export const HEADERS = {
  ACCESS_CONTROL_ALLOW_ORIGIN: 'Access-Control-Allow-Origin',
  ACCESS_CONTROL_ALLOW_METHODS: 'Access-Control-Allow-Methods',
  ACCESS_CONTROL_ALLOW_HEADERS: 'Access-Control-Allow-Headers',
  ACCESS_CONTROL_ALLOW_CREDENTIALS: 'Access-Control-Allow-Credentials',
  CONTENT_TYPE: 'Content-Type',
} as const;

export const HEADER_VALUES = {
  LOCALHOST_3000: 'https://localhost:3000',
  ALLOWED_METHODS: 'OPTIONS,GET,PUT,POST,DELETE',
  ALLOWED_HEADERS: 'Content-Type, Authorization',
  ALLOW_CREDENTIALS: 'true',
} as const;
