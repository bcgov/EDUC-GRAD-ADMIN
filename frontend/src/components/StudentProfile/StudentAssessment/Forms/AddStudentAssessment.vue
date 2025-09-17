<template>
  <v-dialog v-model="dialog" max-width="800" @after-leave="closeDialog">
    <template v-slot:activator="{ props }">
      <v-btn v-if="hasPermissions('STUDENT', 'studentAssessmentUpdate')" color="bcGovBlue" prepend-icon="mdi-plus"
        class="text-none" @click="openCreateStudentAssessmentDialog" text="Add Assessment" />
    </template>

    <v-form ref="newStudentAssessmentForm" v-model="isValidForm">
      <v-card>
        <v-card-title>
          <v-row no-gutters>
            <div class="v-card-title">Add Assessment</div>
            <v-spacer />
            <v-btn icon="mdi-close" density="compact" rounded="sm" variant="outlined" color="error" class="mt-2"
              @click="closeDialog" />
          </v-row>
        </v-card-title>
        <v-card-text class="py-1">
          <v-expand-transition>
            <v-row>
              <v-col v-if="updateStudentAssessment.assessmentStudentValidationIssues">
                <v-alert v-for="(issue, i) in updateStudentAssessment.assessmentStudentValidationIssues" :key="i"
                  :type="issue.validationIssueCode === 'COURSE_SESSION_EXCEED' ? 'warning' : 'error'" border="start"
                  variant="tonal" density="compact">
                  {{ issue.validationMessage }}
                  <span
                    v-if="updateStudentAssessment.assessmentStudentValidationIssues.length === 1 && issue.validationIssueCode === 'COURSE_SESSION_EXCEED'"
                    @click="save(true)" class="text-decoration-underline cursor-pointer" role="button" tabindex="0">
                    Update anyways
                  </span>
                </v-alert>
              </v-col>
            </v-row>
          </v-expand-transition>
          <v-row class="mt-n2">
            <v-col>
              <v-autocomplete v-model="updateStudentAssessment.sessionID" item-title="sessionDate"
                item-value="sessionID" :items="assessmentSessions" label="Session" :loading="isLoadingSessions"
                :rules="requiredRules" clearable @update:model-value="updateAssessmentTypeDropdown"></v-autocomplete>
              <v-autocomplete v-model="updateStudentAssessment.assessmentID" label="Assessment Code"
                :items="assessmentsInSession" item-title="assessmentTypeCode" item-value="assessmentID"
                :loading="isLoadingAssessments" :rules="requiredRules" clearable
                :no-data-text="updateStudentAssessment.sessionID === null ? 'Select a Session' : 'No data available'"></v-autocomplete>
              <v-select v-model="updateStudentAssessment.provincialSpecialCaseCode" label="Provincial Special Case Code"
                :items="provincialSpecialCaseDropdown.displayItems()" item-title="label"
                item-value="provincialSpecialCaseCode" :clearable="provincialSpecialCaseDropdown.canClear()">
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :disabled="provincialSpecialCaseDropdown.isOptionDisabled(item.raw)"
                    :class="{ 'text-disabled': provincialSpecialCaseDropdown.isOptionDisabled(item.raw) }">
                  </v-list-item>
                </template>
              </v-select>
              <SchoolDropdown v-model="updateStudentAssessment.assessmentCenterSchoolID" label="Assessment Center" />
              <SchoolDropdown v-if="hasPermissions('STUDENT', 'editSchoolAtWrite')"
                v-model="updateStudentAssessment.schoolAtWriteSchoolID" label="School of Record At Write"
                :required="wasWritten" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" variant="outlined" class="text-none" density="default" text="Cancel"
            @click="dialog = false" />
          <v-spacer></v-spacer>
          <v-btn color="bcGovBlue" variant="flat" class="text-none" density="default" text="Save" :loading="isSaving"
            :disabled="(isSaving || !isValidForm || updateStudentAssessment?.assessmentStudentValidationIssues?.length > 0)"
            @click="save(false)" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { useAppStore } from '@/store/modules/app';
import { useAccessStore } from '@/store/modules/access';
import { useSnackbarStore } from '@/store/modules/snackbar';
import StudentAssessmentService from '@/services/StudentAssessmentService';
import { defineComponent } from 'vue'
import { mapState } from 'pinia';
import { omit } from 'lodash';
import SchoolDropdown from '@/components/Common/SchoolDropdown.vue';
import { usePermissionBasedDropdown } from '@/composables/usePermissionBasedDropdown';

export default defineComponent({
  name: "AddStudentAssessment",
  components: { SchoolDropdown },
  emits: ['update:modelValue', 'saved'],
  setup() {
    const snackbarStore = useSnackbarStore();
    return { snackbarStore };
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
      provincialSpecialCaseCodes: "provincialSpecialCaseCodes",
      assessmentTypeCodesMap: "assessmentTypeCodesMap"
    }),
    ...mapState(useAccessStore, ["hasPermissions"]),


    provincialSpecialCaseDropdown() {
      // Find the matching assessment for the current student
      const match = this.assessmentSessions
        .flatMap(session => session.assessments)
        .find(
          assessment =>
            assessment.assessmentID === this.updateStudentAssessment?.assessmentID
        );

      // Work on a copy of the codes to avoid mutating the original array
      let allowedCodes = ["A", "E", "Q"];
      let defaultAllowedCodes = ["E"];

      // Get exclusion rules for the matched assessment type
      const excludeConfig = this.specialCaseCodesToExcludeFromAssessments?.[match?.assessmentTypeCode];
      const excludeCodes = excludeConfig?.excludeCodes || [];

      // Filter out excluded codes
      allowedCodes = allowedCodes.filter(code => !excludeCodes.includes(code));
      defaultAllowedCodes = defaultAllowedCodes.filter(code => !excludeCodes.includes(code));

      // Return the dropdown configuration
      return usePermissionBasedDropdown({
        items: this.provincialSpecialCaseCodes,
        currentValue: this.updateStudentAssessment?.provincialSpecialCaseCode,
        itemValueKey: "provincialSpecialCaseCode",
        permissionKey: "editAllSpecialCases",
        allowedCodes: allowedCodes,
        defaultAllowedCodes: defaultAllowedCodes,
      });
    },



    wasWritten() {
      return !!(this.updateStudentAssessment?.proficiencyScore || this.updateStudentAssessment?.provincialSpecialCaseCode);
    }
  },
  data: function () {
    return {
      assessmentsInSession: [],
      dialog: false,
      updateStudentAssessment: {
        sessionID: null,
        provincialSpecialCaseCode: null,
        assessmentCenterSchoolID: null,
        assessmentID: null
      },
      requiredRules: [v => !!v || 'Required'],
      isValidForm: false,
      isSaving: false,
      isLoadingAssessments: false,
      specialCaseCodesToExcludeFromAssessments: {
        NME10: { excludeCodes: ["E"] },
        NMF10: { excludeCodes: ["E"] },
        NMF: { excludeCodes: ["E"] },
        NME: { excludeCodes: ["E"] },
      }
    };
  },
  watch: {
    'updateStudentAssessment.provincialSpecialCaseCode'() {
      this.$nextTick(() => {
        this.$refs.newStudentAssessmentForm?.validate()
      })
    },
    'updateStudentAssessment.provincialSpecialCaseCode'() {
      this.$nextTick(() => {
        this.$refs.newStudentAssessmentForm?.validate();
      });
    },
    'updateStudentAssessment.assessmentID'(newVal) {
      const selectedAssessment = this.assessmentsInSession.find(
        assessment => assessment.assessmentID === newVal
      );

      if (
        selectedAssessment &&
        this.specialCaseCodesToExcludeFromAssessments[selectedAssessment.assessmentTypeCode]
      ) {
        this.updateStudentAssessment.provincialSpecialCaseCode = null;
      }
    }
  },

  methods: {
    closeDialog() {
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
    async save(allowRuleOverride) {
      this.isSaving = true;
      try {
        let cleanStudentAssessment = omit(this.updateStudentAssessment, ['assessmentStudentValidationIssues', 'sessionID'])
        cleanStudentAssessment.studentID = this.studentId;
        const res = await StudentAssessmentService.createAssessmentStudent(cleanStudentAssessment, allowRuleOverride);
        this.updateStudentAssessment.assessmentStudentValidationIssues = res.data.assessmentStudentValidationIssues;
        if (this.updateStudentAssessment.assessmentStudentValidationIssues) {
        } else if (!this.updateStudentAssessment.assessmentStudentValidationIssues) {
          this.dialog = false;
          this.$emit('saved');
          this.snackbarStore.showSnackbar(
            "Success! Student assessment saved",
            "success",
            2000
          );
        }
      } catch (error) {
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
    updateAssessmentTypeDropdown($event) {
      this.isLoadingAssessments = true;
      this.updateStudentAssessment.assessmentID = null;
      const session = this.assessmentSessions.find(x => x.sessionID === $event);
      this.assessmentsInSession = this.sortAssessmentsInSession(session);
      const assessment = this.assessmentsInSession.find(x => x.assessmentTypeCode === this.updateStudentAssessment.assessmentTypeCode);
      if (assessment && this.updateStudentAssessment.sessionID) {
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