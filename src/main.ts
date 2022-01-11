import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueTippy from 'vue-tippy';
import './scss/main.scss'
import 'tippy.js/dist/tippy.css' // optional for styling



createApp(App)
  .use(store)
  .use(router)
  .use(VueTippy, {
    defaultProps: {
      showOnCreate: true
    }
  })
  .mount('#app')
