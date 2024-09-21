import { createRouter, createWebHistory } from 'vue-router';
import UsersList from "@/components/UsersList.vue";
import LogInRegistrationPage from "@/components/LogInRegistrationPage.vue";
import AdminMainPage from "@/components/admin/AdminMainPage.vue";
import AdminLogin from "@/components/admin/AdminLogin.vue";
import UserComments from "@/components/UserComments.vue";
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
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
    path: '/:userId',
    name: 'users-list-auth',
    component: UsersList,
    props: true,
    meta: {
      title: 'Users list',
    },
  },
  {
    path: '/:userId/comments/:userCommentId',
    name: 'users-comments',
    component: UserComments,
    props: true,
    meta: {
      title: 'User comments',
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
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminMainPage,
    props: { admin: true },
    meta: {
      title: 'Admin page',
      requiresAuth: true
    },
    children: [
      {
        path: 'login',
        name: 'admin-login',
        component: AdminLogin,
        props: { admin: true },
      },
      {
        path: 'users/:userId',
        name: 'admin-users',
        component: UsersList,
        props: (route: RouteLocationNormalized) => (
          {
            userId: route.params.userId,
            admin: true
          }),
      },
      {
        path: 'users/:userId/comments/:userCommentId',
        name: 'admin-comments',
        component: UserComments,
        props: (route: RouteLocationNormalized) => (
          {
            userCommentId: route.params.userCommentId,
            userId: route.params.userId,
            admin: true
          }),
        meta: {
          title: 'User comments',
        },
      }


    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {

    if (to.name === 'admin' ) {
      next('/admin/login');
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router
