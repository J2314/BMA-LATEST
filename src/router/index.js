import {
  createRouter,
  createWebHistory
} from '@ionic/vue-router';
import {
  staffRoute
} from './staff-route.js'
import {
  adminRoute
} from './admin-route.js'
import store from '../store/index'
import {
  IS_USER_AUTHENTICATE_GETTER,
  GET_USER_TYPE,
  AUTO_LOGIN_ACTION,
} from '@/store/storeConstants'

store.dispatch(`auth/${AUTO_LOGIN_ACTION}`)
const authRoute = (prop) => [
  {
    path: '/',
    name: prop + '.login',
    meta: {
      auth: false,
      name: 'Login',
      user: 'guest'
    },
    component: () => import('../views/Auth/AdminLogin.vue')
  },
  {
    path: '/login',
    name: prop + '.login',
    meta: {
      auth: false,
      name: 'Login',
      user: 'guest'
    },
    component: () => import('../views/Auth/AdminLogin.vue')
  },
  {
    path: 'forget-password',
    name: prop + '.student-forget-password',
    meta: {
      auth: false,
      name: 'Student Forget Password',
      user: 'guest'
    },
    component: () => import('../views/Page/HomeView.vue')
  },
]

const routes = [
  {
    path: '/',
    name: 'client-layout',
    component: () => import('@/components/layouts/AuthLayout.vue'),
    children: authRoute('client-layout')
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    name: 'admin-layout',
    component: () => import('@/components/layouts/MainLayout.vue'),
    children: adminRoute('admin-layout')
  },
  {
    path: '/staff',
    redirect: '/staff/dashboard',
    name: 'staff-layout',
    component: () => import('@/components/layouts/StaffLayout.vue'),
    children: staffRoute('staff-layout')
  },
];


const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes
})

function adminUserMiddleware(to, from, next) {
  // Regular user middleware logic
  // console.log('Student user middleware')
  if (to.meta.user !== 'admin') {
    next('/admin/dashboard')// router.beforeEach((to, from, next) => {
      // //   const isAuth = store.getters[`auth/${IS_USER_AUTHENTICATE_GETTER}`]
      // //   const isAuthType = store.getters[`auth/${GET_USER_TYPE}`]
      // //   console.log(isAuth)
      // //   console.log(isAuthType)
      // //   document.title = `${to.meta.name} - Baliwag Maritime Academy, Inc.`
      // //   if (isAuth) {
      // //     if (isAuthType === 'admin') {
      // //       adminUserMiddleware(to, from, next)
      // //     } else if (isAuthType === 'staff') {
      // //       staffUserMiddleware(to, from, next)
      // //     }
      // //   } else {
      // //     if (to.meta.user !== 'guest') {
      // //       next('/')
      // //     } else {
      // //       next()
      // //     }
      // //   }
      // // })
} else {
    next()
  }
}

function staffUserMiddleware(to, from, next) {
  // Admin user middleware logic
  // console.log('Applicant user middleware')
  if (to.meta.user !== 'staff') {
    next('/staff/dashboard')
  } else {  
    next()
  }
}
// router.beforeEach((to, from, next) => {
//   const isAuth = store.getters[`auth/${IS_USER_AUTHENTICATE_GETTER}`]
//   const isAuthType = store.getters[`auth/${GET_USER_TYPE}`]
//   console.log(isAuth)
//   console.log(isAuthType)
//   document.title = `${to.meta.name} - Baliwag Maritime Academy, Inc.`
//   if (isAuth) {
//     if (isAuthType === 'admin') {
//       adminUserMiddleware(to, from, next)
//     } else if (isAuthType === 'staff') {
//       staffUserMiddleware(to, from, next)
//     }
//   } else {
//     if (to.meta.user !== 'guest') {
//       next('/')
//     } else {
//       next()
//     }
//   }
// })
export default router