<template>
  <v-col cols="12">
    <v-row style="font-size: 1rem">
      <v-col>
        <strong>
          {{
            processedAssessment.assessmentType?.label ||
            processedAssessment.assessmentTypeCode
          }}
          {{ processedAssessment.sessionDate }}</strong
        >
        ({{ processedAssessment.assessmentDetails.label }})
      </v-col>
    </v-row>

    <v-row no-gutters style="font-size: 1rem">
      <v-col class="mr-2" cols="auto">
        <strong>Proficiency Score&nbsp;</strong>
        <span v-if="processedAssessment.proficiencyScore">{{
          processedAssessment.proficiencyScore
        }}</span>
        <span v-else><i>null</i></span>
      </v-col>

      <v-col class="mr-2" cols="auto">
        <strong>Special Case&nbsp;</strong>
        <span v-if="processedAssessment.provincialSpecialCaseCode">
          {{
            getProvincialSpecialCaseDisplayName(
              processedAssessment.provincialSpecialCaseCode
            )
          }}
        </span>
        <span v-else><i>null</i></span>
      </v-col>

      <v-col class="mr-2" cols="auto">
        <strong>Wrote Flag&nbsp;</strong>
        <span v-if="processedAssessment.wroteFlag">{{
          processedAssessment.wroteFlag ? "Y" : "N"
        }}</span>
        <span v-else><i>null</i></span>
      </v-col>

      <v-col class="mr-2" cols="auto">
        <strong>Exceeds Writes&nbsp;</strong>
        <span>{{ processedAssessment.numberOfAttempts >= 3 ? "Y" : "N" }}</span>
      </v-col>

      <v-col class="mr-2" cols="auto">
        <strong>Assessment Center&nbsp;</strong>
        <span v-if="processedAssessment.assessmentCenterSchoolID">
          {{
            getAssessmentCenterSchoolDisplayName(
              processedAssessment.assessmentCenterSchoolID
            )
          }}
        </span>
        <span v-else><i>null</i></span>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import { useAppStore } from "@/store/modules/app";
import { mapState } from "pinia";
import { toRaw } from "vue";

export default {
  name: "AssessmentReview",
  setup() {
    return { v$: useVuelidate() };
  },
  computed: {
    ...mapState(useAppStore, {
      getSchoolsList: "getSchoolsList",
      getStudentAssessmentProvincialSpecialCaseCodes:
        "getStudentAssessmentProvincialSpecialCaseCodes",
      assessmentTypeCodesMap: "assessmentTypeCodesMap",
    }),
    processedAssessment() {
      if (!this.assessment) return {};

      return {
        ...this.assessment,
        assessmentDetails:
          toRaw(
            this.assessmentTypeCodesMap.get(this.assessment.assessmentTypeCode)
          ) || null,
        sessionDate: `${this.assessment.courseYear}-${this.assessment.courseMonth}`,
      };
    },
  },
  props: {
    assessment: {
      type: Object,
      required: true,
    },
    shouldRemoveGutters: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  data() {
    return {};
  },
  mounted() {},
  validations() {},
  watch: {},
  methods: {
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
  },
};
</script>
