import { defineStore } from 'pinia'
import { createTask, listTasks } from '../api/tasks'
import type { CreateTaskDto, PageMeta, Task, TaskStatus } from '../types/api'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    items: [] as Task[],
    meta: { page: 1, limit: 20, total: 0, totalPages: 0 } as PageMeta,
    status: undefined as TaskStatus | undefined,
    loading: false,
  }),
  actions: {
    async fetch(page = this.meta.page, limit = this.meta.limit, ...statusArg: [TaskStatus | undefined] | []) {
      this.loading = true
      if (statusArg.length > 0) this.status = statusArg[0]
      try {
        const res = await listTasks(page, limit, this.status)
        this.items = res.data
        this.meta = res.meta
      } finally {
        this.loading = false
      }
    },
    async create(dto: CreateTaskDto) {
      const task = await createTask(dto)
      await this.fetch(1, this.meta.limit, this.status)
      return task
    },
  },
})
