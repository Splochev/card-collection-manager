import type { IGetUser } from '@/interfaces/user.interface'
import router from '@/router'
import { useSdkStore } from '@/stores/useSdkStore'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as IGetUser | null,
  }),
  actions: {
    setUser(user: IGetUser | null) {
      this.user = user
      router.push('/')
    },
    logout() {
      this.setUser(null)
      localStorage.removeItem('token')

      const sdkStore = useSdkStore()
      sdkStore.setToken('')
    },
  },
  getters: {
    isAuthenticated(): boolean {
      return this.user !== null
    },
    isAdmin(): boolean {
      return this.user?.role === 'admin'
    },
    isPending(): boolean {
      return Boolean(this.user?.isVerified)
    },
  },
})
