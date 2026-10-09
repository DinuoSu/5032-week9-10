import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { authReady, isAuthenticated, currentUser } from '../stores/auth.js'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/form', redirect: '/' },
    { path: '/about', name: 'About', component: () => import('../views/AboutView.vue'), meta: { requiresAuth: true } },
    { path: '/json', name: 'JSON', component: () => import('../views/JSONView.vue') },
    { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue') },
    { path: '/access-denied', name: 'AccessDenied', component: () => import('../views/AccessDeniedView.vue') },
    { path: '/FireLogin', name: 'FireLogin', component: () => import('../views/FirebaseSigninView.vue') },
    { path: '/FireRegister', name: 'FireRegister', component: () => import('../views/FirebaseRegisterView.vue') },
    { path: '/logout', name: 'Logout', component: () => import('../views/LogoutView.vue') },
    { path: '/addbook', name: 'AddBook', component: () => import('../views/AddBookView.vue'), meta: { requiresFirebase: true } },
    { path: '/getbookcount', name: 'GetBookCount', component: () => import('../views/GetBookCountView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
router.beforeEach(async to => {
  await authReady
  if (to.meta.requiresFirebase && !currentUser.value) return { name: 'FireLogin', query: { redirect: to.fullPath } }
  if (to.meta.requiresAuth && !isAuthenticated.value) return { name: 'Login', query: { redirect: to.fullPath } }
})
export default router
