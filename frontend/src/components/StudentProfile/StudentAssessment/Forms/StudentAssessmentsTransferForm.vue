<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="80%">
      <v-card>
        <v-card-title
          ><v-row no-gutters>
            <div class="v-card-title">Transfer Student Assessments</div>
            <v-spacer />
            <v-btn
              icon="mdi-close"
              density="compact"
              rounded="sm"
              @click="close"
            />
          </v-row>
          <v-card-subtitle>
            {{ sourceStudentData.pen }} - {{ sourceStudentData.legalLastName }},
            {{ sourceStudentData.legalFirstName }}
            {{ sourceStudentData.legalMiddleNames }}
            <span v-if="targetStudentData?.pen">
              <v-icon>mdi-arrow-right</v-icon>
              {{ targetStudentData.pen }} -
              {{ targetStudentData.legalLastName }},
              {{ targetStudentData.legalFirstName }}
              {{ targetStudentData.legalMiddleNames }}
            </span>
          </v-card-subtitle>
        </v-card-title>
        <div class="progress-container" v-if="validationStep">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <v-stepper alt-labels show-actions v-model="step">
          <template v-slot:default>
            <v-stepper-header>
              <v-stepper-item
                title="Select&nbsp;Student"
                value="1"
                no-wrap
              ></v-stepper-item>
              <v-stepper-item title="Review" value="2"></v-stepper-item>
              <v-stepper-item title="Confirmation" value="3"></v-stepper-item>
            </v-stepper-header>
            <v-stepper-window>
              <v-stepper-window-item value="1">
                <StudentLookupByPen v-model:studentData="targetStudentData" />
                <v-row
                  v-if="sourceStudentData.pen === targetStudentData.pen"
                  no-gutters
                >
                  <v-col cols="12" class="mt-2">
                    <v-alert type="error" dense text>
                      <div class="mb-2">
                        Transferring assessments to the same student is not
                        allowed.
                      </div>
                    </v-alert>
                  </v-col>
                </v-row>
              </v-stepper-window-item>
              <v-stepper-window-item value="2">
                <div
                  style="
                    max-height: 60vh;
                    overflow-y: auto;
                    padding-right: 0.5rem;
                  "
                >
                  <AssessmentReviewAndReconcile
                    :sourceStudentData="sourceStudentData"
                    :targetStudentData="targetStudentData"
                    :sourceStudentAssessments="selectedAssessmentsToTransfer"
                    :targetStudentAssessments="targetStudentAssessments"
                    type="assessmentTransfer"
                  />
                </div>
              </v-stepper-window-item>
              <!-- Step 2 -->
              <v-stepper-window-item value="3">
                <div
                  style="
                    max-height: 60vh;
                    overflow-y: auto;
                    padding-right: 0.5rem;
                  "
                >
                  <v-expansion-panels multiple>
                    <v-expansion-panel
                      v-for="(
                        assessment, index
                      ) in transferStudentAssessmentResultsMessages"
                      :key="index"
                      elevation="0"
                      rounded="0"
                      style="background-color: transparent; border: none"
                    >
                      <v-alert
                        :type="
                          assessment.validationIssues.some(
                            (i) => i.validationIssueSeverityCode === 'ERROR'
                          )
                            ? 'error'
                            : 'success'
                        "
                        border="start"
                        variant="tonal"
                        density="compact"
                        class="my-1"
                      >
                        <template #prepend>
                          <v-icon
                            :color="
                              assessment.validationIssues.some(
                                (i) => i.validationIssueSeverityCode === 'ERROR'
                              )
                                ? 'error'
                                : 'success'
                            "
                            style="margin-top: 0.94rem"
                          >
                            {{
                              assessment.validationIssues.some(
                                (i) => i.validationIssueSeverityCode === "ERROR"
                              )
                                ? "mdi-close-circle"
                                : "mdi-check-circle"
                            }}
                          </v-icon>
                        </template>

                        <v-expansion-panel-title
                          class="d-flex align-center justify-space-between"
                        >
                          <div class="d-flex align-center flex-grow-1">
                            <span>
                              {{
                                assessment.originalAssessment.assessmentDetails
                                  .assessmentCode
                              }}
                              {{
                                assessment.originalAssessment.assessmentDetails
                                  .assessmentLevel
                              }}
                              –
                              {{
                                assessment.originalAssessment.assessmentSession
                              }}
                              {{
                                assessment.validationIssues.some(
                                  (i) =>
                                    i.validationIssueSeverityCode === "ERROR"
                                )
                                  ? " failed to add assessment"
                                  : ` transferred from student ${sourceStudentData.pen}`
                              }}
                            </span>

                            <v-spacer />

                            <span class="text-caption text-grey-darken-1">
                              {{
                                (() => {
                                  const errors =
                                    assessment.validationIssues.filter(
                                      (i) =>
                                        i.validationIssueSeverityCode ===
                                        "ERROR"
                                    ).length;
                                  const warnings =
                                    assessment.validationIssues.filter(
                                      (i) =>
                                        i.validationIssueSeverityCode ===
                                        "WARNING"
                                    ).length;

                                  const parts = [];
                                  if (errors > 0)
                                    parts.push(`${errors} error(s)`);
                                  if (warnings > 0)
                                    parts.push(`${warnings} warning(s)`);
                                  return parts.join(", ");
                                })()
                              }}
                            </span>
                          </div>

                          <template #actions>
                            <v-icon>mdi-chevron-down</v-icon>
                          </template>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <div v-if="assessment.validationIssues.length">
                            <div
                              v-for="(issue, i) in assessment.validationIssues"
                              :key="i"
                              class="pl-3 d-flex align-center mb-2"
                            >
                              <v-icon
                                :color="
                                  issue.validationIssueSeverityCode === 'ERROR'
                                    ? 'error'
                                    : 'warning'
                                "
                                class="me-2"
                                size="18"
                              >
                                {{
                                  issue.validationIssueSeverityCode === "ERROR"
                                    ? "mdi-alert-circle"
                                    : "mdi-alert"
                                }} </v-icon
                              >{{
                                issue.validationIssueSeverityCode === "ERROR"
                                  ? "Error"
                                  : "Warning: "
                              }}
                              {{ issue.validationIssueMessage }}
                            </div>
                          </div>
                          <div v-else>No validation issues.</div>
                        </v-expansion-panel-text>
                      </v-alert>
                    </v-expansion-panel>
                  </v-expansion-panels>
                  <v-alert
                    v-if="assessmentsToTransfer.length > 0"
                    type="info"
                    class="mb-4"
                    border="start"
                    elevation="2"
                    variant="tonal"
                  >
                    <div class="mb-2">
                      You are about to transfer the following assessments to
                      student
                      <strong
                        >{{ targetStudentData.pen }} -
                        {{ targetStudentData.legalLastName }},
                        {{ targetStudentData.legalFirstName }}</strong
                      >:
                    </div>
                    <pre>{{ assessmentsToTransfer }}</pre>
                    <v-row
                      no-gutters
                      v-for="assessment in assessmentsToTransfer"
                      :key="assessment.assessmentID + assessment.sessionDate"
                      >{{ assessment.assessmentID }}
                    </v-row>
                  </v-alert>
                </div>
              </v-stepper-window-item>
            </v-stepper-window>
          </template>
        </v-stepper>
        <v-card-actions>
          <v-btn
            v-if="step == 0"
            color="error"
            variant="outlined"
            class="text-none"
            @click="close"
            >Cancel</v-btn
          >
          <v-btn
            v-else-if="step <= 2"
            @click="step--"
            color="bcGovBlue"
            variant="outlined"
            :disabled="
              validationStep ||
              (transferStudentAssessmentResultsMessages &&
                transferStudentAssessmentResultsMessages.length > 0)
            "
            >Back</v-btn
          >
          <v-spacer />
          <v-btn
            v-if="
              step === 0 || (step === 1 && assessmentsToTransfer.length > 0)
            "
            @click="step++"
            color="bcGovBlue"
            variant="outlined"
            :disabled="
              validationStep ||
              (step === 1 && assessmentsToTransfer.length === 0) ||
              (step === 0 && v$.$invalid) ||
              sourceStudentData.pen === targetStudentData.pen
            "
            >Next</v-btn
          >
          <v-btn
            v-else-if="step == 2 && assessmentsToTransfer.length > 0"
            :disabled="validationStep"
            color="error"
            variant="flat"
            class="text-none"
            @click="submitForm"
          >
            Transfer Student Assessments
          </v-btn>
          <v-btn
            v-else-if="!validationStep"
            color="bcGovBlue"
            variant="flat"
            class="text-none"
            @click="close"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import { useStudentStore } from "@/store/modules/student";
import StudentLookupByPen from "@/components/StudentProfile/Forms/FormInputs/StudentLookupByPen.vue";
import AssessmentReviewAndReconcile from "@/components/StudentProfile/Forms/wizard/AssessmentReviewAndReconcile.vue";
import StudentService from "@/services/StudentService.js";
import StudentAssessmentService from "@/services/StudentAssessmentService.js";
import { mapState, mapActions } from "pinia";
import { toRaw } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "StudentAssessmentsTransferForm",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  components: {
    StudentLookupByPen,
    AssessmentReviewAndReconcile,
  },
  props: {
    selectedAssessmentsToTransfer: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      snackbarStore: useSnackbarStore(),
      step: 0,
      sourceStudentData: this.sourceStudent || {},
      targetStudentData: {},
      sourceStudentAssessments: this.selectedAssessmentsToTransfer || [],
      targetStudentAssessments: [],
      transferStudentAssessmentResultsMessages: [],
      validationStep: false,
    };
  },
  computed: {
    studentStore() {
      return useStudentStore();
    },
    sourceStudent() {
      return this.studentStore.student.profile;
    },
    ...mapState(useStudentStore, {
      assessmentsToTransfer: (state) => state.transfer.assessments,
    }),
  },
  watch: {
    targetStudentData: {
      immediate: true,
      async handler(newTargetStudentData) {
        if (newTargetStudentData && newTargetStudentData.studentID) {
          this.validationStep = true;

          console.log("ID " + newTargetStudentData.studentID);
          let response = await this.getStudentAssessments(
            newTargetStudentData.studentID
          );
          this.targetStudentAssessments = response || [];
          this.validationStep = false;
        }
      },
    },
    sourceStudent: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.sourceStudentData = newVal;
        }
      },
    },
  },
  validations: {
    targetStudentData: {
      studentID: { required },
      pen: { required },
    },
    sourceStudentData: {
      studentID: { required },
      pen: { required },
    },
  },
  methods: {
    ...mapActions(useStudentStore, [
      "addAssessmentsToTransfer",
      "removeAssessmentFromTransfer",
      "clearAssessmentsToTransfer",
      "transferStudentAssessments",
    ]),
    close() {
      this.dialog = false;
      this.clearForm();
      this.$emit("close");
    },
    clearForm() {
      this.step = 0;
      this.targetStudentData = {};
      this.sourceStudentAssessments = [];
      this.targetStudentAssessments = [];
      this.transferStudentAssessmentResultsMessages = [];
      this.validationStep = false;
    },
    openTransferStudentAssessmentsDialog() {
      this.transferStudentAssessmentResultsMessages = [];
      this.clearAssessmentsToTransfer();
      this.clearForm();
      this.dialog = true;
    },

    async getStudentAssessments(studentID) {
      if (!studentID) return [];
      try {
        let sort = {
          "assessmentEntity.assessmentTypeCode": "ASC",
        };
        let searchParams = {
          studentId: studentID,
        };
        const response =
          await StudentAssessmentService.getStudentAssessmentsBySearchCriteria(
            searchParams,
            sort,
            1,
            1000
          );

        if (response.data !== null) {
          return response.data.content;
        } else {
          console.error(
            "No student assessments found with the provided ID",
            studentID
          );
          return [];
        }
      } catch (err) {
        this.snackbarStore.showSnackbar(
          "There was an error fetching assessments: " +
            (err?.response?.status || "Unknown"),
          "error",
          5000
        );
        return [];
      }
    },
    async submitForm() {
      this.transferStudentAssessmentResultsMessages = [];

      const assessmentWithoutAssessmentDetailsAndUserInfo =
        this.assessmentsToTransfer.map(
          ({
            assessmentDetails,
            relatedAssessmentDetails,
            createUser,
            createDate,
            updateUser,
            updateDate,
            ...rest
          }) => ({ ...rest })
        );
      const transferStudentAssessmentsRequestBody = toRaw(
        assessmentWithoutAssessmentDetailsAndUserInfo
      );
      try {
        await this.transferStudentAssessments(
          this.sourceStudentData.studentID,
          this.targetStudentData.studentID,
          transferStudentAssessmentsRequestBody
        ).then((response) => {
          // Enrich response with entire original assessment object
          const enrichedResults = response.map((result) => {
            const original = this.assessmentsToTransfer.find(
              (assessment) => assessment.assessmentID === result.assessmentID
            );
            return {
              ...result,
              originalAssessment: original || {},
            };
          });
          this.transferStudentAssessmentResultsMessages = enrichedResults;
          this.clearAssessmentsToTransfer(); // optional
        });
      } catch (error) {
        console.error("Error transferring student assessments:", error);
        this.snackbarStore.showSnackbar(
          "Failed to transfer student assessments",
          "error",
          10000
        );
      }
    },
  },
};
</script>
<style scoped>
.progress-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999999999 !important;
}
</style>
