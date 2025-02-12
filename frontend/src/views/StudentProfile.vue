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
                class="float-right admin-actions text-none"
                prepend-icon="mdi-school"
                append-icon="mdi-menu-down"
                color="primary"
              >
                Transcripts & TVRs</v-btn
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
                v-on:click="showUndoCompletionDialog = true"
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
        <v-card class="p-0" :disabled="tabLoading">
          <v-window v-model="tab">
            <v-window-item value="gradStatusTab">
              <v-tabs v-model="selectedTab" bg-color="bcGovLightGrey">
                <v-tab value="GRAD" class="text-none">GRAD</v-tab>
                <v-tab value="Courses" class="text-none"
                  >Courses ({{ courses.length }})</v-tab
                >
                <v-tab value="Assessments" class="text-none"
                  >Assessments ({{ assessments.length }})</v-tab
                >
                <v-tab value="Exams" class="text-none"
                  >Exams Details ({{ exams.length }})</v-tab
                >
                <v-tab value="Optional" class="text-none"
                  >Optional Programs ({{ optionalPrograms.length }})</v-tab
                >
                <v-tab value="Audit" class="text-none">Audit History</v-tab>
                <v-tab value="Notes" class="text-none"
                  >Notes ({{ studentNotes.length }})
                </v-tab>
                <v-tab value="Undo Completion Reasons" class="text-none"
                  >Undo Completion Reasons ({{
                    studentUngradReasons.length
                  }})</v-tab
                >
              </v-tabs>
              <v-card-text>
                <v-window v-model="selectedTab">
                  <v-window-item value="GRAD" data-cy="grad-window-item">
                    <v-tabs v-model="selectedSubTab" color="primary">
                      <v-tab value="gradStatusTab" class="text-none"
                        ><v-chip
                          class="text-none"
                          color="primary"
                          :variant="
                            selectedSubTab == 'gradStatusTab'
                              ? 'flat'
                              : 'outlined'
                          "
                          >GRAD Status</v-chip
                        ></v-tab
                      >
                      <v-tab value="requirementDetailsTab" class="text-none"
                        ><v-chip
                          class="text-none"
                          color="primary"
                          :variant="
                            selectedSubTab == 'requirementDetailsTab'
                              ? 'flat'
                              : 'outlined'
                          "
                          >Requirement Details</v-chip
                        ></v-tab
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
                  <v-window-item value="Courses" data-cy="courses-window-item">
                    <v-progress-circular
                      v-if="tabLoading"
                      indeterminate
                      color="green"
                    >
                    </v-progress-circular>
                    <StudentCourses></StudentCourses
                  ></v-window-item>
                  <v-window-item value="Assessments" data-cy="assessments-window-item">
                    <v-progress-circular
                      v-if="tabLoading"
                      indeterminate
                      color="green"
                    >
                    </v-progress-circular>
                    <StudentAssessments
                  /></v-window-item>
                  <v-window-item value="Exams" data-cy="exams-window-item">
                    <v-progress-circular
                      v-if="tabLoading"
                      indeterminate
                      color="green"
                    >
                    </v-progress-circular>
                    <StudentExams />
                  </v-window-item>
                  <v-window-item value="Optional" data-cy="optional-window-item">
                    <v-progress-circular
                      v-if="tabLoading"
                      indeterminate
                      color="green"
                    >
                    </v-progress-circular>
                    <StudentOptionalPrograms></StudentOptionalPrograms
                  ></v-window-item>
                  <v-window-item value="Audit" data-cy="audit-window-item">
                    <v-progress-circular
                      v-if="tabLoading"
                      indeterminate
                      color="green"
                    >
                    </v-progress-circular>
                    <div>
                      <StudentAuditHistory v-if="auditTab == 'studentAudit'" />
                    </div>
                  </v-window-item>
                  <v-window-item value="Notes">
                    <v-progress-circular
                      v-if="tabLoading"
                      indeterminate
                      color="green"
                    >
                    </v-progress-circular>
                    <StudentNotes></StudentNotes>
                  </v-window-item>
                  <v-window-item value="Undo Completion Reasons" data-cy="undo-window-item">
                    <v-progress-circular
                      v-if="tabLoading"
                      indeterminate
                      color="green"
                    >
                    </v-progress-circular>

                    <StudentUndoCompletionReasons></StudentUndoCompletionReasons>
                  </v-window-item>
                </v-window>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>
      </div>
    </div>
    <!-- projectedGradStatusWithFinalMarksDialog Modal -->
    <v-dialog
      v-model="projectedGradStatusWithFinalMarksDialog"
      max-width="1200px"
    >
      <v-card>
        <v-card-title class="text-h5">
          Projected Grad Status with Final Marks
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="projectedGradStatus && projectedGradStatus?.gradStatus"
            type="info"
            dense
            outlined
          >
            {{ projectedGradStatus?.gradMessage }}
          </v-alert>
          <v-row v-if="projectedGradStatus && projectedGradStatus?.gradStatus">
            <v-col cols="6">
              <v-card>
                <v-card-title>Requirements met</v-card-title>
                <v-card-text v-if="projectedGradStatus?.requirementsMet">
                  <v-data-table
                    dense
                    :items="projectedGradStatus?.requirementsMet"
                    :headers="requirementsMetFields"
                    class="elevation-1"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card>
                <v-card-title>Noncompletion reasons</v-card-title>
                <v-card-text v-if="projectedGradStatus?.nonGradReasons">
                  <v-data-table
                    dense
                    :items="projectedGradStatus?.nonGradReasons"
                    :headers="noncompletionReasonsFields"
                    class="elevation-1"
                  />
                </v-card-text>
                <v-card-text v-else>
                  All program requirements have been met
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <div v-if="projectedOptionalGradStatus">
            <div
              v-for="optionalProgram in projectedOptionalGradStatus"
              :key="optionalProgram?.optionalProgramCode"
            >
              <h3 class="optionalProgramName">
                {{ optionalProgram?.optionalProgramName }}
              </h3>
              <v-row>
                <v-col cols="6">
                  <v-card>
                    <v-card-title>Requirements met</v-card-title>
                    <v-card-text
                      v-if="
                        optionalProgram?.studentOptionalProgramData
                          ?.optionalRequirementsMet
                      "
                    >
                      <v-data-table
                        dense
                        :items="
                          optionalProgram?.studentOptionalProgramData
                            ?.optionalRequirementsMet
                        "
                        :headers="[
                          { text: 'Rule', value: 'rule', class: 'px-0 py-2' },
                          {
                            text: 'Description',
                            value: 'description',
                            class: 'px-0 py-2',
                          },
                        ]"
                        class="elevation-1"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card>
                    <v-card-title>Requirements not met</v-card-title>
                    <v-card-text
                      v-if="
                        optionalProgram?.studentOptionalProgramData
                          ?.optionalNonGradReasons
                      "
                    >
                      <v-data-table
                        dense
                        :items="
                          optionalProgram?.studentOptionalProgramData
                            ?.optionalNonGradReasons
                        "
                        class="elevation-1"
                      />
                    </v-card-text>
                    <v-card-text v-else>
                      All requirements have been met
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="projectedGradStatusWithFinalMarksDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Projected Grad status and registrations Modal -->
    <v-dialog v-model="projectedGradStatusDialog" max-width="1200px">
      <v-card>
        <v-card-title class="text-h5">
          Projected Grad Status with Final Marks and Registrations
        </v-card-title>

        <v-card-text>
          <v-alert type="info" outlined>
            {{ projectedGradStatusWithRegistrations?.gradMessage }}
          </v-alert>

          <v-row
            v-if="
              projectedGradStatusWithRegistrations &&
              projectedGradStatusWithRegistrations?.gradStatus
            "
          >
            <v-col cols="6">
              <v-card>
                <v-card-title>Requirements met</v-card-title>
                <v-card-text
                  v-if="projectedGradStatusWithRegistrations?.requirementsMet"
                >
                  <v-data-table
                    dense
                    :items="
                      projectedGradStatusWithRegistrations?.requirementsMet
                    "
                    :headers="requirementsMetFields"
                    class="elevation-1"
                  >
                    <template v-slot:item.rule="{ item }">
                      <div
                        :style="
                          item?.projected
                            ? 'background-color: #eaf2fa; width: 100%'
                            : ''
                        "
                      >
                        {{ item?.rule }}
                      </div>
                    </template>
                    <template v-slot:item.description="{ item }">
                      <div
                        :style="
                          item?.projected
                            ? 'background-color: #eaf2fa; width: 100%'
                            : ''
                        "
                      >
                        {{ item?.description }} (Projected)
                      </div>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card>
                <v-card-title>Noncompletion reasons</v-card-title>
                <v-card-text
                  v-if="projectedGradStatusWithRegistrations?.nonGradReasons"
                >
                  <v-data-table
                    dense
                    :items="
                      projectedGradStatusWithRegistrations?.nonGradReasons
                    "
                    :headers="noncompletionReasonsFields"
                    class="elevation-1"
                  />
                </v-card-text>
                <v-card-text v-else>
                  All program requirements have been met
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <div v-if="projectedOptionalGradStatus">
            <div
              v-for="optionalProgram in projectedOptionalGradStatus"
              :key="optionalProgram?.optionalProgramCode"
            >
              <h3 class="optionalProgramName">
                {{ optionalProgram?.optionalProgramName }}
              </h3>
              <v-row>
                <v-col cols="6">
                  <v-card>
                    <v-card-title>Requirements met</v-card-title>
                    <v-card-text
                      v-if="
                        optionalProgram?.studentOptionalProgramData
                          ?.optionalRequirementsMet
                      "
                    >
                      <v-data-table
                        dense
                        :items="
                          optionalProgram?.studentOptionalProgramData
                            ?.optionalRequirementsMet
                        "
                        :headers="[
                          { text: 'Rule', value: 'rule', class: 'px-0 py-2' },
                          {
                            text: 'Description',
                            value: 'description',
                            class: 'px-0 py-2',
                          },
                        ]"
                        class="elevation-1"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card>
                    <v-card-title>Requirements not met</v-card-title>
                    <v-card-text
                      v-if="
                        optionalProgram?.studentOptionalProgramData
                          ?.optionalNonGradReasons
                      "
                    >
                      <v-data-table
                        dense
                        :items="
                          optionalProgram.studentOptionalProgramData
                            .optionalNonGradReasons
                        "
                        class="elevation-1"
                      />
                    </v-card-text>
                    <v-card-text v-else
                      >All requirements have been met</v-card-text
                    >
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="projectedGradStatusDialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Undo Completion Modal -->
    <v-dialog max-width="600px" v-model="showUndoCompletionDialog">
      <v-card>
        <v-card-title class="text-h5">Undo Completion</v-card-title>
        <v-card-text>
          <p>Undo Completion Reason</p>
          <v-select
            v-model="studentUngradReasonForm.selected"
            :items="ungradReasons"
            item-title="label"
            item-value="code"
            label="Select an Undo Completion Reason"
          ></v-select>

          <div class="mt-2 mb-4" v-if="studentUngradReasonForm.selected">
            <v-alert
              type="info"
              variant="tonal"
              border="start"
              v-if="ungradReasons.length > 0"
            >
              {{
                ungradReasons.find(
                  (element) => element.code === studentUngradReasonForm.selected
                ).description
              }}
            </v-alert>
          </div>

          <div v-if="studentUngradReasonForm.selected === 'OTH'" class="mt-3">
            <v-textarea
              v-model="studentUngradReasonForm.description"
              label="Reason for running undo completion on this student..."
              :rules="[(v) => !!v || 'Description is required']"
            ></v-textarea>
          </div>

          <v-checkbox
            v-if="studentUngradReasonForm.selected"
            v-model="studentUngradReasonForm.confirm"
            label="I confirm that I am authorized to undo completion for this student"
          ></v-checkbox>
        </v-card-text>

        <v-card-actions class="mx-4 mb-4">
          <v-btn
            color="bcGovBlue"
            variant="outlined"
            @click="closeStudentUndoCompletionDialog"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            class="text-none"
            color="error"
            variant="flat"
            :disabled="v$.studentUngradReasonForm.$invalid"
            @click="submitStudentUndoCompletion"
          >
            Undo Completion
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
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
import StudentUndoCompletionReasons from "@/components/StudentProfile/StudentUndoCompletionReasons.vue";
import StudentNotes from "@/components/StudentProfile/AuditHistory/StudentNotes.vue";
import DisplayTable from "@/components/DisplayTable.vue";

// pinia store
import { useSnackbarStore } from "@/store/modules/snackbar";
import { useStudentStore } from "../store/modules/student";
import { useAppStore } from "../store/modules/app";
import { useAccessStore } from "../store/modules/access";
import { mapState, mapActions } from "pinia";

// vuelidate
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, sameAs } from "@vuelidate/validators";

export default {
  name: "studentProfile",
  setup() {
    const studentStore = useStudentStore();
    const appStore = useAppStore();
    const accessStore = useAccessStore();
    return { appStore, studentStore, accessStore, v$: useVuelidate() };
  },
  validations() {
    return {
      studentUngradReasonForm: {
        selected: { required },
        description: {
          required: requiredIf(function () {
            return (
              !!this.studentUngradReasonForm &&
              this.studentUngradReasonForm.selected == "OTH"
            );
          }),
        },
        confirm: { sameAsTrue: sameAs(true) },
      },
    };
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
          this.snackbarStore.showSnackbar(
            "There was an error: " + error.response.status,
            "error",
            5000
          );
        }
      });
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
    StudentUndoCompletionReasons: StudentUndoCompletionReasons,
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
      disableScreen: false,
      snackbarStore: useSnackbarStore(),
      projectedGradStatusWithFinalMarksDialog: false,
      projectedGradStatusDialog: false,
      tab: null,
      pen: "",
      optionalProgramTab: "",
      projectedOptionalGradStatus: "",
      nonGradReasons: "",
      projectedrequirementsMet: "",
      studentUngradReasonForm: {
        selected: null,
        description: null,
        confirm: false,
      },
      // studentUngradReasonSelected: "",
      // studentUngradReasonDescription: "",
      // confirmStudentUndoCompletion: false,
      selectedSubTab: "gradStatus",
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
      showUndoCompletionDialog: false,
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
      this.studentUngradReasonForm.confirm = false; //clear confirm if they change options
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
          this.snackbarStore.showSnackbar(
            "There was an error: " + error.response.status,
            "error",
            5000
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
    submitStudentUndoCompletion() {
      this.ungraduateStudent();
      this.closeStudentUndoCompletionDialog();
    },
    closeStudentUndoCompletionDialog() {
      this.resetUndoCompletionValues();
      this.showUndoCompletionDialog = false;
    },
    ungraduateStudent() {
      this.tabLoading = true;
      this.studentUngradReasonForm.confirm = "";
      let ungradCode = this.studentUngradReasonForm.selected;
      let ungradDesc = this.studentUngradReasonForm.description;
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
                this.snackbarStore.showSnackbar(
                  "There was an error: " + error.response.status,
                  "error",
                  5000
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
                this.snackbarStore.showSnackbar(
                  "There was an error: " + error.response.status,
                  "error",
                  5000
                );
              }
            });
          this.loadStudentReportsAndCertificates();
        })
        .catch((error) => {
          this.tabLoading = false;
          this.snackbarStore.showSnackbar(
            "There was an error: " + error.response.status,
            "error",
            5000
          );
        });
    },
    resetUndoCompletionValues() {
      this.studentUngradReasonForm.selected = null;
      this.studentUngradReasonForm.description = null;
      this.studentUngradReasonForm.confirm = false;
    },
    reloadGradStatus() {
      StudentService.getGraduationStatus(this.studentId)
        .then((res) => {
          this.setStudentGradStatus(res.data);
        })
        .catch((error) => {
          if (error.res.status) {
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.res.status,
              "error",
              5000
            );
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
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.response.status,
              "error",
              5000
            );
          }
        });
    },
    updateStudentReports() {
      this.disableScreen = true;
      this.selectedTab = 0;
      this.tabLoading = true;
      GraduationService.updateStudentReports(this.studentId)
        .then(() => {
          this.loadStudentOptionalPrograms(this.studentId);
          this.loadStudentHistory(this.studentId);
          this.loadStudentOptionalProgramHistory(this.studentId);

          this.loadStudentReportsAndCertificates();
          StudentService.getGraduationStatus(this.studentId)
            .then((res) => {
              this.setStudentGradStatus(res.data);
              this.tabLoading = false;
            })
            .catch((error) => {
              this.tabLoading = false;
              if (error.res.status) {
                this.snackbarStore.showSnackbar(
                  "There was an error: " + error.res.status,
                  "error",
                  5000
                );
              }
            });
        })
        .catch((error) => {
          if (error.response.status) {
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.response.status,
              "error",
              5000
            );
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
          this.projectedGradStatusWithFinalMarksDialog = true;
          this.tabLoading = false;
          this.loadStudentReportsAndCertificates();
        })
        .catch((error) => {
          this.tabLoading = false;
          if (error.response.status) {
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.response.status,
              "error",
              5000
            );
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
          this.projectedGradStatusDialog = true;

          this.tabLoading = false;
          this.loadStudentReportsAndCertificates();
        })
        .catch((error) => {
          if (error.response.status) {
            this.tabLoading = false;
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.response.status,
              "error",
              5000
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
                  this.snackbarStore.showSnackbar(
                    "There was an error: " + error.response.status,
                    "error",
                    5000
                  );
                }
              });
          }
          this.setStudentProfile(data);
        })
        .catch((error) => {
          if (error.response.status) {
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.response.status,
              "error",
              5000
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
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.response.status,
              "error",
              5000
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
          if (error.response) {
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.response,
              "error",
              5000
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
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.response.status,
              "error",
              5000
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
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.response.status,
              "error",
              5000
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
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.response.status,
              "error",
              5000
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
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.response.status,
              "error",
              5000
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
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.response.status,
              "error",
              5000
            );
          }
        });
    },
  },
};
</script>

<style scoped>
.admin-actions {
  top: 50px;
}
.last-updated-date {
  position: absolute;
  top: -1px;
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
