<template>
  <div class="form-control w-full">
    <div class="relative">
      <InputText
        :type="type"
        :placeholder="placeholder"
        v-model="innerValue"
        :class="inputClass"
        v-bind="$attrs"
        :style="iconStyles"
      />
      <span
        v-if="leftIcon"
        :class="`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-primary`"
        style="z-index: 1"
      >
        <i :class="leftIcon"></i>
      </span>
      <span
        v-if="rightIcon"
        :class="`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-primary`"
        style="z-index: 1"
      >
        <i :class="rightIcon"></i>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import InputText from 'primevue/inputtext'
import { mapPropsToClasses } from '@/utils/classUtils'

const props = withDefaults(
  defineProps<{
    modelValue: string
    type?: string
    placeholder?: string
    size?: 'xs' | 'sm' | 'md' | 'lg'
    bordered?: boolean
    leftIcon?: string
    rightIcon?: string
    class?: string
  }>(),
  {
    type: 'text',
    placeholder: '',
    size: 'sm',
    bordered: true,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const innerValue = computed<string>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const inputClass = computed(() => {
  const baseClasses = mapPropsToClasses(props, {
    size: 'p-inputtext-',
    bordered: 'input-bordered',
  })

  return [...baseClasses, '!rounded-full', 'focus:outline-none', 'focus:shadow-none'].join(' ')
})

const iconStyles = computed(() => ({
  'padding-left': props.leftIcon ? '2rem' : '',
  'padding-right': props.rightIcon ? '2rem' : '',
}))
</script>
