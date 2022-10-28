import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueTippy from 'vue-tippy';
import './scss/main.scss'
import 'tippy.js/dist/tippy.css' // optional for styling
import { library } from '@fortawesome/fontawesome-svg-core'
import { faClone } from '@fortawesome/free-regular-svg-icons'
import {faMapMarkerAlt, faExclamationCircle, faChevronLeft, faRobot, faCrown } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { createWriter, Writer } from '@/helpers/charmap'

library.add(faSync)
library.add(faClone)
library.add(faMapMarkerAlt)
library.add(faExclamationCircle)
library.add(faChevronLeft)
library.add(faRobot)
library.add(faCrown)

createWriter().then((charWriter:Writer) => {
  createApp(App)
    .provide('charWriter', charWriter)
    .component('FontAwesome', FontAwesomeIcon)
    .use(store)
    .use(router)
    .use(VueTippy)
    .mount('#app')
})
