import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueTippy from 'vue-tippy'
import './scss/main.scss'
import 'tippy.js/dist/tippy.css' // optional for styling
import 'flag-icons/css/flag-icons.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faClone } from '@fortawesome/free-regular-svg-icons'
import {faStar, faMapMarkerAlt, faExclamationCircle, faChevronLeft, faRobot, faCrown } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSync,faTrophy } from '@fortawesome/free-solid-svg-icons'
import { createWriter } from '@/helpers/charmap'
import type { Writer } from '@/helpers/charmap'

library.add(faStar)
library.add(faSync)
library.add(faClone)
library.add(faMapMarkerAlt)
library.add(faExclamationCircle)
library.add(faChevronLeft)
library.add(faRobot)
library.add(faCrown)
library.add(faTrophy)

createWriter().then((charWriter:Writer) => {
  createApp(App)
    .provide('charWriter', charWriter)
    .component('FontAwesome', FontAwesomeIcon)
    .use(store)
    .use(router)
    .use(VueTippy)
    .mount('#app')
})
