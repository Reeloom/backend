import { Request, Response } from 'express';
import { BaseController } from '@/shared/infrastructure/http/BaseController';
import {
  CreateUserUseCase,
  UserAlreadyExistsError,
} from '@/modules/user/application/use-cases/create-user/CreateUserUseCase';
import { CreateUserRequest } from '@/modules/user/application/use-cases/create-user/CreateUserRequest';
import { CreateUserResponse } from '@/modules/user/application/use-cases/create-user/CreateUserResponse';
import { Result } from '@/shared/application/use-cases/IUseCase';
import { MESSAGES } from '@/shared/constants/messages';

export class CreateUserController extends BaseController<
  CreateUserRequest,
  CreateUserResponse,
  UserAlreadyExistsError | Error
> {
  constructor(useCase: CreateUserUseCase) {
    super(useCase);
  }

  protected buildRequest(req: Request): CreateUserRequest {
    return new CreateUserRequest(
      req.body.email,
      req.body.password,
      req.body.name,
    );
  }

  protected sendResponse(
    res: Response,
    result: Result<CreateUserResponse, UserAlreadyExistsError | Error>,
  ): void {
    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.value,
      });
    } else if (result.error instanceof UserAlreadyExistsError) {
      res.status(409).json({
        success: false,
        message: result.error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: (result.error as Error).message || MESSAGES.UNKNOWN_ERROR,
      });
    }
  }
}
