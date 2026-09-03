<script setup lang="ts">
import { ref } from 'vue'
import { assignTask } from '../../api/tasks'
import { useToastStore } from '../../stores/toast'
import { ApiError } from '../../api/client'
import Modal from '../ui/Modal.vue'
import UserMultiSelect from '../ui/UserMultiSelect.vue'

const props = defineProps<{ open: boolean; taskId: number }>()
const emit = defineEmits<{ close: []; assigned: [] }>()

const toast = useToastStore()
const userIds = ref<number[]>([])
const fieldError = ref<string | null>(null)
const submitting = ref(false)

function close() {
  userIds.value = []
  fieldError.value = null
  emit('close')
}

async function submit() {
  fieldError.value = null
  if (!userIds.value.length) {
    fieldError.value = 'Selecciona al menos un usuario'
    return
  }
  submitting.value = true
  try {
    await assignTask(props.taskId, { userIds: userIds.value })
    toast.success('Usuarios asignados correctamente')
    emit('assigned')
    close()
  } catch (err) {
    if (err instanceof ApiError) fieldError.value = err.message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Modal title="Asignar usuarios" :open="open" @close="close">
    <div class="flex flex-col gap-4">
      <UserMultiSelect v-model="userIds" />
      <p v-if="fieldError" class="text-sm text-red-400">{{ fieldError }}</p>
      <div class="flex justify-end gap-2">
        <button
          class="rounded-lg border border-app-border px-4 py-2 text-sm text-app-text-dim hover:text-app-text"
          @click="close"
        >
          Cancelar
        </button>
        <button
          :disabled="submitting"
          class="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-50"
          @click="submit"
        >
          {{ submitting ? 'Asignando...' : 'Asignar' }}
        </button>
      </div>
    </div>
  </Modal>
</template>
