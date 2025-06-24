<template>
  <div class="dropdown dropdown-end">
    <span id="avatarLabel" class="sr-only">User menu</span>
    <label tabindex="0" class="btn btn-circle avatar placeholder" aria-label="User menu">
      <div
        class="bg-neutral text-neutral-content rounded-full w-10 h-10 flex items-center justify-center"
      >
        <span v-if="label" class="text-lg font-semibold leading-none">
          {{ label }}
        </span>
        <i v-else-if="icon" :class="['text-lg', icon]" aria-hidden="true"></i>
      </div>
    </label>
    <ul
      tabindex="0"
      class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1"
      aria-label="User menu options"
    >
      <li v-for="link in links" :key="link.label">
        <SharedButton variant="link" class="justify-start w-full" @click="link.clickMethod">
          {{ link.label }}
        </SharedButton>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import SharedButton from '@/components/shared/SharedButton.vue'

const props = defineProps<{
  label?: string
  icon?: string
  links: Array<{ label: string; clickMethod: () => void }>
}>()
</script>
