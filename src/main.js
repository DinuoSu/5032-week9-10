import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import './assets/base.css'
import 'bootstrap/dist/css/bootstrap.min.css'
// import './style.css'

createApp(App).use(PrimeVue, { theme: { preset: Aura, options: { darkModeSelector: false } } }).use(router).mount('#app')
