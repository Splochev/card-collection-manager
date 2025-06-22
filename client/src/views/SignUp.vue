<template>
  <div>Sign Up works</div>
  <button class="btn btn-primary" @click="login()">Go to Sign In</button>
  <button class="btn btn-primary" @click="getUsers()">Go to Sign In</button>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import { useSdkStore } from '@/stores/useSdkStore'
import { SDK } from '@/sdk/SDK.ts'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

async function login() {
  const sdkStore = useSdkStore()
  const sdkState = sdkStore.sdk
  try {
    const user = await sdkState.authManager.login('sunko@gmail.com', 'admin')
    console.log('Login successful:', user)
    const userStore = useUserStore()
    userStore.setUser(user)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

async function getUsers() {
  const sdkStore = useSdkStore()
  const sdkState = sdkStore.sdk
  try {
    const users = await sdkState.userManager.getAllUsers()
    console.log('Users fetched successfully:', users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}
</script>
