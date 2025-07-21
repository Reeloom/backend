import { ValueObject } from '@/shared/domain/value-objects/ValueObject';
import { EMAIL_REGEX } from '@/shared/config/regex';
import { MESSAGES } from '@/shared/constants/messages';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(email: string): Email {
    if (!this.isValidEmail(email)) {
      throw new Error(MESSAGES.INVALID_EMAIL);
    }
    return new Email({ value: email.toLowerCase() });
  }

  get value(): string {
    return this.props.value;
  }

  private static isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email);
  }
}
