import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import CursorEffects from '@/components/CursorEffects'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/cursor',
      name: 'Cursor',
      component: CursorEffects
    }
  ]
})
