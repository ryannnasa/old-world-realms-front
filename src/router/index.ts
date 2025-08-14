import { createRouter, createWebHistory } from 'vue-router'
import CreateABattleReport from '@/views/CreateABattleReport.vue'
import AllBattleReports from '@/views/AllBattleReports.vue'
import BattleReportView from '@/views/BattleReportView.vue'
import HomePage from '@/views/HomePage.vue'
import MyAccount from '@/views/MyAccount.vue'
import Contact from '@/views/Contact.vue'
import { useAuthStore } from '@/stores/auth'
import Confidentiality from '@/views/Confidentiality.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/homepage',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/allbattlereports',
    name: 'All Battle Reports',
    component : AllBattleReports
  },

    {
    path: '/createabattlereport',
    name: 'Create A New Battle Report',
    component : CreateABattleReport
  },
  {
    path: '/createabattlereport/:id',
    name: 'Modify A New Battle Report',
    component : CreateABattleReport
  },

   {
    path: '/battlereportview/:id',
    name: 'Battle Report View',
    component : BattleReportView
  },

  {
    path: '/myaccount',
    name: 'My Account',
    component : MyAccount
  },

  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/confidentialite',
    name: 'Confidentialité',
    component: Confidentiality
  },

  {
    path: '/legal',
    name: 'Mentions Légales',
    component: () => import('@/views/Legal.vue')
  },
  {
    path: '/cgu',
    name: 'CGU',
    component: () => import('@/views/Cgu.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.isLoggedIn && (to.path === '/' || to.path === '')) {
    next('/homepage')
    return
  }
  
  next()
})

router.afterEach((to, from) => {
  const authStore = useAuthStore()
  
  if (!authStore.isLoggedIn) {
    sessionStorage.removeItem('justLoggedIn')
    sessionStorage.removeItem('redirectInProgress')
  }
})

export default router
