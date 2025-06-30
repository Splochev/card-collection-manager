<template>
  <div class="flex h-screen">
    <Sidebar v-model:visible="sidebarVisible" class="md:hidden" />
    <aside class="hidden md:flex md:flex-col w-64 border-r shadow-sm p-4">
      <nav class="flex flex-col gap-4">
        <SharedButton
          label="Collection"
          icon="pi pi-book"
          class="p-button-text justify-start"
          variant="link"
          :path="goTo('/collection')"
        />
        <SharedButton
          label="Card Sets"
          icon="pi pi-clone"
          class="p-button-text justify-start"
          variant="link"
          :path="goTo('/card-sets')"      
        />
        <SharedButton
          v-if="userStore.isAdmin"
          label="Users"
          icon="pi pi-users"
          class="p-button-text justify-start"
          variant="link"
          path="/users"
        />
      </nav>
    </aside>
    <div class="flex-1 flex flex-col">
      <header class="flex items-center justify-between border-b p-4 shadow-sm">
        <div class="flex gap-4 items-center">
          <div class="w-fit">
            <SharedInput
              v-model="searchQuery"
              placeholder="Search…"
              leftIcon="fas fa-search" 
              label="search"
            />
          </div>
          <SharedSwitch
            v-model="switchState"
            leftLabel="Card Sets"
            rightLabel="Collection" 
          />
        </div>
        <div class="flex items-center">
          <SharedAvatar
            :label="`${userStore.user?.firstName?.[0] || ''}${userStore.user?.lastName?.[0] || ''}`"
            :links="userMenu"
          />
        </div>
      </header>
      <main class="flex-1 overflow-auto p-4">
        <div>{{ debouncedSearchValue }}</div>
        <slot> </slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { debounce } from '@/utils/debounce'
import SharedInput from '@/components/shared/SharedInput.vue'
import SharedAvatar from '@/components/shared/SharedAvatar.vue'
import SharedButton from '@/components/shared/SharedButton.vue'
import SharedSwitch from '@/components/shared/SharedSwitch.vue'
import Sidebar from 'primevue/sidebar'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const searchQuery = ref('')
const debouncedSearchValue = ref('')
const switchState = ref(true)
const sidebarVisible = ref(false)

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

const updateDebouncedSearch = debounce((value: string) => {
  debouncedSearchValue.value = value
}, 300)

watch(searchQuery, (newValue) => {
  updateDebouncedSearch(newValue)
})

watch(debouncedSearchValue, (newValue) => {
  // Update URL query parameter based on debounced search
  const currentQuery = { ...route.query }
  if (newValue.trim()) {
    currentQuery.search = newValue
  } else {
    delete currentQuery.search
  }
  router.replace({ query: currentQuery })
})

function updateSwitchBasedOnRoute() {
  if (route.path === '/collection') {
    switchState.value = true
  } else if (route.path === '/card-sets') {
    switchState.value = false
  }
}

function initializeFromRoute() {
  const searchParam = route.query.search as string
  if (searchParam) {
    searchQuery.value = searchParam
    debouncedSearchValue.value = searchParam
  }
  updateSwitchBasedOnRoute()
}

watch(() => route.path, () => {
  updateSwitchBasedOnRoute()
})

watch(() => route.query.search, (newSearchParam) => {
  const searchValue = newSearchParam as string || ''
  if (searchQuery.value !== searchValue) {
    searchQuery.value = searchValue
    debouncedSearchValue.value = searchValue
  }
})

watch(switchState, (newValue) => {
  const currentQuery = { ...route.query }
  if (newValue) {
    if (route.path !== '/collection') {
      router.push({ path: '/collection', query: currentQuery })
    }
  } else {
    if (route.path !== '/card-sets') {
      router.push({ path: '/card-sets', query: currentQuery })
    }
  }
})

watch(debouncedSearchValue, (newValue) => {
  const currentQuery = { ...route.query, search: newValue };
  if (switchState.value) {
    if (route.path !== '/collection') {
      router.push({ path: '/collection', query: currentQuery });
    }
  } else {
    if (route.path !== '/card-sets') {
      router.push({ path: '/card-sets', query: currentQuery });
    }
  }
});

function goTo(path: string) {
  const queryString = new URLSearchParams(route.query as Record<string, string>).toString();
  return `${path}${queryString && !queryString.includes('null') ? `?${queryString}` : ''}`;
}

onMounted(() => initializeFromRoute())
</script>
