import { ValueObject } from '@/shared/domain/value-objects/ValueObject';
import { v4 as uuidv4 } from 'uuid';
import { UUID_REGEX } from '@/shared/config/regex';
import { MESSAGES } from '@/shared/constants/messages';

interface SessionIdProps {
  value: string;
}

export class SessionId extends ValueObject<SessionIdProps> {
  private constructor(props: SessionIdProps) {
    super(props);
  }

  public static create(id: string): SessionId {
    if (!this.isValidUuid(id)) {
      throw new Error(MESSAGES.INVALID_UUID_FORMAT);
    }
    return new SessionId({ value: id });
  }

  public static generate(): SessionId {
    return new SessionId({ value: uuidv4() });
  }

  get value(): string {
    return this.props.value;
  }

  private static isValidUuid(uuid: string): boolean {
    return UUID_REGEX.test(uuid);
  }
}
