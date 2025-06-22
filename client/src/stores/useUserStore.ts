import type { IGetUser } from '@/interfaces/user.interface'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as IGetUser | null,
  }),
  actions: {
    setUser(user: IGetUser | null) {
      this.user = user
    },
    clearUser() {
      this.user = null
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
