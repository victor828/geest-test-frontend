<script setup lang="ts">
type Tone = 'emerald' | 'blue' | 'slate' | 'amber' | 'red'

const props = withDefaults(
  defineProps<{
    tone?: Tone
  }>(),
  { tone: 'slate' },
)

const toneClasses: Record<Tone, string> = {
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  slate: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium"
    :class="toneClasses[props.tone]"
  >
    <slot />
  </span>
</template>
