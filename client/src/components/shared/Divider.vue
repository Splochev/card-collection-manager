<template>
  <Divider
    :layout="layout"
    :type="type"
    :align="alignment"
    :pt="{
      root: { class: 'w-full' }
    }"
  >
    <template v-if="$slots.default" #default>
      <slot></slot>
    </template>
  </Divider>
</template>

<script lang="ts" setup>
import Divider from 'primevue/divider';

defineProps<{
  layout?: 'horizontal' | 'vertical';
  type?: 'solid' | 'dashed' | 'dotted';
  alignment?: 'left' | 'center' | 'right';
}>();
</script> 