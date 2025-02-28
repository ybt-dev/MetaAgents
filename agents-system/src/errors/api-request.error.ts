export default class ApiRequestError extends Error {
  public readonly requestId: string | null;

  constructor(
    message: string,
    readonly responseStatus: number,
    readonly responseHeaders?: Headers,
    readonly code?: string,
    readonly data?: object,
  ) {
    super(message);
  }
}
