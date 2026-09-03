<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { completeTask, getTask } from '../api/tasks'
import type { Task } from '../types/api'
import { useToastStore } from '../stores/toast'
import Badge from '../components/ui/Badge.vue'
import AssignModal from '../components/tasks/AssignModal.vue'
import NotificationsTable from '../components/tasks/NotificationsTable.vue'

const route = useRoute()
const taskId = Number(route.params.id)
const toast = useToastStore()

const task = ref<Task | null>(null)
const loading = ref(false)
const showAssign = ref(false)
const completingUserId = ref<number | null>(null)

async function load() {
  loading.value = true
  try {
    task.value = await getTask(taskId)
  } finally {
    loading.value = false
  }
}

onMounted(load)

async function markCompleted(userId: number) {
  completingUserId.value = userId
  try {
    const res = await completeTask(taskId, { userId })
    task.value = res.task
    toast.success(res.message)
  } finally {
    completingUserId.value = null
  }
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })
}

const isArchived = computed(() => task.value?.status === 'archived')
</script>

<template>
  <div class="flex flex-col gap-6">
    <RouterLink to="/tasks" class="text-sm text-app-text-dim hover:text-app-text">
      ← Volver a tareas
    </RouterLink>

    <div v-if="task" class="flex flex-col gap-6">
      <div class="rounded-xl border border-app-border bg-app-card p-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-xl font-semibold text-app-text">{{ task.title }}</h2>
            <p v-if="task.description" class="mt-1 text-sm text-app-text-dim">{{ task.description }}</p>
          </div>
          <Badge :tone="task.status === 'open' ? 'blue' : 'slate'">{{ task.status }}</Badge>
        </div>
        <div class="mt-4 flex gap-6 text-xs text-app-text-dim">
          <span>Creada: {{ formatDate(task.createdAt) }}</span>
          <span>Archivada: {{ formatDate(task.archivedAt) }}</span>
        </div>
      </div>

      <div class="rounded-xl border border-app-border bg-app-card">
        <div class="flex items-center justify-between border-b border-app-border px-4 py-3">
          <h3 class="text-sm font-semibold text-app-text">Asignados</h3>
          <button
            class="rounded-lg border border-app-border px-3 py-1.5 text-sm text-app-text-dim hover:text-app-text"
            @click="showAssign = true"
          >
            + Asignar usuarios
          </button>
        </div>
        <table class="w-full text-left text-sm">
          <tbody>
            <tr
              v-for="a in task.assignees"
              :key="a.userId"
              class="border-b border-app-border/60 last:border-0"
            >
              <td class="px-4 py-3 font-medium text-app-text">{{ a.name }} {{ a.lastName }}</td>
              <td class="px-4 py-3 text-app-text-dim">{{ a.email }}</td>
              <td class="px-4 py-3">
                <Badge :tone="a.completed ? 'emerald' : 'amber'">
                  {{ a.completed ? 'Completada' : 'Pendiente' }}
                </Badge>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  v-if="!a.completed"
                  :disabled="completingUserId === a.userId"
                  class="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-50"
                  @click="markCompleted(a.userId)"
                >
                  {{ completingUserId === a.userId ? 'Guardando...' : 'Marcar completada' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!task.assignees?.length" class="px-4 py-6 text-center text-sm text-app-text-dim">
          Esta tarea no tiene usuarios asignados.
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <h3 class="text-sm font-semibold text-app-text">Notificaciones</h3>
        <NotificationsTable v-if="isArchived" :task-id="taskId" />
        <p v-else class="text-sm text-app-text-dim">
          Las notificaciones se generan cuando la tarea se archiva automáticamente al completar todos los
          asignados.
        </p>
      </div>
    </div>

    <AssignModal :open="showAssign" :task-id="taskId" @close="showAssign = false" @assigned="load" />
  </div>
</template>
