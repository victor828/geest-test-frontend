<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useUsersStore } from "../stores/users";
import Badge from "../components/ui/Badge.vue";
import Pagination from "../components/ui/Pagination.vue";
import EmptyState from "../components/ui/EmptyState.vue";
import UserFormModal from "../components/users/UserFormModal.vue";

const usersStore = useUsersStore();
const showForm = ref(false);

onMounted(() => usersStore.fetch());

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <p class="text-sm text-app-text-dim">
        Gestiona los usuarios registrados en el sistema.
      </p>
      <button
        class="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
        @click="showForm = true">
        + Nuevo usuario
      </button>
    </div>

    <div
      class="overflow-hidden rounded-xl border border-app-border bg-app-card">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-app-border text-app-text-dim">
          <tr>
            <th class="px-4 py-3 font-medium">Nombre</th>
            <th class="px-4 py-3 font-medium">Email</th>
            <th class="px-4 py-3 font-medium">Fecha alta</th>
            <th class="px-4 py-3 font-medium">Tareas pendientes</th>
            <th class="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in usersStore.items"
            :key="u.id"
            class="border-b border-app-border/60 last:border-0 hover:bg-white/[0.02]">
            <td class="px-4 py-3 font-medium text-app-text">
              {{ u.name }} {{ u.lastName }}
            </td>
            <td class="px-4 py-3 text-app-text-dim">{{ u.email }}</td>
            <td class="px-4 py-3 text-app-text-dim">
              {{ formatDate(u.createdAt) }}
            </td>
            <td class="px-4 py-3">
              <Badge :tone="u.pendingTasks?.length ? 'amber' : 'slate'">
                {{ u.pendingTasks?.length ?? 0 }}
              </Badge>
            </td>
            <td class="px-4 py-3 text-right">
              <RouterLink
                :to="`/users/${u.id}/tasks`"
                class="text-sm font-medium text-emerald-400 hover:text-emerald-300">
                Ver tareas →
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
      <EmptyState
        v-if="!usersStore.loading && !usersStore.items.length"
        message="Aún no hay usuarios registrados." />
      <Pagination
        :meta="usersStore.meta"
        @change="(p) => usersStore.fetch(p)" />
    </div>

    <UserFormModal :open="showForm" @close="showForm = false" />
  </div>
</template>
