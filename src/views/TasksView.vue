<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useTasksStore } from '../stores/tasks'
import type { TaskStatus } from '../types/api'
import Badge from '../components/ui/Badge.vue'
import Pagination from '../components/ui/Pagination.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import TaskFormModal from '../components/tasks/TaskFormModal.vue'

const tasksStore = useTasksStore()
const showForm = ref(false)

const filters: { label: string; value: TaskStatus | undefined }[] = [
  { label: 'Todas', value: undefined },
  { label: 'Abiertas', value: 'open' },
  { label: 'Archivadas', value: 'archived' },
]

onMounted(() => tasksStore.fetch())

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="flex gap-1 rounded-lg border border-app-border p-1">
        <button
          v-for="f in filters"
          :key="f.label"
          class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          :class="
            tasksStore.status === f.value
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'text-app-text-dim hover:text-app-text'
          "
          @click="tasksStore.fetch(1, tasksStore.meta.limit, f.value)"
        >
          {{ f.label }}
        </button>
      </div>
      <button
        class="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
        @click="showForm = true"
      >
        + Nueva tarea
      </button>
    </div>

    <div class="overflow-hidden rounded-xl border border-app-border bg-app-card">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-app-border text-app-text-dim">
          <tr>
            <th class="px-4 py-3 font-medium">Título</th>
            <th class="px-4 py-3 font-medium">Estado</th>
            <th class="px-4 py-3 font-medium">Asignados</th>
            <th class="px-4 py-3 font-medium">Creada</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="t in tasksStore.items"
            :key="t.id"
            class="cursor-pointer border-b border-app-border/60 last:border-0 hover:bg-white/[0.02]"
          >
            <td class="px-4 py-3">
              <RouterLink :to="`/tasks/${t.id}`" class="font-medium text-app-text hover:text-emerald-400">
                {{ t.title }}
              </RouterLink>
              <p v-if="t.description" class="max-w-xs truncate text-xs text-app-text-dim">
                {{ t.description }}
              </p>
            </td>
            <td class="px-4 py-3">
              <Badge :tone="t.status === 'open' ? 'blue' : 'slate'">{{ t.status }}</Badge>
            </td>
            <td class="px-4 py-3">
              <div class="flex -space-x-2">
                <span
                  v-for="a in t.assignees?.slice(0, 5)"
                  :key="a.userId"
                  :title="`${a.name} ${a.lastName}${a.completed ? ' (completada)' : ''}`"
                  class="flex h-7 w-7 items-center justify-center rounded-full border-2 border-app-card text-[10px] font-semibold uppercase"
                  :class="a.completed ? 'bg-emerald-500/25 text-emerald-300' : 'bg-slate-600/40 text-slate-200'"
                >
                  {{ a.name[0] }}{{ a.lastName[0] }}
                </span>
                <span v-if="!t.assignees?.length" class="text-xs text-app-text-dim">Sin asignar</span>
              </div>
            </td>
            <td class="px-4 py-3 text-app-text-dim">{{ formatDate(t.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
      <EmptyState v-if="!tasksStore.loading && !tasksStore.items.length" message="No hay tareas para este filtro." />
      <Pagination :meta="tasksStore.meta" @change="(p) => tasksStore.fetch(p)" />
    </div>

    <TaskFormModal :open="showForm" @close="showForm = false" />
  </div>
</template>
