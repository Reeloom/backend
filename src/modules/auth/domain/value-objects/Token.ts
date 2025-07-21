import { ValueObject } from '@/shared/domain/value-objects/ValueObject';
import { MESSAGES } from '@/shared/constants/messages';

interface TokenProps {
  value: string;
}

export class Token extends ValueObject<TokenProps> {
  private constructor(props: TokenProps) {
    super(props);
  }

  public static create(token: string): Token {
    if (!token || token.length < 10) {
      throw new Error(MESSAGES.INVALID_TOKEN);
    }
    return new Token({ value: token });
  }

  get value(): string {
    return this.props.value;
  }
}
