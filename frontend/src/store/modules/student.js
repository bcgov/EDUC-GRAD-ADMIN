import { defineStore } from "pinia";
import router from "@/router";
import CodesService from "@/services/CodesService.js";
import StudentService from "@/services/StudentService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
import StudentAssessmentService from "@/services/StudentAssessmentService";
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
    adoptLoading: false,
    studentDialog: false,
    student: {
      profile: {},
      courses: [], // do we want to create a coursesMap ?
      assessmentsLegacy: [],
      assessmentStudents: [],
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
      auditHistoryCourses: [],
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
    create: {
      courses: [],
    },
    update: {
      courses: [],
    },
    delete: {
      courses: [],
    },
    transfer: {
      courses: [],
    },
    merge: {
      examinableCourses: {
        info: [],
        conflicts: [],
        errors: [],
      },
      nonExaminableCourses: {
        info: [],
        conflicts: [],
        errors: [],
      },
      assessments: {
        info: [],
        conflicts: [],
        errors: [],
      },
      gradStatus: {},
      note: {
        mergeCompleted: false,
        source: {},
        target: {}
      },
    }
  }),
  actions: {
    async adoptStudent(studentData) {
      try {
        this.adoptLoading = true;
        const response = await StudentService.adoptPENStudent(studentData);

        const studentID = response?.data?.studentID;
        if (studentID) {
          router.push({ path: `/student-profile/${studentID}` });
        }
        this.studentDialog = false;
      } catch (error) {
        this.$snackbarStore.error(error);
      } finally {
        this.adoptLoading = false;
      }
    },
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
      StudentService.getStudentXMLReport(pen)
        .then((response) => {
          this.setStudentXmlReport(response.data);
        })
        .catch((error) => {
          if (error.response.status != "404") {
            this.snackbarStore.showSnackbar(
              !!error.response?.status
                ? `${error.response.status} Error getting student XML`
                : "Something went wrong getting student XML",
              "error",
              5000
            );
          }
        });
    },
    loadStudentCertificates(id) {
      StudentService.getStudentCertificates(id)
        .then((response) => {
          this.setStudentCertificates(response.data);
        })
        .catch((error) => {
          this.snackbarStore.showSnackbar(
            !!error.response?.status
              ? `${error.response.status} Error getting student certificate`
              : "Something went wrong getting student certificate",
            "error",
            10000,
            "ERROR" + error?.response?.status
          );
        });
    },
    loadStudentReports(id) {
      StudentService.getStudentTVR(id)
        .then((response) => {
          this.setStudentReports(response.data);
        })
        .catch((error) => {
          this.snackbarStore.showSnackbar(
            !!error.response?.status
              ? `${error.response.status} Error getting student TVR`
              : "Something went wrong getting student TVR",
            "error",
            10000,
            "ERROR" + error?.response?.status
          );
        });
    },
    loadStudentTranscripts(id) {
      StudentService.getStudentTranscript(id)
        .then((response) => {
          this.setStudentTranscripts(response.data);
        })
        .catch((error) => {
          if (error?.response?.data?.code != "404") {
            if (error?.response?.status) {
              this.snackbarStore.showSnackbar(
                !!error.response?.status
                  ? `${error.response.status} Error getting student transcript`
                  : "Something went wrong getting student transcript",
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
    loadStudentHistory(studentId) {
      StudentService.getStudentHistory(studentId)
        .then((response) => {
          this.setStudentAuditHistory(response.data);
        })
        .catch((error) => {
          if (error?.response?.status) {
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
    loadStudentCourseHistory(studentId) {
      StudentService.getStudentCourseHistory(studentId)
        .then((response) => {
          this.setStudentCourseAuditHistory(response.data);
        })
        .catch((error) => {
          if (error?.response?.status) {
            this.snackbarStore.showSnackbar(
              "ERROR " + error?.response?.statusText,
              "error",
              10000,
              "There was an error with the Student Service (getting the Student Course History): " +
                error?.response?.status
            );
          }
        });
    },
    loadStudentAssessmentHistory(studentId) {
      StudentAssessmentService.getStudentAssessmentHistoryBySearchCriteria(
        studentId
      )
        .then((response) => {
          this.setStudentCourseAuditHistory(response.data);
        })
        .catch((error) => {
          if (error?.response?.status) {
            this.snackbarStore.showSnackbar(
              "ERROR " + error?.response?.statusText,
              "error",
              10000,
              "There was an error with the Student Service (getting the Student Course History): " +
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
      this.student.assessmentsLegacy = [];
      this.student.assessmentStudents = [];
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
    //IMPROVEMENT: Pull this data from the app store
    getGraduationPrograms() {
      CodesService.getGradProgramCodes()
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
    setStudentCourseAuditHistory(payload) {
      this.student.auditHistoryCourses = payload;
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
    setStudentAssessmentsLegacy(payload) {
      this.student.assessmentsLegacy = payload;
      if (this.student.assessmentsLegacy.length) {
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

    /*****************************
     * STUDENT OPTIONAL PROGRAMS
     *****************************/
    loadStudentOptionalPrograms(studentId) {
      StudentService.getGraduationStatusOptionalPrograms(studentId)
        .then((response) => {
          this.setStudentGradStatusOptionalPrograms(response.data);
        })
        .catch((error) => {
          if (error?.response?.status) {
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

    /************************
     * STUDENT COURSES
     * legacy course functions above should be removed when CRUD goes live
     ***********************/

    // get and set data in store
    async getStudentCourses(studentId) {
      let response = await StudentService.getStudentCourses(studentId);
      await this.setStudentCourses(response.data);
    },
    async setStudentCourses(payload) {
      this.student.courses = payload;
    },
    setStudentAssessments(studentAssessments) {
      this.student.assessmentStudents = studentAssessments;
      if (this.student.assessmentStudents.length) {
        this.student.hasAssessments = true;
      }
    },
    // create student courses and form helpers
    async createStudentCourses(courses) {
      try {
        const response = await StudentService.createStudentCourses(
          this.id,
          courses
        );
        this.getStudentCourses(this.id);
        this.loadStudentGradStatus(this.id);
        return response.data;
      } catch (error) {
        console.error("Error adding student courses: ", error);
        return error;
      }
    },
    addCoursesToCreate(course) {
      this.create.courses.push(course);
    },
    removeCourseFromCreate(courseID, courseSession) {
      this.create.courses = this.create.courses.filter(
        (course) =>
          !(
            course.courseID === courseID &&
            course.courseSession === courseSession
          )
      );
    },
    async updateStudentCourse(course) {
      try {
        const response = await StudentService.updateStudentCourse(
          this.id,
          course
        );
        this.getStudentCourses(this.id);
        this.loadStudentGradStatus(this.id);
        return response;
      } catch (error) {
        console.error("Error updating student courses:", error);
        throw error;
      }
    },
    clearCoursesToCreate(course) {
      this.create.courses = [];
    },
    // delete student assessments
    async deleteStudentAssessments(assessments) {
      console.info("Deleting student assessments")
    },
    // delete student courses
    async deleteStudentCourses(courses) {
      try {
        const response = await StudentService.deleteStudentCourses(
          this.id,
          courses
        );
        this.getStudentCourses(this.id);
        this.loadStudentGradStatus(this.id);
        return response;
      } catch (error) {
        console.error("Error deleting student courses:", error);
        throw error;
      }
    },
    // Transfer student courses
    async transferStudentCourses(sourceStudentID, targetStudentID, courses) {
      try {
        const response = await StudentService.transferStudentCourses(
          sourceStudentID,
          targetStudentID,
          courses
        );
        this.getStudentCourses(sourceStudentID);
        this.loadStudentGradStatus(sourceStudentID);
        return response.data;
      } catch (error) {
        console.error("Error transferring student courses: ", error);
        return error;
      }
    },
    addCoursesToTransfer(course) {
      this.transfer.courses.push(course);
    },
    clearCoursesToTransfer() {
      this.transfer.courses = [];
    },
    clearExaminableCoursesToMerge() {
      this.merge.examinableCourses.info = [];
      this.merge.examinableCourses.conflicts = [];
    },
    clearNonExaminableCoursesToMerge() {
      this.merge.nonExaminableCourses.info = [];
      this.merge.nonExaminableCourses.conflicts = [];
    },
    clearAssessmentsToMerge() {
      this.merge.assessments.info = [];
      this.merge.assessments.conflicts = [];
    },
    clearGradStatusToMerge() {
      this.merge.gradStatus = {};
    },
    clearNotesToMerge() {
      this.merge.note.mergeCompleted = false;
      this.merge.note.source = {};
      this.merge.note.target = {};
    },
    clearStudentMerge() {
      this.clearExaminableCoursesToMerge();
      this.clearNonExaminableCoursesToMerge();
      this.clearAssessmentsToMerge();
      this.clearGradStatusToMerge();
      this.clearNotesToMerge();
    },
    // Merge student courses
    async mergeStudentCourses(
      sourceStudentID,
      targetStudentID,
      studentCourses
    ) {
      try {
        return await StudentService.mergeStudentCourses(
          sourceStudentID,
          targetStudentID,
          studentCourses
        );
      } catch (error) {
        console.error("Error merging student courses: ", error);
        return error;
      }
    },    
    //Complete merge
    async completeStudentDataMerge(sourceStudentID, targetStudentID, completeMergeNotes) {
      try {
        return await StudentService.completeStudentDataMerge(
          sourceStudentID,
          targetStudentID,
          completeMergeNotes
        );
      } catch (error) {
        console.error("Error completing merging student : ", error);
        return error;
      }
    }, 
    removeCourseFromTransfer(courseID, courseSession) {
      this.transfer.courses = this.transfer.courses.filter(
        (course) =>
          !(
            course.courseID === courseID &&
            course.courseSession === courseSession
          )
      );
    },
  },
  getters: {
    isCourseUsedForGraduation: (state) => (course) => {
      return (
        state.student.gradStatus.studentGradData.studentCourses.studentCourseList.find(
          (course) => course.id === courseId
        )?.used || false
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
    getStudentCourseAuditHistory() {
      return this.student.auditHistoryCourses;
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
    studentOptionalPrograms() {
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
    getStudentAssessmentsLegacy() {
      if (
        !Array.isArray(this.student.assessmentsLegacy) ||
        this.student.assessmentsLegacy.length === 0
      ) {
        return [];
      }
      return this.student.assessmentsLegacy.map((assessment) => ({
        ...assessment,
        id: `${assessment.assessmentCode}_${assessment.sessionDate}`,
      }));
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
    studentCareerPrograms() {
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

    formattedStudentName(showPEN = true, showMiddle = true) {
      let profile = this.student?.profile;
      if (profile) {
        let formattedName = `${profile.legalLastName}, ${profile.legalFirstName}`;
        if (showPEN) {
          formattedName = `${profile.pen} - ` + formattedName;
        }
        if (showMiddle && profile.legalMiddleNames) {
          formattedName = formattedName + ` ${profile.legalMiddleNames}`;
        }
        return formattedName;
      } else {
        //return "error occurred getting student name, refresh or try again later";
        return "";
      }
    },
    studentAssessments() {
      return this.student.assessmentStudents;
    },
    studentCourses() {
      return this.student.courses;
    },
    studentExamCourses() {
      return this.student.courses.filter((course) => !!course.courseExam);
    },
    studentCoursesToCreate: (state) => state.coursesToCreate,
    studentCourseToCreateById: (state) => {
      return (courseId, sessionDate) =>
        state.coursesToCreate.find(
          (course) =>
            courseId === course.courseId && sessionDate == course.sessionDate
        );
    },
  },
});
