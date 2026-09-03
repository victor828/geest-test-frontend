<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getUserTasks } from '../api/users'
import type { UserTask } from '../types/api'
import Badge from '../components/ui/Badge.vue'
import EmptyState from '../components/ui/EmptyState.vue'

const route = useRoute()
const tasks = ref<UserTask[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    tasks.value = await getUserTasks(Number(route.params.id))
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-4">
    <RouterLink to="/users" class="text-sm text-app-text-dim hover:text-app-text">
      ← Volver a usuarios
    </RouterLink>

    <div class="overflow-hidden rounded-xl border border-app-border bg-app-card">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-app-border text-app-text-dim">
          <tr>
            <th class="px-4 py-3 font-medium">Tarea</th>
            <th class="px-4 py-3 font-medium">Estado</th>
            <th class="px-4 py-3 font-medium">Completada</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="t in tasks"
            :key="t.id"
            class="border-b border-app-border/60 last:border-0 hover:bg-white/[0.02]"
          >
            <td class="px-4 py-3">
              <RouterLink :to="`/tasks/${t.id}`" class="font-medium text-app-text hover:text-emerald-400">
                {{ t.title }}
              </RouterLink>
              <p v-if="t.description" class="text-xs text-app-text-dim">{{ t.description }}</p>
            </td>
            <td class="px-4 py-3">
              <Badge :tone="t.status === 'open' ? 'blue' : 'slate'">{{ t.status }}</Badge>
            </td>
            <td class="px-4 py-3">
              <Badge :tone="t.completed ? 'emerald' : 'amber'">
                {{ t.completed ? 'Sí' : 'No' }}
              </Badge>
            </td>
          </tr>
        </tbody>
      </table>
      <EmptyState v-if="!loading && !tasks.length" message="Este usuario no tiene tareas asignadas." />
    </div>
  </div>
</template>
