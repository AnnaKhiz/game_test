import { createRouter, createWebHistory } from 'vue-router';
import UsersList from "@/components/UsersList.vue";
import RegistrationComponent from "@/components/LogInRegistrationPage.vue";
import LogInRegistrationPage from "@/components/LogInRegistrationPage.vue";

const routes = [
  {
    path: '/',
    name: 'users-list',
    component: UsersList,
    props: true,
    meta: {
      title: 'Users list',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: LogInRegistrationPage,
    props: true,
    meta: {
      title: 'Registration page',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LogInRegistrationPage,
    props: true,
    meta: {
      title: 'Login page',
    },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
