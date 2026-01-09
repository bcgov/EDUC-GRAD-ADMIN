<template>
  <div class="assessment-search-form mb-4">
    <v-form v-on:submit.prevent>
      <v-row class="mt-1">
        <div class="search-field col-12 col-md-3">
          <v-text-field id="pen"
                        v-model="searchParams.pen"
                        label="PEN"
                        variant="outlined"
                        clearable
                        density="compact"
                        pattern="\d*"
                        maxlength="9"
                        validate-on="blur lazy"
                        :rules="[v => !v || /^\d{9}$/.test(v) || 'PEN must be exactly 9 digits']"
                        @update:model-value="v => (searchParams.pen = (v ?? '').replace(/\D/g,'').slice(0,9) || null)"
          />
        </div>
        <div class="assessment-search-field col-12 col-md-3">
          <v-autocomplete id="student-status"
                          v-model="searchParams.studentStatus"
                          label="Student Status"
                          :items="studentStatusOptions"
                          item-title="code"
                          item-value="code"
                          variant="outlined"
                          clearable
                          density="compact"
          ></v-autocomplete>
        </div>
        <div class="search-field col-12 col-md-3">
          <v-autocomplete id="gender"
                          v-model="searchParams.genderCode"
                          label="Gender"
                          :items="genderCodes"
                          :item-title="item => `${item.label} (${item.genderCode})`"
                          item-value="genderCode"
                          variant="outlined"
                          clearable
                          density="compact"
                          v-on:keyup="keyHandler"
          ></v-autocomplete>
        </div>
      </v-row>
      <v-row class="mt-1">
        <div class="search-field col-12 col-md-3">
          <v-text-field id="legal-last-name"
                        v-model="searchParams.legalLastName"
                        label="Legal Surname"
                        variant="outlined"
                        clearable
                        density="compact"
          >
            <template #append-inner>
              <v-tooltip text="Wildcard search (contains)">
                <template #activator="{ props }">
                  <v-chip
                      v-bind="props"
                      class="wildcard-chip"
                      size="small"
                      label
                      :variant="searchParams.wildcards.legalLastName ? 'elevated' : 'outlined'"
                      :color="searchParams.wildcards.legalLastName ? 'primary' : 'grey-lighten-1'"
                      @click.stop="searchParams.wildcards.legalLastName = !searchParams.wildcards.legalLastName"
                  >
                    .*
                  </v-chip>
                </template>
              </v-tooltip>
            </template>
          </v-text-field>
        </div>
        <div class="search-field col-12 col-md-3">
          <v-text-field id="legal-given-name"
                        v-model="searchParams.legalFirstName"
                        label="Legal Given Name"
                        variant="outlined"
                        clearable
                        density="compact"
          >
            <template #append-inner>
              <v-tooltip text="Wildcard search (contains)">
                <template #activator="{ props }">
                  <v-chip
                      v-bind="props"
                      class="wildcard-chip"
                      size="small"
                      label
                      :variant="searchParams.wildcards.legalFirstName ? 'elevated' : 'outlined'"
                      :color="searchParams.wildcards.legalFirstName ? 'primary' : 'grey-lighten-1'"
                      @click.stop="searchParams.wildcards.legalFirstName = !searchParams.wildcards.legalFirstName"
                  >
                    .*
                  </v-chip>
                </template>
              </v-tooltip>
            </template>
          </v-text-field>
        </div>
        <div class="search-field col-12 col-md-3">
          <v-text-field id="legal-middle-name"
                        v-model="searchParams.legalMiddleNames"
                        label="Legal Middle Name"
                        variant="outlined"
                        clearable
                        density="compact"
          >
            <template #append-inner>
              <v-tooltip text="Wildcard search (contains)">
                <template #activator="{ props }">
                  <v-chip
                      v-bind="props"
                      class="wildcard-chip"
                      size="small"
                      label
                      :variant="searchParams.wildcards.legalMiddleNames ? 'elevated' : 'outlined'"
                      :color="searchParams.wildcards.legalMiddleNames ? 'primary' : 'grey-lighten-1'"
                      @click.stop="searchParams.wildcards.legalMiddleNames = !searchParams.wildcards.legalMiddleNames"
                  >
                    .*
                  </v-chip>
                </template>
              </v-tooltip>
            </template>
          </v-text-field>
        </div>
      </v-row>
      <v-row class="mt-1">
        <div class="search-field col-12 col-md-3">
          <v-text-field
              id="datepicker-birthdate-from"
              label="Birthdate"
              variant="outlined"
              density="compact"
              v-model="searchParams.dobFrom"
              type="date"
              max="9999-12-30"
              autocomplete="off"
              clearable
          />
        </div>
        <div class="range-check">
          <v-checkbox
              id="session-range-checkbox"
              v-model="searchParams.useBirthdateRange"
              class="ma-0 pa-0"
              height="100%"
              density="compact"
              :label="searchParams.useBirthdateRange ? 'To:' : 'Use Range'"
              color="#606060"
              @update:model-value="onUseBirthdateRangeChanged"
          />
        </div>
        <div class="search-field col-12 col-md-3" v-if="searchParams.useBirthdateRange">
          <v-text-field
              id="datepicker-birthdate-to"
              label="Birthdate"
              variant="outlined"
              density="compact"
              v-model="searchParams.dobTo"
              type="date"

              :min="searchParams.dobFrom || undefined"
              max="9999-12-30"
              autocomplete="off"
              clearable
          />
        </div>
      </v-row>
      <v-row class="mt-1">
        <div class="search-button">
          <v-btn
            prepend-icon="mdi-magnify"
            id="search-submit"
            v-on:click="onSearchClicked"
            :loading="searchLoading"
            :disabled="searchLoading"
            variant="flat"
            color="primary"
            class="text-none"
          >Search</v-btn>
          <v-btn
            class="mx-2 text-none"
            id="adv-search-reset-button"
            color="primary"
            variant="outlined"
            @click="clearInput"
          >Reset</v-btn>
        </div>
      </v-row>
    </v-form>
  </div>
  <div v-if="searchMessage" class="d-flex align-center mt-8 mb-2">
    <v-alert
        type="success"
        variant="tonal"
        border="start"
        class="ml-1 py-3 width-fit-content"
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
</template>
<script>
import { useAppStore } from "@/store/modules/app";
import {mapState} from "pinia";
import {useSnackbarStore} from "@/store/modules/snackbar";
import StudentService from "@/services/StudentService";
import schoolsService from "@/services/SchoolsService";

export default {
  name: "StudentAdvSearch",
  watch: {
    "searchParams.dobFrom"(newFrom) {
      if (!newFrom) {
        this.searchParams.dobTo = null;
        return;
      }
      if (this.searchParams.dobTo && this.searchParams.dobTo < newFrom) {
        this.searchParams.dobTo = null;
      }
    },
  },
  setup() {
    const snackbarStore = useSnackbarStore();
    return { snackbarStore };
  },
  mounted() {

  },
  data() {
    return {
      searchResults: [],
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
      totalElements: "",
      searchMessage: "",
      errorMessage: "",
      searchLoading: false,
      downloadLoading: false,
      searchParams: {
        pen: null,
        studentStatus: null,
        legalFirstName: null,
        legalLastName: null,
        legalMiddleNames: null,
        dobFrom: null,
        dobTo: null,
        genderCode: null,
        useBirthdateRange: false,
        wildcards: {
          legalFirstName: false,
          legalLastName: false,
          legalMiddleNames: false,
        }
      },
      searchResultsHeaders: [
        {
          key: "pen",
          title: "PEN",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "studentStatus",
          title: "Student Status",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "legalLastName",
          title: "Surname",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "legalFirstName",
          title: "Given Name",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "legalMiddleNames",
          title: "Middle Name",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "dob",
          title: "Birthdate",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "genderCode",
          title: "Gender",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "studentGrade",
          title: "Grade",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "program",
          title: "Program",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "programCompletionDate",
          title: "Completion Date",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecordId",
          title: "School of Record",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecordSchoolName",
          title: "School of Record Name",
          sortable: false,
          editable: false,
          class: "w-1",
        },
      ],
    }
  },
  computed: {
    ...mapState(useAppStore, {
      studentStatusOptions: "studentStatusOptions",
      genderCodes: "genderCodes",
      getSchoolById: "getSchoolById",
    }),
  },
  methods: {
    async onSearchClicked() {
      this.hasSearched = true;
      this.search();
    },
    search() {
      console.log(`Searching for: ${JSON.stringify(this.searchParams)}`);
      if (!this.hasSearched) {
        return;
      }
      this.searchLoading = true;
      StudentService.getStudentsBySearchCriteria(
          this.apiSearchParamsBuilder(),
          {},
          this.currentPage,
          this.itemsPerPage
      ).then((res) => {
        console.log(`Data returned from search ::: ${JSON.stringify(res.data)}`);
        if (res.data) {
          this.responseContent = res.data;
          this.searchResults =
              this.responseContent?.content;
          this.convertSearchResults();
          this.totalElements = this.responseContent.totalElements;
          this.totalPages = this.responseContent.totalPages;
          this.searchMessage = (this.responseContent.totalElements === 1) ? "1 student record found. " : this.totalElements + " student records found. ";
        }
      }).catch((error) => {
            if (error?.response?.status) {
              this.snackbarStore.showSnackbar(
                  "ERROR " + error?.response?.statusText,
                  "error",
                  10000,
                  "There was an error with the Student Service: " +
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
    apiSearchParamsBuilder() {
      const EXCLUDED_KEYS = ['useBirthdateRange', 'wildcards'];

      const WILDCARD_RENAMES = {
        legalFirstName:   { flag: 'legalFirstName',  apiKey: 'legalFirstNameWild' },
        legalLastName:    { flag: 'legalLastName',   apiKey: 'legalLastNameWild' },
        legalMiddleNames: { flag: 'legalMiddleNames', apiKey: 'legalMiddleNameWild' }, // note singular flag
      };

      const apiSearchParams = {};
      const wildcardFlags = this.searchParams.wildcards || {};

      const searchKeys = Object.keys(this.searchParams).filter((k) => {
        if (EXCLUDED_KEYS.includes(k)) return false;

        const value = this.searchParams[k];
        if (value === null || value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        return !(Array.isArray(value) && value.length === 0);
      });

      searchKeys.forEach((key) => {
        const value = this.searchParams[key];
        // rename key if wildcard toggle is on for that field
        let apiKey = key;
        const rename = WILDCARD_RENAMES[key];
        if (rename && wildcardFlags[rename.flag]) {
          apiKey = rename.apiKey;
        }
        apiSearchParams[apiKey] = Array.isArray(value) ? value.join(',') : value;
      });

      return apiSearchParams;
    }
    ,
    clearInput: function () {
      this.searchResults = [];
      this.searchMessage = "";
      this.hasSearched = false;
      this.clearSearchParams(this.searchParams);
    },
    clearSearchParams: function (searchParams) {
      for (const k of Object.keys(searchParams)) {
        const v = searchParams[k];
        if (v && typeof v === "object" && !Array.isArray(v)) {
          this.clearSearchParams(v);
        } else {
          searchParams[k] = null;
        }
      }
    },
    keyHandler: function (e) {
      if (e.keyCode === 13) {
        //enter key pressed
      }
    },
    onUseBirthdateRangeChanged(checked) {
      if (!checked) {
        this.searchParams.dobTo = null;
        this.searchParams.useBirthdateRange = false;
      }
    },
    convertSearchResults() {
      const parseDate = (s) => {
        if (!s) return null;
        if (typeof s === "string" && s.includes(",")) return s.split(",")[0].trim();
        return String(s).slice(0, 10);
      };

      this.searchResults = this.searchResults.map((student) => {
        const originalSchoolId = student.schoolOfRecordId;
        const mincode = schoolsService.schoolIdToMincode(originalSchoolId) || originalSchoolId;
        const school = this.getSchoolById(originalSchoolId);
        const schoolName = school?.displayName ?? null;

        return {
          ...student,
          schoolOfRecordId: mincode,
          dob: parseDate(student.dob),
          programCompletionDate: parseDate(student.programCompletionDate),
          schoolOfRecordSchoolName: schoolName,
        };
      });
    }
    ,
  }
}
</script>
<style scoped>
.range-check :deep(.v-label.v-label--clickable) {
  display: flex;
  align-items: center;
  padding-top: .5em;
  padding-bottom: 0;
}

:deep(.wildcard-chip) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-weight: 800;
  cursor: pointer;
  user-select: none;
}

.table th {
  border-bottom: 2px solid #5475a7;
}

.search-form {
  background-color: #fff;
}

.search-field {
  padding-right: 10px;
}

.search-field label {
  float: left;
  clear: both;
}

.search-field input {
  float: left;
  clear: both;
  padding-left: 10px;
  width: 100%;
}

.search-button {
  margin-top: 32px;
  padding-left: 15px;
}

.export-link-container {
  padding-right: 15px;
}

.export-results-link {
  color: rgb(56, 89, 138) !important;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}

.export-results-link:hover:not(.disabled-link):not(.loading-link) {
  color: rgb(41, 66, 102);
}

.export-results-link.disabled-link {
  color: rgba(0, 0, 0, 0.38) !important;
  cursor: default;
  pointer-events: none;
}

.export-results-link.loading-link {
  cursor: default;
  pointer-events: none;
}
</style>