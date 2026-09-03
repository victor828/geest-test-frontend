import { apiClient, idempotencyHeader } from './client'
import type { CreateUserDto, Paginated, User, UserTask } from '../types/api'

export function createUser(dto: CreateUserDto) {
  return apiClient
    .post<User>('/users', dto, { headers: idempotencyHeader() })
    .then((r) => r.data)
}

export function listUsers(page: number, limit: number) {
  return apiClient
    .get<Paginated<User>>('/users', { params: { page, limit } })
    .then((r) => r.data)
}

export function getUserTasks(userId: number) {
  return apiClient.get<UserTask[]>(`/users/${userId}/tasks`).then((r) => r.data)
}
