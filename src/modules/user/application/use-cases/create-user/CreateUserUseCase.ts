import { IUseCase, Result } from '@/shared/application/use-cases/IUseCase';
import { IUserRepository } from '@/modules/user/domain/repositories/IUserRepository';
import { User } from '@/modules/user/domain/entities/User';
import { Email } from '@/modules/user/domain/value-objects/Email';
import { Password } from '@/modules/user/domain/value-objects/Password';
import { CreateUserRequest } from '@/modules/user/application/use-cases/create-user/CreateUserRequest';
import { CreateUserResponse } from '@/modules/user/application/use-cases/create-user/CreateUserResponse';
import { MESSAGES } from '@/shared/constants/messages';

export class UserAlreadyExistsError extends Error {
  constructor() {
    super(MESSAGES.USER_ALREADY_EXISTS);
    this.name = 'UserAlreadyExistsError';
  }
}

export class CreateUserUseCase
  implements
    IUseCase<CreateUserRequest, CreateUserResponse, UserAlreadyExistsError>
{
  constructor(private userRepository: IUserRepository) {}

  async execute(
    request: CreateUserRequest,
  ): Promise<Result<CreateUserResponse, UserAlreadyExistsError>> {
    const email = Email.create(request.email);
    const password = Password.create(request.password);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      return { success: false, error: new UserAlreadyExistsError() };
    }

    // Create the user
    const user = User.create({
      email,
      password: await password.hash(),
      name: request.name,
      isActive: true,
    });

    // Save to repository
    const savedUser = await this.userRepository.save(user);

    return {
      success: true,
      value: {
        id: savedUser.id,
        email: savedUser.email.value,
        name: savedUser.name,
        isActive: savedUser.isActive,
        createdAt: savedUser.createdAt,
      },
    };
  }
}
