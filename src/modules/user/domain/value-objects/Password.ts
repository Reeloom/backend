import { ValueObject } from '@/shared/domain/value-objects/ValueObject';
import * as bcrypt from 'bcryptjs';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_SALT_ROUNDS,
} from '@/shared/config/security';
import { MESSAGES } from '@/shared/constants/messages';

interface PasswordProps {
  value: string;
  hashed: boolean;
}

export class Password extends ValueObject<PasswordProps> {
  private static readonly SALT_ROUNDS = PASSWORD_SALT_ROUNDS;
  private static readonly MIN_LENGTH = PASSWORD_MIN_LENGTH;

  private constructor(props: PasswordProps) {
    super(props);
  }

  public static create(password: string): Password {
    if (!this.isValidPassword(password)) {
      throw new Error(MESSAGES.INVALID_PASSWORD);
    }
    return new Password({ value: password, hashed: false });
  }

  public static createHashed(hashedPassword: string): Password {
    return new Password({ value: hashedPassword, hashed: true });
  }

  public async hash(): Promise<Password> {
    if (this.props.hashed) {
      return this;
    }
    const hashedValue = await bcrypt.hash(
      this.props.value,
      Password.SALT_ROUNDS,
    );
    return new Password({ value: hashedValue, hashed: true });
  }

  public async comparePassword(password: string): Promise<boolean> {
    if (!this.props.hashed) {
      throw new Error(MESSAGES.CANNOT_COMPARE_UNHASHED_PASSWORD);
    }
    return await bcrypt.compare(password, this.props.value);
  }

  get value(): string {
    return this.props.value;
  }

  get isHashed(): boolean {
    return this.props.hashed;
  }

  private static isValidPassword(password: string): boolean {
    return password.length >= this.MIN_LENGTH;
  }
}
