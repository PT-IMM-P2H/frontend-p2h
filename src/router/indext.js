import { createRouter, createWebHistory } from "vue-router";
import Main from '../views/main.vue'
import LoginPage from '../components/login-page.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path:'/login',
            name: 'login',
            component : LoginPage
        },
        {
            path:'/',
            name: 'main',
            component : Main
        },
        {
            path: '/form-p2h',
            name: 'form-p2h',
            component: () => import('../components/user/p2h_form.vue')
        },
        {
            path: '/profile-user',
            name: 'profile-user',
            component: () => import('../components/user/profile.vue')
        },
        {
            path: '/riwayat-user',
            name: 'riwayat-user',
            component: () => import('../components/user/riwayat-user.vue')
        },
    ],
    scrollBehavior(to, from, savedPosition){
        return {top: 0}
    }    
})

export default router;