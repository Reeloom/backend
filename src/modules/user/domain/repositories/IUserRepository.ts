import { IRepository } from '@/shared/domain/repositories/IRepository';
import { User } from '@/modules/user/domain/entities/User';
import { Email } from '@/modules/user/domain/value-objects/Email';

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: Email): Promise<User | null>;
  findByEmailString(email: string): Promise<User | null>;
  exists(email: Email): Promise<boolean>;
}
