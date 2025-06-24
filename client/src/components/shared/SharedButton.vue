<template>
  <Button
    v-bind="attrs"
    :class="buttonClass"
    :icon="icon"
    :label="label"
    :disabled="disabled || loading"
    :loading="loading"
    :rounded="rounded"
    @click="handleClick"
    :as="variant === 'link' ? 'a' : 'button'"
    :href="variant === 'link' && path ? path : undefined"
  >
    <template v-if="hasDefaultSlot" #default>
      <slot></slot>
    </template>
  </Button>
</template>

<script setup lang="ts">
import { computed, useAttrs, useSlots, defineEmits, defineProps, withDefaults } from 'vue'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    label?: string
    icon?: string
    severity?:
      | 'secondary'
      | 'success'
      | 'info'
      | 'warn'
      | 'help'
      | 'danger'
      | 'contrast'
      | 'default'
    variant?: 'text' | 'outlined' | 'contained' | 'link' | 'default'
    size?: 'small' | 'normal' | 'large'
    rounded?: boolean
    loading?: boolean
    disabled?: boolean
    class?: string
    style?: string | Record<string, any>
    path?: string
  }>(),
  {
    severity: 'default',
    variant: 'default',
    size: 'normal',
    rounded: true,
    loading: false,
  },
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const attrs = useAttrs()
const slots = useSlots()

const hasDefaultSlot = computed(() => !!slots.default)

const buttonClass = computed(() => {
  const baseClasses = [
    props.class,
    {
      [`p-button-${props.variant}`]: props.variant && props.variant !== 'default',
      [`p-button-${props.severity}`]: props.severity && props.severity !== 'default',
      [`p-button-${props.size}`]: props.size && props.size !== 'normal',
      'p-button-rounded': props.rounded,
    },
  ]
  if (props.variant === 'link') {
    baseClasses.push('filter', 'hover:brightness-75')
  }
  return baseClasses
})

function handleClick(event: MouseEvent) {
  if (props.path) {
    event.preventDefault()
    navigateTo(props.path)
    return
  }

  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const router = useRouter()
function navigateTo(path: string) {
  router.push(path)
}
</script>
