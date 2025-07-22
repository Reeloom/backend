import { GoogleSignInUseCase } from './GoogleSignInUseCase';
import { mock } from 'jest-mock-extended';
import { GoogleAuthService } from '@/modules/auth/infrastructure/services/GoogleAuthService';
import { IUserRepository } from '@/modules/user/domain/repositories/IUserRepository';
import { IOAuthAccountRepository } from '@/modules/user/domain/repositories/IOAuthAccountRepository';
import { JwtService } from '@/modules/auth/infrastructure/services/JwtService';
import { User } from '@/modules/user/domain/entities/User';
import { Email } from '@/modules/user/domain/value-objects/Email';
import { Password } from '@/modules/user/domain/value-objects/Password';
import { PROVIDERS } from '@/shared/constants/providers';
import { MESSAGES } from '@/shared/constants/messages';
import { OAUTH } from '@/shared/constants/oauth';
import { OAuthAccount } from '@/modules/user/domain/entities/OAuthAccount';

describe('GoogleSignInUseCase', () => {
  const mockGoogleAuthService = mock<GoogleAuthService>();
  const mockUserRepository = mock<IUserRepository>();
  const mockOAuthAccountRepository = mock<IOAuthAccountRepository>();
  const mockJwtService = mock<JwtService>();
  const useCase = new GoogleSignInUseCase(
    mockGoogleAuthService,
    mockUserRepository,
    mockOAuthAccountRepository,
    mockJwtService,
  );

  const code = 'valid-code';
  const tokens = { access_token: 'token' };
  const userInfo = {
    email: 'test@example.com',
    id: 'google-id',
    name: 'Test User',
  };
  const user = User.create({
    email: Email.create(userInfo.email),
    password: Password.createHashed(OAUTH.GOOGLE.PASSWORD_PLACEHOLDER),
    name: userInfo.name,
    isActive: true,
  });
  const oauthAccount = OAuthAccount.create({
    provider: PROVIDERS.GOOGLE,
    providerId: userInfo.id,
    email: userInfo.email,
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const jwt = 'jwt-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should sign in with existing OAuthAccount (providerId)', async () => {
    mockGoogleAuthService.getTokens.mockResolvedValue(tokens);
    mockGoogleAuthService.getUserInfo.mockResolvedValue(userInfo);
    mockOAuthAccountRepository.findByProvider.mockResolvedValue(oauthAccount);
    mockUserRepository.findById.mockResolvedValue(user);
    mockJwtService.sign.mockReturnValue(jwt);

    const result = await useCase.execute(code);
    expect(result.user).toBe(user);
    expect(result.jwt).toBe(jwt);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockOAuthAccountRepository.create).not.toHaveBeenCalled();
  });

  it('should link provider to existing user by email', async () => {
    mockGoogleAuthService.getTokens.mockResolvedValue(tokens);
    mockGoogleAuthService.getUserInfo.mockResolvedValue(userInfo);
    mockOAuthAccountRepository.findByProvider.mockResolvedValue(null);
    mockUserRepository.findByEmailString.mockResolvedValue(user);
    mockOAuthAccountRepository.create.mockResolvedValue(oauthAccount);
    mockJwtService.sign.mockReturnValue(jwt);

    const result = await useCase.execute(code);
    expect(result.user).toBe(user);
    expect(result.jwt).toBe(jwt);
    expect(mockOAuthAccountRepository.create).toHaveBeenCalled();
  });

  it('should create user and link provider if neither found', async () => {
    mockGoogleAuthService.getTokens.mockResolvedValue(tokens);
    mockGoogleAuthService.getUserInfo.mockResolvedValue(userInfo);
    mockOAuthAccountRepository.findByProvider.mockResolvedValue(null);
    mockUserRepository.findByEmailString.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue(user);
    mockOAuthAccountRepository.create.mockResolvedValue(oauthAccount);
    mockJwtService.sign.mockReturnValue(jwt);

    const result = await useCase.execute(code);
    expect(result.user).toBe(user);
    expect(result.jwt).toBe(jwt);
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockOAuthAccountRepository.create).toHaveBeenCalled();
  });

  it('should throw INVALID_AUTH_CODE if userInfo.email or id is missing', async () => {
    mockGoogleAuthService.getTokens.mockResolvedValue(tokens);
    mockGoogleAuthService.getUserInfo.mockResolvedValue({
      id: '',
      email: '',
      name: 'No Email',
    });
    await expect(useCase.execute(code)).rejects.toThrow(
      MESSAGES.INVALID_AUTH_CODE,
    );
  });

  it('should throw USER_NOT_FOUND if user is not found after linking', async () => {
    mockGoogleAuthService.getTokens.mockResolvedValue(tokens);
    mockGoogleAuthService.getUserInfo.mockResolvedValue(userInfo);
    mockOAuthAccountRepository.findByProvider.mockResolvedValue(oauthAccount);
    mockUserRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(code)).rejects.toThrow(
      MESSAGES.USER_NOT_FOUND,
    );
  });
});
