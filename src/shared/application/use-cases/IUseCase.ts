// Result pattern for use cases
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

export interface IUseCase<TRequest, TResponse, E = Error> {
  execute(request: TRequest): Promise<Result<TResponse, E>>;
}
