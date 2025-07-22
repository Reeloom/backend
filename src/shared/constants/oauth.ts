export const OAUTH = {
  GOOGLE: {
    ACCESS_TYPE: 'offline',
    PROMPT: 'consent',
    PASSWORD_PLACEHOLDER:
      process.env.GOOGLE_OAUTH_PASSWORD_PLACEHOLDER || 'oauth-google',
  },
  INSTAGRAM: {
    RESPONSE_TYPE: 'code',
    GRANT_TYPE: 'authorization_code',
    PASSWORD_PLACEHOLDER:
      process.env.INSTAGRAM_OAUTH_PASSWORD_PLACEHOLDER || 'oauth-instagram',
    AUTH_URL: 'https://api.instagram.com/oauth/authorize',
    TOKEN_URL: 'https://api.instagram.com/oauth/access_token',
    USERINFO_URL: 'https://graph.instagram.com/me',
  },
};
