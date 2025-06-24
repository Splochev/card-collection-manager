import { defineStore } from 'pinia'
import SDK from '@/sdk/SDK'
import { useUserStore } from '@/stores/useUserStore'

export const useSdkStore = defineStore('sdk', {
  state: () => ({
    sdk: null as SDK | null,
  }),
  actions: {
    async initializeSdk(systemUrl: string) {
      this.sdk = SDK.getInstance(systemUrl)

      const sdkToken = this.sdk.getToken()
      const userStore = useUserStore()
      const isAuthenticated = userStore.isAuthenticated

      if (!isAuthenticated && sdkToken) {
        const authUser = await this.sdk.authManager.getMe()
        userStore.setUser(authUser)
      }
    },
    setToken(token: string) {
      if (this.sdk) {
        this.sdk.setTokens(token)
      }
    },
  },
})
