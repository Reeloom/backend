import { GoogleAuthService } from '@/modules/auth/infrastructure/services/GoogleAuthService';
import { IUserRepository } from '@/modules/user/domain/repositories/IUserRepository';
import { IOAuthAccountRepository } from '@/modules/user/domain/repositories/IOAuthAccountRepository';
import { User } from '@/modules/user/domain/entities/User';
import { Email } from '@/modules/user/domain/value-objects/Email';
import { Password } from '@/modules/user/domain/value-objects/Password';
import { JwtService } from '@/modules/auth/infrastructure/services/JwtService';
import { PROVIDERS } from '@/shared/constants/providers';
import { MESSAGES } from '@/shared/constants/messages';
import { OAUTH } from '@/shared/constants/oauth';
import { OAuthAccount } from '@/modules/user/domain/entities/OAuthAccount';

export class GoogleSignInUseCase {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly userRepository: IUserRepository,
    private readonly oauthAccountRepository: IOAuthAccountRepository,
    private readonly jwtService: JwtService,
  ) {}

  getAuthUrl(): string {
    return this.googleAuthService.getAuthUrl();
  }

  async execute(code: string) {
    const tokens = await this.googleAuthService.getTokens(code);
    const userInfo = await this.googleAuthService.getUserInfo(tokens);
    if (!userInfo.email || !userInfo.id) {
      throw new Error(MESSAGES.INVALID_AUTH_CODE);
    }
    // 1. Try to find OAuthAccount by provider/providerId
    let oauthAccount = await this.oauthAccountRepository.findByProvider(
      PROVIDERS.GOOGLE,
      userInfo.id,
    );
    let user: User | null = null;
    if (oauthAccount) {
      // Found linked account, get user
      user = await this.userRepository.findById(oauthAccount.userId);
    } else {
      // 2. Try to find user by email
      user = await this.userRepository.findByEmailString(userInfo.email);
      if (!user) {
        // 3. Create user if not found
        user = User.create({
          email: Email.create(userInfo.email),
          password: Password.createHashed(OAUTH.GOOGLE.PASSWORD_PLACEHOLDER),
          name: userInfo.name,
          isActive: true,
        });
        user = await this.userRepository.save(user);
      }
      // 4. Link OAuthAccount to user
      oauthAccount = await this.oauthAccountRepository.create(
        OAuthAccount.create({
          provider: PROVIDERS.GOOGLE,
          providerId: userInfo.id,
          email: userInfo.email,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );
    }
    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }
    const jwt = this.jwtService.sign({
      sub: user.id,
      email: user.email.value,
      name: user.name,
      provider: PROVIDERS.GOOGLE,
    });
    return { user, jwt };
  }
}
