import { Request, Response } from 'express';

export abstract class BaseController<TRequest, TResponse> {
  protected useCase: any;

  constructor(useCase: any) {
    this.useCase = useCase;
  }

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const request = this.buildRequest(req);
      const result = await this.useCase.execute(request);
      this.sendResponse(res, result);
    } catch (error: unknown) {
      this.handleError(res, error);
    }
  }

  protected abstract buildRequest(req: Request): TRequest;
  protected abstract sendResponse(res: Response, result: TResponse): void;
  protected handleError(res: Response, error: unknown): void {
    res
      .status(500)
      .json({
        message:
          error instanceof Error ? error.message : 'Internal server error',
      });
  }
}
