import { Request, Response } from 'express';
import { BaseController } from '@/shared/infrastructure/http/BaseController';
import {
  CreateUserUseCase,
  UserAlreadyExistsError,
} from '@/modules/user/application/use-cases/create-user/CreateUserUseCase';
import { CreateUserRequest } from '@/modules/user/application/use-cases/create-user/CreateUserRequest';
import { CreateUserResponse } from '@/modules/user/application/use-cases/create-user/CreateUserResponse';

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

  protected sendResponse(res: Response, result: CreateUserResponse): void {
    res.status(201).json({
      success: true,
      data: result,
    });
  }
}
