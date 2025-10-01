<template>
  <v-row no-gutters class="mb-4">
    <v-col cols="12" v-if="type === 'assessmentMerge'">
      <AssessmentMerge
        :sourceStudentData="sourceStudentData"
        :targetStudentData="targetStudentData"
        :assessmentReconciliation="assessmentReconciliation"
      />
    </v-col>
    <v-col cols="12" v-if="type === 'assessmentTransfer'">
      <AssessmentTransfer
        :sourceStudentData="sourceStudentData"
        :targetStudentData="targetStudentData"
        :assessmentReconciliation="assessmentReconciliation"
      />
    </v-col>
  </v-row>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";

import AssessmentMerge from "./support/assessment/AssessmentMerge.vue";
import AssessmentTransfer from "./support/assessment/AssessmentTransfer.vue";

export default {
  name: "AssessmentReviewAndReconcile",
  components: {
    AssessmentMerge,
    AssessmentTransfer,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  computed: {},
  props: {
    sourceStudentData: {
      type: Object,
      required: true,
    },
    targetStudentData: {
      type: Object,
      required: true,
    },
    sourceStudentAssessments: {
      type: Array,
      required: true,
    },
    targetStudentAssessments: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      default: "", // 'transfer' or 'merge'
      required: true,
    },
  },
  data() {
    return {
      assessmentReconciliation: {
        conflicts: [], //matched but different details and cannot be transferred
        info: [], // not matched and can be transferred
        errors: [], //rule check if cannot be transferred
      },
    };
  },
  mounted() {},
  validations() {},
  watch: {
    type: {
      immediate: true,
      async handler(newVal) {
        if (newVal === "assessmentMerge") {
          this.reconcileForMerge();
        }
        if (newVal === "assessmentTransfer") {
          this.reconcileForTransfer();
        }
      },
    },
    targetStudentAssessments: {
      immediate: true,
      async handler(newVal) {
        if (this.type === "assessmentMerge") {
          this.reconcileForMerge();
        }
        if (this.type === "assessmentTransfer") {
          this.reconcileForTransfer();
        }
      },
    },
  },
  methods: {
    resetAssessmentReconciliation() {
      this.assessmentReconciliation.conflicts = [];
      this.assessmentReconciliation.info = [];
      this.assessmentReconciliation.errors = [];
    },
    reconcileForMerge() {
      this.resetAssessmentReconciliation();
      if (this.sourceStudentAssessments.length > 0) {
        //Source not empty & target empty/not empty
        for (const sourceAssessment of this.sourceStudentAssessments) {
          const matchedTarget = this.getMatchedAssessment(
            sourceAssessment,
            this.targetStudentAssessments
          );

          const truePENHasProficiencyScore = !!matchedTarget?.proficiencyScore;
          if (truePENHasProficiencyScore) {
            this.assessmentReconciliation.errors.push({
              source: sourceAssessment,
              target: matchedTarget,
              message: "Assessment has a proficiency score",
            });
          } else {
            if (matchedTarget) {
              this.assessmentReconciliation.conflicts.push({
                source: sourceAssessment,
                target: matchedTarget,
                message: "Assessment for this session already exists",
              });
            } else {
              this.assessmentReconciliation.info.push({
                source: sourceAssessment,
                target: matchedTarget,
                message: "",
              });
            }
          }
        }
      }
      //check Source is empty and target is not empty
      for (const targetAssessment of this.targetStudentAssessments) {
        const matchedTarget = this.getMatchedAssessment(
          targetAssessment,
          this.sourceStudentAssessments
        );
        if (!matchedTarget) {
          this.assessmentReconciliation.info.push({
            source: null,
            target: targetAssessment,
            message: "",
          });
        }
      }
    },
    reconcileForTransfer() {
      this.resetAssessmentReconciliation();
      if (this.sourceStudentAssessments.length > 0) {
        for (const sourceAssessment of this.sourceStudentAssessments) {
          const matchedTarget = this.getMatchedAssessment(
            sourceAssessment,
            this.targetStudentAssessments
          );

          // If a match is found for any reason, it's an error.
          if (matchedTarget) {
            this.assessmentReconciliation.errors.push({
              source: sourceAssessment,
              target: matchedTarget,
              message:
                "Assessment for this session already exists on the target student.",
            });
          } else {
            // Only assessments with NO match are considered for transfer.
            this.assessmentReconciliation.info.push({
              source: sourceAssessment,
              target: null,
              message: "Ready for transfer.",
            });
          }
        }
      }
    },
    getMatchedAssessment(assessment, studentAssessments) {
      if (assessment && studentAssessments && studentAssessments.length > 0) {
        return studentAssessments.find((item) =>
          this.validateAssessment(assessment, item)
        );
      }
      return null;
    },
    validateAssessment(sourceAssessment, targetAssessment) {
      return (
        sourceAssessment.assessmentID === targetAssessment.assessmentID &&
        sourceAssessment.sessionID === targetAssessment.sessionID
      );
    },
  },
};
</script>
