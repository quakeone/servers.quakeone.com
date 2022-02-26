import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Servers from '../views/Servers.vue'
import About from '../views/About.vue'
import Layout from '../views/Layout.vue'
import RecentMatches from '../views/RecentMatches.vue'
import ServerMatches from '../views/ServerMatches.vue'
import ServerDetail from '../views/ServerDetail.vue'
const routes: Array<RouteRecordRaw> = [{
  path: '/',
  component: Layout,
  children: [{
    path: '/',
    name: 'Servers',
    props: (r) => ({ gameId: r.query.gameId}),
    component: Servers
  }, {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/recent',
    name: 'Recent',
    component: RecentMatches
  },
  {
    path: '/server/:serverId',
    name: 'Server Details',
    props: true,
    component: ServerDetail
  },
  {
    path: '/server/:serverId/match',
    name: 'Server Matches',
    props: true,
    component: ServerMatches
  }]
}]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
