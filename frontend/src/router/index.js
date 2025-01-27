import { createRouter, createWebHistory } from "vue-router";
import ErrorPage from "@/components/ErrorPage.vue";
import BackendSessionExpired from "@/components/BackendSessionExpired.vue";
import SessionExpired from "@/components/SessionExpired.vue";
import UnAuthorized from "@/components/UnAuthorized.vue";
import UnAuthorizedPage from "@/components/UnAuthorizedPage.vue";
import { useAuthStore } from "../store/modules/auth";
import { useAccessStore } from "../store/modules/access";

// Dyanmic imports were causing issues with state for Codes components
import CareerPrograms from "../components/Codes/CareerPrograms.vue";
import CertificateTypes from "../components/Codes/CertificateTypes.vue";
import DigitialSignatures from "../components/Codes/DigitalSignatures.vue";
import SignatureBlockType from "../components/Codes/SignatureBlockType.vue";
import TranscriptTypes from "../components/Codes/TranscriptTypes.vue";
import ProgramCertificateTranscripts from "../components/Codes/ProgramCertificateTranscripts.vue";
import ReportTypes from "../components/Codes/ReportTypes.vue";
import StatusCodes from "../components/Codes/StatusCodes.vue";
import UngradReasons from "../components/Codes/UngradReasons.vue";
import HistoryActivityCodes from "../components/Codes/HistoryActivityCodes.vue";
import DocumentStatusCode from "../components/Codes/DocumentStatusCode.vue";
import BatchTypes from "../components/Codes/BatchTypes.vue";
// Programs
import AdminGraduationPrograms from "../views/Programs.vue";
import AlgorithmRules from "../components/Programs/AlgorithmRules.vue";
import GraduationPrograms from "../components/Programs/GraduationPrograms.vue";
import GraduationProgramRules from "../components/Programs/GraduationProgramRules.vue";
import GraduationProgramCourses from "../components/Programs/GraduationProgramCourses.vue";
import GraduationOptionalPrograms from "../components/Programs/GraduationOptionalPrograms.vue";
import GraduationOptionalProgramRules from "../components/Programs/GraduationOptionalProgramRules.vue";
import LetterGrades from "../components/Programs/LetterGrades.vue";
import SpecialCases from "../components/Programs/SpecialCases.vue";
import RequirementTypes from "../components/Programs/RequirementTypes.vue";
import GraduationProgramTranscriptMessage from "../components/Programs/GraduationProgramTranscriptMessage.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/home",
      name: "Home",
      component: () => import("../views/Home.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/",
      name: "search",
      component: () => import("../views/StudentSearch.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"),
      meta: {
        guest: true,
      },
    },
    {
      path: "/batch-processing",
      name: "Batch Processing",
      component: () => import("../views/BatchProcessing.vue"),
      meta: {
        guest: false,
        requiresAuth: true,
      },
    },
    {
      path: "/logout",
      name: "Logout",
      component: () => import("../views/Logout.vue"),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/assessments",
      name: "Assessments",
      component: () => import("../views/Assessments.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/programs",
      component: AdminGraduationPrograms,
      children: [
        {
          path: "",
          component: AlgorithmRules,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "programs/",
          component: GraduationPrograms,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "program-rules/",
          component: GraduationProgramRules,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "program/:programCode/:category/:rule",
          component: GraduationProgramCourses,
          name: "programRuleCourses",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "optional-programs/",
          component: GraduationOptionalPrograms,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "optional-program-rules/",
          component: GraduationOptionalProgramRules,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "optional-programs/:programCode/:optionalProgramCode",
          component: GraduationOptionalProgramRules,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "optional-programs/:programCode/:category/:rule",
          component: GraduationProgramCourses,
          name: "optionalProgramRuleCourses",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "letter-grades/",
          component: LetterGrades,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "special-cases/",
          component: SpecialCases,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "algorithm-rules/",
          component: AlgorithmRules,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "requirement-types/",
          component: RequirementTypes,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "transcript-message/",
          component: GraduationProgramTranscriptMessage,
          meta: {
            requiresAuth: true,
          },
        },
      ],
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/courses",
      name: "Courses",
      component: () => import("../views/Courses.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/error",
      name: "error",
      component: ErrorPage,
    },
    {
      path: "/token-expired",
      name: "backend-session-expired",
      component: BackendSessionExpired,
    },
    {
      path: "/schools",
      name: "Schools",
      component: () => import("../views/Schools.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/session-expired",
      name: "session-expired",
      component: SessionExpired,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/unauthorized",
      name: "unauthorized",
      component: UnAuthorized,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/unauthorized-page",
      name: "unauthorized-page",
      component: UnAuthorizedPage,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/student-profile/:studentId",
      name: "student-profile",
      component: () => import("../views/StudentProfile.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/psi",
      name: "psi",
      component: () => import("../views/PSI.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/codes",
      name: "codes",
      component: () => import("../views/Codes.vue"),
      children: [
        {
          path: "",
          name: "career-programs",
          component: CareerPrograms,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/codes/career-programs",
          component: CareerPrograms,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/codes/certificates-types",
          component: CertificateTypes,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/codes/digital-signatures",
          component: DigitialSignatures,
          name: "digitalSignatures",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/codes/signature-blocks",
          component: SignatureBlockType,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/codes/transcript-types",
          component: TranscriptTypes,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/codes/program-certificate-transcript",
          component: ProgramCertificateTranscripts,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/codes/report-types",
          component: ReportTypes,
          name: "reportTypes",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/codes/student-status-codes",
          component: StatusCodes,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/codes/ungrad-reasons",
          component: UngradReasons,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/codes/history-activity",
          component: HistoryActivityCodes,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/codes/document-status-codes",
          component: DocumentStatusCode,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/codes/batch-types",
          component: BatchTypes,
          meta: {
            requiresAuth: true,
          },
        },
      ],
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/school-reports",
      name: "school-reports",
      component: () => import("../views/Reports.vue"),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});
//Fix for multiple next() call warning
router.beforeEach((to, _from, next) => {
  const aStore = useAuthStore();
  const accessStore = useAccessStore();

  // this section is to set page title in vue store
  if (to.meta.requiresAuth) {
    aStore
      .getJwtToken()
      .then(() => {
        if (!aStore.isAuthenticated) {
          next("/token-expired2");
        } else {
          Promise.all([accessStore.setAccess(), aStore.getUserInfo()])
            .then(() => {
              next();
            })
            .catch((error) => {
              next("error");
            });
        }
      })
      .catch(() => {
        if (!aStore.userInfo) {
          next("/login");
        } else {
          next("/token-expired");
        }
      });
  } else {
    next();
  }
});

// router.beforeEach((to, _from, next) => {
//   const aStore = useAuthStore();
//   const accessStore = useAccessStore();
//   // this section is to set page title in vue store
//   if (to.meta.requiresAuth) {
//     aStore
//       .getJwtToken()
//       .then(() => {

//         if (!aStore.isAuthenticated) {
//           next("/token-expired2");
//         } else {
//           accessStore
//             .setAccess()
//             .then(() => {
//               next();
//             })
//             .catch((error) => {
//               next("error");
//             });
//           aStore
//             .getUserInfo()
//             .then(() => {
//               next();
//             })
//             .catch(() => {
//               next("error");
//             });
//         }
//       })
//       .catch(() => {
//         if (!aStore.userInfo) {
//           next("/login");
//         } else {
//           next("/token-expired");
//         }
//       });
//   } else {
//     next();
//   }
// });
export default router;
