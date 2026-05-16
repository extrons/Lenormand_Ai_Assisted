import { createRouter, createWebHashHistory } from 'vue-router'
import Card from '@/components/card.vue'
import MeaningManager from '@/views/MeaningManager.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),  // ← 改这里
  routes: [
    {
      path: '/',
      name: 'home',
      component: Card
    },
    {
      path: '/meanings',
      name: 'meanings',
      component: MeaningManager
    }
  ],
})

export default router
