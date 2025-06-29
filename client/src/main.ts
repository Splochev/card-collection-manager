import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import { useSdkStore } from '@/stores/useSdkStore'

const app = createApp(App)

app.use(createPinia())
const sdkStore = useSdkStore()
const sdkUrl = import.meta.env.VITE_SDK_URL
if (!sdkUrl) throw new Error('Missing VITE_SDK_URL environment variable')
await sdkStore.initializeSdk(sdkUrl)

  app.use(PrimeVue, {
    ripple: false,
    theme: {
      preset: Aura,
      options: {
        darkMode: false,
        darkModeSelector: ".my-app-dark",
      },
    },
  });
app.use(router)
app.mount('#app')
