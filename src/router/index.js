import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from "firebase/app";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/Home')
  },
  {
    path: '/login',
    name: 'Login',
    meta: {layout: 'empty'},
    component: () => import('../views/Login')
  },
  {
    path: '/register',
    name: 'Register',
    meta: {layout: 'empty'},
    component: () => import('../views/Register')
  },
  {
    path: '/categories',
    name: 'Categories',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/Categories')
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/Detail')
  },
  {
    path: '/history',
    name: 'History',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/History')
  },
  {
    path: '/planning',
    name: 'Planning',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/Planning')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/Profile')
  },
  {
    path: '/record',
    name: 'Record',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/Record')
  },
  {
    path: '/pageNotFound',
    name: 'PageNotFound',
    meta: {layout: 'empty'},
    component: () => import('../components/PageNotFound')
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requireAuth = to.meta.auth;

  if (requireAuth && !currentUser) {
    next('/login?message=login')
  } else if (!to.matched.length) {
    next('/pageNotFound');
  } else {
    next()
  }
})

export default router
