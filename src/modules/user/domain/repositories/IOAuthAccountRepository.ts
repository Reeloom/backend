import { OAuthAccount } from '@/modules/user/domain/entities/OAuthAccount';

export interface IOAuthAccountRepository {
  findByProvider(
    provider: string,
    providerId: string,
  ): Promise<OAuthAccount | null>;
  findByUserId(userId: string): Promise<OAuthAccount[]>;
  create(account: OAuthAccount): Promise<OAuthAccount>;
}
