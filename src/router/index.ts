import { createRouter, createWebHistory } from 'vue-router'
import AllUnits from '../views/AllUnits.vue'
import CreateABattleReport from '@/views/CreateABattleReport.vue'
import AllBattleReports from '@/views/AllBattleReports.vue'
import BattleReportView from '@/views/BattleReportView.vue'
import HomePage from '@/views/HomePage.vue'

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
    path: '/battlereportview',
    name: 'Battle Report View',
    component : BattleReportView
  },

  {
    path: '/allunits',
    name: 'All Units',
    component : AllUnits
  }
  // Commenter ou supprimer cette section si vous n'avez pas le fichier AboutView.vue
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import('../views/AboutView.vue')
  // }
]

const router = createRouter({
 history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
