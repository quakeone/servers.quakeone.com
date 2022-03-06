import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Servers from '../views/Servers.vue'
import About from '../views/About.vue'
import Layout from '../views/Layout.vue'
import RecentMatches from '../views/RecentMatches.vue'
import ServerDetail from '../views/ServerDetail.vue'

const routes: Array<RouteRecordRaw> = [{
  path: '/',
  component: Layout,
  children: [{
    path: '/',
    name: 'servers',
    props: (r) => ({ gameId: r.query.gameId}),
    component: Servers
  }, {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/recent',
    name: 'recent',
    component: RecentMatches
  },
  {
    path: '/server/:serverId',
    name: 'serverDetails',
    props: (r) => ({ 
      matchPage: parseInt(r.query.matchPage as string || '1'),
      serverId: parseInt(r.params.serverId as string || '-1')
    }),
    component: ServerDetail
  }]
}]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    console.log('savedPosition: ')
    console.log(savedPosition)
    if (to.name === from.name) {
      return false
    }

    return savedPosition || false
  }
})

export default router
