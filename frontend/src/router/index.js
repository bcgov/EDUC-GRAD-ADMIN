import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import Logout from '../views/Logout.vue';
import StudentSearch from '../views/StudentSearch.vue';
import StudentProfile from '../views/StudentProfile.vue';
import Courses from '../views/Courses.vue';
import Schools from '../views/Schools.vue';
import PSI from '../views/PSI.vue';
import Test from '../views/Table.vue';
import AdminGraduationPrograms from '../views/AdminGraduationPrograms.vue';


Vue.use(VueRouter)

const routes = [{
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      guest: true
    }
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout,
    meta: {
      guest: true
    }
  },
  {
    path: '/',
    name: 'student-search',
    component: StudentSearch,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/student-profile/:pen',
    name: 'student-profile',
    component: StudentProfile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin-graduation-programs',
    name: 'admin-graduation-programs',
    component: AdminGraduationPrograms,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/courses',
    name: 'courses',
    component: Courses,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/schools',
    name: 'schools',
    component: Schools,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/psi',
    name: 'psi',
    component: PSI,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/test',
    name: 'test',
    component: Test,
    meta: {
      requiresAuth: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('jwt') == null) {
          next({
              path: '/logout',
              params: { nextUrl: to.fullPath }
          })
      }
      else {
          //let user = JSON.parse(localStorage.getItem('user'))   
            //next({ name: 'student-search'})  
            next()
      }
  } 
   else {
       next()
  }
})
export default router