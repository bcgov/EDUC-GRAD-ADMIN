import {defineStore} from 'pinia';

const getDefaultAdvancedSearchCriteria = () => {
    return {
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
    };
};

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
        advancedSearchCriteria: getDefaultAdvancedSearchCriteria(),
        searchParams: {
            assessmentCode: null,
            assessmentSession: {
                from: null,
                to: null
            },
            schoolOfRecord: null,
            schoolOfRecordAtWrite: null,
            grade: null,
            proficiencyScore: null,
            specialCase: null,
            wroteFlag: null
        },
        assessmentSearchResponse: null
    }),
    getters: {
    },
    actions: {
        async setIsAdvancedSearch(isAdvancedSearch) {
            this.isAdvancedSearch = isAdvancedSearch;
        },
        async setPageNumber(pageNumber) {
            this.pageNumber = pageNumber;
        },
        async setSelectedRecords(selectedRecords) {
            this.selectedRecords = selectedRecords || [];
        },
        async setAssessmentSearchResponse(assessmentSearchResponse){
            this.assessmentSearchResponse = assessmentSearchResponse;
        },
        async setAdvancedSearchCriteria(advancedSearchCriteria) {
            this.advancedSearchCriteria = advancedSearchCriteria;
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
            this.advancedSearchCriteria = getDefaultAdvancedSearchCriteria();
            this.searchParams = {
                assessmentCode: null,
                assessmentSession: {
                    from: null,
                    to: null
                },
                schoolOfRecord: null,
                schoolOfRecordAtWrite: null,
                grade: null,
                proficiencyScore: null,
                specialCase: null,
                wroteFlag: null
            };
        },
        async clearSearchResults() {
            this.selectedRecords = [];
            this.assessmentSearchResponse = null;
        }
    }
});
