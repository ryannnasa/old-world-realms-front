import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Accueil from '@/views/Accueil.vue'
import ReportBattle from '@/views/ReportBattle.vue'
import MesRapportsDeBatailles from '@/views/MesRapportsDeBatailles.vue'
import BattleReportView from '@/views/BattleReportView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/Accueil',
    name: 'Accueil',
    component: Accueil
  },
  {
    path: '/rapports-batailles',
    name: 'Rapports de Batailles',
    component : MesRapportsDeBatailles
  },

  {
    path: '/creer-rapports-batailles',
    name: 'Créer un Nouveau Rapport de Bataille',
    component : ReportBattle
  },
  {
    path: '/mon-rapport-bataille',
    name: 'Mon Rapport de Bataille',
    component : BattleReportView
  },

  {
    path: '/armee',
    name: 'Armées',
    component : HomeView
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
