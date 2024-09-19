import { createRouter, createWebHistory } from 'vue-router';
import UsersList from "@/components/UsersList.vue";
import RegistrationComponent from "@/components/RegistrationPage.vue";

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
    path: '/registration',
    name: 'registration',
    component: RegistrationComponent,
    props: true,
    meta: {
      title: 'Registration page',
    },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
