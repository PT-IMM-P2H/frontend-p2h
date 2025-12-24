import { createRouter, createWebHistory } from "vue-router";
import Main from '../views/main.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path:'/',
            name: 'main',
            component : Main
        },
        {
            path: '/form-p2h',
            name: 'form-p2h',
            component: () => import('../components/user/P2HForm/p2h_form.vue')
        }
    ],
    scrollBehavior(to, from, savedPosition){
        return {top: 0}
    }    
})

export default router;