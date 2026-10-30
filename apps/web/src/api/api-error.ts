export interface ApiErrorPayload {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  code?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let payload: ApiErrorPayload | undefined;
    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      payload = undefined;
    }

    const message = Array.isArray(payload?.message)
      ? payload.message.join("; ")
      : (payload?.message ?? payload?.error ?? response.statusText ?? "API request failed");

    return new ApiError(message, response.status, payload?.code, payload);
  }
}
