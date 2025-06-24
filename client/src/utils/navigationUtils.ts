import type { Router } from 'vue-router'

export function navigateToPath(path: string, router: Router) {
  if (!path.startsWith('/')) {
    console.warn('Invalid path provided:', path)
    return
  }

  router.push(path)
}
