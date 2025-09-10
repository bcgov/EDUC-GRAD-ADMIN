<template>
  <div>
    <v-alert v-if="!studentAssessments?.length" class="container">
      This student does not have any assessments.
    </v-alert>
    <div class="col-12 px-3" v-if="allowUpdateStudentAssessments">
      <div class="float-left grad-actions">
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              text
              v-bind="props"
              :disabled="selected.length === 0"
              id="actions"
              right
              class="float-right admin-actions text-none"
              prepend-icon="mdi-select-multiple"
              append-icon="mdi-menu-down"
              color="error"
              >Bulk Actions</v-btn
            >
          </template>
          <v-list>
            <v-list-item
              v-if="hasPermissions('STUDENT', 'studentAssessmentUpdate')"
              :disabled="selected.length === 0"
              @click="showAssessmentTransfer"
            >
              <v-icon color="error">mdi-transfer</v-icon> Transfer Selected
              Assessments
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <v-row no-gutters>
      <v-spacer />
      <AddStudentAssessment
        v-if="studentStatus !== 'MER'"
        :student-id="studentId"
        :assessment-sessions="assessmentSessions"
        :is-loading-sessions="isLoadingSessions"
        @saved="loadStudentAssessments"
      />
      <StudentAssessmentsTransferForm
        @close="clearSelected"
        :selectedAssessmentsToTransfer="selected"
        ref="assessmentTransferFormRef"
      >
      </StudentAssessmentsTransferForm>
    </v-row>

    <v-data-table
      v-if="processedAssessments"
      :items="processedAssessments"
      :headers="fields"
      :loading="isLoadingAssessments"
      showFilter="true"
      hide-default-footer
      :show-select="allowUpdateStudentAssessments"
      v-model="selected"
      :item-value="(item) => item"
    >
      <template
        v-slot:item.data-table-expand="{
          item,
          internalItem,
          toggleExpand,
          isExpanded,
        }"
      >
        <td v-if="item.hasMoreInfo === 'Y'">
          <v-btn
            variant="text"
            density="comfortable"
            @click="toggleExpand(internalItem)"
            class="v-data-table__expand-icon"
            :class="{ 'v-data-table__expand-icon--active': isExpanded }"
            :icon="
              isExpanded(internalItem)
                ? 'mdi-chevron-down'
                : 'mdi-chevron-right'
            "
          >
          </v-btn>
        </td>
      </template>
      <template v-slot:item.assessmentName="{ item }">
        <v-btn
          color="primary"
          @click="openAssessmentDetails(item)"
          :text="item.assessmentType?.label || item.assessmentTypeCode"
          variant="text"
          class="text-left v-btn-link assessment-name-btn"
          :disabled="!isAssessmentSelectable(item)"
        />
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <ul v-if="item.hasMoreInfo === true">
              <li v-if="item.mincodeAssessment">
                <strong>Assessment Centre:</strong>
                {{ item.mincodeAssessment }}
              </li>
              <li v-if="item.mincodeAssessmentName">
                <strong>Assessment Centre Name:</strong>
                {{ item.mincodeAssessmentName }}
              </li>
            </ul>
          </td>
        </tr>
      </template>
      <template v-slot:item.edit="{ item }">
        <v-tooltip
          v-if="!canDeleteStudentAssessment(item)"
          text="You do not have permission to edit this provincial specialty code"
        >
          <template v-slot:activator="{ props }">
            <div v-bind="props">
              <v-btn
                variant="text"
                icon="mdi-pencil"
                :disabled="!canDeleteStudentAssessment(item)"
                @click="remove(item)"
              >
              </v-btn>
            </div>
          </template>
        </v-tooltip>
        <v-btn
          v-else
          color="success"
          variant="text"
          icon="mdi-pencil"
          @click="edit(item)"
        >
        </v-btn>
      </template>
      <template v-slot:item.delete="{ item }">
        <v-tooltip
          v-if="!canDeleteStudentAssessment(item)"
          text="You do not have permission to delete this provincial specialty code"
        >
          <template v-slot:activator="{ props }">
            <div v-bind="props">
              <v-btn
                variant="text"
                color="error"
                icon="mdi-delete-forever"
                :disabled="!canDeleteStudentAssessment(item)"
                @click="remove(item)"
              >
              </v-btn>
            </div>
          </template>
        </v-tooltip>
        <v-btn
          v-else
          variant="text"
          color="error"
          icon="mdi-delete-forever"
          :disabled="!canDeleteStudentAssessment(item)"
          @click="remove(item)"
        >
        </v-btn>
      </template>
    </v-data-table>
    <EditStudentAssessment
      v-model="showEditDialog"
      :assessment-item="selectedAssessment"
      :assessment-sessions="assessmentSessions"
      @saved="loadStudentAssessments"
    />
    <v-dialog v-model="showDeleteDialog" max-width="600">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          <v-alert
            v-if="
              studentToDelete?.provincialSpecialCaseCode &&
              canDeleteStudentAssessment(studentToDelete)
            "
            type="warning"
            border="start"
            variant="tonal"
            density="compact"
          >
            This student assessment has the provincial special case code
            <i>{{
              this.getProvincialSpecialCaseDisplayName(
                studentToDelete?.provincialSpecialCaseCode
              )
            }}</i>
          </v-alert>
          Are you sure you want to delete this assessment?
          <div
            v-if="studentToDelete"
            class="mt-2 text-body-2 text-medium-emphasis"
          >
            Assessment: {{ studentToDelete.assessmentTypeCode }} -
            {{ studentToDelete.sessionDate }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            variant="outlined"
            class="text-none"
            density="default"
            text="Cancel"
            @click="showDeleteDialog = false"
          />
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="flat"
            class="text-none"
            density="default"
            text="Delete"
            :loading="isDeleting"
            :disabled="!canDeleteStudentAssessment"
            @click="confirmDelete(true)"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <AssessmentDetailsDialog
      v-model="showAssessmentDetails"
      :assessment-data="selectedAssessmentForDetails"
      :student-detail="studentDetail"
    />
  </div>
</template>
<script>
import { useStudentStore } from "@/store/modules/student";
import { useAppStore } from "@/store/modules/app";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapState } from "pinia";
import { useAccessStore } from "@/store/modules/access";
import { toRaw } from "vue";
import StudentAssessmentService from "@/services/StudentAssessmentService";
import EditStudentAssessment from "@/components/StudentProfile/StudentAssessment/Forms/EditStudentAssessment.vue";
import AddStudentAssessment from "@/components/StudentProfile/StudentAssessment/Forms/AddStudentAssessment.vue";
import AssessmentDetailsDialog from "@/components/StudentProfile/StudentAssessment/AssessmentDetailsDialog.vue";
import StudentAssessmentsTransferForm from "@/components/StudentProfile/StudentAssessment/Forms/StudentAssessmentsTransferForm.vue";
export default {
  name: "StudentAssessments",
  components: {
    AddStudentAssessment,
    EditStudentAssessment,
    AssessmentDetailsDialog,
    StudentAssessmentsTransferForm,
  },
  setup() {
    const studentStore = useStudentStore();
    const appStore = useAppStore();
    const snackbarStore = useSnackbarStore();
    return { studentStore, appStore, snackbarStore };
  },
  props: {
    studentId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState(useAppStore, {
      getSchoolsList: "getSchoolsList",
      getStudentAssessmentProvincialSpecialCaseCodes:
        "getStudentAssessmentProvincialSpecialCaseCodes",
      assessmentTypeCodesMap: "assessmentTypeCodesMap",
    }),
    ...mapState(useStudentStore, { studentAssessments: "studentAssessments" }),
    ...mapState(useAccessStore, [
      "hasPermissions",
      "allowUpdateStudentAssessments",
    ]),

    processedAssessments() {
      if (!this.studentAssessments) return [];
      return this.studentAssessments.map((assessment) => ({
        ...assessment,
        assessmentType:
          toRaw(
            this.assessmentTypeCodesMap.get(assessment.assessmentTypeCode)
          ) || null,
        sessionDate: `${assessment.courseYear}-${assessment.courseMonth}`,
      }));
    },
    studentStatus() {
      return this.studentStore.student.profile.studentStatus;
    },
    fields() {
      let baseFields = [
        {
          key: "data-table-expand",
          title: "",
          sortable: true,
          class: "text-left",
        },
        {
          key: "assessmentTypeCode",
          title: "Code",
          sortable: true,
          class: "text-md-left",
        },
        {
          key: "assessmentName",
          title: "Name",
          sortable: true,
          class: "text-left w-50",
        },
        {
          key: "sessionDate",
          title: "Session",
          sortable: true,
          class: "text-md-center",
        },
        {
          key: "proficiencyScore",
          title: "Proficiency Score",
          sortable: true,
          class: "text-md-center",
        },
        {
          key: "provincialSpecialCaseCode",
          title: "Special Case",
          sortable: true,
          value: (item) =>
            this.getProvincialSpecialCaseDisplayName(
              item.provincialSpecialCaseCode
            ),
        },
        {
          key: "wroteFlag",
          title: "Wrote Flag",
          sortable: true,
          class: "text-md-center",
          value: (item) => (item.wroteFlag === true ? "Y" : "N"),
        },
        {
          key: "exceededWriteFlag",
          title: "Exceeded Writes",
          sortable: true,
          class: "text-md-center",
          value: (item) => (item.numberOfAttempts >= 3 ? "Y" : "N"),
        },
        {
          key: "assessmentCenterSchoolID",
          title: "Assessment Center",
          class: "text-left w-50",
          value: (item) =>
            this.getAssessmentCenterSchoolDisplayName(
              item.assessmentCenterSchoolID
            ),
        },
      ];
      if (
        this.hasPermissions("STUDENT", "studentAssessmentUpdate") &&
        this.studentStatus !== "MER"
      ) {
        baseFields.push(
          { title: "Edit", value: "edit" },
          { title: "Delete", value: "delete" }
        );
      }
      return baseFields;
    },
    canDeleteStudentAssessment() {
      return (studentAssessment) => {
        if (!studentAssessment?.provincialSpecialCaseCode) {
          return true;
        }
        const assessmentAllowedCodes = ["A", "E", "Q"];
        const gradAllowedCode = "E";
        if (this.hasPermissions("STUDENT", "editAllSpecialCases")) {
          return assessmentAllowedCodes.includes(
            studentAssessment?.provincialSpecialCaseCode
          );
        } else {
          return (
            studentAssessment?.provincialSpecialCaseCode === gradAllowedCode
          );
        }
      };
    },
  },

  async mounted() {
    this.appStore.getProvincialSpecialCaseCodes(false);
    this.appStore.getAssessmentTypeCodes(false);
    await this.loadAssessmentSessions();
  },
  data: function () {
    return {
      selected: [],
      showEditDialog: false,
      selectedAssessment: null,
      assessmentSessions: [],
      showDeleteDialog: false,
      studentToDelete: null,
      isDeleting: false,
      isLoadingSessions: true,
      isLoadingAssessments: false,
      studentDetail: null,
      showAssessmentDetails: false,
      selectedAssessmentForDetails: null,
    };
  },
  methods: {
    clearSelected() {
      this.selected = [];
    },
    getStudentDetails(assessmentStudent) {
      return new Promise((resolve, reject) => {
        StudentAssessmentService.getAssessmentStudentDetails(
          assessmentStudent.assessmentStudentID,
          assessmentStudent.assessmentID
        )
          .then((response) => {
            this.studentDetail = response.data;
            resolve(response.data);
          })
          .catch((error) => {
            if (error.response?.status) {
              this.snackbarStore.showSnackbar(
                "Failed to fetch assessment details",
                "error",
                5000
              );
            }
            reject(error);
          });
      });
    },
    remove(assessmentStudent) {
      this.studentToDelete = assessmentStudent;
      this.showDeleteDialog = true;
    },
    async confirmDelete(allowRuleOverride) {
      if (!this.studentToDelete) return;

      this.isDeleting = true;
      try {
        await StudentAssessmentService.deleteAssessmentStudent(
          this.studentToDelete.assessmentStudentID,
          allowRuleOverride
        );
        this.showDeleteDialog = false;
        this.studentToDelete = null;

        this.loadStudentAssessments();
        this.snackbarStore.showSnackbar(
          "Success! Student assessment deleted",
          "success",
          2000
        );
      } catch (error) {
        console.log(error.response);
        if (error?.response?.status === 409) {
          let message = error?.response?.data?.message
            ? error.response.data.message.includes("Reason:")
              ? "Cannot delete assessment record. Reason:" +
                error.response.data.message.split("Reason:")[1]
              : error.response.data.message
            : "Cannot delete assessment record. It has a proficiency score, or session is closed.";
          this.snackbarStore.showSnackbar(message, "error", 5000);
        } else {
          this.snackbarStore.showSnackbar(
            "Failed to delete assessment student",
            "error",
            5000
          );
        }
      } finally {
        this.isDeleting = false;
        this.showDeleteDialog = false;
      }
    },
    edit(item) {
      this.selectedAssessment = item;
      this.showEditDialog = true;
    },
    async loadAssessmentSessions() {
      this.isLoadingSessions = true;
      try {
        const response = await StudentAssessmentService.getAssessmentSessions();
        this.assessmentSessions = response.data.map((session) => ({
          sessionID: session.sessionID,
          sessionDate: `${session.courseYear}-${session.courseMonth}`,
          assessments: session.assessments.map((assessment) => ({
            assessmentID: assessment.assessmentID,
            assessmentTypeCode: assessment.assessmentTypeCode,
          })),
        }));
      } catch (error) {
        this.snackbarStore.showSnackbar(
          "Failed to fetch assessment sessions",
          "error",
          5000
        );
      } finally {
        this.isLoadingSessions = false;
      }
    },
    loadStudentAssessments() {
      this.isLoadingAssessments = true;
      let sort = {
        "assessmentEntity.assessmentTypeCode": "ASC",
      };
      let searchParams = {
        studentId: this.studentId,
      };
      StudentAssessmentService.getStudentAssessmentsBySearchCriteria(
        searchParams,
        sort,
        1,
        1000
      )
        .then((response) => {
          this.studentStore.setStudentAssessments(response?.data?.content);
        })
        .catch((error) => {
          if (error.response?.status) {
            this.snackbarStore.showSnackbar(
              "Failed to load student assessments",
              "error",
              5000
            );
          }
        })
        .finally(() => {
          this.isLoadingAssessments = false;
        });
    },
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
    showAssessmentTransfer() {
      this.$refs.assessmentTransferFormRef.openTransferStudentAssessmentsDialog();
    },
    isAssessmentSelectable(item) {
      if (!item) return false;

      const proficiencyScore = parseInt(item.proficiencyScore);
      const specialCase = item.provincialSpecialCaseCode;

      if (
        !isNaN(proficiencyScore) &&
        proficiencyScore >= 1 &&
        proficiencyScore <= 4
      ) {
        return true;
      }

      return specialCase === "NC";
    },
    async openAssessmentDetails(item) {
      try {
        await this.getStudentDetails(item);

        this.selectedAssessmentForDetails = item;
        this.showAssessmentDetails = true;
      } catch (error) {
        console.error("Failed to fetch assessment details:", error);
        this.snackbarStore.showSnackbar(
          "Failed to fetch assessment details",
          "error",
          5000
        );
      }
    },
  },
};
</script>

<style scoped>
.v-btn.v-btn-link.text-left.assessment-name-btn:disabled {
  opacity: 0.6 !important;
  text-decoration: none !important;
  pointer-events: none !important;
  color: black !important;
}
</style>
