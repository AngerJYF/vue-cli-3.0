import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Packages = () => import(/* webpackChunkName: "Packages" */ '@/views/Packages');

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Packages',
      component: Packages
    }
  ]
})
