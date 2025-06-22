import { defineStore } from 'pinia'
import SDK from '../sdk/SDK'

export const useSdkStore = defineStore('sdk', {
  state: () => ({
    sdk: null as SDK | null,
  }),
  actions: {
    initializeSdk(systemUrl: string) {
      this.sdk = SDK.getInstance(systemUrl)
    },
    setToken(token: string) {
      if (this.sdk) {
        this.sdk.setTokens(token)
      }
    },
  },
})
