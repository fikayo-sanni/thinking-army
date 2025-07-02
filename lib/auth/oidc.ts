import { UserManager, WebStorageStateStore, UserManagerSettings } from 'oidc-client-ts';

// Build OIDC settings from environment variables
function createOidcSettings(): UserManagerSettings {
  if (typeof window === 'undefined') {
    // Server-side or non-browser environment: return a stub config
    return {
      authority: '',
      client_id: '',
      redirect_uri: '',
      response_type: '',
      scope: '',
      post_logout_redirect_uri: '',
      loadUserInfo: false,
    };
  }

  return {
    authority: process.env.NEXT_PUBLIC_AUTHORITY_URL!,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI || window.location.origin,
    post_logout_redirect_uri: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI || window.location.origin,
    response_type: process.env.NEXT_PUBLIC_RESPONSE_TYPE || 'code',
    scope: process.env.NEXT_PUBLIC_SCOPE || 'openid profile email',
    loadUserInfo: process.env.NEXT_PUBLIC_LOAD_USER_INFO === 'true',
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    useRefreshToken: true,
    accessTokenExpiringNotificationTime: 30,
    automaticSilentRenew: true,
  };
}

export const oidcUserManager = new UserManager(createOidcSettings()); 