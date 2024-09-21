import { createRouter, createWebHistory } from 'vue-router';
import UsersList from "@/components/UsersList.vue";
import RegistrationComponent from "@/components/LogInRegistrationPage.vue";
import LogInRegistrationPage from "@/components/LogInRegistrationPage.vue";
import AdminMainPage from "@/components/admin/AdminMainPage.vue";
import AdminLogin from "@/components/admin/AdminLogin.vue";
import AdminUsersList from "@/components/admin/AdminUsersList.vue";
import UserComments from "@/components/UserComments.vue";
import AdminCommentsPage from "@/components/admin/AdminCommentsPage.vue";

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
    // children: [
    //   {
    //     path: 'comments/:userCommentId',
    //     name: 'users-comments',
    //     component: UserComments,
    //     props: true,
    //     meta: {
    //       title: 'User comments',
    //     },
    //   }
    // ]
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
    props: true,
    meta: {
      title: 'Admin page',
      requiresAuth: true
    },
    children: [
      {
        path: 'login',
        name: 'admin-login',
        component: AdminLogin,
        props: true,
      },
      {
        path: 'users/:userId',
        name: 'admin-users',
        component: AdminUsersList,
        props: true,
        // children: [
        //   {
        //     path: 'comments/:userCommentId',
        //     name: 'admin-comments',
        //     component: AdminCommentsPage,
        //     props: true,
        //     meta: {
        //       title: 'User comments',
        //     },
        //   }
        // ]
      },
      {
        path: 'users/:userId/comments/:userCommentId',
        name: 'admin-comments',
        component: AdminCommentsPage,
        props: true,
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
  // const isAuthenticated = localStorage.getItem('auth')
  // console.log('isAuthenticated', isAuthenticated)
  // console.log(process.env.BASE_URL)

  if (to.matched.some(record => record.meta.requiresAuth)) {

    if (to.name === 'admin' ) {
      console.log('Auth false')
      next('/admin/login');
    } else {
      console.log('Auth true')
      next();
    }
  } else {
    next();
  }
})

export default router
