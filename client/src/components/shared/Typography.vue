<template>
  <component :is="tag" :class="computedClass" v-bind="$attrs">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'body1',
  },
  tag: {
    type: String,
    default: 'p',
  },
  class: {
    type: String,
    default: '',
  },
})

const computedClass = computed(() => {
  const baseClass = 'font-roboto'
  const variantClasses: Record<string, string> = {
    h1: 'text-6xl font-semibold',
    h2: 'text-5xl font-semibold',
    h3: 'text-4xl font-semibold',
    h4: 'text-3xl font-semibold',
    h5: 'text-2xl font-semibold',
    h6: 'text-xl font-semibold',
    subtitle1: 'text-lg font-medium',
    subtitle2: 'text-base font-medium',
    body1: 'text-base font-normal',
    body2: 'text-sm font-normal',
    caption: 'text-xs font-light',
    overline: 'text-xs font-light uppercase',
  }
  return `${baseClass} ${variantClasses[props.variant] || ''} ${props.class}`
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');

.font-roboto {
  font-family: 'Roboto', sans-serif;
}
</style>
