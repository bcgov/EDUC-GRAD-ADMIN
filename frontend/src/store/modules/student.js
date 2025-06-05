import { defineStore } from "pinia";
import ProgramManagementService from "@/services/ProgramManagementService.js";
import GraduationReportService from "@/services/GraduationReportService.js";
import StudentService from "@/services/StudentService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
export const useStudentStore = defineStore("student", {
  namespaced: true,
  state: () => ({
    snackbarStore: useSnackbarStore(),
    pen: "",
    id: "",
    advancedSearchProps: "",
    tokenTimeout: "",
    isAuthenticated: localStorage.getItem("jwtToken") !== null,
    token: "",
    refreshToken: "",
    correlationID: "",
    roles: "administrator",
    permissions: "",
    username: "",
    pageTitle: null,
    quickSearchId: "",
    student: {
      profile: {},
      courses: [], // do we want to create a coursesMap ?
      assessments: [],
      coursesLegacy: [],
      examsLegacy: [],
      notes: [],
      gradStatus: "not loaded",
      optionalPrograms: [],
      hasAssessments: false,
      hasGradStatus: false,
      hasgradStatusPendingUpdates: false,
      hasNotes: false,
      certificates: [],
      reports: [],
      transcripts: [],
      xmlReports: [],
      ungradReasons: "",
      careerPrograms: [],
      auditHistory: [],
      auditHistoryOptionalPrograms: [],
    },
    editedGradStatus: {
      programCompletionDate: "",
      pen: "",
      program: "",
      studentGrade: "",
      schoolOfRecordName: "",
      schoolOfRecord: "",
      schoolOfRecordId: "",
      schoolAtGrad: "",
      schoolAtGradId: "",
      schoolAtGradName: "",
      studentStatus: "",
      studentID: "",
      gpa: "",
      honoursStanding: "",
      adultStartDate: "",
      consumerEducationRequirementMet: "",
      recalculateGradStatus: "",
      recalculateProjectedGrad: "",
    },
    coursesCreate: null,
    courseUpdate: null, // Might want to initialize fields similar to editedGradStatus
  }),
  actions: {
    formatAssessmentItemsList(items) {
      return items.map((item) => {
        if (!item.used) {
          item.used = "Not Used";
        }
        if (item.notCompleted) {
          item.notCompleted = " No Attempt";
        }
        if (item.projected) {
          item.projected = " Registration";
        }
        if (item.failed) {
          item.failed = " Not Completed";
        }
        if (item.duplicate) {
          item.duplicate = " Repeat";
        }
        return item;
      });
    },
    formatCourseItemsList(items) {
      return items.map((item) => {
        if (!item.used) {
          item.used = "Not Used";
        }
        if (item.notCompleted) {
          item.notCompleted = " Incomplete Course";
        }
        if (item.projected) {
          item.projected = " Registration or Interim";
        }
        if (item.failed) {
          item.failed = " Failed";
        }
        if (item.duplicate) {
          item.duplicate = " Repeat";
        }
        if (item.careerPrep) {
          item.careerPrep = " Career Prep course";
        }
        if (item.locallyDeveloped) {
          item.locallyDeveloped = " Locally Developed course";
        }
        if (item.boardAuthorityAuthorized) {
          item.boardAuthorityAuthorized = " Board/Authority Authorized Course";
        }
        if (item.cutOffCourse) {
          item.cutOffCourse = " Course taken after Program Expiry Date";
        }
        if (item.grade10Course) {
          item.grade10Course = " Grade 10 ineligible (1995 program)";
        }
        if (item.lessCreditCourse) {
          item.lessCreditCourse = " Courses with credits < 4 ineligible";
        }
        if (item.restricted) {
          item.restricted = " Course restricted against another course";
        }
        if (item.independentDirectedStudies) {
          item.independentDirectedStudies =
            ", Independent Directed Studies course";
        }

        return item;
      });
    },
    loadStudentReportsAndCertificates() {
      this.loadStudentXmlReport(this.pen);
      this.loadStudentTranscripts(this.id);
      this.loadStudentCertificates(this.id);
      this.loadStudentReports(this.id);
    },
    loadStudentXmlReport(pen) {
      GraduationReportService.getStudentXmlReport(pen)
        .then((response) => {
          this.setStudentXmlReport(response.data);
        })
        .catch((error) => {
          if (error.response.status == 404) {
            // eslint-disable-next-line
            console.log(error);
          } else {
            this.snackbarStore.showSnackbar(error.response, "error", 5000);
          }
        });
    },
    loadStudentCertificates(id) {
      GraduationReportService.getStudentCertificates(id)
        .then((response) => {
          this.setStudentCertificates(response.data);
        })
        .catch((error) => {
          if (error?.response?.data?.code == "404") {
            // eslint-disable-next-line
            console.log(error);
          } else {
            if (error?.response?.status) {
              // this.$bvToast.toast("ERROR " + error.response.statusText, {
              //   title: "ERROR" + error.response.status,
              //   variant: "danger",
              //   noAutoHide: true,
              // });
              this.snackbarStore.showSnackbar(
                "ERROR " + error?.response?.statusText,
                "error",
                10000,
                "ERROR" + error?.response?.status
              );
            }
          }
        });
    },
    loadStudentReports(id) {
      GraduationReportService.getStudentReports(id)
        .then((response) => {
          this.setStudentReports(response.data);
        })
        .catch((error) => {
          if (error?.response?.data?.code == "404") {
            // eslint-disable-next-line
            console.log(error);
          } else {
            if (error?.response?.status) {
              // this.$bvToast.toast("ERROR " + error.response.statusText, {
              //   title: "ERROR" + error.response.status,
              //   variant: "danger",
              //   noAutoHide: true,
              // });
              this.snackbarStore.showSnackbar(
                "ERROR " + error?.response?.statusText,
                "error",
                10000,
                "ERROR" + error?.response?.status
              );
            }
          }
        });
    },
    loadStudentTranscripts(id) {
      GraduationReportService.getStudentTranscripts(id)
        .then((response) => {
          this.setStudentTranscripts(response.data);
        })
        .catch((error) => {
          if (error?.response?.data?.code == "404") {
            // eslint-disable-next-line
            console.log(error);
          } else {
            if (error?.response?.status) {
              this.snackbarStore.showSnackbar(
                "There was a problem with the web service",
                "error",
                10000,
                "ERROR" + error?.response?.status
              );
            }
          }
        });
    },
    loadStudentGradStatus(studentId) {
      StudentService.getGraduationStatus(studentId)
        .then((response) => {
          this.setStudentGradStatus(response.data);
          this.showEdit = false;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(
            "There was an error loading student grad status",
            error
          );
        });
    },
    loadStudentOptionalPrograms(studentId) {
      StudentService.getGraduationStatusOptionalPrograms(studentId)
        .then((response) => {
          this.setStudentGradStatusOptionalPrograms(response.data);
        })
        .catch((error) => {
          if (error?.response?.status) {
            // this.$bvToast.toast("ERROR " + error.response.statusText, {
            //   title:
            //     "There was an error with the Student Service (getting the Graduation Status Optional Programs): " +
            //     error.response.status,
            //   variant: "danger",
            //   noAutoHide: true,
            // });
            this.snackbarStore.showSnackbar(
              "ERROR " + error?.response?.statusText,
              "error",
              10000,
              "There was an error with the Student Service (getting the Graduation Status Optional Programs): " +
                error?.response?.status
            );
          }
        });
    },
    loadStudentCareerPrograms(studentId) {
      StudentService.getStudentCareerPrograms(studentId)
        .then((response) => {
          this.setStudentCareerPrograms(response.data);
        })
        .catch((error) => {
          if (error?.response?.status) {
            // this.$bvToast.toast("ERROR " + error.response.statusText, {
            //   title:
            //     "There was an error with the Student Service (getting the student's Career Programs): " +
            //     error.response.status,
            //   variant: "danger",
            //   noAutoHide: true,
            // });
            this.snackbarStore.showSnackbar(
              "ERROR " + error?.response?.statusText,
              "error",
              10000,
              "There was an error with the Student Service (getting the student's Career Programs): " +
                error?.response?.status
            );
          }
        });
    },
    loadStudentHistory(studentId) {
      StudentService.getStudentHistory(studentId)
        .then((response) => {
          this.setStudentAuditHistory(response.data);
        })
        .catch((error) => {
          if (error?.response?.status) {
            // this.$bvToast.toast("ERROR " + error.response.statusText, {
            //   title:
            //     "There was an error with the Student Service (getting the Student History): " +
            //     error.response.status,
            //   variant: "danger",
            //   noAutoHide: true,
            // });
            this.snackbarStore.showSnackbar(
              "ERROR " + error?.response?.statusText,
              "error",
              10000,
              "There was an error with the Student Service (getting the Student History): " +
                error?.response?.status
            );
          }
        });
    },
    loadStudentOptionalProgramHistory(studentId) {
      StudentService.getStudentOptionalProgramHistory(studentId)
        .then((response) => {
          this.setStudentOptionalProgramsAuditHistory(response.data);
        })
        .catch((error) => {
          if (error?.response?.status) {
            // this.$bvToast.toast("ERROR " + error.response.statusText, {
            //   title:
            //     "There was an error with the Student Service (getting the Student Optional Program History): " +
            //     error.response.status,
            //   variant: "danger",
            //   noAutoHide: true,
            // });
            this.snackbarStore.showSnackbar(
              "ERROR " + error?.response?.statusText,
              "error",
              10000,
              "There was an error with the Student Service (getting the Student Optional Program History): " +
                error?.response?.status
            );
          }
        });
    },
    unsetStudent() {
      this.student.profile = {};
      this.student.notes = [];
      this.student.id = [];
      this.student.coursesLegacy = [];
      this.student.courses = [];
      this.student.assessments = [];
      this.student.examsLegacy = [];
      this.student.gradStatus = "not loaded";
      this.student.optionalPrograms = [];
      this.student.hasAssessments = false;
      this.student.hasNotes = false;
      this.student.hasGradStatus = false;
      this.student.hasgradStatusPendingUpdates = false;
      this.student.certificates = [];
      this.student.reports = [];
      this.student.transcripts = [];
      this.student.xmlReports = [];
      this.student.ungradReasons = [];
      this.student.careerPrograms = [];
    },
    setUsername(payload) {
      this.username = payload;
    },
    setQuickSearchId(payload) {
      this.quickSearchId = payload;
    },
    setPermissions(payload) {
      this.permissions = payload;
    },

    getGraduationPrograms() {
      ProgramManagementService.getGraduationPrograms()
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
    },
    setStudentPen(payload) {
      this.pen = payload;
    },
    setStudentId(payload) {
      this.id = payload;
    },
    setStudentAuditHistory(payload) {
      this.student.auditHistory = payload;
    },
    setStudentOptionalProgramsAuditHistory(payload) {
      this.student.auditHistoryOptionalPrograms = payload;
    },
    setStudentCareerPrograms(payload) {
      this.student.careerPrograms = payload;
    },
    setStudentCertificates(payload) {
      this.student.certificates = payload;
    },
    setStudentReports(payload) {
      this.student.reports = payload;
    },
    setStudentTranscripts(payload) {
      this.student.transcripts = payload;
    },
    setStudentXmlReport(payload) {
      this.student.xmlReports = payload;
    },
    setAdvancedSearchProps(payload) {
      this.advancedSearchProps = payload;
    },
    setStudentUngradReasons(payload) {
      this.student.ungradReasons = payload;
    },
    setHasGradStatusPendingUpdates(payload) {
      this.student.hasGradStatusPendingUpdates = payload;
    },
    setStudentGradStatusOptionalPrograms(payload) {
      this.student.optionalPrograms = payload;
      for (let optionalProgram of this.student.optionalPrograms) {
        optionalProgram.studentOptionalProgramData = JSON.parse(
          optionalProgram.studentOptionalProgramData
        );
      }
    },
    setStudentProfile(payload) {
      this.student.profile = payload[0];
    },
    setStudentCoursesLegacy(payload) {
      this.student.coursesLegacy = payload;
    },
    setStudentAssessments(payload) {
      this.student.assessments = payload;
      if (this.student.assessments.length) {
        this.student.hasAssessments = true;
      }
    },
    setStudentExamsLegacy(payload) {
      this.student.examsLegacy = payload;
    },
    // isProxy, toRaw { ...payload }
    setStudentGradStatus(payload) {
      this.student.gradStatus = payload;
      //when commiting gradstatus to store, we need to put the json string in to a json object to call it easier
      if (this.student.gradStatus.studentGradData) {
        this.student.gradStatus.studentGradData = JSON.parse(
          this.student.gradStatus.studentGradData
        );
      } else {
        this.student.gradStatus.studentGradData = {};
      }
      if (
        this.student.gradStatus != "not loaded" ||
        this.student.gradStatus == ""
      ) {
        this.student.hasGradStatus = true;
      }
    },
    setRoles(payload) {
      this.roles = payload;
    },
    setStudentNotes(payload) {
      this.student.notes = payload;
      if (this.student.notes.length) {
        this.student.hasNotes = true;
      }
    },
    setEditedGradStatus(gradStatus) {
      this.editedGradStatus = gradStatus;
    },
    setFormattedGradStatusAssessments(item) {
      this.formattedGradStatusAssessments = item;
    },
    // setFormattedGradStatusCourses(item) {
    //   this.formattedGradStatusCourses = item;
    // },

    /** STUDENT OPTIONAL PROGRAM CRUD */
    addStudentOptionalProgram(optionalProgramId) {
      try {
        let response = StudentService.createStudentOptionalProgram(
          this.id,
          optionalProgramId
        ).then(() => {
          // reload student grad status optional programs & optional program history after create
          this.loadStudentOptionalProgramHistory(this.id);
          this.loadStudentOptionalPrograms(this.id);
          this.loadStudentGradStatus(this.id);
        });
      } catch (error) {
        // eslint-disable-next-line
        console.error("Error creating student optional program: ", error);
      }
    },
    addStudentCareerPrograms(careerPrograms) {
      let careerProgramPayload = {
        careerProgramCodes: careerPrograms,
      };

      try {
        let response = StudentService.createStudentCareerPrograms(
          this.id,
          careerProgramPayload
        ).then(() => {
          // reload student grad status, optional/career programs & optional program history after create
          this.loadStudentOptionalProgramHistory(this.id);
          this.loadStudentOptionalPrograms(this.id);
          this.loadStudentCareerPrograms(this.id);
          this.loadStudentGradStatus(this.id);
        });
      } catch (error) {
        // eslint-disable-next-line
        console.error("Error creating student career program: ", error);
      }
    },
    removeStudentOptionalProgram(optionalProgramId) {
      try {
        let response = StudentService.deleteStudentOptionalProgram(
          this.id,
          optionalProgramId
        ).then(() => {
          // reload student grad status, optional programs & optional program history after delete
          this.loadStudentOptionalProgramHistory(this.id);
          this.loadStudentOptionalPrograms(this.id);
          this.loadStudentGradStatus(this.id);
        });
      } catch (error) {
        // eslint-disable-next-line
        console.error("Error deleting student optional program: ", error);
      }
    },
    removeStudentCareerProgram(careerProgramCode) {
      try {
        let response = StudentService.deleteStudentCareerProgram(
          this.id,
          careerProgramCode
        ).then(() => {
          // reload student grad status, optional/career programs & optional program history after delete
          this.loadStudentOptionalProgramHistory(this.id);
          this.loadStudentOptionalPrograms(this.id);
          this.loadStudentCareerPrograms(this.id);
          this.loadStudentGradStatus(this.id);
        });
      } catch (error) {
        // eslint-disable-next-line
        console.error("Error deleting student career program: ", error);
      }
    },

    /** STUDENT COURSE CRUD */
    async getStudentCourses(studentId) {
      let response = await StudentService.getStudentCourses(studentId);
      await this.setStudentCourses(response.data);
    },
    async setStudentCourses(payload) {
      this.student.courses = payload;
    },
    async deleteStudentCourses(courses) {
      try {
        await StudentService.deleteStudentCourses(this.id, courses);
        this.getStudentCourses(this.id);
      } catch (error) {
        console.error("Error deleting student courses:", error);
        throw error;
      }
    },
  },
  getters: {
    isCourseUsedForGraduation: (state) => (courseId) => {
      return (
        state.student.courses.find((course) => course.id === courseId)
          ?.usedForGrad || false
      );
    },
    hasAssociatedExam: (state) => (courseId) => {
      return (
        state.student.courses.find((course) => course.id === courseId)
          ?.hasExam || false
      );
    },
    getEditedGradStatus() {
      return this.editedGradStatus;
    },
    getStudentAuditHistory() {
      return this.student.auditHistory;
    },
    getStudentOptionalProgramAuditHistory() {
      return this.student.auditHistoryOptionalPrograms;
    },
    getAdvancedSearchProps() {
      return this.advancedSearchProps;
    },
    getStudentUngradReasons() {
      return this.student.ungradReasons;
    },
    getStudentCertificates() {
      return this.student.certificates;
    },
    getStudentReports() {
      return this.student.reports;
    },
    getStudentTranscripts() {
      return this.student.transcripts;
    },
    getStudentXmlReports() {
      return this.student.xmlReports;
    },
    getStudentGraduationCreationAndUpdate() {
      return {
        createdBy: this.student.gradStatus.createdBy,
        createdTimestamp: this.student.gradStatus.createdTimestamp,
        updatedBy: this.student.gradStatus.updatedBy,
        updatedTimestamp: this.student.gradStatus.updatedTimestamp,
      };
    },
    getHasGradStatusPendingUpdates() {
      return this.student.hasGradStatusPendingUpdates;
    },
    getStudentId() {
      return this.student.profile.studentID;
    },
    getStudentProfile() {
      return this.student.profile;
    },
    getStudentFullName() {
      return {
        legalLastName: this.student.profile.legalLastName,
        legalFirstName: this.student.profile.legalFirstName,
        legalMiddleNames: this.student.profile.legalMiddleNames,
        pen: this.student.profile.pen,
      };
    },
    getStudentPen() {
      return this.student.profile.pen;
    },
    getStudentGradStatus() {
      return this.student.gradStatus;
    },
    getStudentOptionalPrograms() {
      return this.student.optionalPrograms;
    },
    getStudentCoursesLegacy() {
      if (
        !Array.isArray(this.student.coursesLegacy) ||
        this.student.coursesLegacy.length === 0
      ) {
        return [];
      }
      return this.student.coursesLegacy.map((course) => ({
        ...course,
        id: `${course.courseCode}_${course.courseLevel}_${course.sessionDate}`,
      }));
    },
    getStudentExamsLegacy() {
      if (!this.student.examsLegacy || this.student.examsLegacy.length === 0) {
        return [];
      } else {
        return this.student.examsLegacy;
      }
    },
    getStudentAssessments() {
      if (
        !Array.isArray(this.student.assessments) ||
        this.student.assessments.length === 0
      ) {
        return [];
      }
      return this.student.assessments.map((assessment) => ({
        ...assessment,
        id: `${assessment.assessmentCode}_${assessment.sessionDate}`,
      }));
      // return this.student.assessments;
    },
    getStudentNotes() {
      return this.student.notes;
    },
    getStudentProgram() {
      return this.student.gradStatus.program;
    },
    studentHasAssessments() {
      return this.student.hasAssessments;
    },
    studentHasGradStatus() {
      return this.student.hasGradStatus;
    },
    studentHasNotes() {
      return this.student.hasNotes;
    },
    gradStatusCourses() {
      if (
        this.student.gradStatus.studentGradData &&
        this.student.gradStatus.studentGradData.studentCourses
      ) {
        return this.student.gradStatus.studentGradData.studentCourses
          .studentCourseList;
      } else {
        return {};
      }
    },
    gradStatusAssessments() {
      if (
        this.student.gradStatus.studentGradData &&
        this.student.gradStatus.studentGradData.studentAssessments
      ) {
        return this.student.gradStatus.studentGradData.studentAssessments
          .studentAssessmentList;
      } else {
        return {};
      }
    },
    getRoles() {
      return this.roles;
    },
    isAdmin() {
      return this.roles == "administrator";
    },
    // isAuthenticated() {
    //   return this.roles == "authenticated";
    // },
    getPermissions() {
      return this.permissions;
    },
    getUsername() {
      return this.username;
    },
    getQuickSearchId() {
      return this.quickSearchId;
    },
    getRequirementsMet() {
      if (this.student.gradStatus.studentGradData) {
        return this.student.gradStatus.studentGradData.requirementsMet;
      } else {
        return {};
      }
    },
    getNongradReasons() {
      if (this.student.gradStatus.studentGradData) {
        return this.student.gradStatus.studentGradData.nonGradReasons;
      } else {
        return {};
      }
    },
    getStudentCareerPrograms() {
      return this.student.careerPrograms;
    },
    getFormattedGradStatusCourses() {
      return this.formatCourseItemsList(this.gradStatusCourses);
    },
    getFormattedGradStatusAssessments() {
      return this.formatAssessmentItemsList(this.gradStatusAssessments);
    },

    /** NEW GETTERS BELOW
     * getters above should be renamed to drop the 'get' portion and sorted by type below
     * (student courses, student exams, student grad status, etc.), so getStudentCourses should
     * become studentCourses. We can reserve the 'getXFunctionName' format for API calls and move the
     * calls to the student store to align with our pattern in our app store and other ministry Vue apps.
     *
     * We're already dropping the 'get' when we use ...mapState() to map the properties to a computed
     * variable, so it makes to rename our getters in the store too since the get is already implied by being
     * in the getter section */

    studentCourses() {
      return this.student.courses;
    },
    studentExamCourses() {
      return this.student.courses.filter((course) => !!course.courseExam);
    },
  },
});
