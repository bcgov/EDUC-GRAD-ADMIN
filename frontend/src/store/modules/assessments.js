import { defineStore } from "pinia";
import StudentAssessmentService from "@/services/StudentAssessmentService.js";
import sharedMethods from "@/sharedMethods";

export const useAssessmentsStore = defineStore("assessments", {
  state: () => ({
    assessmentTypeCodes: new Map(),
    assessmentSessions: [],
  }),
  getters: {
    getAssessmentTypeCodeByCode: (state) => {
      return (code) => state.assessmentTypeCodes.get(code);
    },
    getActiveAssessmentSessions: (state) => {
      return state.assessmentSessions.filter(session => session.isOpen);
    },
    getAssessmentSessionById: (state) => {
      return (sessionId) => state.assessmentSessions.find(session => session.sessionId === sessionId);
    },
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
    },
    async setAssessmentSessions(assessmentSessions) {
      this.assessmentSessions = sharedMethods.applyDisplayOrder(assessmentSessions);
    },
    async getAssessmentSessions(getNewData = true) {
      //if (getNewData || !sharedMethods.dataArrayExists(this.assessmentSessions)) {
        let response = await StudentAssessmentService.getAssessmentSessions();
        await this.setAssessmentSessions(response.data);
      //}
    },
  },
}); 