import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import Logout from '../views/Logout.vue';
import StudentSearch from '../views/StudentSearch.vue';
import StudentProfile from '../views/StudentProfile.vue';
import Assessments from '../views/Assessments.vue';
import Courses from '../views/Courses.vue';
import Schools from '../views/Schools.vue';
import PSI from '../views/PSI.vue';
import SchoolReports from '../views/SchoolReports.vue';
import AdminGraduationPrograms from '../views/Programs.vue';
import AdminCodes from '../views/Codes.vue';
import CareerPrograms from '../components/Codes/CareerPrograms.vue';
import ReportTypes from '../components/Codes/ReportTypes.vue';
import UngradReasons from '../components/Codes/UngradReasons.vue';
import StatusCodes from '../components/Codes/StatusCodes.vue';
import TranscriptTypes from '../components/Codes/TranscriptTypes.vue';
import CertificateTypes from '../components/Codes/CertificateTypes.vue';
import HistoryActivityCodes from '../components/Codes/HistoryActivityCodes.vue';
import ProgramCertificateTranscripts from '../components/Codes/ProgramCertificateTranscripts.vue';
import DigitialSignatures from '../components/Codes/DigitalSignatures.vue';
import SignatureBlockType from '../components/Codes/SignatureBlockType.vue';
import DocumentStatusCode from '../components/Codes/DocumentStatusCode.vue';
import GraduationPrograms from '../components/GraduationPrograms.vue';
import GraduationProgramCourses from '../components/GraduationProgramCourses.vue';
import GraduationProgramRules from '../components/GraduationProgramRules.vue';
import GraduationOptionalProgramRules from '@/components/GraduationOptionalProgramRules';
import GraduationOptionalPrograms from '@/components/GraduationOptionalPrograms';
import GraduationProgramTranscriptMessage from '@/components/GraduationProgramTranscriptMessage';
import BatchProcessing from '../views/BatchProcessing.vue';
import RequirementTypes from '@/components/Programs/RequirementTypes.vue';
import LetterGrades from '@/components/Programs/LetterGrades';
import SpecialCases from '@/components/Programs/SpecialCases';
import AlgorithmRules from '@/components/Programs/AlgorithmRules';
import SessionExpired from '@/components/SessionExpired';
import ErrorPage from '@/components/ErrorPage.vue';
import BackendSessionExpired from '@/components/BackendSessionExpired';
import UnAuthorized from '@/components/UnAuthorized';
import UnAuthorizedPage from '@/components/UnAuthorizedPage';
import store from '@/store/index';
import authStore from '@/store/modules/auth';


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
      requiresAuth: false
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
    path: '/batch-processing',
    name: 'Batch Processing',
    component: BatchProcessing,
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
      { path: 'requirement-types/', component: RequirementTypes },
      { path: 'transcript-message/', component: GraduationProgramTranscriptMessage},
    ],
    meta: {
      requiresAuth: true
    },
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
    path: '/codes',
    component: AdminCodes,
    children: [
      { path: '', component: CareerPrograms },
      { path: '/codes/career-programs', component: CareerPrograms },
      { path: '/codes/certificates-types', component: CertificateTypes },
      { path: '/codes/digital-signatures', component: DigitialSignatures, name: "digitalSignatures"},
      { path: '/codes/signature-blocks', component: SignatureBlockType },
      { path: '/codes/transcript-types', component: TranscriptTypes },
      { path: '/codes/program-certificate-transcript', component: ProgramCertificateTranscripts },
      { path: '/codes/report-types', component: ReportTypes, name: "reportTypes" },
      { path: '/codes/student-status-codes', component: StatusCodes },
      { path: '/codes/ungrad-reasons', component: UngradReasons },
      { path: '/codes/history-activity', component: HistoryActivityCodes },
      { path: '/codes/document-status-codes', component: DocumentStatusCode },
    ],    
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/school-reports',
    name: 'schoolReports',
    component: SchoolReports,
    meat: {
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
    path: '/psi',
    name: 'psi',
    component: PSI,
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
    path: '/student-profile/:studentId',
    name: 'student-profile',
    component: StudentProfile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/token-expired',
    name: 'backend-session-expired',
    component: BackendSessionExpired
  },
  {
    path: '/session-expired',
    name: 'session-expired',
    component: SessionExpired,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: UnAuthorized,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/unauthorized-page',
    name: 'unauthorized-page',
    component: UnAuthorizedPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/error',
    name: 'error',
    component: ErrorPage,
    meta: {
      requiresAuth: false
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, _from, next) => {
  function validateAndExecute(nextRouteInError) {
    store.dispatch('auth/getJwtToken').then(() => {
      if (!authStore.state.isAuthenticated) {
        next(nextRouteInError);
      } else {
        store.dispatch('auth/getUserInfo').then(() => {
          if (!authStore.state.isAuthorizedUser) {
            next('unauthorized');
          } else if (to.meta.role && !store.getters[`auth/${to.meta.role}`]) {
            next('unauthorized-page');
          } else {
            next();
          }
        }).catch(() => {
          // eslint-disable-next-line
          console.log('Unable to get user info');
          next('error');
        });
      }
    }).catch(() => {
      
      next(nextRouteInError);
    });
  }
  // this section is to set page title in vue store
  if (to && to.meta) {
    store.commit('setPageTitle',to.meta.pageTitle);
  } else {
    store.commit('setPageTitle','');
  }

  // // This section is to clear the search results when users are not on a search page
  // if (!to.meta.saveSearch){
  //   store.commit('studentSearch/clearStudentSearchParams');
  //   store.commit('studentSearch/clearStudentSearchResults');
  // }

  // this section is to handle the backend session expiry, where frontend vue session is still valid.
  if (to.meta.requiresAuth && authStore.state.isAuthenticated) {
    validateAndExecute('/token-expired');
  }else if (to.meta.requiresAuth) {
    validateAndExecute('login');
  }
  else{
    next();
  }
});
export default router;