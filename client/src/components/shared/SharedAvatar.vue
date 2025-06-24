<template>
  <div>
    <SharedButton
      ref="menuButton"
      aria-haspopup="true"
      aria-controls="user-menu"
      aria-expanded="true"
      @click="toggleMenu"
      variant="icon"
    >
      <Avatar
        :label="label"
        :icon="icon"
        size="large"
        shape="circle"
        class="bg-primary text-primary-content"
        style="width: 2.5rem; height: 2.5rem; font-weight: 600; font-size: 1.125rem"
      />
    </SharedButton>
    <Menu ref="menu" id="user-menu" :model="menuItems" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Menu from 'primevue/menu'
import Avatar from 'primevue/avatar'
import SharedButton from '@/components/shared/SharedButton.vue'

const props = defineProps<{
  label?: string
  icon?: string
  links: Array<{ label: string; clickMethod: () => void }>
}>()

const menu = ref()
const menuButton = ref()

const toggleMenu = (event: MouseEvent) => {
  menu.value?.toggle(event)
}

const menuItems = props.links.map((link) => ({
  label: link.label,
  command: link.clickMethod,
}))
</script>
