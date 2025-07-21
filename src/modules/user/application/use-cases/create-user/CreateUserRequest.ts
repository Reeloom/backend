import { BaseDTO } from '@/shared/application/dto/BaseDTO';

export class CreateUserRequest extends BaseDTO {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly name?: string,
  ) {
    super();
  }

  validate(): boolean {
    return !!(
      this.email &&
      this.password &&
      this.email.length > 0 &&
      this.password.length >= 8
    );
  }
}
