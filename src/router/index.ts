import { createRouter, createWebHistory } from 'vue-router'
import AllUnits from '../views/AllUnits.vue'
import CreateABattleReport from '@/views/CreateABattleReport.vue'
import AllBattleReports from '@/views/AllBattleReports.vue'
import BattleReportView from '@/views/BattleReportView.vue'
import HomePage from '@/views/HomePage.vue'
import MyAccount from '@/views/MyAccount.vue'

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
    path: '/allunits',
    name: 'All Units',
    component : AllUnits
  },

  {
    path: '/myaccount',
    name: 'My Account',
    component : MyAccount
  }

]

const router = createRouter({
 history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
