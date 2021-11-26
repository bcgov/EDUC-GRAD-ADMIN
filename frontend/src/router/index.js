import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
//import Logout from '../views/Logout.vue';
import StudentSearch from '../views/StudentSearch.vue';
import StudentProfile from '../views/StudentProfile.vue';
import Assessments from '../views/Assessments.vue';
import Courses from '../views/Courses.vue';
import Schools from '../views/Schools.vue';
import PSI from '../views/PSI.vue';
import AdminGraduationPrograms from '../views/AdminGraduationPrograms.vue';
import AdminCodes from '../views/Codes.vue';
import GraduationPrograms from '../components/GraduationPrograms.vue';
import GraduationProgramCourses from '../components/GraduationProgramCourses.vue';
import GraduationProgramRules from '../components/GraduationProgramRules.vue';
import GraduationOptionalProgramRules from '@/components/GraduationOptionalProgramRules';
import GraduationOptionalPrograms from '@/components/GraduationOptionalPrograms';
import Admin from '../views/Admin.vue';
import LetterGrades from '@/components/Admin/LetterGrades';
import SpecialCases from '@/components/Admin/SpecialCases';
import AlgorithmRules from '@/components/Admin/AlgorithmRules';

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
    beforeEnter() {document.cookie = 'SMSESSION=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'; 
    location.href = process.env.VUE_APP_KEYCLOAK_AUTH_HOST + '/auth/realms/master/protocol/openid-connect/logout?redirect_uri=' + location.protocol + '//' + location.host} 
  },
  // {
  //   path: '/logout',
  //   name: 'logout',
  //   component: Logout,
  //   meta: {
  //     guest: true
  //   }
  // },
  {
    path: '/',
    name: 'student-search',
    component: StudentSearch,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/student-profile/:pen/:studentId',
    name: 'student-profile',
    component: StudentProfile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin-graduation-programs',
    component: AdminGraduationPrograms,
    children: [
      { path: '', component: AlgorithmRules },
      { path: 'programs/', component: GraduationPrograms },
      { path: 'program-rules/', component: GraduationProgramRules },
      { path: 'program/:programCode/:category/:rule', component: GraduationProgramCourses, name: "programRuleCourses"},
      { path: 'optional-programs/', component: GraduationOptionalPrograms },
      { path: 'optional-program-rules/', component: GraduationOptionalProgramRules },
      { path: 'optional-programs/:programCode/:optionalProgramCode', component: GraduationOptionalProgramRules },
      { path: 'optional-programs/:programCode/:category/:rule', component: GraduationProgramCourses, name: "optionalProgramRuleCourses" },
      { path: 'letter-grades/', component: LetterGrades },
      { path: 'special-cases/', component: SpecialCases },
      { path: 'algorithm-rules/', component: AlgorithmRules },
    ],
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/codes',
    component: AdminCodes,
    meta: {
      requiresAuth: true
    },
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
    path: '/assessments',
    name: 'assessments',
    component: Assessments,
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
  }
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