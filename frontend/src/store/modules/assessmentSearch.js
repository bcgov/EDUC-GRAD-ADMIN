import {defineStore} from 'pinia';

export const assessmentSearchStore = defineStore('assessmentSearch', {
    namespaced: true,
    state: () => ({
        isAdvancedSearch: false,
        pageNumber: 1,
        headerSortParams: {
            currentSort: 'dob',
            currentSortAsc: true
        },
        selectedRecords: [],
        searchParams: {
            assessmentTypeCode: null,
            assessmentSession: {
                sessionIdStart: null,
                sessionIdEnd: null,
                sessionIdRange: [],
                useSessionRange: false,
            },
            schoolOfRecordSchoolID: null,
            schoolAtWriteSchoolID: null,
            gradeAtRegistration: null,
            proficiencyScore: null,
            provincialSpecialCaseCode: null,
            wroteFlag: null
        },
        assessmentSearchResponse: null
    }),
    getters: {
    },
    actions: {
        async clearSearchParams() {
            this.searchParams = {
                assessmentTypeCode: null,
                assessmentSession: {
                    sessionIdStart: null,
                    sessionIdEnd: null,
                    sessionIdRange: [],
                    useSessionRange: false,
                },
                schoolOfRecordSchoolID: null,
                schoolAtWriteSchoolID: null,
                gradeAtRegistration: null,
                proficiencyScore: null,
                provincialSpecialCaseCode: null,
                wroteFlag: null
            };
        },
        async clearSearchResults() {
            this.selectedRecords = [];
            this.assessmentSearchResponse = null;
        }
    }
});
