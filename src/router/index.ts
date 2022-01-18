import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import RecentMatches from '../views/RecentMatches.vue'
import ServerMatches from '../views/ServerMatches.vue'

const routes: Array<RouteRecordRaw> = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/recent',
    name: 'Recent',
    component: RecentMatches
  },
  {
    path: '/server/:serverId/match',
    name: 'Server Matches',
    props: true,
    component: ServerMatches
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
