<template>
  <div class="flex h-screen">
    <aside class="w-64 bg-base-300 p-4 hidden md:block">
      <ul class="menu text-base">
        <li v-if="userStore.isAuthenticated">
          <SharedButton variant="link" path="/collection">Collection</SharedButton>
        </li>
        <li>
          <SharedButton variant="link" path="/card-sets">Card Sets</SharedButton>
        </li>
        <li v-if="userStore.isAdmin">
          <SharedButton variant="link" path="/users">Users</SharedButton>
        </li>
      </ul>
    </aside>
    <div class="flex-1 flex flex-col">
      <div class="navbar bg-base-200 px-4 flex justify-between items-center">
        <div class="flex gap-4 items-center">
          <div class="w-fit">
            <SharedInput v-model="searchQuery" placeholder="Search…" leftIcon="fas fa-search" />
          </div>
          <SharedSwitch v-model="switchState" leftLabel="Collection" rightLabel="Card Sets" />
        </div>
        <div class="flex-none">
          <template v-if="!userStore.isAuthenticated">
            <SharedButton variant="link" path="/signin"> Sign In </SharedButton>
            <SharedButton variant="link" path="/signup"> Sign Up </SharedButton>
          </template>
          <template v-else>
            <SharedAvatar
              :label="`${userStore.user?.firstName?.[0] || ''}${userStore.user?.lastName?.[0] || ''}`"
              icon="fas fa-user"
              :links="[{ label: 'Logout', clickMethod: logout }]"
            />
          </template>
        </div>
      </div>
      <div class="p-4 flex-1 overflow-auto">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import SharedButton from '@/components/shared/SharedButton.vue'
import SharedInput from '@/components/shared/SharedInput.vue'
import SharedSwitch from '@/components/shared/SharedSwitch.vue'
import SharedAvatar from '@/components/shared/SharedAvatar.vue'

const router = useRouter()
const userStore = useUserStore()
const searchQuery = ref('')
const switchState = ref(false)

function logout() {
  userStore.logout()
  router.push('/signin')
}
</script>
