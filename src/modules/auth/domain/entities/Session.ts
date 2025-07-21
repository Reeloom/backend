import { BaseEntity } from '@/shared/domain/entities/BaseEntity';
import { SessionId } from '@/modules/auth/domain/value-objects/SessionId';
import { UserId } from '@/modules/auth/domain/value-objects/UserId';
import { Token } from '@/modules/auth/domain/value-objects/Token';

export interface SessionProps {
  userId: UserId;
  token: Token;
  expiresAt: Date;
  isActive: boolean;
  userAgent?: string;
  ipAddress?: string;
}

export class Session extends BaseEntity<SessionProps> {
  private constructor(
    props: SessionProps,
    id?: SessionId,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(props, id?.value, createdAt, updatedAt);
  }

  public static create(props: SessionProps, id?: SessionId): Session {
    return new Session(props, id);
  }

  public static createFromPersistence(
    props: SessionProps,
    id: string,
    createdAt: Date,
    updatedAt: Date,
  ): Session {
    return new Session(props, SessionId.create(id), createdAt, updatedAt);
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get token(): Token {
    return this.props.token;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get userAgent(): string | undefined {
    return this.props.userAgent;
  }

  get ipAddress(): string | undefined {
    return this.props.ipAddress;
  }

  public isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  public deactivate(): void {
    this.props.isActive = false;
  }

  public extendExpiration(newExpiresAt: Date): void {
    this.props.expiresAt = newExpiresAt;
  }

  protected generateId(): string {
    return SessionId.generate().value;
  }
}
