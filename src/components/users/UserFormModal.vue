<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUsersStore } from '../../stores/users'
import { useToastStore } from '../../stores/toast'
import { ApiError } from '../../api/client'
import Modal from '../ui/Modal.vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const usersStore = useUsersStore()
const toast = useToastStore()

const form = reactive({ name: '', lastName: '', email: '' })
const fieldError = ref<string | null>(null)
const submitting = ref(false)

function reset() {
  form.name = ''
  form.lastName = ''
  form.email = ''
  fieldError.value = null
}

function close() {
  reset()
  emit('close')
}

async function submit() {
  fieldError.value = null
  submitting.value = true
  try {
    await usersStore.create({ ...form })
    toast.success(`Usuario "${form.name} ${form.lastName}" creado correctamente`)
    close()
  } catch (err) {
    if (err instanceof ApiError) {
      fieldError.value = err.message
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Modal title="Nuevo usuario" :open="open" @close="close">
    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <div>
        <label class="mb-1 block text-sm text-app-text-dim">Nombre</label>
        <input
          v-model="form.name"
          required
          type="text"
          class="w-full rounded-lg border border-app-border bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500/60"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm text-app-text-dim">Apellido</label>
        <input
          v-model="form.lastName"
          required
          type="text"
          class="w-full rounded-lg border border-app-border bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500/60"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm text-app-text-dim">Email</label>
        <input
          v-model="form.email"
          required
          type="email"
          class="w-full rounded-lg border border-app-border bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500/60"
        />
      </div>
      <p v-if="fieldError" class="text-sm text-red-400">{{ fieldError }}</p>
      <div class="mt-2 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-lg border border-app-border px-4 py-2 text-sm text-app-text-dim hover:text-app-text"
          @click="close"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          {{ submitting ? 'Creando...' : 'Crear usuario' }}
        </button>
      </div>
    </form>
  </Modal>
</template>
