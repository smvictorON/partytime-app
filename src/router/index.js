import store from '@/store'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/newparty',
    name: 'newparty',
    component: () => import(/* webpackChunkName: "newparty" */ '../views/NewParty.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/editparty/:id',
    name: 'editparty',
    component: () => import(/* webpackChunkName: "editparty" */ '../views/EditParty.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/party/:id',
    name: 'party',
    component: () => import(/* webpackChunkName: "party" */ '../views/Party.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(store.getters.authenticated === false)
      next({
        path: '/login',
        params: {nextUrl: to.fullPath}
      })
    else
      next()
  }else{
    next()
  }
})

export default router
