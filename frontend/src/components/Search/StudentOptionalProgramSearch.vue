<template>
  <div class="optional-program-search-form mb-4">
    <v-form v-on:submit.prevent>
      <v-row class="mt-1">
        <div class="optional-program-search-field col-12 col-md-2">
          <v-select
            id="student-status"
            v-model="searchParams.studentStatus"
            label="Student Status"
            :items="studentStatusOptions"
            variant="outlined"
            clearable
            density="compact"
            v-on:keyup="keyHandler"
          ></v-select>
        </div>
        <div class="optional-program-search-field col-12 col-md-2">
          <SchoolSelect
            v-model="searchParams.schoolOfRecordSchoolID"
            :disabled="false"
            label="School of Record"
            :items="getSchoolsList"
            :item-title="schoolTitle"
          />
        </div>
        <div class="optional-program-search-field col-12 col-md-2">
          <v-autocomplete
            id="district-of-record"
            v-model="searchParams.districtOfRecord"
            label="District of Record"
            :items="districtsList"
            :item-title="districtTitle"
            item-value="districtNumber"
            variant="outlined"
            clearable
            density="compact"
            v-on:keyup="keyHandler"
          ></v-autocomplete>
        </div>
        <div class="optional-program-search-field col-12 col-md-2">
          <v-select
            id="program-complete"
            label="Program Complete?"
            :items="programCompleteOptions"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model="searchParams.programComplete"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
        <div class="optional-program-search-field col-12 col-md-2">
          <SchoolSelect
            v-model="searchParams.schoolAtGraduationSchoolID"
            :disabled="false"
            label="School at Graduation"
            :items="getSchoolsList"
            :item-title="schoolTitle"
          />
        </div>
        <div class="optional-program-search-field col-12 col-md-2">
          <v-autocomplete
            id="optional-program"
            label="Optional Program"
            :items="groupedOptionalProgramOptions"
            item-title="optionalProgramName"
            item-value="optionalProgramID"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model.trim="searchParams.optionalProgram"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
      </v-row>
      <v-row class="mt-1">
        <div class="optional-program-search-field col-12 col-md-auto">
          <v-text-field
            id="optional-program-completion-date-from"
            label="Optional Program Completion Date From"
            variant="outlined"
            density="compact"
            type="date"
            class="form__input"
            v-model="searchParams.optionalProgramCompletionDateFrom"
            v-on:keyup="keyHandler"
            placeholder="YYYY-MM-DD"
            max="9999-12-30"
            clearable
          />
        </div>
        <div class="optional-program-search-field col-12 col-md-auto">
          <v-text-field
            id="optional-program-completion-date-to"
            label="Optional Program Completion Date To"
            variant="outlined"
            density="compact"
            type="date"
            class="form__input"
            v-model="searchParams.optionalProgramCompletionDateTo"
            v-on:keyup="keyHandler"
            placeholder="YYYY-MM-DD"
            max="9999-12-30"
            clearable
          />
        </div>
      </v-row>
      <v-row>
        <div class="optional-program-search-button">
          <v-btn
            prepend-icon="mdi-magnify"
            id="optional-program-search-submit"
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
            id="optional-program-search-reset-button"
            color="primary"
            variant="outlined"
            @click="clearInput"
          >
            Reset
          </v-btn>
        </div>
      </v-row>
    </v-form>
    <div v-if="searchMessage" class="d-flex align-center mt-8 mb-2">
      <v-alert
        type="success"
        variant="tonal"
        border="start"
        class="ml-1 py-3 width-fit-content"
        :text="`${searchMessage}`"
      ></v-alert>
      <v-spacer></v-spacer>
      <div class="export-link-container">
        <a
          id="export-results-link"
          @click="totalElements > 0 && !downloadLoading ? downloadReport() : null"
          :class="{ 'disabled-link': totalElements === 0, 'loading-link': downloadLoading }"
          class="export-results-link"
        >
          <v-progress-circular
            v-if="downloadLoading"
            indeterminate
            size="16"
            width="2"
            color="rgb(56, 89, 138)"
            class="mr-1"
          ></v-progress-circular>
          <v-icon v-else size="small" class="mr-1">mdi-download</v-icon>
          <span>Export Results</span>
        </a>
      </div>
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
          item-value="studentID"
          @update:options="updateDataTable"
        >
          <template v-slot:item.pen="{ item }">
            <router-link :to="'/student-profile/' + item.studentID">
              {{ item.pen }}
            </router-link>
          </template>
        </v-data-table-server>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/store/modules/app";
import { optionalProgramSearchStore } from "@/store/modules/optionalProgramSearch";
import { useSnackbarStore } from "@/store/modules/snackbar";
import StudentOptionalProgramService from "@/services/StudentOptionalProgramService";
import SchoolSelect from "@/components/Search/SchoolSelect.vue";

export default {
  name: "StudentOptionalProgramSearch",
  components: {
    SchoolSelect,
  },
  setup() {
    const snackbarStore = useSnackbarStore();
    return { snackbarStore };
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
      searchMessage: "",
      errorMessage: "",
      searchLoading: false,
      downloadLoading: false,
      totalElements: "",
      studentStatusOptions: [
        { title: "Current", value: "CUR" },
        { title: "Archived", value: "ARC" },
        { title: "Deceased", value: "DEC" },
        { title: "Merged", value: "MER" },
        { title: "Terminated", value: "TER" },
      ],
      programCompleteOptions: [
        { title: "Yes", value: "yes" },
        { title: "No", value: "no" },
      ],
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
          key: "middleName",
          title: "Middle Name",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "birthdate",
          title: "Birthdate",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "grade",
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
          key: "completionDate",
          title: "Completion Date",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecordCode",
          title: "School of Record Code",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecordName",
          title: "School of Record Name",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfGraduationCode",
          title: "School of Graduation Code",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfGraduationName",
          title: "School of Graduation Name",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "optionalProgram",
          title: "Optional Program",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "optionalProgramCompletionDate",
          title: "Optional Program Completion Date",
          sortable: false,
          editable: false,
          class: "w-1",
        },
      ],
    };
  },
  computed: {
    ...mapState(optionalProgramSearchStore, ["searchParams"]),
    ...mapState(useAppStore, {
      getSchoolsList: "getNonPSISchoolsList",
      schoolByMincode: "schoolByMincode",
      districtsList: "getDistrictList",
      optionalProgramOptions: "optionalProgramOptions",
      groupedOptionalProgramOptions: "groupedOptionalProgramOptions",
      optionalProgramIdToNameMap: "optionalProgramIdToNameMap",
    }),
  },
  created() {
    this.appStore = useAppStore();
  },
  methods: {
    apiSearchParamsBuilder() {
      const apiSearchParams = {};
      const searchKeys = Object.keys(this.searchParams).filter((k) => {
        const value = this.searchParams[k];
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return !(Array.isArray(value) && value.length === 0);
      });
      searchKeys.forEach((key) => {
        if (key === "districtOfRecord") {
          const districtNumber = this.searchParams[key];

          const district = this.districtsList.find(d => d.districtNumber === districtNumber);

          if (!district) {
            return;
          }

          const districtId = district.districtId;

          const schoolsInDistrict = this.getSchoolsList.filter(
            (school) => school.districtId === districtId
          );

          const schoolIds = schoolsInDistrict.map((school) => school.schoolId).join(",");

          if (schoolIds) {
            apiSearchParams[key] = schoolIds;
          }
        } else if (key === "optionalProgram") {
          // Find the selected optional program and use all its IDs
          const selectedProgramId = this.searchParams[key];
          const selectedProgram = this.groupedOptionalProgramOptions?.find(
            op => op.optionalProgramID === selectedProgramId
          );

          if (selectedProgram && selectedProgram.allOptionalProgramIDs) {
            apiSearchParams[key] = selectedProgram.allOptionalProgramIDs.join(",");
          } else {
            apiSearchParams[key] = selectedProgramId;
          }
        } else {
          apiSearchParams[key] = Array.isArray(this.searchParams[key])
            ? this.searchParams[key].join(",")
            : this.searchParams[key];
        }
      });
      return apiSearchParams;
    },

    clearInput: function () {
      this.searchResults = [];
      this.searchMessage = "";
      this.hasSearched = false;
      optionalProgramSearchStore().clearSearchParams();
    },

    keyHandler: function (e) {
      if (e.keyCode === 13) {
        //enter key pressed
      }
    },

    onSearchClicked() {
      this.hasSearched = true;
      this.search();
    },

    schoolTitle(item) {
      if (item) {
        const status = item.closedDate ? "Closed" : "Open";
        return `${item.mincode} - ${item.displayName} (${status})`;
      } else {
        return null;
      }
    },

    districtTitle(item) {
      if (item) {
        const status = item.districtStatusCode === "ACTIVE" ? "Open" : "Closed";
        return `${item.districtNumber} - ${item.displayName} (${status})`;
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
      StudentOptionalProgramService.getStudentOptionalProgramsBySearchCriteria(
        this.apiSearchParamsBuilder(),
        sort,
        this.currentPage,
        this.itemsPerPage
      )
        .then((response) => {
          if (response.data) {
            this.responseContent = response.data;
            this.searchResults = this.responseContent?.content?.map(item => this.transformOptionalProgramData(item)) || [];
            this.totalElements = this.responseContent.totalElements || 0;
            this.totalPages = this.responseContent.totalPages || 0;
            this.searchMessage =
              this.responseContent.totalElements === 1
                ? "1 result found"
                : this.totalElements + " results found";
          }
        })
        .catch((error) => {
          console.error('Optional program search error:', error);
          if (error?.response?.status) {
            this.snackbarStore.showSnackbar(
              "ERROR " + error?.response?.statusText,
              "error",
              10000,
              "There was an error with the Optional Program Service: " +
                error?.response?.status
            );
          }
        })
        .finally(() => {
          this.searchLoading = false;
        });
    },

    transformOptionalProgramData(item) {
      const parseDate = (dateStr) => {
        if (!dateStr) return '';
        try {
          if (dateStr.includes(',')) {
            return dateStr.split(',')[0].trim();
          }
          return new Date(dateStr).toISOString().split('T')[0];
        } catch (e) {
          console.warn('Error parsing date:', dateStr, e);
          return '';
        }
      };

      const statusMap = {
        'CUR': 'Current',
        'ARC': 'Archived',
        'DEC': 'Deceased',
        'MER': 'Merged',
        'TER': 'Terminated'
      };

      const gradStudent = item.gradStudent || {};
      const studentStatus = statusMap[gradStudent.studentStatus] || gradStudent.studentStatus || '';

      let schoolOfRecordCode = '';
      let schoolOfRecordName = '';
      let schoolOfGraduationCode = '';
      let schoolOfGraduationName = '';

      if (gradStudent.schoolOfRecordId) {
        const school = this.getSchoolsList?.find(s => s.schoolId === gradStudent.schoolOfRecordId);
        if (school) {
          schoolOfRecordCode = school.mincode || '';
          schoolOfRecordName = school.displayName || '';
        }
      }

      if (gradStudent.schoolAtGraduationId) {
        const school = this.getSchoolsList?.find(s => s.schoolId === gradStudent.schoolAtGraduationId);
        if (school) {
          schoolOfGraduationCode = school.mincode || '';
          schoolOfGraduationName = school.displayName || '';
        }
      }

      let optionalProgramName = '';
      if (item.optionalProgramID) {
        optionalProgramName = this.optionalProgramIdToNameMap?.[item.optionalProgramID] || '';
      }

      return {
        studentID: gradStudent.studentID,
        pen: gradStudent.pen,
        studentStatus: studentStatus,
        surname: gradStudent.legalLastName,
        givenName: gradStudent.legalFirstName,
        middleName: gradStudent.legalMiddleNames || '',
        birthdate: parseDate(gradStudent.dob),
        grade: gradStudent.studentGrade,
        program: gradStudent.program,
        completionDate: parseDate(gradStudent.programCompletionDate),
        schoolOfRecordCode: schoolOfRecordCode,
        schoolOfRecordName: schoolOfRecordName,
        schoolOfGraduationCode: schoolOfGraduationCode,
        schoolOfGraduationName: schoolOfGraduationName,
        schoolOfRecordId: gradStudent.schoolOfRecordId,
        schoolOfGraduationId: gradStudent.schoolAtGraduationId || null,
        optionalProgram: optionalProgramName,
        optionalProgramCompletionDate: parseDate(item.completionDate),
      };
    },

    updateDataTable({ page }) {
      this.currentPage = page;
      this.search();
    },

    downloadReport() {
      this.downloadLoading = true;
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const dateStr = `${year}${month}${day}`;
      const defaultFilename = `StudentOptionalProgramSearch-${dateStr}.csv`;

      StudentOptionalProgramService.downloadOptionalProgramStudentSearchReport(
        this.apiSearchParamsBuilder()
      )
        .then((response) => {
          if (response.data) {
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', defaultFilename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            this.snackbarStore.showSnackbar(
              "Report downloaded successfully",
              "success",
              5000
            );
          }
        })
        .catch((error) => {
          if (error?.response?.status) {
            this.snackbarStore.showSnackbar(
              "ERROR " + error?.response?.statusText,
              "error",
              10000,
              "There was an error downloading the report: " +
                error?.response?.status
            );
          } else {
            this.snackbarStore.showSnackbar(
              "Failed to download report",
              "error",
              5000
            );
          }
        })
        .finally(() => {
          this.downloadLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.table th {
  border-bottom: 2px solid #5475a7;
}

.optional-program-search-form {
  background-color: #fff;
  padding-left: 10px;
  padding-right: 10px;
}

.optional-program-search-field {
  padding-right: 10px;
}

.optional-program-search-field label {
  float: left;
  clear: both;
}

.optional-program-search-field input {
  float: left;
  clear: both;
  padding-left: 10px;
  width: 100%;
}

.optional-program-search-button {
  margin-top: 32px;
  padding-left: 5px;
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

