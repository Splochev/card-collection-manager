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
import { computed, useAttrs, useSlots } from 'vue'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import { navigateToPath } from '@/utils/navigationUtils'
import { mapPropsToClasses } from '@/utils/classUtils'

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
    variant?: 'text' | 'outlined' | 'contained' | 'link' | 'icon' | 'default'
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

const buttonClass = computed(() =>
  mapPropsToClasses(props, {
    variant: 'p-button-',
    severity: 'p-button-',
    size: 'p-button-',
    rounded: 'p-button-rounded',
    linkVariant: ['filter', 'hover:brightness-75', '!p-0'],
    iconVariant: ['p-button-icon-only', 'p-button-rounded'],
  }),
)

function handleClick(event: MouseEvent) {
  if (props.path) {
    event.preventDefault()
    navigateToPath(props.path, router)
    return
  }

  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const router = useRouter()
</script>
