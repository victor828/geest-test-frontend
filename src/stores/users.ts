import { defineStore } from 'pinia'
import { createUser, listUsers } from '../api/users'
import type { CreateUserDto, PageMeta, User } from '../types/api'

export const useUsersStore = defineStore('users', {
  state: () => ({
    items: [] as User[],
    meta: { page: 1, limit: 20, total: 0, totalPages: 0 } as PageMeta,
    loading: false,
  }),
  actions: {
    async fetch(page?: number, limit?: number) {
      page ??= this.meta.page
      limit ??= this.meta.limit
      this.loading = true
      try {
        const res = await listUsers(page, limit)
        this.items = res.data
        this.meta = res.meta
      } finally {
        this.loading = false
      }
    },
    async create(dto: CreateUserDto) {
      const user = await createUser(dto)
      await this.fetch(1, this.meta.limit)
      return user
    },
  },
})
