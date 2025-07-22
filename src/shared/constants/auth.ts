export const GOOGLE_AUTH = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '',
  SCOPES: ['openid', 'profile', 'email'],
};

export const INSTAGRAM_AUTH = {
  CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID || '',
  CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET || '',
  REDIRECT_URI: process.env.INSTAGRAM_REDIRECT_URI || '',
  SCOPES: ['user_profile', 'user_media'],
};
