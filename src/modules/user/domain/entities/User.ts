import { BaseEntity } from '@/shared/domain/entities/BaseEntity';
import { Email } from '@/modules/user/domain/value-objects/Email';
import { Password } from '@/modules/user/domain/value-objects/Password';
import { UserId } from '@/modules/user/domain/value-objects/UserId';
import { OAuthAccount } from '@/modules/user/domain/entities/OAuthAccount';

export interface UserProps {
  email: Email;
  password: Password;
  name?: string;
  isActive?: boolean;
  oauthAccounts?: OAuthAccount[];
}

export class User extends BaseEntity<UserProps> {
  private constructor(
    props: UserProps,
    id?: UserId,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(props, id?.value, createdAt, updatedAt);
  }

  public static create(props: UserProps, id?: UserId): User {
    return new User(props, id);
  }

  public static createFromPersistence(
    props: UserProps,
    id: string,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(props, UserId.create(id), createdAt, updatedAt);
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): Password {
    return this.props.password;
  }

  get name(): string | undefined {
    return this.props.name;
  }

  get isActive(): boolean {
    return this.props.isActive ?? true;
  }

  get oauthAccounts(): OAuthAccount[] | undefined {
    return this.props.oauthAccounts;
  }

  public activate(): void {
    this.props.isActive = true;
  }

  public deactivate(): void {
    this.props.isActive = false;
  }

  public changePassword(newPassword: Password): void {
    this.props.password = newPassword;
  }

  public changeEmail(newEmail: Email): void {
    this.props.email = newEmail;
  }

  protected generateId(): string {
    return UserId.generate().value;
  }
}
