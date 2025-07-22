import { mock } from 'jest-mock-extended';

interface GoogleOAuthServiceMock {
  getTokens: jest.Mock;
  getUserInfo: jest.Mock;
}

export const getMockGoogleOAuthService = () => mock<GoogleOAuthServiceMock>();
