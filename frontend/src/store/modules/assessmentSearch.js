import {defineStore} from 'pinia';

export const assessmentSearchStore = defineStore('assessmentSearch', {
    namespaced: true,
    state: () => ({
        searchParams: {
            assessmentTypeCode: null,
            sessionIdStart: null,
            sessionIdEnd: null,
            sessionIdRange: [],
            useSessionRange: false,
            schoolOfRecordSchoolID: null,
            schoolAtWriteSchoolID: null,
            gradeAtRegistration: null,
            proficiencyScoreValue: null,
            provincialSpecialCaseCode: [],
            wroteFlag: null
        },
        wroteFlagOptions: [
            { title: 'Yes', value: 'yes' },
            { title: 'No', value: 'no' }
        ],
    }),
    getters: {
    },
    actions: {
        async clearSearchParams() {
            this.searchParams = {
                assessmentTypeCode: null,
                sessionIdStart: null,
                sessionIdEnd: null,
                sessionIdRange: [],
                useSessionRange: false,
                schoolOfRecordSchoolID: null,
                schoolAtWriteSchoolID: null,
                gradeAtRegistration: null,
                proficiencyScoreValue: null,
                provincialSpecialCaseCode: [],
                wroteFlag: null
            };
        },
    }
});
