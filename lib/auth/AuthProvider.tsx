'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User } from 'oidc-client-ts';
import { parseJwt } from './parse-jwt';
import { oidcUserManager } from './oidc';

interface AuthContextValue {
  user: User | null;
  status: string;
  login(): void;
  logout(): void;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<string>('');
  const [processingCallback, setProcessingCallback] = useState<boolean>(false);

  const handleUser = useCallback((u: User | null) => {
    setUser(prevUser => {
      // Explicitly avoid updating if the user hasn't changed
      if (prevUser?.id_token === u?.id_token) {
        return prevUser; // Avoid redundant state update
      }

      if (!u) {
        window.localStorage.removeItem('jwt');
        return null;
      }

      const idToken = u.id_token || '';
      const parsed = parseJwt(idToken);
      if (!parsed.nickslug || !parsed.sponsor) {
        window.localStorage.removeItem('jwt');
        setStatus('Your account is not authorised');
        setTimeout(() => oidcUserManager.signoutRedirect(), 5000);
        return null;
      }

      window.localStorage.setItem('jwt', idToken);
      return u;
    });
  }, []);

  // Explicitly handle redirect callbacks, setting processing flag
  useEffect(() => {
    if (window.location.search.includes('code=') || window.location.search.includes('state=')) {
      setProcessingCallback(true);
      oidcUserManager
        .signinRedirectCallback()
        .then(user => {
          if (user.id_token) {
            handleUser(user);
            window.localStorage.setItem('jwt', user.id_token);
            console.log('user id token: ', user.id_token)
          }
        })
        .catch(err => {
          console.error('signinRedirectCallback error:', err);
          setStatus('Login error, please try again.');
        })
        .finally(() => {
          window.history.replaceState({}, document.title, window.location.pathname);
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
  const logout = () => oidcUserManager.signoutRedirect();

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

    mgr.events.addUserLoaded(onUserLoaded);
    mgr.events.addAccessTokenExpiring(onTokenExpiring);
    mgr.events.addAccessTokenExpired(onTokenExpired);

    return () => {
      mgr.events.removeUserLoaded(onUserLoaded);
      mgr.events.removeAccessTokenExpiring(onTokenExpiring);
      mgr.events.removeAccessTokenExpired(onTokenExpired);
    };
  }, [handleUser, logout]);

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
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