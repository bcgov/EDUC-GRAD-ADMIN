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
              <!-- Select Student -->
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
              <!-- Review -->
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
              <!-- Confirmation -->
              <v-stepper-window-item value="3">
                <div
                  style="
                    max-height: 60vh;
                    overflow-y: auto;
                    padding-right: 0.5rem;
                  "
                >
                  <v-expansion-panels>
                    <v-expansion-panel
                      v-for="(
                        item, index
                      ) in transferStudentAssessmentResultsMessages"
                      :key="index"
                      elevation="0"
                      rounded="0"
                      style="background-color: transparent; border: none"
                    >
                      <v-alert
                        type="error"
                        border="start"
                        variant="tonal"
                        density="compact"
                        class="my-1"
                      >
                        <span>Error transferring </span>
                        <span class="font-weight-bold">{{ getAssessmentDisplay(item.assessmentStudentID) }}: </span>
                        <span>{{ item.validationMessage }}</span>
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
                    <div
                      no-gutters
                      v-for="assessment in assessmentsToTransfer"
                      :key="assessment.assessmentID + assessment.sessionDate"
                    >
                      <v-col cols="12">
                        <v-row style="font-size: 1rem">
                          <v-col>
                            <strong>
                              {{
                                assessment.assessmentType?.label ||
                                assessment.assessmentTypeCode
                              }}
                              {{ assessment.sessionDate }}</strong
                            >
                            ({{ assessment.assessmentType.label }})
                          </v-col>
                        </v-row>
                        <v-row no-gutters style="font-size: 1rem">
                          <v-col class="mr-2" cols="auto">
                            <strong>Proficiency Score: </strong>
                            <span v-if="assessment.proficiencyScore">{{
                              assessment.proficiencyScore
                            }}</span>
                            <span v-else><i>null</i></span>
                          </v-col>
                          <v-col class="mr-2" cols="auto">
                            <strong>Special Case: </strong>
                            <span v-if="assessment.provincialSpecialCaseCode">
                              {{
                                getProvincialSpecialCaseDisplayName(
                                  assessment.provincialSpecialCaseCode
                                )
                              }}
                            </span>
                            <span v-else><i>null</i></span>
                          </v-col>
                          <v-col class="mr-2" cols="auto">
                            <strong>Wrote Flag: </strong>
                            <span v-if="assessment.wroteFlag">{{
                              assessment.wroteFlag ? "Y" : "N"
                            }}</span>
                            <span v-else><i>null</i></span>
                          </v-col>
                          <v-col class="mr-2" cols="auto">
                            <strong>Exceeds Writes: </strong>
                            <span>{{
                              assessment.numberOfAttempts >= 3 ? "Y" : "N"
                            }}</span>
                          </v-col>
                          <v-col class="mr-2" cols="auto">
                            <strong>Assessment Center: </strong>
                            <span v-if="assessment.assessmentCenterSchoolID">
                              {{
                                getAssessmentCenterSchoolDisplayName(
                                  assessment.assessmentCenterSchoolID
                                )
                              }}
                            </span>
                            <span v-else><i>null</i></span>
                          </v-col>
                        </v-row>
                      </v-col>
                    </div>
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
            :loading="loadingTransfer"
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
import { useAppStore } from "@/store/modules/app";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { useStudentStore } from "@/store/modules/student";
import StudentLookupByPen from "@/components/StudentProfile/Forms/FormInputs/StudentLookupByPen.vue";
import AssessmentReviewAndReconcile from "@/components/StudentProfile/Forms/wizard/AssessmentReviewAndReconcile.vue";
import StudentAssessmentService from "@/services/StudentAssessmentService.js";
import { mapState, mapActions } from "pinia";
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
      loadingTransfer: false
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
    ...mapState(useAppStore, {
      getSchoolsList: "getSchoolsList",
      getStudentAssessmentProvincialSpecialCaseCodes:
        "getStudentAssessmentProvincialSpecialCaseCodes",
      assessmentTypeCodesMap: "assessmentTypeCodesMap",
    }),
  },
  watch: {
    targetStudentData: {
      immediate: true,
      async handler(newTargetStudentData) {
        if (newTargetStudentData && newTargetStudentData.studentID) {
          this.validationStep = true;
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
    getAssessmentCenterSchoolDisplayName(schoolId) {
      const school = this.getSchoolsList.find(
        (school) => school.schoolId === schoolId
      );
      return school ? `${school.mincode} - ${school.displayName}` : "";
    },
    getProvincialSpecialCaseDisplayName(code) {
      const specialCase =
        this.getStudentAssessmentProvincialSpecialCaseCodes.find(
          (specialCaseCode) =>
            specialCaseCode.provincialSpecialCaseCode === code
        );
      return specialCase ? specialCase.label : "";
    },
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
          // eslint-disable-next-line
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
      const studentAssessmentIDs = this.assessmentsToTransfer.map(x => x.assessmentStudentID);
      this.loadingTransfer = true;

      try {
        await this.transferStudentAssessments(
          this.sourceStudentData.studentID,
          this.targetStudentData.studentID,
            studentAssessmentIDs
        ).then((response) => {
          if(!response?.length) {
            this.snackbarStore.showSnackbar(
                "Successfully transferred assessments",
                "success",
                5000);
            this.$emit("refresh-sessions"); // Notify parent to refresh sessions
            this.close();
          } else {
            this.transferStudentAssessmentResultsMessages = response;
          }
          this.loadingTransfer = false;
        });
      } catch (error) {
        this.loadingTransfer = false;
        console.error("Error transferring student assessments:", error);
        this.snackbarStore.showSnackbar(
          "Failed to transfer student assessments",
          "error",
          10000
        );
      }
    },
    getAssessmentDisplay(assessmentStudentID) {
      const assessmentStudent = this.assessmentsToTransfer.find(x => x.assessmentStudentID === assessmentStudentID);
      if(!assessmentStudent) {
        return null;
      }
      return assessmentStudent.assessmentType?.label + " " + assessmentStudent.sessionDate;
    }
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
