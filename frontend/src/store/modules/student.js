import { defineStore } from "pinia";
import ProgramManagementService from "@/services/ProgramManagementService.js";
import GraduationReportService from "@/services/GraduationReportService.js";
import StudentService from "@/services/StudentService.js";
export const useStudentStore = defineStore("student", {
  namespaced: true,
  state: () => ({
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
      courses: "not loaded",
      assessments: "not loaded",
      exams: "not loaded",
      notes: [],
      gradStatus: "not loaded",
      optionalPrograms: "not loaded",
      hasExams: false,
      hasAssessments: false,
      hasCourses: false,
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
      schoolName: "",
      schoolOfRecord: "",
      schoolAtGrad: "",
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
  }),
  actions: {
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
            this.$bvToast.toast("ERROR " + error.response.statusText, {
              title: "Service ERROR" + error.response.status,
              variant: "danger",
              noAutoHide: true,
            });
          }
        });
    },
    loadStudentCertificates(id) {
      GraduationReportService.getStudentCertificates(id)
        .then((response) => {
          this.setStudentCertificates(response.data);
        })
        .catch((error) => {
          if (error.response.data.code == "404") {
            // eslint-disable-next-line
            console.log(error);
          } else {
            if (error.response.status) {
              this.$bvToast.toast("ERROR " + error.response.statusText, {
                title: "ERROR" + error.response.status,
                variant: "danger",
                noAutoHide: true,
              });
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
          if (error.response.data.code == "404") {
            // eslint-disable-next-line
            console.log(error);
          } else {
            if (error.response.status) {
              this.$bvToast.toast("ERROR " + error.response.statusText, {
                title: "ERROR" + error.response.status,
                variant: "danger",
                noAutoHide: true,
              });
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
          if (error.response.data.code == "404") {
            // eslint-disable-next-line
            console.log(error);
          } else {
            if (error.response.status) {
              this.$bvToast.toast("ERROR " + error.response.statusText, {
                title: "Service ERROR" + error.response.status,
                variant: "danger",
                noAutoHide: true,
              });
            }
          }
        });
    },
    loadStudentOptionalPrograms(studentId) {
      StudentService.getGraduationStatusOptionalPrograms(studentId)
        .then((response) => {
          this.setStudentGradStatusOptionalPrograms(response.data);
        })
        .catch((error) => {
          if (error.response.status) {
            this.$bvToast.toast("ERROR " + error.response.statusText, {
              title:
                "There was an error with the Student Service (getting the Graduation Status Optional Programs): " +
                error.response.status,
              variant: "danger",
              noAutoHide: true,
            });
          }
        });
    },
    loadStudentHistory(studentId) {
      StudentService.getStudentHistory(studentId)
        .then((response) => {
          this.setStudentAuditHistory(response.data);
        })
        .catch((error) => {
          if (error.response.status) {
            this.$bvToast.toast("ERROR " + error.response.statusText, {
              title:
                "There was an error with the Student Service (getting the Student History): " +
                error.response.status,
              variant: "danger",
              noAutoHide: true,
            });
          }
        });
    },
    loadStudentOptionalProgramHistory(studentId) {
      StudentService.getStudentOptionalProgramHistory(studentId)
        .then((response) => {
          this.setStudentOptionalProgramsAuditHistory(response.data);
        })
        .catch((error) => {
          if (error.response.status) {
            this.$bvToast.toast("ERROR " + error.response.statusText, {
              title:
                "There was an error with the Student Service (getting the Student Optional Program History): " +
                error.response.status,
              variant: "danger",
              noAutoHide: true,
            });
          }
        });
    },
    unsetStudent() {
      this.student.profile = {};
      this.student.notes = [];
      this.student.id = "not loaded";
      this.student.courses = "not loaded";
      this.student.assessments = "not loaded";
      this.student.exams = "not loaded";
      this.student.gradStatus = "not loaded";
      this.student.optionalPrograms = "not loaded";
      this.student.hasExams = false;
      this.student.hasAssessments = false;
      this.student.hasCourses = false;
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
    setStudentCourses(payload) {
      this.student.courses = payload;
      if (this.student.courses.length) {
        this.student.hasCourses = true;
      }
    },
    setStudentAssessments(payload) {
      this.student.assessments = payload;
      if (this.student.assessments.length) {
        this.student.hasAssessments = true;
      }
    },
    setStudentExams(payload) {
      this.student.exams = payload;
      if (this.student.exams.length) {
        this.student.hasExams = true;
      }
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
    //Optioanl Program CRUD
    addStudentOptionalProgram(optionalProgramCode, careerProgramCode) {
      let optionalProgramPayload = {
        createUser: "string",
        createDate: "2024-02-14T02:15:53.938Z",
        updateUser: "string",
        updateDate: "2024-02-14T02:15:53.938Z",
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        pen: "string",
        optionalProgramID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        studentOptionalProgramData: "string",
        optionalProgramCompletionDate: "string",
        optionalProgramName: "string",
        optionalProgramCode: "string",
        programCode: "string",
        studentID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      };
      try {
        let response = StudentService.createStudentOptionalProgram(
          this.id,
          optionalProgramPayload,
          careerProgramCode
        );
        console.log("Request successful:", response);
      } catch (error) {
        console.error("Error creating student optional program:", error);
      }
    },
    // deleteStudentOptionalProgram
    // updateStudentOptionalProgram
  },
  getters: {
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
    getStudentCourses() {
      if (
        !Array.isArray(this.student.courses) ||
        this.student.courses.length === 0
      ) {
        return [];
      }
      return this.student.courses.map((course) => ({
        ...course,
        id: `${course.courseCode}_${course.courseLevel}_${course.sessionDate}`,
      }));
    },
    getStudentExams() {
      return this.student.exams;
    },
    getStudentAssessments() {
      if (
        !Array.isArray(this.student.assessments) ||
        this.student.assessments.length === 0
      ) {
        return "";
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
    studentHasCourses() {
      return this.student.hasCourses;
    },
    studentHasExams() {
      return this.student.hasExams;
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
    isAuthenticated() {
      return this.roles == "authenticated";
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
    getStudentCareerPrograms() {
      return this.student.careerPrograms;
    },
    getEditedGradStatus() {
      return this.editedGradStatus;
    },
  },
});
