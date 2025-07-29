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
    // Si l'utilisateur utilise le bouton retour/suivant du navigateur
    if (savedPosition) {
      return savedPosition
    }
    // Sinon, toujours aller en haut de la page
    return { top: 0 }
  }
})

// Guard de navigation simple
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Si l'utilisateur est connecté et va à la racine, rediriger vers homepage
  if (authStore.isLoggedIn && (to.path === '/' || to.path === '')) {
    next('/homepage')
    return
  }
  
  next()
})

// Nettoyer les éventuels flags après navigation
router.afterEach((to, from) => {
  const authStore = useAuthStore()
  
  // Si l'utilisateur n'est plus connecté, nettoyer tous les flags
  if (!authStore.isLoggedIn) {
    sessionStorage.removeItem('justLoggedIn')
    sessionStorage.removeItem('redirectInProgress')
  }
})

export default router
