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
                  border="start"
                  variant="tonal"
                  density="compact"
              >
                {{ issue.validationMessage }}
              </v-alert>
            </v-col>
          </v-row>
        </v-expand-transition>
        <v-row class="pl-2">
            <v-col class="py-0"><strong>Session:</strong></v-col>
            <v-col class="py-0">
              {{ sessionDisplayValue }}
            </v-col>
        </v-row>
        <v-row class="pl-2">
            <v-col class="py-0"><strong>Assessment Code:</strong></v-col>
            <v-col class="pt-0">
              {{ updateStudentAssessment.assessmentTypeCode }}
            </v-col>
        </v-row>
        <v-row class="mt-n2">
          <v-col class="pb-0">
            <v-select
                v-model="updateStudentAssessment.provincialSpecialCaseCode"
                label="Provincial Special Case Code"
                :items="provincialSpecialCaseDropdown.displayItems()"
                item-title="label"
                item-value="provincialSpecialCaseCode"
                :clearable="provincialSpecialCaseDropdown.canClear()"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    :disabled="provincialSpecialCaseDropdown.isOptionDisabled(item.raw)"
                    :class="{ 'text-disabled': provincialSpecialCaseDropdown.isOptionDisabled(item.raw) }"
                >
                </v-list-item>
              </template>
            </v-select>
            <SchoolDropdown
                v-model="updateStudentAssessment.assessmentCenterSchoolID"
                label="Assessment Center"
            />
            <SchoolDropdown
                v-if="hasPermissions('STUDENT', 'editSchoolAtWrite')"
                v-model="updateStudentAssessment.schoolAtWriteSchoolID"
                label="School of Record At Write"
                :required="wasWritten"
            />
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
import {useAccessStore} from "@/store/modules/access";
import { usePermissionBasedDropdown } from '@/composables/usePermissionBasedDropdown';
import SchoolDropdown from "@/components/Common/SchoolDropdown.vue";

export default {
  name: "EditStudentAssessment",
  components: {SchoolDropdown},
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    assessmentItem: {
      type: Object,
      default: null
    },
    assessmentSessions: {
      type: Array,
      required: true
    }
  },
  emits: ['update:modelValue', 'saved'],
  setup() {
    const snackbarStore = useSnackbarStore();
    return { snackbarStore };
  },
  computed: {
    ...mapState(useAppStore, {
      provincialSpecialCaseCodes: 'provincialSpecialCaseCodes'
    }),
    ...mapState(useAccessStore, ['hasPermissions']),
    dialog: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    },
    provincialSpecialCaseDropdown() {
      return usePermissionBasedDropdown({
        items: this.provincialSpecialCaseCodes,
        currentValue: this.updateStudentAssessment?.provincialSpecialCaseCode,
        itemValueKey: 'provincialSpecialCaseCode',
        permissionKey: 'editAllSpecialCases',
        allowedCodes: ['A', 'E', 'Q'],
        defaultAllowedCodes: ['E']
      })
    },
    sessionDisplayValue() {
      return this.assessmentSessions.find(session => session.sessionID === this.updateStudentAssessment.sessionID).sessionDate;
    },
    wasWritten() {
      return !!(this.updateStudentAssessment?.proficiencyScore || this.updateStudentAssessment?.provincialSpecialCaseCode);
    }
  },
  data: function() {
    return {
      updateStudentAssessment: null,
      isSaving: false,
      isValidForm: false
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal && this.assessmentItem) {
        this.edit(this.assessmentItem);
      }
    },
    'updateStudentAssessment.provincialSpecialCaseCode'() {
      this.$nextTick(() => {
        this.$refs.editStudentAssessmentForm?.validate()
      })
    }
  },
  methods: {
    closeDialog() {
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
        } else if(!this.updateStudentAssessment.assessmentStudentValidationIssues) {
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
    }
  }
}
</script>