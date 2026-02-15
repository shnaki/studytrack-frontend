import type { ApiError } from '@/types/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/v1'

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiError,
  ) {
    super(body.detail ?? body.title ?? 'API request failed')
    this.name = 'ApiRequestError'
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const body = (await res.json()) as ApiError
    throw new ApiRequestError(res.status, body)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json() as Promise<T>
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path)
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function put<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function del(path: string): Promise<void> {
  return request<void>(path, { method: 'DELETE' })
}
