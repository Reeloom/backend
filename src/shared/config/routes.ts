export const API_VERSION = 'v1';
export const API_PREFIX = '/api';

export const API_ROUTES = {
  USERS: `${API_PREFIX}/${API_VERSION}/users`,
  AUTH: `${API_PREFIX}/${API_VERSION}/auth`,
  TIKTOK: `${API_PREFIX}/${API_VERSION}/tiktok`,
  ANALYTICS: `${API_PREFIX}/${API_VERSION}/analytics`,
  AI: `${API_PREFIX}/${API_VERSION}/ai`,
  CONTENT: `${API_PREFIX}/${API_VERSION}/content`,
} as const;
