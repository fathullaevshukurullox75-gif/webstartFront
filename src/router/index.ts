import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue"
import AttendanceView from "@/views/AttendanceView.vue";
import Group from "@/views/Group.vue";
import Course from "@/views/Course.vue";
import Payme from "@/views/Payme.vue";
import User from "@/views/UserViev.vue";
import OneGroup from "@/components/OneGroupPage.vue";
import Teacher from "@/views/TeacherView.vue"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/home",
      name: "home",
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: "/group",
      name: "group",
      component: Group,
      meta: { requiresAuth: true },
    },
    {
      path: "/group/:id",
      name: "onegroup",
      component: OneGroup,
      meta: { requiresAuth: true },
    },
    {
      path: "/course",
      name: "course",
      component: Course,
      meta: { requiresAuth: true },
    },
    {
      path: "/attendance",
      name: "attendance",
      component: AttendanceView,
    },
    {
      path: "/payme",
      name: "payme",
      component: Payme,
    },
    {
      path: "/users",
      name: "users",
      component: User,
    },
    {
      path: "/teacher",
      name: "teacher",
      component: Teacher,
    },
  ],
});


export default router;
