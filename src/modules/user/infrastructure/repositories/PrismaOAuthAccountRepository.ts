import { IOAuthAccountRepository } from '@/modules/user/domain/repositories/IOAuthAccountRepository';
import { OAuthAccount } from '@/modules/user/domain/entities/OAuthAccount';
import prisma from '@/database/prismaClient';
import { OAuthAccount as PrismaOAuthAccount } from '@prisma/client';

export class PrismaOAuthAccountRepository implements IOAuthAccountRepository {
  async findByProvider(
    provider: string,
    providerId: string,
  ): Promise<OAuthAccount | null> {
    const record = await prisma.oAuthAccount.findUnique({
      where: { provider_providerId: { provider, providerId } },
    });
    if (!record) {
      return null;
    }
    return OAuthAccount.create(
      {
        provider: record.provider,
        providerId: record.providerId,
        email: record.email,
        userId: record.userId,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      record.id,
    );
  }

  async findByUserId(userId: string): Promise<OAuthAccount[]> {
    const records = await prisma.oAuthAccount.findMany({ where: { userId } });
    return records.map((record: PrismaOAuthAccount) =>
      OAuthAccount.create(
        {
          provider: record.provider,
          providerId: record.providerId,
          email: record.email,
          userId: record.userId,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        },
        record.id,
      ),
    );
  }

  async create(account: OAuthAccount): Promise<OAuthAccount> {
    const record = await prisma.oAuthAccount.create({
      data: {
        provider: account.provider,
        providerId: account.providerId,
        email: account.email,
        userId: account.userId,
      },
    });
    return OAuthAccount.create(
      {
        provider: record.provider,
        providerId: record.providerId,
        email: record.email,
        userId: record.userId,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      },
      record.id,
    );
  }
}
