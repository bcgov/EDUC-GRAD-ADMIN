<template>
  <div class="student-profile">
    <!-- Studnet Demo. -->
    <div class="row m-0 py-3">
      <StudentInformation></StudentInformation>

      <div class="col-12 px-3">
        <div class="float-right grad-actions" v-if="allowRunGradAlgorithm">
          <v-progress-circular v-if="tabLoading" indeterminate color="green">
          </v-progress-circular>
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                text
                v-bind="props"
                :disabled="tabLoading || !hasGradStatus"
                id="actions"
                right
                class="m-md-2 float-right admin-gear-w-text"
              >
                <v-icon icon="mdi-school" start></v-icon>Transcripts &
                TVRs</v-btn
              >
            </template>
            <v-list>
              <v-list-item
                :disabled="studentGradStatus.studentStatus === 'MER'"
                v-on:click="projectedGradStatusWithFinalMarks"
                >Preview Final Marks</v-list-item
              >
              <v-list-item
                :disabled="studentGradStatus.studentStatus === 'MER'"
                v-on:click="projectedGradStatusWithFinalAndReg"
                >Update TVR</v-list-item
              >
              <v-list-item
                :disabled="
                  studentGradStatus.recalculateGradStatus !== 'Y' ||
                  studentGradStatus.studentStatus === 'MER' ||
                  (!!studentGradStatus.programCompletionDate &&
                    studentGradStatus.program !== 'SCCP')
                "
                v-on:click="graduateStudent"
                >Update Grad Status</v-list-item
              >
              <v-list-item
                :disabled="
                  studentGradStatus.studentStatus === 'MER' ||
                  !studentGradStatus.programCompletionDate
                "
                v-on:click="updateStudentReports"
                >Update Transcript</v-list-item
              >
              <v-list-item
                :disabled="
                  studentGradStatus.studentStatus === 'MER' ||
                  !studentGradStatus.programCompletionDate
                "
                >Undo Completion</v-list-item
              >
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>
    <!-- Studnet Demo. end-->
    <div class="row m-0">
      <div class="col-12 px-0">
        <v-card class="p-0" color="#f2f2f2">
          <v-window v-model="tab">
            <v-window-item value="gradStatusTab">
              <v-tabs v-model="selectedTab" bg-color="primary">
                <v-tab value="GRAD">GRAD</v-tab>
                <v-tab value="Courses">Courses ({{ courses.length }})</v-tab>
                <v-tab value="Assessments"
                  >Assessments ({{ assessments.length }})</v-tab
                >
                <v-tab value="Exams">Exams Details ({{ exams.length }})</v-tab>
                <v-tab value="Optional"
                  >Optional Programs ({{ optionalPrograms.length }})</v-tab
                >
                <v-tab value="Audit">Audit History</v-tab>
              </v-tabs>
              <v-card-text>
                <v-window v-model="selectedTab">
                  <v-window-item value="GRAD">
                    <v-tabs v-model="selectedSubTab" color="primary">
                      <v-tab value="gradStatusTab"
                        ><v-chip>GRAD Status</v-chip></v-tab
                      >
                      <v-tab value="requirementDetailsTab" color="primary"
                        ><v-chip>Requirement Details</v-chip></v-tab
                      >
                    </v-tabs>

                    <div class="last-updated-date">
                      <v-chip class="ma-2" label>
                        <v-icon icon="mdi-calendar" start></v-icon>
                        <strong>Updated:</strong>
                        {{ $filters.formatTime(studentGradStatus.updateDate) }}
                        by
                        {{ studentGradStatus.updateUser }}
                      </v-chip>
                    </div>

                    <v-window v-model="selectedSubTab">
                      <v-window-item value="gradStatusTab">
                        <div v-if="studentGradStatus.studentGradData">
                          <v-alert
                            color="Info"
                            icon="$info"
                            v-if="
                              studentGradStatus.studentGradData.gradMessage &&
                              !studentGradStatus.recalculateGradStatus
                            "
                          >
                            {{ studentGradStatus.studentGradData.gradMessage }}
                          </v-alert>
                        </div>

                        <StudentGraduationStatus></StudentGraduationStatus>
                      </v-window-item>

                      <v-window-item value="requirementDetailsTab">
                        <GRADRequirementDetails> </GRADRequirementDetails>
                      </v-window-item>
                    </v-window>

                    <div id="RequirementDetails">
                      <v-progress-circular
                        v-if="tabLoading"
                        indeterminate
                        color="green"
                      >
                      </v-progress-circular>
                    </div>
                  </v-window-item>
                  <v-window-item value="Courses">
                    <v-progress-circular
                      v-if="tabLoading"
                      indeterminate
                      color="green"
                    >
                    </v-progress-circular>
                    <StudentCourses></StudentCourses
                  ></v-window-item>
                  <v-window-item value="Assessments">
                    <v-progress-circular
                      v-if="tabLoading"
                      indeterminate
                      color="green"
                    >
                    </v-progress-circular>
                    <StudentAssessments
                  /></v-window-item>
                  <v-window-item value="Exams">
                    <v-progress-circular
                      v-if="tabLoading"
                      indeterminate
                      color="green"
                    >
                    </v-progress-circular>
                    <StudentExams />
                  </v-window-item>
                  <v-window-item value="Optional">
                    <v-progress-circular
                      v-if="tabLoading"
                      indeterminate
                      color="green"
                    >
                    </v-progress-circular>
                    <StudentOptionalPrograms></StudentOptionalPrograms
                  ></v-window-item>
                  <v-window-item value="Audit">
                    <v-progress-circular
                      v-if="tabLoading"
                      indeterminate
                      color="green"
                    >
                    </v-progress-circular>
                    <div class="ml-3">
                      <v-btn
                        class="mr-2 my-1"
                        v-on:click="auditTab = 'studentAudit'"
                        size="sm"
                        :variant="
                          auditTab == 'studentAudit' ? 'tonal' : 'outlined'
                        "
                        >Student Audit</v-btn
                      >
                      <v-btn
                        class="mr-2 my-1"
                        v-on:click="auditTab = 'notes'"
                        size="sm"
                        :variant="auditTab == 'notes' ? 'tonal' : 'outlined'"
                        >Notes ({{ studentNotes.length }})</v-btn
                      >
                      <v-btn
                        class="mr-2 my-1"
                        v-on:click="auditTab = 'undoCompletionReasons'"
                        size="sm"
                        :variant="
                          auditTab == 'undoCompletionReasons'
                            ? 'tonal'
                            : 'outlined'
                        "
                        >Undo Completion Reasons ({{
                          studentUngradReasons.length
                        }})</v-btn
                      >
                      <StudentAuditHistory v-if="auditTab == 'studentAudit'" />
                    </div>
                  </v-window-item>
                </v-window>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { showNotification } from "../utils/common.js";
import AssessmentService from "@/services/AssessmentService.js";
import CourseService from "@/services/CourseService.js";
import StudentService from "@/services/StudentService.js";
import GraduationService from "@/services/GraduationService.js";
import GRADRequirementDetails from "@/components/StudentProfile/GRADRequirementDetails.vue";
import StudentInformation from "@/components/StudentProfile/StudentInformation.vue";
import StudentCourses from "@/components/StudentProfile/StudentCourses.vue";
import StudentAssessments from "@/components/StudentProfile/StudentAssessments.vue";
import StudentExams from "@/components/StudentProfile/StudentExams.vue";
import StudentGraduationStatus from "@/components/StudentProfile/StudentGraduationStatus.vue";
import StudentOptionalPrograms from "@/components/StudentProfile/StudentOptionalPrograms.vue";
import StudentAuditHistory from "@/components/StudentProfile/AuditHistory/StudentAuditHistory.vue";
import StudentNotes from "@/components/StudentProfile/AuditHistory/StudentNotes.vue";
import DisplayTable from "@/components/DisplayTable.vue";

import { useStudentStore } from "../store/modules/student";
import { useAppStore } from "../store/modules/app";
import { useAccessStore } from "../store/modules/access";
import { mapState, mapActions } from "pinia";
export default {
  name: "studentProfile",
  setup() {
    const studentStore = useStudentStore();
    const appStore = useAppStore();
    const accessStore = useAccessStore();
    return { appStore, studentStore, accessStore };
  },
  created() {
    StudentService.getStudentPen(this.$route.params.studentId)
      .then((response) => {
        this.pen = response.data.pen;
        this.setStudentPen(this.pen);
        const studentIdFromURL = this.$route.params.studentId;
        this.setStudentId(studentIdFromURL);
        this.loadStudent(studentIdFromURL);
      })
      .catch((error) => {
        if (error.response.status) {
          this.showNotification(
            "danger",
            "There was an error: " + error.response.status
          );
        }
      });
    this.showNotification = showNotification;
    this.window.width = window.innerWidth;
    this.window.height = window.innerHeight;
    if (this.window.width < 768) {
      this.smallScreen = true;
    }
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  components: {
    StudentInformation: StudentInformation,
    StudentCourses: StudentCourses,
    GRADRequirementDetails: GRADRequirementDetails,
    StudentAssessments: StudentAssessments,
    StudentExams: StudentExams,
    StudentGraduationStatus: StudentGraduationStatus,
    StudentOptionalPrograms: StudentOptionalPrograms,
    StudentAuditHistory: StudentAuditHistory,
    StudentNotes: StudentNotes,
    DisplayTable: DisplayTable,
  },
  props: {},
  data() {
    return {
      tab: null,
      pen: "",
      optionalProgramTab: "",
      projectedOptionalGradStatus: "",
      nonGradReasons: "",
      projectedrequirementsMet: "",
      studentUngradReasonSelected: "",
      studentUngradReasonDescription: "",
      confirmStudentUndoCompletion: false,
      selectedSubTab: 0,
      selectedTab: 0,
      projectedGradStatus: [],
      projectedGradStatusWithRegistrations: [],
      tabLoading: false,
      gradTab: "gradStatus",
      auditTab: "studentAudit",
      show: false,
      opened: [],
      displayMessage: null,
      smallScreen: false,
      window: {
        width: 0,
        height: 0,
      },
      courseViewMode: "showAllCourses",
      moreStudentInfo: false,
      noncompletionReasonsFields: [
        {
          key: "rule",
          label: "Rule",
          class: "pl-0 pr-2 py-2",
        },
        {
          key: "description",
          label: "Description",
          class: "px-0 py-2",
        },
        {
          key: "transcriptRule",
          label: "Transcript Rule",
          class: "py-2",
        },
      ],
      requirementsMetFields: [
        {
          key: "rule",
          label: "Rule",
          class: "px-0 py-2",
        },
        {
          key: "description",
          label: "Description",
          class: "px-0 py-2",
        },
        {
          key: "transcriptRule",
          label: "Transcript Rule",
          class: "py-2",
        },
      ],
    };
  },
  computed: {
    ...mapState(useAccessStore, {
      allowUpdateGradStatus: "allowUpdateGradStatus",
      allowRunGradAlgorithm: "allowRunGradAlgorithm",
    }),
    ...mapState(useAppStore, {
      ungradReasons: "ungradReasons",
    }),
    ...mapState(useStudentStore, {
      profile: "getStudentProfile",
      courses: "getStudentCourses",
      assessments: "getStudentAssessments",
      exams: "getStudentExams",
      studentHasCourses: "studentHasCourses",
      gradInfo: "getStudentGraduationCreationAndUpdate",
      hasGradStatus: "studentHasGradStatus",
      studentGradStatus: "getStudentGradStatus",
      studentId: "getStudentId",
      studentPen: "getStudentPen",
      studentInfo: "getStudentProfile",
      studentNotes: "getStudentNotes",
      optionalPrograms: "getStudentOptionalPrograms",
      studentUngradReasons: "getStudentUngradReasons",
      gradCourses: "gradStatusCourses",
      studentHistory: "getStudentAuditHistory",
      optionalProgramHistory: "getStudentOptionalProgramAuditHistory",
      quickSearchId: "getQuickSearchId",
    }),
  },
  watch: {
    userUndoCompletionReasonChange: function () {
      this.confirmStudentUndoCompletion = false; //clear confirm if they change options
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  beforeRouteUpdate(to, from, next) {
    StudentService.getStudentPen(this.quickSearchId)
      .then((response) => {
        this.pen = response.data.pen;
        this.setStudentPen(this.pen);
        this.setStudentId(this.quickSearchId);
        this.loadStudent(this.quickSearchId);
      })
      .catch((error) => {
        if (error.response.status) {
          this.showNotification(
            "danger",
            "There was an error: " + error.response.status
          );
        }
      });
    next();
  },
  methods: {
    ...mapActions(useStudentStore, [
      "loadStudentReportsAndCertificates",
      "loadStudentOptionalPrograms",
      "loadStudentHistory",
      "loadStudentOptionalProgramHistory",
      "setStudentCertificates",
      "setStudentReports",
      "setStudentTranscripts",
      "setStudentXmlReport",
      "setStudentGradStatus",
      "setStudentProfile",
      "setStudentAssessments",
      "setStudentGradStatusOptionalPrograms",
      "setStudentCourses",
      "setStudentExams",
      "setStudentNotes",
      "setStudentUngradReasons",
      "setStudentAuditHistory",
      "setStudentCareerPrograms",
      "setStudentUngradReasons",
      "setStudentOptionalProgramsAuditHistory",
      "setStudentPen",
      "setStudentId",
    ]),
    ungraduateStudent() {
      this.tabLoading = true;
      this.confirmStudentUndoCompletion = "";
      let ungradCode = this.studentUngradReasonSelected;
      let ungradDesc = this.studentUngradReasonDescription;
      if (ungradCode != "OTH") {
        ungradDesc = this.ungradReasons.filter(function (reason) {
          return reason.code == ungradCode;
        });
        ungradDesc = ungradDesc[0].description;
      }
      StudentService.ungradStudent(this.studentId, ungradCode, ungradDesc)
        .then(() => {
          StudentService.getStudentUngradReasons(this.studentId)
            .then((response) => {
              this.setStudentUngradReasons(response.data);
            })
            .catch((error) => {
              if (error.response.status) {
                this.showNotification(
                  "danger",
                  "There was an error: " + error.response.status
                );
              }
            });
          StudentService.getGraduationStatus(this.studentId)
            .then((response) => {
              this.setStudentGradStatus(response.data);
              this.loadStudentHistory(this.studentId);
              this.loadStudentOptionalProgramHistory(this.studentId);
              this.loadStudentOptionalPrograms(this.studentId);
              this.tabLoading = false;
            })
            .catch((error) => {
              this.tabLoading = false;
              if (error.response.status) {
                this.$bvToast.toast("ERROR " + error.response.statusText, {
                  title: "ERROR" + error.response.status,
                  variant: "danger",
                  noAutoHide: true,
                });
              }
            });
          this.loadStudentReportsAndCertificates();
        })
        .catch((error) => {
          this.tabLoading = false;
          this.showNotification(
            "danger",
            "There was an error: " + error.response.data.messages[0].message
          );
        });
    },
    resetUndoCompletionValues() {
      this.confirmStudentUndoCompletion = false;
      this.studentUngradReasonSelected = "";
      this.studentUngradReasonDescription = "";
    },
    reloadGradStatus() {
      StudentService.getGraduationStatus(this.studentId)
        .then((res) => {
          this.setStudentGradStatus(res.data);
        })
        .catch((error) => {
          if (error.res.status) {
            this.$bvToast.toast("ERROR " + error.res.statusText, {
              title: "ERROR" + error.res.status,
              variant: "danger",
              noAutoHide: true,
            });
          }
        });
      this.loadStudentReportsAndCertificates();
      this.tabLoading = false;
    },
    graduateStudent() {
      this.selectedTab = 0;
      this.tabLoading = true;
      GraduationService.graduateStudent(this.studentId)
        .then(() => {
          this.loadStudent(this.studentId);
        })
        .catch((error) => {
          this.tabLoading = false;
          if (error.response.status) {
            this.$bvToast.toast("ERROR " + error.response.statusText, {
              title: "ERROR" + error.response.status,
              variant: "danger",
              noAutoHide: true,
            });
          }
        });
    },
    updateStudentReports() {
      this.selectedTab = 0;
      this.tabLoading = true;
      GraduationService.updateStudentReports(this.studentId)
        .then(() => {
          this.loadStudentReportsAndCertificates();
          StudentService.getGraduationStatus(this.studentId)
            .then((res) => {
              this.setStudentGradStatus(res.data);
              this.tabLoading = false;
            })
            .catch((error) => {
              if (error.res.status) {
                this.$bvToast.toast("ERROR " + error.res.statusText, {
                  title: "ERROR" + error.res.status,
                  variant: "danger",
                  noAutoHide: true,
                });
              }
            });
        })
        .catch((error) => {
          if (error.response.status) {
            this.$bvToast.toast("ERROR " + error, {
              title: "ERROR" + error.response.status.response,
              variant: "danger",
              noAutoHide: true,
            });
            this.tabLoading = false;
          }
        });
    },
    projectedGradStatusWithFinalMarks() {
      this.tabLoading = true;
      GraduationService.projectedGradFinalMarks(this.studentId)
        .then((response) => {
          this.projectedGradStatus = JSON.parse(
            response.data.graduationStudentRecord.studentGradData
          );
          this.projectedOptionalGradStatus =
            response.data.studentOptionalProgram;
          for (let projectedOptGradStatus of this.projectedOptionalGradStatus) {
            projectedOptGradStatus.studentOptionalProgramData = JSON.parse(
              projectedOptGradStatus.studentOptionalProgramData
            );
          }
          this.$refs["projectedGradStatusWithFinalMarks"].show();
          this.tabLoading = false;
          this.loadStudentReportsAndCertificates();
        })
        .catch((error) => {
          this.tabLoading = false;
          if (error.response.status) {
            this.$bvToast.toast("ERROR " + error.response.statusText, {
              title: "ERROR" + error.response.status,
              variant: "danger",
              noAutoHide: true,
            });
          }
        });
    },
    projectedGradStatusWithFinalAndReg() {
      this.nonGradReasons =
        this.studentGradStatus.studentGradData.nonGradReasons;
      this.tabLoading = true;
      GraduationService.projectedGradStatusWithFinalAndReg(this.studentId)
        .then((response) => {
          this.projectedGradStatusWithRegistrations = response.data;
          this.projectedGradStatusWithRegistrations = JSON.parse(
            this.projectedGradStatusWithRegistrations.graduationStudentRecord
              .studentGradData
          );
          this.projectedOptionalGradStatus =
            response.data.studentOptionalProgram;
          for (let projectedOptGradStatus of this.projectedOptionalGradStatus) {
            projectedOptGradStatus.studentOptionalProgramData = JSON.parse(
              projectedOptGradStatus.studentOptionalProgramData
            );
          }
          this.projectedrequirementsMet =
            this.projectedGradStatusWithRegistrations.requirementsMet;
          this.$refs["projectedGradStatusWithFinalAndReg"].show();
          this.tabLoading = false;
          this.loadStudentReportsAndCertificates();
        })
        .catch((error) => {
          if (error.response.status) {
            this.tabLoading = false;
            this.showNotification(
              "danger",
              "There was an error with the Graduation Service (projected Grad Status with Final and Reg): " +
                error.response.status
            );
          }
        });
    },
    closeRecord: function () {
      this.unsetStudent();
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
      if (this.window.width < 992) {
        this.smallScreen = true;
      } else {
        this.smallScreen = false;
      }
    },
    loadStudent(studentIdFromURL) {
      this.loadStudentProfile();
      this.loadAssessments();
      this.loadGraduationStatus(studentIdFromURL);
      this.loadStudentOptionalPrograms(studentIdFromURL);
      this.loadCareerPrograms(studentIdFromURL);
      this.loadStudentCourseAchievements();
      this.loadStudentExamDetails();
      this.loadStudentNotes(studentIdFromURL);
      this.loadStudentReportsAndCertificates();
      this.loadStudentUngradReasons(studentIdFromURL);
      this.loadStudentHistory(studentIdFromURL);
      this.loadStudentOptionalProgramHistory(studentIdFromURL);
      this.tabLoading = false;
    }, //loadStudent
    loadStudentProfile() {
      StudentService.getStudentByPen(this.pen)
        .then((response) => {
          let data = response.data;
          //get true PEN for MER students
          //TODO SF: change length check to valid PEN check? Or do we want a valid GUID check utility?
          if (data[0].trueStudentID && data[0].trueStudentID.length > 9) {
            StudentService.getStudentByID(data[0].trueStudentID)
              .then((response) => {
                data[0].trueStudentID = response.data.pen;
              })
              .catch((error) => {
                if (error.response.status) {
                  this.showNotification(
                    "danger",
                    "There was an error getting the Student Service (Getting the true student ID): " +
                      error.response.status
                  );
                }
              });
          }
          this.setStudentProfile(data);
        })
        .catch((error) => {
          if (error.response.status) {
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Student using PEN): " +
                error.response.status
            );
          }
        });
    },
    loadAssessments() {
      AssessmentService.getStudentAssessment(this.pen)
        .then((response) => {
          this.setStudentAssessments(response.data);
        })
        .catch((error) => {
          if (error.response.status) {
            this.showNotification(
              "danger",
              "There was an error with the Assessment Service: " +
                error.response.status
            );
          }
        });
    },
    loadGraduationStatus(studentIdFromURL) {
      StudentService.getGraduationStatus(studentIdFromURL)
        .then((response) => {
          this.setStudentGradStatus(response.data);
        })
        .catch((error) => {
          if (error.response.status) {
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Graduation Status): " +
                error.response.status
            );
          }
        });
    },
    loadCareerPrograms(studentIdFromURL) {
      StudentService.getStudentCareerPrograms(studentIdFromURL)
        .then((response) => {
          this.setStudentCareerPrograms(response.data);
        })
        .catch((error) => {
          if (error.response.status) {
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Student Career Programs): " +
                error.response.status
            );
          }
        });
    },
    loadStudentCourseAchievements() {
      CourseService.getStudentCourseAchievements(this.pen)
        .then((response) => {
          this.setStudentCourses(response.data);
        })
        .catch((error) => {
          if (error.response.status) {
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Student Course Achievements): " +
                error.response.status
            );
          }
        });
    },
    loadStudentExamDetails() {
      CourseService.getStudentExamDetails(this.pen)
        .then((response) => {
          this.setStudentExams(response.data);
        })
        .catch((error) => {
          if (error.response.status) {
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Student Exam Details): " +
                error.response.status
            );
          }
        });
    },
    loadStudentNotes(studentIdFromURL) {
      StudentService.getStudentNotes(studentIdFromURL)
        .then((response) => {
          this.setStudentNotes(response.data);
        })
        .catch((error) => {
          if (error.response.status) {
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Student Notes): " +
                error.response.status
            );
          }
        });
    },
    loadStudentUngradReasons(studentIdFromURL) {
      StudentService.getStudentUngradReasons(studentIdFromURL)
        .then((response) => {
          this.setStudentUngradReasons(response.data);
        })
        .catch((error) => {
          if (error.response.status) {
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Undo Completion Reasons): " +
                error.response.status
            );
          }
        });
    },
  },
};
</script>

<style scoped>
.last-updated-date {
  position: absolute;
  top: 15px;
  right: 0;
}
.student-profile {
  padding-left: 25px;
  padding-right: 25px;
}
.grad-actions {
  position: absolute;
  right: 0;
  top: -100px;
}
.profile-info {
  font-size: 29px;
}
.profile-info button {
  font-size: 29px;
  box-shadow: none !important;
  padding: 0px;
  color: #313132;
}
.profile-info button.btn.btn-link:focus {
  border: none !important;
}
.close-record {
  float: right;
  text-align: center;
}

.close-record .dropdown-menu.show {
  left: -120px !important;
}

.tab-loading {
  color: green !important;
}

.student-info {
  margin: 10px 0px;
  float: left;
}

.card {
  border-radius: 0px !important;
}

header.card-header button {
  border-radius: 0px !important;
}

.no-underline {
  text-decoration: none;
}
.profile-name-data {
  word-break: break-all;
  max-width: 400px;
}
.profile-name label {
  font-size: 11px;
  float: left;
  clear: both;
  padding: 5px 0;
  margin-bottom: 0px;
  width: 100%;
  color: #036;
  border-bottom: 1px dotted #ccc;
}
.profile-name td {
  padding: 0px 10px;
}

#filter-dropdown {
  position: absolute;
  right: 0;
  top: 0;
}
.link-active {
  text-decoration: none;
  border-bottom: 3px solid black;
}
.record-timestamp {
  position: absolute;
  right: 50px;
}
.optionalProgramName {
  margin-top: 1rem;
}
</style>
