export type TaskStatus = 'open' | 'archived'

export interface PendingTask {
  id: number
  title: string
}

export interface User {
  id: number
  name: string
  lastName: string
  email: string
  createdAt: string
  pendingTasks?: PendingTask[]
}

export interface UserTask {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  completed: boolean
}

export interface TaskAssignee {
  userId: number
  name: string
  lastName: string
  email: string
  completed: boolean
}

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
  archivedAt: string | null
  assignees?: TaskAssignee[]
}

export interface PageMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface Paginated<T> {
  data: T[]
  meta: PageMeta
}

export interface NotificationAttempt {
  attemptNumber: number
  httpStatus: number | null
  success: boolean
  errorMessage: string | null
  attemptedAt: string
}

export interface CreateUserDto {
  name: string
  lastName: string
  email: string
}

export interface CreateTaskDto {
  title: string
  description?: string
  userIds?: number[]
}

export interface AssignTaskDto {
  userIds: number[]
}

export interface CompleteTaskDto {
  userId: number
}

export interface ApiErrorBody {
  error: {
    code: string
    message: string
  }
}
