import { InstagramAuthService } from '@/modules/auth/infrastructure/services/InstagramAuthService';
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

export class InstagramSignInUseCase {
  constructor(
    private readonly instagramAuthService: InstagramAuthService,
    private readonly userRepository: IUserRepository,
    private readonly oauthAccountRepository: IOAuthAccountRepository,
    private readonly jwtService: JwtService,
  ) {}

  getAuthUrl(): string {
    return this.instagramAuthService.getAuthUrl();
  }

  async execute(code: string) {
    const tokens = await this.instagramAuthService.getTokens(code);
    const userInfo = await this.instagramAuthService.getUserInfo(
      tokens.access_token,
    );
    if (!userInfo.id || !userInfo.username) {
      throw new Error(MESSAGES.INVALID_AUTH_CODE);
    }
    const pseudoEmail = `${userInfo.id}@instagram.com`;
    // 1. Try to find OAuthAccount by provider/providerId
    let oauthAccount = await this.oauthAccountRepository.findByProvider(
      PROVIDERS.INSTAGRAM,
      userInfo.id,
    );
    let user: User | null = null;
    if (oauthAccount) {
      // Found linked account, get user
      user = await this.userRepository.findById(oauthAccount.userId);
    } else {
      // 2. Try to find user by email
      user = await this.userRepository.findByEmailString(pseudoEmail);
      if (!user) {
        // 3. Create user if not found
        user = User.create({
          email: Email.create(pseudoEmail),
          password: Password.createHashed(OAUTH.INSTAGRAM.PASSWORD_PLACEHOLDER),
          name: userInfo.username,
          isActive: true,
        });
        user = await this.userRepository.save(user);
      }
      // 4. Link OAuthAccount to user
      oauthAccount = await this.oauthAccountRepository.create(
        OAuthAccount.create({
          provider: PROVIDERS.INSTAGRAM,
          providerId: userInfo.id,
          email: pseudoEmail,
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
      provider: PROVIDERS.INSTAGRAM,
    });
    return { user, jwt };
  }
}
