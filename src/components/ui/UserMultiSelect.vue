<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { listUsers } from '../../api/users'
import type { User } from '../../types/api'

const props = defineProps<{ modelValue: number[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: number[]] }>()

const users = ref<User[]>([])
const search = ref('')
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await listUsers(1, 100)
    users.value = res.data
  } finally {
    loading.value = false
  }
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter((u) =>
    `${u.name} ${u.lastName} ${u.email}`.toLowerCase().includes(q),
  )
})

function toggle(id: number) {
  const selected = new Set(props.modelValue)
  if (selected.has(id)) {
    selected.delete(id)
  } else {
    selected.add(id)
  }
  emit('update:modelValue', Array.from(selected))
}
</script>

<template>
  <div class="rounded-lg border border-app-border">
    <input
      v-model="search"
      type="text"
      placeholder="Buscar usuario por nombre o email..."
      class="w-full rounded-t-lg border-b border-app-border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-app-text-dim"
    />
    <div class="max-h-48 overflow-y-auto p-1">
      <p v-if="loading" class="px-2 py-2 text-sm text-app-text-dim">Cargando usuarios...</p>
      <p v-else-if="!filtered.length" class="px-2 py-2 text-sm text-app-text-dim">
        Sin resultados.
      </p>
      <label
        v-for="u in filtered"
        :key="u.id"
        class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white/5"
      >
        <input
          type="checkbox"
          :checked="modelValue.includes(u.id)"
          class="accent-emerald-500"
          @change="toggle(u.id)"
        />
        <span>{{ u.name }} {{ u.lastName }}</span>
        <span class="text-xs text-app-text-dim">{{ u.email }}</span>
      </label>
    </div>
  </div>
</template>
