<template>
  <div class="flex h-screen">
    <Sidebar v-model:visible="sidebarVisible" class="md:hidden" />
    <aside class="hidden md:flex md:flex-col w-64 border-r shadow-sm p-4">
      <nav class="flex flex-col gap-4">
        <SharedButton
          label="Collection"
          icon="pi pi-book"
          class="p-button-text justify-start"
          @click="goTo('/collection')"
        />
        <SharedButton
          label="Card Sets"
          icon="pi pi-clone"
          class="p-button-text justify-start"
          @click="goTo('/card-sets')"
        />
        <SharedButton
          v-if="userStore.isAdmin"
          label="Users"
          icon="pi pi-users"
          class="p-button-text justify-start"
          @click="goTo('/users')"
        />
      </nav>
    </aside>
    <div class="flex-1 flex flex-col">
      <header class="flex items-center justify-between border-b p-4 shadow-sm">
        <div class="flex gap-4 items-center">
          <div class="w-fit">
            <SharedInput v-model="searchQuery" placeholder="Search…" leftIcon="fas fa-search" />
          </div>
          <SharedSwitch v-model="switchState" leftLabel="Card Sets" rightLabel="Collection" />
        </div>
        <div class="flex items-center">
          <SharedAvatar
            :label="`${userStore.user?.firstName?.[0] || ''}${userStore.user?.lastName?.[0] || ''}`"
            :links="userMenu"
          />
        </div>
      </header>
      <main class="flex-1 overflow-auto p-4">
        <slot> </slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import SharedInput from '@/components/shared/SharedInput.vue'
import SharedAvatar from '@/components/shared/SharedAvatar.vue'
import SharedButton from '@/components/shared/SharedButton.vue'
import SharedSwitch from '@/components/shared/SharedSwitch.vue'
import Sidebar from 'primevue/sidebar'

const router = useRouter()
const userStore = useUserStore()
const searchQuery = ref('')
const switchState = ref(true)
const sidebarVisible = ref(false)

const menu = ref()
const userMenu = [
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    clickMethod: () => {
      userStore.logout()
      router.push('/signin')
    },
  },
]

function goTo(path: string) {
  router.push(path)
}

function toggleMenu(event: Event) {
  menu.value.toggle(event)
}
</script>
