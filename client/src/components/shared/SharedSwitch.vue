<template>
  <label class="label">
    <span v-if="leftLabel" class="label-text mr-2">{{ leftLabel }}</span>
    <input
      type="checkbox"
      class="toggle"
      :class="sizeClass"
      :aria-label="leftLabel || rightLabel || 'Toggle switch'"
      :checked="modelValue"
      @change="onChange"
    />
    <span v-if="rightLabel" class="label-text ml-2">{{ rightLabel }}</span>
    <slot></slot>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  leftLabel?: string
  rightLabel?: string
  class?: string
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'ghost'
    | 'link'
    | 'outline'
    | 'neutral'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
}>()

const emit = defineEmits(['update:modelValue'])

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'toggle-xs'
    case 'sm':
      return 'toggle-sm'
    case 'md':
      return 'toggle-md'
    case 'lg':
      return 'toggle-lg'
    default:
      return ''
  }
})

function onChange(event: Event) {
  const isChecked = (event.target as HTMLInputElement).checked
  emit('update:modelValue', isChecked)
}
</script>
