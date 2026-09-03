<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    open: boolean
  }>(),
  {},
)

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60" @click="emit('close')" />
      <div
        class="relative w-full max-w-lg rounded-xl border border-app-border bg-app-card p-6 shadow-2xl"
      >
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-app-text">{{ title }}</h2>
          <button
            class="rounded-md p-1 text-app-text-dim hover:bg-white/5 hover:text-app-text"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
