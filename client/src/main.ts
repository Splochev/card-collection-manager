import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'
import { useSdkStore } from './stores/useSdkStore'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const sdkStore = useSdkStore()
await sdkStore.initializeSdk('http://localhost:3000') // TODO use env

app.mount('#app')
