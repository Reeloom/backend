import { BaseEntity } from '@/shared/domain/entities/BaseEntity';

export interface OAuthAccountProps {
  provider: string;
  providerId: string;
  email: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class OAuthAccount extends BaseEntity<OAuthAccountProps> {
  private constructor(
    props: OAuthAccountProps,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(props, id, createdAt, updatedAt);
  }

  public static create(props: OAuthAccountProps, id?: string): OAuthAccount {
    return new OAuthAccount(props, id, props.createdAt, props.updatedAt);
  }

  get provider(): string {
    return this.props.provider;
  }

  get providerId(): string {
    return this.props.providerId;
  }

  get email(): string {
    return this.props.email;
  }

  get userId(): string {
    return this.props.userId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  protected generateId(): string {
    return `${this.props.provider}:${this.props.providerId}`;
  }
}
