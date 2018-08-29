import Vue from 'vue'
import Router from 'vue-router'
import Good from 'components/good/good'
import Rate from 'components/rate/rate'
import Seller from 'components/seller/seller'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/good'
    },
    {
      path: '/good',
      name: 'good',
      component: Good
    },
    {
      path: '/rate',
      name: 'rate',
      component: Rate
    },
    {
      path: '/seller',
      name: 'seller',
      component: Seller
    }
  ],
  linkActiveClass: 'active',
  mode: 'history'
})
