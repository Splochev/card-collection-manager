<script setup lang="ts">
import { RouterView } from 'vue-router'
import Layout from '@/components/layouts/Layout.vue'
import AuthLayout from '@/components/layouts/AuthLayout.vue'
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()
</script>

<template>
  <div>
    <template v-if="userStore.isAuthenticated">
      <Layout>
        <RouterView />
      </Layout>
    </template>
    <template v-else>
      <AuthLayout/>
    </template>
  </div>
</template>

<style scoped></style>
