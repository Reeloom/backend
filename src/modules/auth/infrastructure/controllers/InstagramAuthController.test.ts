import request from 'supertest';
import express from 'express';
import { InstagramAuthController } from './InstagramAuthController';
import { COOKIE_NAMES } from '@/shared/constants/providers';
import { MESSAGES } from '@/shared/constants/messages';

jest.mock(
  '@/modules/auth/application/use-cases/instagram-signin/InstagramSignInUseCase',
);
const { InstagramSignInUseCase } = jest.requireMock(
  '@/modules/auth/application/use-cases/instagram-signin/InstagramSignInUseCase',
);

const app = express();
app.use(express.json());
app.get('/auth/instagram', InstagramAuthController.redirectToInstagram);
app.get('/auth/instagram/callback', InstagramAuthController.handleCallback);

describe('InstagramAuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to Instagram OAuth URL', async () => {
    InstagramSignInUseCase.prototype.getAuthUrl.mockReturnValue(
      'https://instagram.com/auth',
    );
    const res = await request(app).get('/auth/instagram');
    expect(res.status).toBe(302);
    expect(res.header['location']).toBe('https://instagram.com/auth');
  });

  it('should return 400 if code is missing', async () => {
    const res = await request(app).get('/auth/instagram/callback');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: MESSAGES.INVALID_AUTH_CODE,
    });
  });

  it('should set cookie and return user on success', async () => {
    const user = {
      id: 'id',
      email: { value: 'test@example.com' },
      name: 'Test',
    };
    const jwt = 'jwt-token';
    InstagramSignInUseCase.prototype.execute.mockResolvedValue({ user, jwt });
    const res = await request(app).get('/auth/instagram/callback?code=abc');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { id: 'id', email: 'test@example.com', name: 'Test' },
    });
    expect(res.header['set-cookie']).toBeDefined();
    expect(res.header['set-cookie'][0]).toMatch(
      new RegExp(`${COOKIE_NAMES.ACCESS_TOKEN}=jwt-token`),
    );
  });

  it('should return 500 and error message on failure', async () => {
    InstagramSignInUseCase.prototype.execute.mockRejectedValue(
      new Error(MESSAGES.AUTH_ERROR),
    );
    const res = await request(app).get('/auth/instagram/callback?code=abc');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ success: false, message: MESSAGES.AUTH_ERROR });
  });
});
