<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useTasksStore } from '../../stores/tasks'
import { useToastStore } from '../../stores/toast'
import { ApiError } from '../../api/client'
import Modal from '../ui/Modal.vue'
import UserMultiSelect from '../ui/UserMultiSelect.vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const tasksStore = useTasksStore()
const toast = useToastStore()

const form = reactive({ title: '', description: '', userIds: [] as number[] })
const fieldError = ref<string | null>(null)
const submitting = ref(false)

function reset() {
  form.title = ''
  form.description = ''
  form.userIds = []
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
    await tasksStore.create({
      title: form.title,
      description: form.description || undefined,
      userIds: form.userIds.length ? form.userIds : undefined,
    })
    toast.success(`Tarea "${form.title}" creada correctamente`)
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
  <Modal title="Nueva tarea" :open="open" @close="close">
    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <div>
        <label class="mb-1 block text-sm text-app-text-dim">Título</label>
        <input
          v-model="form.title"
          required
          type="text"
          class="w-full rounded-lg border border-app-border bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500/60"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm text-app-text-dim">Descripción (opcional)</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full rounded-lg border border-app-border bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500/60"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm text-app-text-dim">Asignar usuarios (opcional)</label>
        <UserMultiSelect v-model="form.userIds" />
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
          {{ submitting ? 'Creando...' : 'Crear tarea' }}
        </button>
      </div>
    </form>
  </Modal>
</template>
