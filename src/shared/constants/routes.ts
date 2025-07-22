// Remove unused import config
// Use direct strings for route roots
export const ROUTES = {
  AUTH: {
    ROOT: '/auth',
    GOOGLE: {
      REDIRECT: '/auth/google',
      CALLBACK: '/auth/google/callback',
    },
    INSTAGRAM: {
      REDIRECT: '/auth/instagram',
      CALLBACK: '/auth/instagram/callback',
    },
  },
  USER: {
    ROOT: '/users',
  },
  HEALTH: '/health',
} as const;
