<template>
  <v-dialog
      v-model="dialog"
      max-width="800"
      @after-leave="closeDialog"
  >
    <v-form
        ef="editStudentAssessmentForm"
        v-model="isValidForm">
    <v-card>
      <v-card-title>
        <v-row no-gutters>
          <div class="v-card-title">Edit Assessment</div>
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
      <v-card-text
        v-if="updateStudentAssessment"
        class="py-1"
      >
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
          <v-col class="pb-0">
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
            @click="closeDialog"/>
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
<script>
import { useAppStore } from "@/store/modules/app";
import {useSnackbarStore} from "@/store/modules/snackbar";
import { mapState } from "pinia";
import { omit } from 'lodash';
import { reactive } from "vue";
import StudentAssessmentService from "@/services/StudentAssessmentService";
import OpenStatusBadge from "@/components/Common/OpenStatusBadge.vue";

export default {
  name: "EditStudentAssessment",
  components: {OpenStatusBadge},
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    studentId: {
      type: String,
      required: true
    },
    assessmentItem: {
      type: Object,
      default: null
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
  emits: ['update:modelValue', 'saved'],
  setup() {
    const appStore = useAppStore();
    const snackbarStore = useSnackbarStore();
    return { appStore, snackbarStore };
  },
  computed: {
    ...mapState(useAppStore, { getSchoolsList: "getSchoolsList", provincialSpecialCaseCodes: "provincialSpecialCaseCodes" }),
    dialog: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    },
  },
  data: function() {
    return {
      hasError: false,
      updateStudentAssessment: null,
      isSaving: false,
      requiredRules: [v => !!v || 'Required'],
      isValidForm: false,
      specialCases: []
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal && this.assessmentItem) {
        this.edit(this.assessmentItem);
      }
    }
  },
  async mounted() {
  },
  methods: {
    closeDialog() {
      this.hasError = false;
      this.updateStudentAssessment = null;
      this.isSaving = false;
      this.dialog = false;
    },
    edit(item) {
      this.updateStudentAssessment = reactive(omit(item, ['assessmentType']));
    },
    async save() {
      this.isSaving = true;
      try {
        let cleanStudentAssessment = omit(this.updateStudentAssessment,
            ['assessmentStudentValidationIssues', 'wroteFlag', 'sessionID', 'assessmentTypeCode', 'courseMonth', 'courseYear', 'sessionDate'])

        const res = await StudentAssessmentService.updateAssessmentStudent(cleanStudentAssessment.assessmentStudentID, cleanStudentAssessment);
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
        this.snackbarStore.showSnackbar(
            "Failed to update assessment student",
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
    }
  }
}
</script>

<style scoped>

</style>