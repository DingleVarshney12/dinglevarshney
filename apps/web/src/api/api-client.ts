import { ApiError } from "./api-error";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api").replace(
  /\/$/,
  "",
);

async function request<T>(path: string, init?: RequestInit, accessToken?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...init?.headers,
      },
    });
  } catch (error) {
    throw new ApiError("The portfolio API could not be reached.", 0, "NETWORK_ERROR", error);
  }

  if (!response.ok) throw await ApiError.fromResponse(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const apiClient = {
  get<T>(path: string, accessToken?: string): Promise<T> {
    return request<T>(path, undefined, accessToken);
  },

  post<TBody, TResponse>(path: string, body: TBody, accessToken?: string): Promise<TResponse> {
    return request<TResponse>(
      path,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      accessToken,
    );
  },

  patch<TBody, TResponse>(path: string, body: TBody, accessToken?: string): Promise<TResponse> {
    return request<TResponse>(
      path,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
      accessToken,
    );
  },

  put<TBody, TResponse>(path: string, body: TBody, accessToken?: string): Promise<TResponse> {
    return request<TResponse>(
      path,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      accessToken,
    );
  },

  delete<TResponse>(path: string, accessToken?: string): Promise<TResponse> {
    return request<TResponse>(path, { method: "DELETE" }, accessToken);
  },
};
