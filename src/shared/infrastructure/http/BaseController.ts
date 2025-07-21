import { Request, Response } from 'express';
import { IUseCase, Result } from '@/shared/application/use-cases/IUseCase';

export abstract class BaseController<TRequest, TResponse, E = Error> {
  constructor(private useCase: IUseCase<TRequest, TResponse, E>) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const request = this.buildRequest(req);
      const response = await this.useCase.execute(request);
      this.sendResponse(res, response);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  protected abstract buildRequest(req: Request): TRequest;
  protected abstract sendResponse(
    res: Response,
    response: Result<TResponse, E>,
  ): void;

  protected handleError(res: Response, error: any): void {
    // Allow override for custom error handling
    console.error('Controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
