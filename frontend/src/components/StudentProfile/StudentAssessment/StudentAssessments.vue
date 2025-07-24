<template>
  <div>
    <v-alert v-if="!studentAssessments?.length" class="container">
      This student does not have any assessments.
    </v-alert>
    <v-row no-gutters>

      <v-spacer />
      <AddStudentAssessment
          :student-id="studentId"
          :assessment-sessions="assessmentSessions"
          :is-loading-sessions="isLoadingSessions"
          @saved="loadStudentAssessments"
      />
    </v-row>
    <v-data-table
        v-if="processedAssessments"
        :items="processedAssessments"
        :headers="fields"
        :loading="isLoadingAssessments"
        showFilter="true"
        hide-default-footer
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
        <v-btn
            color="success"
            variant="text"
            icon
            @click="edit(item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.delete="{ item }">
        <v-btn variant="text" icon @click="remove(item)">
          <v-icon
              color="error"
              density="compact"
              variant="text"
          >mdi-delete-forever</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <EditStudentAssessment
        v-model="showEditDialog"
        :student-id="studentId"
        :assessment-item="selectedAssessment"
        :assessment-sessions="assessmentSessions"
        :is-loading-sessions="isLoadingSessions"
        @saved="loadStudentAssessments"
    />
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this assessment?
          <div v-if="studentToDelete" class="mt-2 text-body-2 text-medium-emphasis">
            Assessment: {{ studentToDelete.assessmentTypeCode }} - {{ studentToDelete.sessionDate}}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
              color="error"
              variant="outlined"
              class="text-none"
              density="default"
              text="Cancel"
              @click="showDeleteDialog = false"/>
          <v-spacer></v-spacer>
          <v-btn
              color="error"
              variant="flat"
              class="text-none"
              density="default"
              text="Delete"
              :loading="isDeleting"
              @click="confirmDelete"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  name: "StudentAssessments",
  components: {StudentCoursesCreateForm, StudentCoursesDeleteForm, AddStudentAssessment, EditStudentAssessment},
  setup() {
    const studentStore = useStudentStore();
    const appStore = useAppStore();
    const snackbarStore = useSnackbarStore();
    return { studentStore, appStore, snackbarStore };
  },
  props: {
    studentId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(useAppStore, {
      getSchoolsList: "getSchoolsList",
      assessmentTypeCodes: "assessmentTypeCodes",
      assessmentTypeCodesMap: "assessmentTypeCodesMap"}),
    ...mapState(useStudentStore, { studentAssessments: "studentAssessments" }),
    ...mapState(useAccessStore, ["hasPermissions"]),
    processedAssessments() {
      if (!this.studentAssessments) return [];
      return this.studentAssessments.map(assessment => ({
        ...assessment,
        assessmentType: toRaw(this.assessmentTypeCodesMap.get(assessment.assessmentTypeCode)) || null,
        sessionDate: `${assessment.courseYear}-${assessment.courseMonth}`
      }));
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
          sortDirection: "desc",
          class: "text-md-left",
        },
        {
          key: "sessionDate",
          title: "Session",
          sortable: true,
          class: "text-md-center"
        },
        {
          key: "provincialSpecialCaseCode",
          title: "Special Case",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "wroteFlag",
          title: "Wrote Flag",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
          value: (item) => item.wroteFlag === true ? 'Y' : 'N'
        },
        {
          key: "exceededWriteFlag",
          title: "Exceeded Writes",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
          value: (item) => item.numberOfAttempts >= 3 ? 'Y' : 'N'
        },
        {
          key: "proficiencyScore",
          title: "Proficiency Score",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "assessmentName",
          title: "Name",
          sortable: true,
          sortDirection: "desc",
          class: "text-left w-50",
        },
        {
          key: "assessmentCenterSchoolID",
          title: "Assessment Center",
          sortDirection: "desc",
          class: "text-left w-50",
          value: (item) => this.getAssessmentCenterSchoolDisplayName(item.assessmentCenterSchoolID)
        }
      ]
      if(this.hasPermissions('STUDENT', 'studentAssessmentUpdate')) {
        baseFields.push({title: 'Edit', value: 'edit'}, {title: 'Delete', value: 'delete'});
      }
      return baseFields;
    }
  },
  async mounted() {
    this.appStore.getProvincialSpecialCaseCodes(false);
    this.appStore.getAssessmentTypeCodes(false);
    await this.loadAssessmentSessions();
  },
  data: function () {
    return {
      showEditDialog: false,
      selectedAssessment: null,
      assessmentSessions: [],
      assessmentsInSession: [],
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
    remove(assessmentStudent) {
      this.studentToDelete = assessmentStudent;
      this.showDeleteDialog = true;
    },
    async confirmDelete() {
      if (!this.studentToDelete) return;

      this.isDeleting = true;
      try {
        await StudentAssessmentService.deleteAssessmentStudent(this.studentToDelete.assessmentStudentID);
        this.showDeleteDialog = false;
        this.studentToDelete = null;

        this.loadStudentAssessments();
        this.snackbarStore.showSnackbar(
            "Success! Student assessment deleted",
            "success",
            2000
        );
      } catch (error) {
        console.log(error.response)
        if(error?.response?.status === 409) {
          this.snackbarStore.showSnackbar(
              "Assessment student cannot be deleted. It has a proficiency score, or session is closed.",
              "error",
              5000
          );
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
    loadStudentAssessments() {
      this.isLoadingAssessments = true;
      let sort = {
        'assessmentEntity.assessmentTypeCode': 'ASC',
      };
      let searchParams = {
        studentId: this.studentId
      };
      StudentAssessmentService.getStudentAssessmentsBySearchCriteria(searchParams, sort, 1, 1000)
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
      const school = this.getSchoolsList.find(school => school.schoolId === schoolId);
      return school ? `${school.mincode} - ${school.displayName}` : '';
    }
  }
};
</script>

<style scoped>

</style>