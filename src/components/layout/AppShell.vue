<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="flex min-h-screen bg-app-bg text-app-text">
    <aside class="flex w-60 shrink-0 flex-col border-r border-app-border bg-app-surface">
      <div class="flex items-center gap-2 border-b border-app-border px-5 py-5">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 font-bold"
        >
          G
        </div>
        <div>
          <p class="text-sm font-semibold leading-tight">GEEST</p>
          <p class="text-xs text-app-text-dim leading-tight">Gestión de tareas</p>
        </div>
      </div>
      <nav class="flex flex-col gap-1 p-3">
        <RouterLink
          to="/users"
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="
            route.path.startsWith('/users')
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'text-app-text-dim hover:bg-white/5 hover:text-app-text'
          "
        >
          Usuarios
        </RouterLink>
        <RouterLink
          to="/tasks"
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="
            route.path.startsWith('/tasks')
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'text-app-text-dim hover:bg-white/5 hover:text-app-text'
          "
        >
          Tareas
        </RouterLink>
      </nav>
    </aside>

    <div class="flex flex-1 flex-col">
      <header class="border-b border-app-border px-8 py-4">
        <h1 class="text-base font-semibold text-app-text">
          {{ route.meta.title ?? '' }}
        </h1>
      </header>
      <main class="flex-1 px-8 py-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
