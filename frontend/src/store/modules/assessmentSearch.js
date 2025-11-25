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
                startDate: {
                    year: null,
                    month: null,
                    day: null
                },
                endDate: {
                    year: null,
                    month: null,
                    day: null
                },
                useDateRange: false,
            },
            schoolOfRecord: null,
            schoolOfRecordAtWrite: null,
            grade: null,
            proficiencyScore: null,
            specialCase: null,
            wroteFlag: null,
            pen: null
        },
        assessmentSearchResponse: null
    }),
    getters: {
    },
    actions: {
        async setPageNumber(pageNumber) {
            this.pageNumber = pageNumber;
        },
        async setSelectedRecords(selectedRecords) {
            this.selectedRecords = selectedRecords || [];
        },
        async setAssessmentSearchResponse(assessmentSearchResponse){
            this.assessmentSearchResponse = assessmentSearchResponse;
        },
        async setSearchParams(searchParams) {
            this.searchParams = searchParams;
        },
        async updateSortParams(sortHeader){
            if (sortHeader === this.headerSortParams.currentSort) {
                this.headerSortParams.currentSortAsc = !this.headerSortParams.currentSortAsc;
                this.pageNumber = 1;
            } else {
                this.headerSortParams.currentSort = sortHeader;
            }
        },
        async clearSearchParams() {
            this.searchParams = {
                assessmentTypeCode: null,
                assessmentSession: {
                    startDate: {
                        year: null,
                        month: null,
                        day: null
                    },
                    endDate: {
                        year: null,
                        month: null,
                        day: null
                    },
                    useDateRange: false,
                },
                schoolOfRecord: null,
                schoolOfRecordAtWrite: null,
                grade: null,
                proficiencyScore: null,
                specialCase: null,
                wroteFlag: null,
                pen: null
            };
        },
        async clearSearchResults() {
            this.selectedRecords = [];
            this.assessmentSearchResponse = null;
        }
    }
});
