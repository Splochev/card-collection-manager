import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import SignIn from '@/views/SignIn.vue'
import SignUp from '@/views/SignUp.vue'
import Collection from '@/views/Collection.vue'
import CardSets from '@/views/CardSets.vue'
import Users from '@/views/Users.vue'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

function requireAdmin(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const store = useUserStore()
  if (store.isAdmin) {
    next()
  } else {
    next('/signin')
  }
}

function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const store = useUserStore()
  if (store.isAuthenticated) {
    next()
  } else {
    next('/signin')
  }
}

function requireGuest(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const store = useUserStore()
  if (store.isAuthenticated) {
    next('/collection')
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    redirect: () => {
      const store = useUserStore()
      return store.isAuthenticated ? '/collection' : '/signin'
    },
  },
  {
    path: '/',
    children: [
      { path: 'collection', component: Collection, beforeEnter: requireAuth },
      { path: 'card-sets', component: CardSets, beforeEnter: requireAuth },
      { path: 'users', component: Users, beforeEnter: requireAdmin },
    ],
  },
  { path: '/signin', component: SignIn, beforeEnter: requireGuest },
  { path: '/signup', component: SignUp, beforeEnter: requireGuest },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
