import { defineStore } from 'pinia'

export type ToastKind = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  kind: ToastKind
  message: string
}

let nextId = 1

export const useToastStore = defineStore('toast', {
  state: () => ({
    items: [] as ToastItem[],
  }),
  actions: {
    push(kind: ToastKind, message: string) {
      const id = nextId++
      this.items.push({ id, kind, message })
      setTimeout(() => this.dismiss(id), 5000)
    },
    success(message: string) {
      this.push('success', message)
    },
    error(message: string) {
      this.push('error', message)
    },
    dismiss(id: number) {
      this.items = this.items.filter((t) => t.id !== id)
    },
  },
})
