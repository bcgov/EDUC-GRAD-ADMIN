import { defineStore } from 'pinia';

export const courseSearchStore = defineStore('courseSearch', {
    namespaced: true,
    state: () => ({
        searchParams: {
            studentStatus: null,
            schoolOfRecordSchoolID: null,
            districtOfRecord: null,
            schoolAtGraduationSchoolID: null,
            grade: null,
            program: null,
            programComplete: null,
            completionDateFrom: null,
            completionDateTo: null,
            courseID: null,
            associatedExam: null,
            finalLetterGrade: null,
            courseSessionFrom: null,
            courseSessionTo: null,
            equivalencyChallenge: null,
            fineArtsAppliedSkill: null
        }
    }),
    getters: {
    },
    actions: {
        async clearSearchParams() {
            this.searchParams = {
                studentStatus: null,
                schoolOfRecordSchoolID: null,
                districtOfRecord: null,
                schoolAtGraduationSchoolID: null,
                grade: null,
                program: null,
                programComplete: null,
                completionDateFrom: null,
                completionDateTo: null,
                courseID: null,
                associatedExam: null,
                finalLetterGrade: null,
                courseSessionFrom: null,
                courseSessionTo: null,
                equivalencyChallenge: null,
                fineArtsAppliedSkill: null
            };
        },
    }
});

