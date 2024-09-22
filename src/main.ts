import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {store} from "@/store";

const appVue = createApp(App)

appVue
  .use(router)
  .use(store)
  .mount('#app')
