<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), {
  message: 'No hay datos para mostrar.',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 py-16 text-app-text-dim">
    <p>{{ message }}</p>
  </div>
</template>
