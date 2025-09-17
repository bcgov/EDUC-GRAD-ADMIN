<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="80%">
      <template v-slot:activator="{ props }">
        <slot name="activator" v-bind="props">
          <v-btn
            v-if="
              !assessmentBatchDelete &&
              hasPermissions('STUDENT', 'studentAssessmentUpdate')
            "
            :disabled="
              !hasPermissions('STUDENT', 'studentAssessmentUpdate') ||
              studentStatus == 'MER'
            "
            v-bind="props"
            color="error"
            icon="mdi-delete-forever"
            density="compact"
            variant="text"
          />
        </slot>
      </template>

      <v-card>
        <v-card-title>
          <v-row no-gutters>
            <div class="v-card-title">Delete Student Assessments</div>
            <v-spacer />
            <v-btn
              icon="mdi-close"
              density="compact"
              rounded="sm"
              variant="outlined"
              color="error"
              class="mt-2"
              @click="close"
            />
          </v-row>
          <v-card-subtitle>{{
            studentStore.formattedStudentName
          }}</v-card-subtitle>
        </v-card-title>
        <v-card-text>
          <StudentAssessmentAlert :studentStatus="studentStatus" />
          <!-- Warnings & Info: These will be deleted -->
          <div
            v-if="
              selectedAssessmentsWithValidations.warning.length ||
              selectedAssessmentsWithValidations.info.length
            "
          >
            <h4 class="font-weight-bold my-2">
              The following assessments will be deleted
            </h4>

            <div
              v-for="(assessment, index) in [
                ...selectedAssessmentsWithValidations.warning,
                ...selectedAssessmentsWithValidations.info,
              ]"
              :key="'deletable-' + index"
              class="mb-3"
            >
              <v-alert
                :type="assessment.validationType"
                border="start"
                variant="tonal"
                density="compact"
                icon="mdi-alert-circle"
              >
                <v-row no-gutters compact>
                  <v-col cols="12" v-if="assessment.validationMessage">
                    <div class="d-flex align-center mb-1">
                      <span>{{ assessment.validationMessage }}</span>
                    </div>
                  </v-col>
                </v-row>
                <v-row class="px-3 py-3" no-gutters>
                  <v-col cols="12">
                    <div style="font-size: 1rem">
                      <!--<AssessmentReview :shouldRemoveGutters="false" :assessment="assessment" />-->
                    </div>
                  </v-col>
                </v-row>
              </v-alert>
            </div>
          </div>

          <div v-if="selectedAssessmentsWithValidations.error.length">
            <h4 class="font-weight-bold my-2">
              The following assessments will NOT be deleted
            </h4>
            <div
              v-for="(
                assessment, index
              ) in selectedAssessmentsWithValidations.error"
              :key="'error-' + index"
              class="mb-3"
            >
              <v-alert
                type="error"
                border="start"
                variant="tonal"
                density="compact"
                icon="mdi-alert-circle"
              >
                <v-row no-gutters compact>
                  <v-col cols="12">
                    <div class="d-flex align-center mb-1">
                      <span>{{ assessment.validationMessage }}</span>
                    </div>
                  </v-col>
                </v-row>
                <v-row class="px-3 py-3" no-gutters>
                  <v-col cols="12">
                    <div style="font-size: 1rem">
                      <!--<AssessmentReview :shouldRemoveGutters="false" :assessment="assessment" />-->
                    </div>
                  </v-col>
                </v-row>
              </v-alert>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            variant="outlined"
            class="text-none"
            density="default"
            @click="close"
          >
            {{ hasAssessmentsToDelete ? "Cancel" : "Close" }}
          </v-btn>
          <v-spacer />
          <v-btn
            v-if="hasAssessmentsToDelete"
            color="error"
            variant="flat"
            class="text-none"
            density="default"
            :disabled="validationStep"
            @click="confirmDelete"
          >
            Delete Assessments<span
              v-if="selectedAssessmentsToDelete.length > 1"
              >s</span
            >
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import { useStudentStore } from "@/store/modules/student";
import { useAccessStore } from "@/store/modules/access";
import StudentAssessmentAlert from "@/components/StudentProfile/StudentAssessment/Forms/StudentAssessmentAlert.vue";

export default {
  name: "StudentAssessmentsDeleteForm",
  components: {
    StudentAssessmentAlert: StudentAssessmentAlert,
  },
  props: {
    selectedAssessmentsToDelete: {
      type: Array,
      required: true,
    },
    assessmentBatchDelete: {
      type: Boolean,
      default: false,
    },
    studentId: {
      type: [String, Number],
      default: null,
    },
  },
  created() {},
  data() {
    return {
      dialog: false,
      snackbarStore: useSnackbarStore(),
      validationStep: false,
    };
  },
  computed: {
    studentStore() {
      return useStudentStore();
    },
    accessStore() {
      return useAccessStore();
    },
    studentPen() {
      return this.studentStore.pen;
    },
    studentStatus() {
      return this.studentStore.student.profile.studentStatus;
    },
    requirementsMet() {
      return this.studentStore.student.gradStatus.studentGradData;
    },

    selectedAssessmentsWithWarnings() {
      return this.selectedAssessmentsWithValidations.filter(
        (assessment) =>
          !assessment.validationIssues ||
          assessment.validationIssues.length === 0 ||
          (assessment.validationIssues.some(
            (issue) => issue.type === "warning"
          ) &&
            !assessment.validationIssues.some(
              (issue) => issue.type === "error"
            ))
      );
    },

    assessmentsWithNoErrorsOrWarnings() {
      return this.selectedAssessmentsWithValidations.filter(
        (assessment) =>
          !assessment.validationIssues ||
          assessment.validationIssues.length === 0
      );
    },

    hasAssessmentsToDelete() {
      const { info, warning } = this.selectedAssessmentsWithValidations;
      return info.length > 0 || warning.length > 0;
    },
    selectedAssessmentsWithValidations() {
      const grouped = {
        error: [],
        warning: [],
        info: [],
      };

      this.selectedAssessmentsToDelete.forEach((assessment) => {
        let validationType = "info";
        let validationMessage = "";

        grouped[validationType].push({
          ...assessment,
          validationType,
          validationMessage,
        });
      });

      return grouped;
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.validationStep = false;
      this.$emit("close");
    },
    async confirmDelete() {
      try {
        this.validationStep = true;
        const request = this.selectedAssessmentsToDelete.map((item) => item.id);
        const response = await this.studentStore.deleteStudentAssessments(
          request
        );

        const notDeleted = response.data
          .filter((assessment) =>
            assessment.validationIssues?.some(
              (issue) => issue.validationIssueSeverityCode === "ERROR"
            )
          )
          .map((assessment) => {
            const errorMessages = assessment.validationIssues
              .filter((issue) => issue.validationIssueSeverityCode === "ERROR")
              .map((issue) => issue.validationIssueMessage)
              .join("; ");

            return `${assessment.assessmentTypeCode}: ${errorMessages}`;
          })
          .join("\n");

        const deleted = response.data
          .filter(
            (assessment) =>
              !assessment.validationIssues?.some(
                (issue) => issue.validationIssueSeverityCode === "ERROR"
              )
          )
          .map((assessment) => `${assessment.assessmentTypeCode}`)
          .join(", ");

        // Format snackbar message
        let message = "";
        if (deleted) {
          message += `Deleted: ${deleted}`;
        }
        if (notDeleted) {
          if (deleted) message += "\n\n"; // spacing between groups
          message += `Not Deleted:\n${notDeleted}`;
        }

        this.snackbarStore.showSnackbar(
          message,
          "success",
          10000,
          "Student assessment"
        );

        this.close();
      } catch (error) {
        console.error("Failed to delete student assessments:", error);
      } finally {
        this.validationStep = false;
      }
    },
    hasPermissions(group, permission) {
      return this.accessStore.hasPermissions(group, permission);
    },
    openDeleteStudentAssessmentDialog() {
      this.dialog = true;
    },
  },
};
</script>
