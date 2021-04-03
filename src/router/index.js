import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import Gymnasts from "../views/Gymnasts.vue"
import Skills from "../views/Skills.vue"
import Profile from "../views/Profile.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/gymnasts",
    name: "Gymnasts",
    component: Gymnasts
  },
  {
    path: "/skills/:mySkills",
    name: "Skills",
    component: Skills,
    props: true
  },
  {
    path: "/profile/:uid",
    name: "Profile",
    component: Profile,
    props: true
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
