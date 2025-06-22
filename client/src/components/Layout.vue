<template>
  <div class="flex flex-col h-screen">
    <!-- Top Navigation -->
    <nav class="bg-base-200 p-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <input type="text" placeholder="Search..." class="input input-bordered w-full max-w-xs" />
        <button class="btn btn-square">
          <i class="fas fa-search"></i>
        </button>
        <label class="flex items-center gap-2">
          <span>Collection</span>
          <input type="checkbox" class="toggle" />
          <span>Card Sets</span>
        </label>
      </div>
      <div>
        <template v-if="!userStore.isAuthenticated">
          <button class="btn btn-link" @click="navigateTo('/signin')">Sign In</button>
          <button class="btn btn-link" @click="navigateTo('/signup')">Sign Up</button>
        </template>
        <template v-else>
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-circle avatar">
              <div class="w-10 rounded-full">
                <span>
                  {{ userStore.user?.username ? userStore.user.username[0] : '' }}
                  {{ userStore.user?.lastname ? userStore.user.lastname[0] : '' }}
                </span>
              </div>
            </label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><button @click="logout">Logout</button></li>
            </ul>
          </div>
        </template>
      </div>
    </nav>

    <div class="flex flex-1">
      <!-- Sidebar Navigation -->
      <aside class="w-64 bg-base-300 p-4 hidden md:block">
        <ul class="menu">
          <li><button @click="navigateTo('/collection')">Collection</button></li>
          <li><button @click="navigateTo('/card-sets')">Card Sets</button></li>
          <template v-if="isAdmin">
            <li><button @click="navigateTo('/users')">Users</button></li>
          </template>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-4">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'

const router = useRouter()
const userStore = useUserStore()

const isAdmin = computed(() => userStore.isAdmin)
function navigateTo(path: string) {
  router.push(path)
}

function logout() {
  userStore.logout()
  navigateTo('/signin')
}
</script>

<style scoped>
/* Add responsive styles */
</style>
