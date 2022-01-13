import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueTippy from 'vue-tippy';
import './scss/main.scss'
import 'tippy.js/dist/tippy.css' // optional for styling
import { library } from '@fortawesome/fontawesome-svg-core'
import { faClone } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'



library.add(faClone)

createApp(App)
  .component('FontAwesome', FontAwesomeIcon)
  .use(store)
  .use(router)
  .use(VueTippy)
  .mount('#app')
