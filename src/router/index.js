import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/images'
  },
  {
    path: '/images',
    name: 'images',
    component: () => import('../views/ImageVue.vue')
  },
  {
    path: '/load',
    name: 'load',
    component: () => import('../views/Deployment.vue')
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('../views/Services.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
