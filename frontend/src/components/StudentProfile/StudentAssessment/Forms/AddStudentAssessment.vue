<template>
      <v-dialog
        v-model="dialog"
        max-width="800"
        @after-leave="closeDialog"
      >
        <template v-slot:activator="{ props }">
          <v-btn
              v-if="hasPermissions('STUDENT', 'studentAssessmentUpdate')"
              color="bcGovBlue"
              prepend-icon="mdi-plus"
              class="text-none"
              @click="openCreateStudentAssessmentDialog"
              text="Add Assessment"
          />
        </template>
        <v-form
            ef="newStudentAssessmentForm"
            v-model="isValidForm">
            <v-card>
              <v-card-title>
                <v-row no-gutters>
                  <div class="v-card-title">Add Assessment</div>
                  <v-spacer />
                  <v-btn
                      icon="mdi-close"
                      density="compact"
                      rounded="sm"
                      variant="outlined"
                      color="error"
                      class="mt-2"
                      @click="closeDialog"
                  />
                </v-row>
              </v-card-title>
              <v-card-text class="py-1">
                <v-expand-transition>
                  <v-row>
                    <v-col v-if="updateStudentAssessment.assessmentStudentValidationIssues">
                      <v-alert
                          v-for="(issue, i) in updateStudentAssessment.assessmentStudentValidationIssues"
                          :key="i"
                          type="error"
                          dense
                          outlined
                          class="mb-2"
                      >
                        {{ issue.validationMessage }}
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-expand-transition>
                <v-row class="mt-n2">
                  <v-col>
                    <v-autocomplete
                        v-model="updateStudentAssessment.sessionID"
                        item-title="sessionDate"
                        item-value="sessionID"
                        :items="assessmentSessions"
                        label="Session"
                        :loading="isLoadingSessions"
                        :rules="requiredRules"
                        clearable
                        @update:model-value="updateAssessmentTypeDropdown"
                    ></v-autocomplete>
                    <v-autocomplete
                        v-model="updateStudentAssessment.assessmentID"
                        label="Course Code"
                        :items="assessmentsInSession"
                        item-title="assessmentTypeCode"
                        item-value="assessmentID"
                        :loading="isLoadingAssessments"
                        :rules="requiredRules"
                        clearable
                        :no-data-text="updateStudentAssessment.sessionID === null ? 'Select a Session' : 'No data available'"
                    ></v-autocomplete>
                    <v-autocomplete
                      v-model="updateStudentAssessment.provincialSpecialCaseCode"
                      label="Provincial Special Case Code"
                      :items="provincialSpecialCaseCodes"
                      item-title="label"
                      item-value="provincialSpecialCaseCode"
                      clearable
                    />
                    <v-autocomplete
                      v-model="updateStudentAssessment.assessmentCenterSchoolID"
                      label="Assessment Center"
                      :items="getSchoolsList"
                      :item-title="schoolTitle"
                      item-value="schoolId"
                      :rules="requiredRules"
                      clearable
                    >
                      <template v-slot:label="label">
                        {{ label.label }}
                      </template>

                      <template v-slot:append-inner>
                        <OpenStatusBadge
                            :compact="false"
                            :openedDateString="getSchoolsList?.find(item => item.schoolId === updateStudentAssessment.assessmentCenterSchoolID)?.openedDate"
                            :closedDateString="getSchoolsList?.find(item => item.schoolId === updateStudentAssessment.assessmentCenterSchoolID)?.closedDate"
                        />
                      </template>
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" :key="item.value">
                          <template v-slot:append>
                            <OpenStatusBadge
                                :openedDateString="item.raw.openedDate"
                                :closedDateString="item.raw.closedDate"
                            />
                          </template>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn
                    color="error"
                    variant="outlined"
                    class="text-none"
                    density="default"
                    text="Cancel"
                    @click="dialog = false"/>
                <v-spacer></v-spacer>
                <v-btn
                    color="bcGovBlue"
                    variant="flat"
                    class="text-none"
                    density="default"
                    text="Save"
                    :loading="isSaving"
                    :disabled="(isSaving || !isValidForm)"
                    @click="save"/>
              </v-card-actions>
            </v-card>
        </v-form>
      </v-dialog>
</template>

<script lang="ts">
import { useStudentStore } from '@/store/modules/student';
import { useAppStore } from '@/store/modules/app';
import {useAccessStore} from '@/store/modules/access';
import {useSnackbarStore} from '@/store/modules/snackbar';
import StudentAssessmentService from '@/services/StudentAssessmentService';
import {defineComponent, toRaw} from 'vue'
import {mapState} from 'pinia';
import { omit } from 'lodash';
import OpenStatusBadge from '@/components/Common/OpenStatusBadge.vue';

export default defineComponent({
  name: "AddStudentAssessment",
  components: {OpenStatusBadge},
  emits: ['update:modelValue', 'saved'],
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
    },
    assessmentSessions: {
      type: Array,
      required: true
    },
    isLoadingSessions: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState(useAppStore, {
      getSchoolsList: "getSchoolsList",
      provincialSpecialCaseCodes: "provincialSpecialCaseCodes",
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
    }
  },
  data: function () {
    return {
      showEditDialog: false,
      selectedAssessment: null,
      assessmentsInSession: [],
      dialog: false,
      detailsShowing: false,
      hasError: false,
      updateStudentAssessment: {
        sessionID: null,
        provincialSpecialCaseCode: null,
        assessmentCenterSchoolID: null,
        assessmentID: null
      },
      requiredRules: [v => !!v || 'Required'],
      isValidForm: false,
      isSaving: false,
      isLoadingAssessments: false
    };
  },
  methods: {
    closeDialog() {
      this.hasError = false;
      this.updateStudentAssessment = {
        sessionID: null,
        provincialSpecialCaseCode: null,
        assessmentCenterSchoolID: null,
        assessmentID: null
      };
      this.assessmentsInSession = [];
      this.isSaving = false;
      this.dialog = false;
    },
    openCreateStudentAssessmentDialog() {
      this.dialog = true;
    },
    async save() {
      this.isSaving = true;
      try {
        let cleanStudentAssessment = omit(this.updateStudentAssessment, ['assessmentStudentValidationIssues','sessionID'])
        cleanStudentAssessment.studentID = this.studentId;
        const res = await StudentAssessmentService.createAssessmentStudent(cleanStudentAssessment);
        this.updateStudentAssessment.assessmentStudentValidationIssues = res.data.assessmentStudentValidationIssues;
        if(this.updateStudentAssessment.assessmentStudentValidationIssues){
          this.hasError = true;
        } else if(!this.updateStudentAssessment.assessmentStudentValidationIssues) {
          this.hasError = false;
          this.dialog = false;
          this.$emit('saved');
          this.snackbarStore.showSnackbar(
              "Success! Student assessment saved",
              "success",
              2000
          );
        }
      } catch(error) {
        console.error('Failed to update assessment student');
        this.snackbarStore.showSnackbar(
            "Failed to add assessment student",
            "error",
            5000
        );
      } finally {
        this.isSaving = false;
      }
    },
    schoolTitle(item) {
      if (item) {
        return `${item.mincode} - ${item.displayName}`;
      } else {
        return null;
      }
    },
    updateAssessmentTypeDropdown($event) {
      this.isLoadingAssessments = true;
      this.updateStudentAssessment.assessmentID = null;
      const session = this.assessmentSessions.find(x => x.sessionID === $event);
      this.assessmentsInSession = this.sortAssessmentsInSession(session);
      const assessment = this.assessmentsInSession.find(x => x.assessmentTypeCode === this.updateStudentAssessment.assessmentTypeCode);
      if(assessment && this.updateStudentAssessment.sessionID) {
        this.updateStudentAssessment.assessmentID = assessment.assessmentID;
      } else {
        this.updateStudentAssessment.assessmentID = null;
      }
      this.isLoadingAssessments = false;
    },
    sortAssessmentsInSession(session) {
      return session?.assessments?.sort((a, b) => {
        const assessmentTypeA = this.assessmentTypeCodesMap.get(a.assessmentTypeCode);
        const assessmentTypeB = this.assessmentTypeCodesMap.get(b.assessmentTypeCode);

        if (assessmentTypeA?.displayOrder !== assessmentTypeB?.displayOrder) {
          return (assessmentTypeA?.displayOrder || 0) - (assessmentTypeB?.displayOrder || 0);
        }
        return (assessmentTypeA?.level || 0) - (assessmentTypeB?.level || 0);
      }) || [];
    }
  }
})
</script>

<style scoped>

</style>