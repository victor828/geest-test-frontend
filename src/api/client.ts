import axios, { AxiosError } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useToastStore } from '../stores/toast'
import type { ApiErrorBody } from '../types/api'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function idempotencyHeader() {
  return { 'Idempotency-Key': uuidv4() }
}

export class ApiError extends Error {
  code: string
  status: number | undefined

  constructor(code: string, message: string, status?: number) {
    super(message)
    this.code = code
    this.status = status
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (err: AxiosError<ApiErrorBody>) => {
    const body = err.response?.data
    const code = body?.error?.code ?? 'UNKNOWN_ERROR'
    const message = body?.error?.message ?? err.message ?? 'Ocurrió un error inesperado'
    const apiError = new ApiError(code, message, err.response?.status)

    useToastStore().error(message)

    return Promise.reject(apiError)
  },
)
