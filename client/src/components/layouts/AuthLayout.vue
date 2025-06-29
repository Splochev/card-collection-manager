<script lang="ts">
import { RouterView } from 'vue-router'
</script>
<script setup lang="ts">
</script>
<template>
  <div class="flex h-screen">
    <div class="w-1/2 flex items-center justify-center">
      <RouterView />
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