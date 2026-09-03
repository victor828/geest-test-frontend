<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getTaskNotifications } from '../../api/tasks'
import type { NotificationAttempt } from '../../types/api'
import Badge from '../ui/Badge.vue'

const props = defineProps<{ taskId: number }>()

const attempts = ref<NotificationAttempt[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    attempts.value = await getTaskNotifications(props.taskId)
  } finally {
    loading.value = false
  }
}

onMounted(load)
defineExpose({ load })

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-app-border bg-app-card">
    <table class="w-full text-left text-sm">
      <thead class="border-b border-app-border text-app-text-dim">
        <tr>
          <th class="px-4 py-2.5 font-medium">Intento</th>
          <th class="px-4 py-2.5 font-medium">Resultado</th>
          <th class="px-4 py-2.5 font-medium">HTTP</th>
          <th class="px-4 py-2.5 font-medium">Fecha</th>
          <th class="px-4 py-2.5 font-medium">Error</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in attempts" :key="a.attemptNumber" class="border-b border-app-border/60 last:border-0">
          <td class="px-4 py-2.5">#{{ a.attemptNumber }}</td>
          <td class="px-4 py-2.5">
            <Badge :tone="a.success ? 'emerald' : 'red'">{{ a.success ? 'Éxito' : 'Fallo' }}</Badge>
          </td>
          <td class="px-4 py-2.5 text-app-text-dim">{{ a.httpStatus ?? '—' }}</td>
          <td class="px-4 py-2.5 text-app-text-dim">{{ formatDate(a.attemptedAt) }}</td>
          <td class="px-4 py-2.5 text-app-text-dim">{{ a.errorMessage ?? '—' }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="!loading && !attempts.length" class="px-4 py-6 text-center text-sm text-app-text-dim">
      Sin intentos de notificación registrados.
    </p>
  </div>
</template>
