import { defineStore } from "pinia";

export const optionalProgramSearchStore = defineStore("optionalProgramSearch", {
  state: () => ({
    searchParams: {
      studentStatus: null,
      schoolOfRecordSchoolID: null,
      districtOfRecord: null,
      programComplete: null,
      schoolAtGraduationSchoolID: null,
      optionalProgram: null,
      optionalProgramCompletionDateFrom: null,
      optionalProgramCompletionDateTo: null,
      program: null,
      grade: null,
    },
  }),
  getters: {
    getSearchParams: (state) => state.searchParams,
  },
  actions: {
    setSearchParams(params) {
      this.searchParams = { ...params };
    },
    clearSearchParams() {
      this.searchParams = {
        studentStatus: null,
        schoolOfRecordSchoolID: null,
        districtOfRecord: null,
        programComplete: null,
        schoolAtGraduationSchoolID: null,
        optionalProgram: null,
        optionalProgramCompletionDateFrom: null,
        optionalProgramCompletionDateTo: null,
        program: null,
        grade: null,
      };
    },
  },
});

