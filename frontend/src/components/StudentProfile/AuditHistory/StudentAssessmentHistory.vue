<template>
  <div>
    <v-alert v-if="!studentAssessmentHistory?.length" class="container">
      This student does not have any assessment history.
    </v-alert>
    <v-row no-gutters>
    </v-row>
    <v-data-table
        v-if="studentAssessmentHistory"
        :items="studentAssessmentHistory"
        :headers="fields"
        :loading="isLoadingAssessments"
        showFilter="true"
        hide-default-footer
    >
      <template v-slot:item.assessmentName="{ item }">
        <v-dialog max-width="500">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                color="surface-variant"
                :text="item.assessmentType?.label || item.assessmentTypeCode"
                variant="plain"
                class="m-1 p-1 text-left v-btn-link"
            >
            </v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card :title="item.assessmentType?.label || item.assessmentTypeCode">
              <v-card-text>
                <div class="row py-1">
                  <div class="col">
                    <strong>Language:</strong>
                  </div>
                  <div class="col">
                    {{ item.assessmentType?.language }}
                  </div>
                </div>
                <div class="row py-1">
                  <div class="col"><strong>Start Date:</strong></div>
                  <div class="col">
                    {{ $filters.formatSimpleDate(item.assessmentType?.effectiveDate) }}
                  </div>
                </div>
                <div class="row py-1">
                  <div class="col"><strong>End Date:</strong></div>
                  <div class="col">
                    {{ $filters.formatSimpleDate(item.assessmentType?.expiryDate) }}
                  </div>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Close" @click="isActive.value = false"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { useStudentStore } from "@/store/modules/student";
import { useAppStore } from "@/store/modules/app";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapState } from "pinia";
import {useAccessStore} from "@/store/modules/access";
import {toRaw} from "vue";
import StudentAssessmentService from "@/services/StudentAssessmentService";
import EditStudentAssessment from "@/components/StudentProfile/StudentAssessment/Forms/EditStudentAssessment.vue";
import AddStudentAssessment from "@/components/StudentProfile/StudentAssessment/Forms/AddStudentAssessment.vue";
import StudentCoursesDeleteForm from "@/components/StudentProfile/Forms/StudentCoursesDeleteForm.vue";
import StudentCoursesCreateForm from "@/components/StudentProfile/Forms/StudentCoursesCreateForm.vue";
export default {
  name: "StudentAssessmentHistory",
  components: {StudentCoursesCreateForm, StudentCoursesDeleteForm, AddStudentAssessment, EditStudentAssessment},
  setup() {
    const studentStore = useStudentStore();
    const appStore = useAppStore();
    const snackbarStore = useSnackbarStore();
    return { studentStore, appStore, snackbarStore };
  },
  props: {
  },
  computed: {
    ...mapState(useAppStore, {
      getSchoolsList: "getSchoolsList",
      getStudentAssessmentProvincialSpecialCaseCodes: "getStudentAssessmentProvincialSpecialCaseCodes",
      assessmentTypeCodes: "assessmentTypeCodes",
      assessmentTypeCodesMap: "assessmentTypeCodesMap"}),
    ...mapState(useStudentStore, { studentId: "getStudentId" }),
    ...mapState(useAccessStore, ["hasPermissions"]),
    fields() {
      let baseFields = [
        {
          key: "historyDate",
          title: "Date",
          sortable: true,
          sortDirection: "desc",
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
          class: "text-md-center"
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
          value: (item) => this.getProvincialSpecialCaseDisplayName(item.provincialSpecialCaseCode)
        },
        {
          key: "wroteFlag",
          title: "Wrote Flag",
          sortable: true,
          class: "text-md-center",
          value: (item) => item.wroteFlag === true ? 'Y' : 'N'
        },
        {
          key: "exceededWriteFlag",
          title: "Exceeded Writes",
          sortable: true,
          class: "text-md-center",
          value: (item) => item.numberOfAttempts >= 3 ? 'Y' : 'N'
        },
        {
          key: "assessmentCenterSchoolID",
          title: "Assessment Center",
          class: "text-left w-50",
          value: (item) => this.getAssessmentCenterSchoolDisplayName(item.assessmentCenterSchoolID)
        }
      ]
      return baseFields;
    }
  },
  async mounted() {
    this.appStore.getAssessmentTypeCodes(false);
    await this.loadAssessmentSessions();
    await this.loadStudentAssessmentHistory();
  },
  data: function () {
    return {
      showEditDialog: false,
      selectedAssessment: null,
      assessmentSessions: [],
      assessmentsInSession: [],
      studentAssessmentHistory: [],
      dialog: false,
      detailsShowing: false,
      hasError: false,
      updateStudentAssessment: null,
      showDeleteDialog: false,
      studentToDelete: null,
      isDeleting: false,
      isSaving: false,
      isLoadingSessions: true,
      isLoadingAssessments: false,
    };
  },
  methods: {
    async loadAssessmentSessions() {
      this.isLoadingSessions = true;
      try {
        const response = await StudentAssessmentService.getAssessmentSessions();
        this.assessmentSessions = response.data.map(session => ({
          sessionID: session.sessionID,
          sessionDate: `${session.courseYear}-${session.courseMonth}`,
          assessments: session.assessments.map(assessment => ({
            assessmentID: assessment.assessmentID,
            assessmentTypeCode: assessment.assessmentTypeCode
          }))
        }));
      } catch(error) {
        this.snackbarStore.showSnackbar(
            "Failed to fetch assessment sessions",
            "error",
            5000
        );
      } finally {
        this.isLoadingSessions = false;
      }
    },
    loadStudentAssessmentHistory() {
      this.isLoadingAssessments = true;
      let sort = {
        'assessmentEntity.assessmentTypeCode': 'ASC',
      };
      let searchParams = {
        studentId: this.studentId
      };
      StudentAssessmentService.getStudentAssessmentHistoryBySearchCriteria(searchParams, sort, 1, 1000)
        .then((response) => {
          this.studentAssessmentHistory = response?.data?.content;
          this.studentAssessmentHistory = this.studentAssessmentHistory.map(assessment => ({
            ...assessment,
            assessmentType: toRaw(this.assessmentTypeCodesMap.get(assessment.assessmentTypeCode)) || null,
            sessionDate: `${assessment.courseYear}-${assessment.courseMonth}`
          }));
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
      const school = this.getSchoolsList.find(school => school.schoolId === schoolId);
      return school ? `${school.mincode} - ${school.displayName}` : '';
    },
    getProvincialSpecialCaseDisplayName(code) {
      const specialCase = this.getStudentAssessmentProvincialSpecialCaseCodes.find(specialCaseCode => specialCaseCode.provincialSpecialCaseCode === code);
      return specialCase ? specialCase.label : '';
    }
  }
};
</script>

<style scoped>

</style>