<template>
  <div class="assessment-search-form mb-4">
    <v-form v-on:submit.prevent>
      <v-row class="mt-1">
        <div class="assessment-search-field col-12 col-md-3">
          <v-autocomplete id="assessment-code"
              v-model="searchParams.assessmentTypeCode"
              label="Assessment Code"
              :items="assessmentTypeCodes"
              item-title="assessmentTypeCode"
              item-value="assessmentTypeCode"
              variant="outlined"
              clearable
              density="compact"
              v-on:keyup="keyHandler"
          ></v-autocomplete>
        </div>
        <div class="assessment-search-field col-12 col-md-2">
          <v-autocomplete
              v-model="searchParams.sessionIdStart"
              item-title="sessionDate"
              item-value="sessionID"
              :items="assessmentSessions"
              label="Session"
              :loading="isLoadingSessions"
              clearable
              @update:model-value="onSessionStartChanged"
              variant="outlined"
              density="compact"
          ></v-autocomplete>
        </div>
        <div class="range-check">
          <v-checkbox
              id="session-range-checkbox"
              v-model="searchParams.useSessionRange"
              class="ma-0 pa-0"
              height="100%"
              density="compact"
              :label="searchParams.useSessionRange ? 'To:' : 'Use Range'"
              :disabled="!searchParams.sessionIdStart"
              color="#606060"
              @update:model-value="onUseSessionRangeChanged"
          />
        </div>
          <div v-if="searchParams.useSessionRange" class="assessment-search-field col-12 col-md-2">
            <v-autocomplete
                v-model="searchParams.sessionIdEnd"
                item-title="sessionDate"
                item-value="sessionID"
                :items="sessionEndOptions"
                label="Session"
                :loading="isLoadingSessions"
                clearable
                variant="outlined"
                density="compact"
            ></v-autocomplete>
        </div>
      </v-row>
      <v-row class="mt-1">
        <div class="assessment-search-field col-12 col-md-3">
          <SchoolSelect
              v-model="searchParams.schoolOfRecordSchoolID"
              :disabled="false"
              label="Select school of record"
              :items="getSchoolsList"
              :item-title="schoolTitle"
          />
        </div>
        <div class="assessment-search-field col-12 col-md-3">
          <SchoolSelect
              v-model="searchParams.schoolAtWriteSchoolID"
              :disabled="false"
              label="Select school at write"
              :items="getSchoolsList"
              :item-title="schoolTitle"
          />
        </div>
        <div class="assessment-search-field col-12 col-md-3">
          <v-text-field id="grade"
              label="Grade"
              variant="outlined"
              density="compact"
              class="form__input"
              v-model.trim="searchParams.gradeAtRegistration"
              v-on:keyup="keyHandler"
              clearable
          />
        </div>
      </v-row>
      <v-row class="mt-1">
        <div class="assessment-search-field col-12 col-md-3">
          <v-autocomplete id="proficiency-score"
            label="Proficiency Score"
            variant="outlined"
            density="compact"
            class="form__input"
            :items="proficiencyScores"
            v-model.trim="searchParams.proficiencyScoreValue"
            v-on:keyup="keyHandler"
            clearable
            multiple
          />
        </div>
        <div class="assessment-search-field col-12 col-md-3">
          <v-autocomplete
              id="special-case-code"
              :items="provincialSpecialCaseCodes"
              :item-title="item => `${item.provincialSpecialCaseCode} - ${item.label}`"
              item-value="provincialSpecialCaseCode"
              label="Special Case"
              variant="outlined"
              density="compact"
              class="form__input"
              v-model="searchParams.provincialSpecialCaseCode"
              v-on:keyup="keyHandler"
              clearable
              multiple
          >
          </v-autocomplete>
        </div>
        <div class="assessment-search-field col-12 col-md-3">
          <v-select id="wrote-flag"
              label="Wrote Flag"
              variant="outlined"
              density="compact"
              class="form__input"
              v-model="searchParams.wroteFlag"
              v-on:keyup="keyHandler"
              :items="wroteFlagOptions"
              clearable
          />
        </div>
      </v-row>
      <v-row>
        <div class="assessment-search-button">
          <v-btn
            prepend-icon="mdi-magnify"
            id="adv-search-submit"
            v-on:click="onSearchClicked"
            :loading="searchLoading"
            :disabled="searchLoading"
            variant="flat"
            color="primary"
            class="text-none"
            >Search</v-btn
          >
          <v-btn
            class="mx-2 text-none"
            id="adv-search-reset-button"
            color="primary"
            variant="outlined"
            @click="clearInput"
          >
            Reset
          </v-btn>
          &nbsp;&nbsp;
        </div>
      </v-row>
    </v-form>
    <div v-if="searchMessage">
      <v-alert
        type="success"
        variant="tonal"
        border="start"
        class="mt-8 mb-2 ml-1 py-3 width-fit-content"
        v-if="searchMessage"
        :text="`${searchMessage}`"
      ></v-alert>
    </div>

    <transition name="fade">
      <div v-if="totalPages > 0 && hasSearched" class="table-responsive">
        <v-data-table-server
            v-model:items-per-page="itemsPerPage"
            :items-per-page-options="itemsPerPageOptions"
            :headers="searchResultsHeaders"
            :items="searchResults"
            :items-length="totalElements"
            :loading="searchLoading"
            item-value="id"
            @update:options="updateDataTable"
        >
          <template v-slot:item.pen="{ item }">
            <router-link :to="'/student-profile/' + item.studentID">
              {{ item.pen }}
            </router-link></template
          >
        </v-data-table-server>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/store/modules/app";
import {assessmentSearchStore} from "@/store/modules/assessmentSearch";
import StudentAssessmentService from "@/services/StudentAssessmentService";
import { useSnackbarStore } from "@/store/modules/snackbar";
import schoolsService from "@/services/SchoolsService";
import OpenStatusBadge from "@/components/Common/OpenStatusBadge.vue";
import SchoolSelect from "@/components/Search/SchoolSelect.vue";

export default {
  name: "StudentAssessmentSearch",
  components: {
    SchoolSelect,
    OpenStatusBadge,
  },
  setup() {
    const snackbarStore = useSnackbarStore();
    return { snackbarStore };
  },
  data() {
    return {
      searchResults: [],
      assessmentSessions: [],
      currentPage: 1,
      itemsPerPage: 10,
      hasSearched: false,
      itemsPerPageOptions: [
        { title: "10", value: 10 },
        { title: "25", value: 25 },
        { title: "50", value: 50 },
        { title: "100", value: 100 },
      ],
      totalPages: "",
      searchMessage: "",
      errorMessage: "",
      searchLoading: false,
      isLoadingSessions: true,
      showAdvancedSearchForm: false,
      totalElements: "",
      proficiencyScores: ['1', '2', '3', '4'],
      searchResultsHeaders: [
        {
          key: "pen",
          title: "PEN",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "surname",
          title: "Surname",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "givenName",
          title: "Given Name",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "gradeAtRegistration",
          title: "Grade",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecordSchoolID",
          title: "School of Record",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolAtWriteSchoolID",
          title: "School at Write",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "assessmentTypeCode",
          title: "Assessment Code",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "sessionID",
          title: "Assessment Session",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "proficiencyScore",
          title: "Proficiency Score",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "provincialSpecialCaseCode",
          title: "Special Case",
          sortable: false,
          editable: false,
          class: "w-1",
        },
      ],
    };
  },
  computed: {
    ...mapState(assessmentSearchStore, ['searchParams', 'wroteFlagOptions']),
    ...mapState(useAppStore, {
      getSchoolsList: "getSchoolsList",
      displaySchoolCategoryCode: "displaySchoolCategoryCode",
      getSchoolById: "getSchoolById",
      provincialSpecialCaseCodes: "provincialSpecialCaseCodes",
      assessmentTypeCodes: "assessmentTypeCodes",
    }),
    sessionEndOptions() {
      const startId = this.searchParams.sessionIdStart;
      if (!startId) return [];
      const startIndex = this.assessmentSessions.findIndex(
          s => s.sessionID === startId
      );
      if (startIndex === -1) return [];
      return this.assessmentSessions.slice(startIndex + 1);
    },
  },
  async mounted() {
    await this.loadAssessmentSessions();
  },
  methods: {
    apiSearchParamsBuilder() {
      const EXCLUDED_KEYS = ['sessionIdStart', 'sessionIdEnd', 'useSessionRange'];
      const apiSearchParams = {};
      // Handle session ranges
      const { sessionIdStart, sessionIdEnd, useSessionRange } = this.searchParams;
      if (useSessionRange && sessionIdStart && sessionIdEnd) {
        const sessionIdRange = this.getSessionIdsInRange(sessionIdStart, sessionIdEnd);
        if (sessionIdRange.length > 0) {
          apiSearchParams.sessionIds = sessionIdRange.join(',');
        }
      } else if (sessionIdStart) {
        // single session search
        apiSearchParams.session = sessionIdStart;
      }
      // Default fields
      const searchKeys = Object.keys(this.searchParams).filter((k) => {
        if (EXCLUDED_KEYS.includes(k)) return false;
        const value = this.searchParams[k];
        if (value === null || value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        return !(Array.isArray(value) && value.length === 0);
      });
      searchKeys.forEach((key) => {
        apiSearchParams[key] = (Array.isArray(this.searchParams[key])) ? this.searchParams[key].join(',') : this.searchParams[key];
      });
      return apiSearchParams;
    },

    clearInput: function () {
      this.searchResults = [];
      this.searchMessage = "";
      this.hasSearched = false;
      assessmentSearchStore().clearSearchParams();
    },
    convertSchoolIDsToMincodes: function () {
      this.searchResults.forEach((student) => {
        student.schoolOfRecordSchoolID =
            schoolsService.schoolIdToMincode(student.schoolOfRecordSchoolID)
            ?? student.schoolOfRecordSchoolID;
        student.schoolAtWriteSchoolID =
            schoolsService.schoolIdToMincode(student.schoolAtWriteSchoolID)
            ?? student.schoolAtWriteSchoolID;
      });
    },
    convertSessionIdsToSessionDates: function () {
      this.searchResults.forEach((student) => {
        const session = this.assessmentSessions.find(
            s => s.sessionID === student.sessionID
        );
        if (session) {
          student.sessionID = session.sessionDate;
        }
      });
    },
    getSessionIdsInRange(startId, endId) {
      if (!startId || !endId) return [];
      const sessions = this.assessmentSessions;
      const startIndex = sessions.findIndex(s => s.sessionID === startId);
      const endIndex = sessions.findIndex(s => s.sessionID === endId);
      if (startIndex === -1 || endIndex === -1) {
        return [];
      }
      const from = Math.min(startIndex, endIndex);
      const to = Math.max(startIndex, endIndex);
      return sessions.slice(from, to + 1).map(s => s.sessionID);
    },
    keyHandler: function (e) {
      if (e.keyCode === 13) {
        //enter key pressed
      }
    },
    async loadAssessmentSessions() {
      this.isLoadingSessions = true;
      try {
        const response = await StudentAssessmentService.getAssessmentSessions();
        const mapped = this.assessmentSessions = response.data.map(session => ({
          sessionID: session.sessionID,
          sessionDate: `${session.courseYear}-${String(session.courseMonth).padStart(2, '0')}`,
          assessments: session.assessments.map(assessment => ({
            assessmentID: assessment.assessmentID,
            assessmentTypeCode: assessment.assessmentTypeCode
          }))
        }));
        mapped.sort((a, b) => b.sessionDate.localeCompare(a.sessionDate));
        this.assessmentSessions = mapped;
      } catch (error) {
        this.snackbarStore.showSnackbar(
            "Failed to fetch assessment sessions",
            "error",
            5000
        );
      } finally {
        this.isLoadingSessions = false;
      }
    },
    onSearchClicked() {
      this.hasSearched = true;
      this.search();
    },
    onSessionStartChanged() {
      this.searchParams.sessionIdEnd = null;
    },
    onUseSessionRangeChanged(checked) {
      if (!checked) {
        this.searchParams.sessionIdEnd = null;
        this.searchParams.useSessionRange = false;
      }
    },
    schoolTitle(item) {
      if (item) {
        return `${item.mincode} - ${item.displayName}`;
      } else {
        return null;
      }
    },
    search() {
      if (!this.hasSearched) {
        return;
      }
      this.searchLoading = true;
      let sort = {};
      StudentAssessmentService.getStudentAssessmentsBySearchCriteria(
          this.apiSearchParamsBuilder(),
          sort,
          this.currentPage,
          this.itemsPerPage
      )
          .then((response) => {
            if (response.data) {
              this.responseContent = response.data;
              this.searchResults =
                  this.responseContent?.content;
              this.convertSchoolIDsToMincodes();
              this.convertSessionIdsToSessionDates();
              this.totalElements = this.responseContent.totalElements;
              this.totalPages = this.responseContent.totalPages;
              this.searchMessage = (this.responseContent.totalElements === 1) ? "1 student record found. " : this.totalElements + " student records found. ";
            }
          })
          .catch((error) => {
            if (error?.response?.status) {
              this.snackbarStore.showSnackbar(
                  "ERROR " + error?.response?.statusText,
                  "error",
                  10000,
                  "There was an error with the Assessment Service: " +
                  error?.response?.status
              );
            }
          })
          .finally(() => {
            this.searchLoading = false;
          });
    },
    updateDataTable({page}) {
      this.currentPage = page;
      this.search();
    },
  },
};
</script>

<style scoped>
.range-check :deep(.v-label.v-label--clickable) {
  display: flex;
  align-items: center;
  padding-top: .5em;
  padding-bottom: 0;
}

.table th {
  border-bottom: 2px solid #5475a7;
}

.assessment-search-form {
  background-color: #fff;
}

.assessment-search-field {
  padding-right: 10px;
}

.assessment-search-field label {
  float: left;
  clear: both;
}

.assessment-search-field input {
  float: left;
  clear: both;
  padding-left: 10px;
  width: 100%;
}

.assessment-search-button {
  margin-top: 32px;
  padding-left: 15px;
}
</style>
