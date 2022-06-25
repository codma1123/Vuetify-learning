import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../components/Home.vue")
  },
  {
    path: "/analysis",
    name: "Analysis",
    component: () => import("../views/AnalysisView.vue")
  },
  {
    path: "/stat",
    name: "stat",
    component: () => import("../views/StatisticsView.vue")
  },
  {
    path: "/rank",
    name: "rank",
    component: () => import("../views/RankView.vue")
  },
  {
    path: "/summoner/:name",    
    component: () => import('../views/SummonerView.vue'),    
    beforeEnter: (to, from, next) => {
      console.log('enter..')
      next()
    },    
    children: [
      {
        path: "champions",        
        component: () => import('../components/SummonerChampions.vue')
      },
      {
        path: '',
        component: () => import('../components/SummonerTotal.vue'),        
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior (to, from, savdPosition) {
    if (savdPosition) {
      return savdPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

export default router