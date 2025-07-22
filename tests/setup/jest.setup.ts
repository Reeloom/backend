process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test';
process.env.GOOGLE_CLIENT_ID = 'test';
process.env.GOOGLE_CLIENT_SECRET = 'test';
process.env.GOOGLE_REDIRECT_URI = 'http://localhost';
process.env.INSTAGRAM_CLIENT_ID = 'test';
process.env.INSTAGRAM_CLIENT_SECRET = 'test';
process.env.INSTAGRAM_REDIRECT_URI = 'http://localhost';

beforeAll(async () => {
  // Setup global DB, mocks, etc. (se necessário)
});
afterEach(() => {
  jest.clearAllMocks();
});
