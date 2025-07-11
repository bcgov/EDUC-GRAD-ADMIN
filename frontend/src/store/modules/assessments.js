import { defineStore } from "pinia";
import StudentAssessmentService from "@/services/StudentAssessmentService.js";
import sharedMethods from "@/sharedMethods";

export const useAssessmentsStore = defineStore("assessments", {
  state: () => ({
    assessmentTypeCodes: new Map(),
  }),
  getters: {
    getAssessmentTypeCodeByCode: (state) => {
      return (code) => state.assessmentTypeCodes.get(code);
    }
  },
  actions: {
    async setAssessmentTypeCodes(assessmentTypeCodes) {
      this.assessmentTypeCodes = new Map(
        sharedMethods.applyDisplayOrder(assessmentTypeCodes).map(type => [type.assessmentTypeCode, type])
      );
    },
    async getAssessmentTypeCodes(getNewData = false) {
      if (getNewData || this.assessmentTypeCodes.size === 0) {
        let response = await StudentAssessmentService.getAssessmentTypeCodes();
        await this.setAssessmentTypeCodes(response.data);
      }
    }
  },
}); 