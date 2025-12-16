import { defineStore } from 'pinia';

export const programSearchStore = defineStore('programSearch', {
    namespaced: true,
    state: () => ({
        searchParams: {
            studentStatus: null,
            program: null,
            grade: null,
            programComplete: null,
            completionDateFrom: null,
            completionDateTo: null,
            schoolAtGraduationSchoolID: null,
            schoolOfRecordSchoolID: null,
            districtOfRecord: null,
            adultStartDateFrom: null,
            adultStartDateTo: null,
            recalculateGradStatus: null,
            recalculateProjectedGrad: null
        }
    }),
    getters: {
    },
    actions: {
        async clearSearchParams() {
            this.searchParams = {
                studentStatus: null,
                program: null,
                grade: null,
                programComplete: null,
                completionDateFrom: null,
                completionDateTo: null,
                schoolAtGraduationSchoolID: null,
                schoolOfRecordSchoolID: null,
                districtOfRecord: null,
                adultStartDateFrom: null,
                adultStartDateTo: null,
                recalculateGradStatus: null,
                recalculateProjectedGrad: null
            };
        },
    }
});

