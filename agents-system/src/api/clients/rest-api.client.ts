import ApiRequestError from '../../errors/api-request.error.ts';
import NetworkError from '../../errors/network.error.ts';

export type HTTP_METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestBody = string | { [key: string]: any };
export type ContentType = 'application/json' | 'text/html' | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FetchResponse<T = any> extends Response {
  json<P = T>(): Promise<P>;
}

export interface FetchOptions {
  headers: Headers;
  contentType: ContentType;
}

interface MakeFetchOptions {
  method: string;
  headers: Headers;
  body: string | FormData | undefined;
}

export interface RestApiClient {
  makeCall<ResBody, ReqBody extends RequestBody = RequestBody>(
    path: string,
    method?: HTTP_METHOD,
    body?: ReqBody,
    options?: Partial<FetchOptions>,
  ): Promise<ResBody>;
}

export class NodeFetchRestApiClient implements RestApiClient {
  protected defaultContentType: ContentType = 'application/json';

  constructor(private baseUrl: string) {
    this.checkStatus = this.checkStatus.bind(this);
  }

  public async makeCall<ResBody, ReqBody extends RequestBody = RequestBody>(
    path: string,
    method: HTTP_METHOD = 'GET',
    body?: ReqBody,
    options: Partial<FetchOptions> = {},
  ): Promise<ResBody> {
    const { headers: customHeaders, contentType = this.defaultContentType } = options;

    const headers = this.getBasicHeaders(method, contentType);

    customHeaders?.forEach((value: string, header: string) => {
      headers.set(header, value);
    });

    return this.makeFetch(`${this.baseUrl}${path}`, { method, headers, body: this.stringifyBody(body) });
  }

  protected async makeFetch(url: string, options: MakeFetchOptions) {
    try {
      const response = await fetch(url, options);

      await this.checkStatus(response as FetchResponse);

      if (options.headers.get('responseType') === 'arraybuffer') {
        return response;
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        throw error;
      }

      throw new NetworkError((error as NetworkError).message);
    }
  }

  protected async checkStatus(response: FetchResponse) {
    if (response.ok) {
      return;
    }

    const body = await this.getErrorResponseBody(response);
    const data = body.error || body.data || body;
    const { code: errorCode, message, ...errorData } = data || {};
    const errorMessage = message || body.data?.error || response.statusText;

    throw new ApiRequestError(errorMessage, response.status, response.headers, errorCode, errorData);
  }

  protected getBasicHeaders(method: HTTP_METHOD, contentType?: ContentType) {
    const headers = new Headers();

    if (contentType) {
      headers.set('Accept', contentType);
      headers.set('Content-Type', contentType);
    }

    return headers;
  }

  protected stringifyBody(body?: RequestBody) {
    if (typeof body === 'string' || body instanceof FormData || typeof body === 'undefined') {
      return body;
    }

    return JSON.stringify(body);
  }

  private async getErrorResponseBody(response: FetchResponse) {
    try {
      return await response.json();
    } catch (err) {
      throw new ApiRequestError(response.statusText, response.status, response.headers);
    }
  }
}
