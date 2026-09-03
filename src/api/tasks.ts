import { apiClient, idempotencyHeader } from './client'
import type {
  AssignTaskDto,
  CompleteTaskDto,
  CreateTaskDto,
  NotificationAttempt,
  Paginated,
  Task,
  TaskStatus,
} from '../types/api'

export function createTask(dto: CreateTaskDto) {
  return apiClient
    .post<Task>('/tasks', dto, { headers: idempotencyHeader() })
    .then((r) => r.data)
}

export function listTasks(page: number, limit: number, status?: TaskStatus) {
  return apiClient
    .get<Paginated<Task>>('/tasks', { params: { page, limit, status } })
    .then((r) => r.data)
}

export function getTask(taskId: number) {
  return apiClient.get<Task>(`/tasks/${taskId}`).then((r) => r.data)
}

export function assignTask(taskId: number, dto: AssignTaskDto) {
  return apiClient
    .post<{ message: string }>(`/tasks/${taskId}/assign`, dto, {
      headers: idempotencyHeader(),
    })
    .then((r) => r.data)
}

export function completeTask(taskId: number, dto: CompleteTaskDto) {
  return apiClient
    .post<{ message: string; task: Task }>(`/tasks/${taskId}/complete`, dto, {
      headers: idempotencyHeader(),
    })
    .then((r) => r.data)
}

export function getTaskNotifications(taskId: number) {
  return apiClient
    .get<NotificationAttempt[]>(`/tasks/${taskId}/notifications`)
    .then((r) => r.data)
}
