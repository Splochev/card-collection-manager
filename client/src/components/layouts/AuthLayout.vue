<script lang="ts">
import { RouterView } from 'vue-router'
</script>
<script setup lang="ts">
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
      <!-- TODO add yu-gi-oh image and add cool bg color from theme -->
      <!-- <img
        alt="trackian-charts"
        src="@/assets/hero-section.png"
        class="opacity-80"
      /> -->
      <div>yu gi oh image</div>
    </div>
  </div>
</template>