import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'  
import 'bootstrap/dist/js/bootstrap.bundle.min.js' 

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faThumbtack } from '@fortawesome/free-solid-svg-icons'
import { faFlag } from '@fortawesome/free-solid-svg-icons'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

// Adicione os ícones que vai usar na library
library.add(faThumbtack, faFlag, faCalendar, faAlignLeft, faClock, faCheckCircle)

// Crie a app PRIMEIRO
const app = createApp(App)

// DEPOIS registre o componente
app.component('FontAwesomeIcon', FontAwesomeIcon)

// DEPOIS use os plugins
app.use(createPinia())

// FINALMENTE monte a app
app.mount('#app')
