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
    name: "summoner",
    component: () => import('../views/SummonerView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router