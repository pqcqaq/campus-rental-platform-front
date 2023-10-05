import { createSSRApp } from 'vue'
import fantMiniPlus from '@/uni_modules/fant-mini-plus'
import App from './App.vue'
import router from './router'
import { persist } from './store/persist'

const pinia = createPinia()
pinia.use(persist)
export function createApp() {
  const app = createSSRApp(App)
  app.config.warnHandler = () => null
  app.use(router)
  app.use(fantMiniPlus)
  app.use(pinia)
  return {
    app,
    pinia
  }
}
