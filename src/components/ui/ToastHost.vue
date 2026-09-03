<script setup lang="ts">
import { useToastStore } from '../../stores/toast'

const toast = useToastStore()

const toneClasses: Record<string, string> = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  error: 'border-red-500/40 bg-red-500/10 text-red-300',
  info: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-2">
    <div
      v-for="item in toast.items"
      :key="item.id"
      class="flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur"
      :class="toneClasses[item.kind]"
    >
      <span>{{ item.message }}</span>
      <button class="opacity-60 hover:opacity-100" @click="toast.dismiss(item.id)">✕</button>
    </div>
  </div>
</template>
