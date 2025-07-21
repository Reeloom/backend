import { ValueObject } from '@/shared/domain/value-objects/ValueObject';
import { v4 as uuidv4 } from 'uuid';
import { UUID_REGEX } from '@/shared/config/regex';
import { MESSAGES } from '@/shared/constants/messages';

interface UserIdProps {
  value: string;
}

export class UserId extends ValueObject<UserIdProps> {
  private constructor(props: UserIdProps) {
    super(props);
  }

  public static create(id: string): UserId {
    if (!this.isValidUuid(id)) {
      throw new Error(MESSAGES.INVALID_UUID_FORMAT);
    }
    return new UserId({ value: id });
  }

  public static generate(): UserId {
    return new UserId({ value: uuidv4() });
  }

  get value(): string {
    return this.props.value;
  }

  private static isValidUuid(uuid: string): boolean {
    return UUID_REGEX.test(uuid);
  }
}
