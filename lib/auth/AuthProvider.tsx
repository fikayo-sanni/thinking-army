'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User } from 'oidc-client-ts';
import { parseJwt } from './parse-jwt';
import { oidcUserManager } from './oidc';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth-service';

interface AuthContextValue {
  user: User | null;
  status: string;
  login(): void;
  logout(): void;
  youreId?: string;
  isAuthenticated(): boolean;
  processingCallback: boolean;
}
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<string>('');
  const [processingCallback, setProcessingCallback] = useState<boolean>(false);
  const [youreId, setYoureId] = useState<string | undefined>(undefined);
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;

  const isAuthenticated = () => {
    // For full authentication, we need both OIDC user AND backend auth token
    // OR just admin auth token (for admin users)
    if (typeof window !== 'undefined') {
      const hasAuthToken = !!localStorage.getItem('authToken');
      // Admin users: just need auth token
      if (!user && hasAuthToken) return true;
      // Regular users: need both OIDC user and auth token
      if (!!user && hasAuthToken) return true;
    }
    return false;
  };

  const handleUser = useCallback(async (u: User | null) => {
    let parsed: any = {};
    setUser(prevUser => {
      // Explicitly avoid updating if the user hasn't changed
      if (prevUser?.id_token === u?.id_token) {
        return prevUser; // Avoid redundant state update
      }

      if (!u) {
        window.localStorage.removeItem('jwt');
        setYoureId(undefined);
        return null;
      }

      const idToken = u.id_token || '';
      parsed = parseJwt(idToken);
      
      // Debug JWT contents
      console.log('JWT Debug:', { 
        hasToken: !!idToken, 
        parsed: { 
          sub: parsed.sub, 
          nickslug: parsed.nickslug, 
          sponsor: parsed.sponsor,
          email: parsed.email,
          allFields: Object.keys(parsed)
        } 
      });
      
      // For root users or admin users, sponsor might not exist
      // Only require nickslug for basic authorization
      if (!parsed.nickslug) {
        console.log('JWT validation failed: missing nickslug');
        window.localStorage.removeItem('jwt');
        setStatus('Your account is not authorised - missing username');
        setTimeout(() => oidcUserManager.signoutRedirect(), 5000);
        setYoureId(undefined);
        return null;
      }
      
      // Warn if sponsor is missing but don't block (root users won't have sponsors)
      if (!parsed.sponsor) {
        console.log('JWT validation warning: no sponsor found (normal for root users)');
      }

      window.localStorage.setItem('jwt', idToken);
      setYoureId(parsed.sub);
      return u;
    });
    // After setting user and youreId, login to backend if not already
    if (u && parsed.nickslug && typeof window !== 'undefined') {
      if (!localStorage.getItem('authToken')) {
        try {

          if (parsed.sub?.startsWith('auth0|')) {
            parsed.sub = parsed.sub.replace(/^auth0\|/, '');
          }
  
          if (parsed.sub?.startsWith('google-oauth2|')) {
            parsed.sub = parsed.sub.replace(/^google-oauth2\|/, '');
          }
          
          // Check if this user was registered through referral and update their status
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/v1/referral/activate-user`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                youreId: parsed.sub,
                username: parsed.nickslug,
                email: parsed.email 
              }),
            });
            
            if (response.ok) {
              console.log('User activated successfully after youre_id registration');
            }
          } catch (activationError) {
            console.log('User activation check failed - user might already be active:', activationError);
          }
          
          await authService.loginWithYoureId(parsed.sub);
          // Ensure redirect happens after successful backend login
          if (router && localStorage.getItem('authToken')) {
            router.replace('/dashboard');
          }
          
        } catch (e) {
          console.error('Backend login failed', e, parsed.sub);
          setStatus('Backend authentication failed. Please try again.');
          // Clear the OIDC user since backend auth failed
          setUser(null);
          setYoureId(undefined);
          window.localStorage.removeItem('jwt');
          // Redirect back to login instead of leaving user in limbo
          if (router) {
            router.replace('/');
          }
          return;
        }
      }
    }
  }, [router]);

  // Explicitly handle redirect callbacks, setting processing flag
  useEffect(() => {
    if (window.location.search.includes('code=') || window.location.search.includes('state=')) {
      setProcessingCallback(true);
      oidcUserManager
        .signinRedirectCallback()
        .then(async user => {
          if (user.id_token) {
            await handleUser(user);
            window.localStorage.setItem('jwt', user.id_token);
            console.log('user id token: ', user.id_token)
          }
        })
        .catch(err => {
          console.error('signinRedirectCallback error:', err);
          setStatus('Login error, please try again.');
        })
        .finally(() => {
          // Only clean URL if we're still on a page with OIDC params (haven't been redirected yet)
          if (window.location.search.includes('code=') || window.location.search.includes('state=')) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          setProcessingCallback(false);
          console.log('finally block reached')
        });
    }
  }, [handleUser]);

  // AND ALSO:
  useEffect(() => {
    if (!processingCallback) {
      oidcUserManager.getUser()
        .then(handleUser)
        .catch(err => console.error('getUser error:', err));
    }
  }, [handleUser, processingCallback]);


  const login = () => oidcUserManager.signinRedirect();
  const logout = () => {
    const wasOidcUser = !!user;
    const wasAdminUser = !user && typeof window !== 'undefined' && !!localStorage.getItem('authToken');
    
    // Clear admin auth token if present
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
    
    // Clear OIDC user state
    setUser(null);
    setYoureId(undefined);
    
    // Redirect based on user type
    if (wasOidcUser) {
      // For OIDC users, do OIDC logout which redirects to landing page
      oidcUserManager.signoutRedirect();
    } else if (wasAdminUser) {
      // For admin users, redirect to admin login page
      if (router) {
        router.replace('/admin');
      }
    } else {
      // Default fallback to landing page
      if (router) {
        router.replace('/');
      }
    }
  };

  useEffect(() => {
    const mgr = oidcUserManager;

    const onUserLoaded = (u: User) => handleUser(u);
    const onTokenExpiring = () => {
      console.log('[OIDC] access-token expiring, trying silent renew');
      mgr.signinSilent().catch(err =>
        console.error('[OIDC] silent renew error', err)
      );
    };
    const onTokenExpired = () => {
      console.warn('[OIDC] access-token expired, forcing silent renew');
      mgr.signinSilent().catch(() => logout());
    };

    // Listen for localStorage changes to immediately respond to auth state changes
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' && e.newValue === null) {
        console.log('🔄 AuthToken removed from localStorage - clearing user state');
        setUser(null);
        setYoureId(undefined);
      } else if (e.key === 'jwt' && e.newValue === null) {
        console.log('🔄 JWT removed from localStorage - clearing user state');
        setUser(null);
        setYoureId(undefined);
      }
    };

    mgr.events.addUserLoaded(onUserLoaded);
    mgr.events.addAccessTokenExpiring(onTokenExpiring);
    mgr.events.addAccessTokenExpired(onTokenExpired);
    window.addEventListener('storage', onStorageChange);

    return () => {
      mgr.events.removeUserLoaded(onUserLoaded);
      mgr.events.removeAccessTokenExpiring(onTokenExpiring);
      mgr.events.removeAccessTokenExpired(onTokenExpired);
      window.removeEventListener('storage', onStorageChange);
    };
  }, [handleUser, logout]);

  return (
    <AuthContext.Provider value={{ user, status, login, logout, youreId, isAuthenticated, processingCallback }}>
      {children}
    </AuthContext.Provider>
  );
}



// Convenience hook so any component can say "useAuth()"
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
} 