import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const appVue = createApp(App)

appVue
  .use(router)
  .mount('#app')
