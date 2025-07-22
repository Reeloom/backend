import { BaseRepository } from '@/shared/infrastructure/database/BaseRepository';
import { IUserRepository } from '@/modules/user/domain/repositories/IUserRepository';
import { User } from '@/modules/user/domain/entities/User';
import { Email } from '@/modules/user/domain/value-objects/Email';
import { Password } from '@/modules/user/domain/value-objects/Password';
import { OAUTH } from '@/shared/constants/oauth';
import type { User as PrismaUser } from '@prisma/client';

export class PrismaUserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return User.createFromPersistence(
      {
        email: Email.create(user.email),
        password: Password.createHashed(
          user.password ?? OAUTH.GOOGLE.PASSWORD_PLACEHOLDER,
        ),
        name: user.name || undefined,
        isActive: user.isActive,
      },
      user.id,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user: PrismaUser) =>
      User.createFromPersistence(
        {
          email: Email.create(user.email),
          password: Password.createHashed(
            user.password ?? OAUTH.GOOGLE.PASSWORD_PLACEHOLDER,
          ),
          name: user.name || undefined,
          isActive: user.isActive,
        },
        user.id,
        user.createdAt,
        user.updatedAt,
      ),
    );
  }

  async save(entity: User): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        id: entity.id,
        email: entity.email.value,
        password: entity.password.value,
        name: entity.name,
        isActive: entity.isActive,
        createdAt: entity.createdAt,
      },
    });

    return User.createFromPersistence(
      {
        email: Email.create(user.email),
        password: Password.createHashed(
          user.password ?? OAUTH.GOOGLE.PASSWORD_PLACEHOLDER,
        ),
        name: user.name || undefined,
        isActive: user.isActive,
      },
      user.id,
      user.createdAt,
      user.updatedAt,
    );
  }

  async update(entity: User): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: entity.id },
      data: {
        email: entity.email.value,
        password: entity.password.value,
        name: entity.name,
        isActive: entity.isActive,
      },
    });

    return User.createFromPersistence(
      {
        email: Email.create(user.email),
        password: Password.createHashed(
          user.password ?? OAUTH.GOOGLE.PASSWORD_PLACEHOLDER,
        ),
        name: user.name || undefined,
        isActive: user.isActive,
      },
      user.id,
      user.createdAt,
      user.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.value },
    });

    if (!user) {
      return null;
    }

    return User.createFromPersistence(
      {
        email: Email.create(user.email),
        password: Password.createHashed(
          user.password ?? OAUTH.GOOGLE.PASSWORD_PLACEHOLDER,
        ),
        name: user.name || undefined,
        isActive: user.isActive,
      },
      user.id,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findByEmailString(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return User.createFromPersistence(
      {
        email: Email.create(user.email),
        password: Password.createHashed(
          user.password ?? OAUTH.GOOGLE.PASSWORD_PLACEHOLDER,
        ),
        name: user.name || undefined,
        isActive: user.isActive,
      },
      user.id,
      user.createdAt,
      user.updatedAt,
    );
  }

  async exists(email: Email): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.value },
      select: { id: true },
    });

    return !!user;
  }
}
