<script lang="ts">
import { RouterView } from 'vue-router'
import Typography from '../shared/Typography.vue';
</script>
<template>
  <div class="flex h-screen">
    <div class="w-1/2 flex items-center justify-center">
      <Transition
        name="fade-slide"
        mode="out-in"
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-8 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-8 scale-95"
      >
        <RouterView />
      </Transition>
    </div>
    <div class="w-1/2 flex items-center justify-center">
      <Typography
        variant="h1"
        tag="h1"
      >
        yu gi oh image
    </Typography>
    </div>
  </div>
</template>