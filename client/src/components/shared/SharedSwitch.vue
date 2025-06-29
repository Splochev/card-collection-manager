<template>
  <label class="flex items-center cursor-pointer select-none">
    <span v-if="leftLabel" class="label-text mr-2 self-center">{{ leftLabel }}</span>
    <ToggleSwitch v-model="innerValue" :class="[sizeClass, props.class]" :aria-label="ariaLabel" />
    <span v-if="rightLabel" class="label-text ml-2 self-center">{{ rightLabel }}</span>
    <slot></slot>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ToggleSwitch from 'primevue/toggleswitch'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg'
    leftLabel?: string
    rightLabel?: string
    class?: string
  }>(),
  {
    size: 'md',
  },
)

const emit = defineEmits(['update:modelValue'])

const innerValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const sizeClass = computed(() => {
  const sizeMapping = {
    xs: 'scale-75',
    sm: 'scale-90',
    md: 'scale-100',
    lg: 'scale-110',
  }
  return sizeMapping[props.size] || ''
})

const ariaLabel = computed(() => props.leftLabel || props.rightLabel || 'Toggle switch')
</script>
