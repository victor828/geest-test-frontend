<script setup lang="ts">
import type { PageMeta } from '../../types/api'

const props = defineProps<{ meta: PageMeta }>()
const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <div
    v-if="props.meta.totalPages > 1"
    class="flex items-center justify-between border-t border-app-border px-4 py-3 text-sm text-app-text-dim"
  >
    <span>
      Página {{ props.meta.page }} de {{ props.meta.totalPages }} · {{ props.meta.total }}
      resultados
    </span>
    <div class="flex gap-2">
      <button
        class="rounded-md border border-app-border px-3 py-1 disabled:opacity-40"
        :disabled="props.meta.page <= 1"
        @click="emit('change', props.meta.page - 1)"
      >
        Anterior
      </button>
      <button
        class="rounded-md border border-app-border px-3 py-1 disabled:opacity-40"
        :disabled="props.meta.page >= props.meta.totalPages"
        @click="emit('change', props.meta.page + 1)"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>
