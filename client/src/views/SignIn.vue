<template>
  <SignLayout>
    <div>
      <Typography tag="h1" variant="h5">Sign In</Typography>
      <SharedButton variant="link" @click="login">Sign In</SharedButton>
      <SharedButton variant="link" @click="getUsers">Get Users</SharedButton>
      <SharedButton variant="link" @click="logout">Logout</SharedButton>
    </div>
  </SignLayout>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import { useSdkStore } from '@/stores/useSdkStore'
import SharedButton from '@/components/shared/SharedButton.vue'
import SignLayout from '@/components/layouts/SignLayout.vue'
import Typography from '@/components/shared/Typography.vue'

const userStore = useUserStore()
const sdkStore = useSdkStore()

function getSdk() {
  const sdk = sdkStore.sdk
  if (!sdk) throw new Error('SDK is not initialized')
  return sdk
}

const login = async () => {
  try {
    const sdk = getSdk()
    const user = await sdk.authManager.login('sunko@gmail.com', 'admin')
    console.log('Login successful:', user)
    userStore.setUser(user)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const getUsers = async () => {
  try {
    const sdk = getSdk()
    const users = await sdk.userManager.getAllUsers()
    console.log('Users fetched successfully:', users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const logout = () => {
  try {
    userStore.logout()
    console.log('User logged out')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
