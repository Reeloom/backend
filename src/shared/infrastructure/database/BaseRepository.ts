import { IRepository } from '@/shared/domain/repositories/IRepository';
import { BaseEntity } from '@/shared/domain/entities/BaseEntity';
import { PrismaExtendedClient } from '@/database/prismaClient';

export abstract class BaseRepository<T extends BaseEntity<unknown>>
  implements IRepository<T>
{
  protected prisma: PrismaExtendedClient;

  constructor(prisma: PrismaExtendedClient) {
    this.prisma = prisma;
  }

  abstract findById(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract save(entity: T): Promise<T>;
  abstract update(entity: T): Promise<T>;
  abstract delete(id: string): Promise<void>;
}
