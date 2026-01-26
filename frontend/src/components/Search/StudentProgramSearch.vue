<template>
  <div class="program-search-form mb-4">
    <v-form v-on:submit.prevent>
      <v-row class="mt-1">
        <div class="program-search-field col-12 col-md-2">
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
        <div class="program-search-field col-12 col-md-2">
          <v-autocomplete
            id="program"
            label="Program"
            :items="programOptions"
            item-title="programCode"
            item-value="programCode"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model.trim="searchParams.program"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
        <div class="program-search-field col-12 col-md-2">
          <v-autocomplete
            id="grade"
            label="Grade"
            :items="studentGradeCodes.sort((a, b) => a.studentGradeCode.localeCompare(b.studentGradeCode))"
            item-title="studentGradeCode"
            item-value="studentGradeCode"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model.trim="searchParams.grade"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
        <div class="program-search-field col-12 col-md-2">
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
        <div class="program-search-field col-12 col-md-auto">
          <v-text-field
            id="completion-date-from"
            label="Completion Date From"
            variant="outlined"
            density="compact"
            type="date"
            class="form__input"
            v-model="searchParams.completionDateFrom"
            v-on:keyup="keyHandler"
            placeholder="YYYY-MM-DD"
            max="9999-12-30"
            clearable
          />
        </div>
        <div class="program-search-field col-12 col-md-auto">
          <v-text-field
            id="completion-date-to"
            label="Completion Date To"
            variant="outlined"
            density="compact"
            type="date"
            class="form__input"
            v-model="searchParams.completionDateTo"
            v-on:keyup="keyHandler"
            placeholder="YYYY-MM-DD"
            :min="searchParams.completionDateFrom || undefined"
            max="9999-12-30"
            clearable
          />
        </div>
      </v-row>
      <v-row v-if="dateRangeError" class="mt-0">
        <div class="col-12">
          <v-alert
            type="error"
            variant="tonal"
            density="compact"
            class="ml-1 py-2"
            :text="dateRangeError"
          ></v-alert>
        </div>
      </v-row>
      <v-row class="mt-1">
        <div class="program-search-field col-12 col-md-2">
          <SchoolSelect
            v-model="searchParams.schoolAtGraduationSchoolID"
            :disabled="false"
            label="School at Graduation"
            :items="getSchoolsList"
            :item-title="schoolTitle"
          />
        </div>
        <div class="program-search-field col-12 col-md-2">
          <SchoolSelect
            v-model="searchParams.schoolOfRecordSchoolID"
            :disabled="false"
            label="School of Record"
            :items="getSchoolsList"
            :item-title="schoolTitle"
          />
        </div>
        <div class="program-search-field col-12 col-md-2">
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
        <div class="program-search-field col-12 col-md-auto">
          <v-text-field
            id="adult-start-date-from"
            label="Adult Start Date From"
            variant="outlined"
            density="compact"
            type="date"
            class="form__input"
            v-model="searchParams.adultStartDateFrom"
            v-on:keyup="keyHandler"
            placeholder="YYYY-MM-DD"
            max="9999-12-30"
            clearable
          />
        </div>
        <div class="program-search-field col-12 col-md-auto">
          <v-text-field
            id="adult-start-date-to"
            label="Adult Start Date To"
            variant="outlined"
            density="compact"
            type="date"
            class="form__input"
            v-model="searchParams.adultStartDateTo"
            v-on:keyup="keyHandler"
            placeholder="YYYY-MM-DD"
            :min="searchParams.adultStartDateFrom || undefined"
            max="9999-12-30"
            clearable
          />
        </div>
      </v-row>
      <v-row v-if="adultStartDateRangeError" class="mt-0">
        <div class="col-12">
          <v-alert
            type="error"
            variant="tonal"
            density="compact"
            class="ml-1 py-2"
            :text="adultStartDateRangeError"
          ></v-alert>
        </div>
      </v-row>
      <v-row class="mt-1">
        <div class="program-search-field col-12 col-md-2">
          <v-select
            id="recalculate-grad-status"
            label="Recalculate Grad Status"
            :items="yesNoOptions"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model="searchParams.recalculateGradStatus"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
        <div class="program-search-field col-12 col-md-2">
          <v-select
            id="recalculate-projected-grad"
            label="Recalculate Projected Grad"
            :items="yesNoOptions"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model="searchParams.recalculateProjectedGrad"
            v-on:keyup="keyHandler"
            clearable
          />
        </div>
      </v-row>
      <v-row>
        <div class="program-search-button">
          <v-btn
            prepend-icon="mdi-magnify"
            id="program-search-submit"
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
            id="program-search-reset-button"
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
import { programSearchStore } from "@/store/modules/programSearch";
import { useSnackbarStore } from "@/store/modules/snackbar";
import StudentProgramService from "@/services/StudentProgramService";
import SchoolSelect from "@/components/Search/SchoolSelect.vue";

export default {
  name: "StudentProgramSearch",
  components: {
    SchoolSelect,
  },
  watch: {
    "searchParams.completionDateFrom"(newFrom) {
      if (!newFrom) {
        return;
      }
      if (
        this.searchParams.completionDateTo &&
        this.searchParams.completionDateTo < newFrom
      ) {
        this.searchParams.completionDateTo = null;
      }
    },
    "searchParams.adultStartDateFrom"(newFrom) {
      if (!newFrom) {
        return;
      }
      if (
        this.searchParams.adultStartDateTo &&
        this.searchParams.adultStartDateTo < newFrom
      ) {
        this.searchParams.adultStartDateTo = null;
      }
    },
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
      dateRangeError: "",
      adultStartDateRangeError: "",
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
      yesNoOptions: [
        { title: "Yes", value: "Y" },
        { title: "No", value: "N" },
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
          key: "adultStartDate",
          title: "Adult Start Date",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "recalculateGradStatus",
          title: "Recalculate Grad Status",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "recalculateProjectedGrad",
          title: "Recalculate Projected Grad",
          sortable: false,
          editable: false,
          class: "w-1",
        },
      ],
    };
  },
  computed: {
    ...mapState(programSearchStore, ["searchParams"]),
    ...mapState(useAppStore, {
      getSchoolsList: "getNonPSISchoolsList",
      schoolByMincode: "schoolByMincode",
      districtsList: "getDistrictList",
      studentGradeCodes: "studentGradeCodes",
      programOptions: "programOptions",
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
      this.dateRangeError = "";
      this.adultStartDateRangeError = "";
      this.hasSearched = false;
      programSearchStore().clearSearchParams();
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

      this.dateRangeError = "";
      if (
        this.searchParams.completionDateFrom &&
        this.searchParams.completionDateTo &&
        new Date(this.searchParams.completionDateFrom) >
          new Date(this.searchParams.completionDateTo)
      ) {
        this.dateRangeError =
          "Completion Date From cannot be after Completion Date To.";
        return;
      }

      this.adultStartDateRangeError = "";
      if (
        this.searchParams.adultStartDateFrom &&
        this.searchParams.adultStartDateTo &&
        new Date(this.searchParams.adultStartDateFrom) >
          new Date(this.searchParams.adultStartDateTo)
      ) {
        this.adultStartDateRangeError =
          "Adult Start Date From cannot be after Adult Start Date To.";
        return;
      }

      this.searchLoading = true;
      let sort = {};
      StudentProgramService.getStudentProgramsBySearchCriteria(
        this.apiSearchParamsBuilder(),
        sort,
        this.currentPage,
        this.itemsPerPage
      )
        .then((response) => {
          if (response.data) {
            this.responseContent = response.data;
            this.searchResults = this.responseContent?.content?.map(item => this.transformProgramData(item)) || [];
            this.totalElements = this.responseContent.totalElements || 0;
            this.totalPages = this.responseContent.totalPages || 0;
            this.searchMessage =
              this.responseContent.totalElements === 1
                ? "1 result found"
                : this.totalElements + " results found";
          }
        })
        .catch((error) => {
          console.error('Program search error:', error);
          if (error?.response?.status) {
            this.snackbarStore.showSnackbar(
              "ERROR " + error?.response?.statusText,
              "error",
              10000,
              "There was an error with the Program Service: " +
                error?.response?.status
            );
          }
        })
        .finally(() => {
          this.searchLoading = false;
        });
    },

    transformProgramData(item) {
      const parseDate = (dateStr) => {
        if (!dateStr) return '';
        try {
          // Handle both ISO format and "YYYY-MM-DD, HH:MM a.m./p.m." format
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
      const studentStatus = statusMap[item.studentStatus] || item.studentStatus;

      // Get school information
      let schoolOfRecordCode = '';
      let schoolOfRecordName = '';
      let schoolOfGraduationCode = '';
      let schoolOfGraduationName = '';

      if (item.schoolOfRecordId) {
        const school = this.getSchoolsList?.find(s => s.schoolId === item.schoolOfRecordId);
        if (school) {
          schoolOfRecordCode = school.mincode || '';
          schoolOfRecordName = school.displayName || '';
        }
      }

      if (item.schoolAtGraduationId) {
        const school = this.getSchoolsList?.find(s => s.schoolId === item.schoolAtGraduationId);
        if (school) {
          schoolOfGraduationCode = school.mincode || '';
          schoolOfGraduationName = school.displayName || '';
        }
      }

      return {
        studentID: item.studentID,
        pen: item.pen,
        studentStatus: studentStatus,
        surname: item.legalLastName,
        givenName: item.legalFirstName,
        middleName: item.legalMiddleNames || '',
        birthdate: parseDate(item.dob),
        grade: item.studentGrade,
        program: item.program,
        completionDate: parseDate(item.programCompletionDate),
        schoolOfRecordCode: schoolOfRecordCode,
        schoolOfRecordName: schoolOfRecordName,
        schoolOfGraduationCode: schoolOfGraduationCode,
        schoolOfGraduationName: schoolOfGraduationName,
        schoolOfRecordId: item.schoolOfRecordId,
        schoolOfGraduationId: item.schoolAtGraduationId || null,
        adultStartDate: parseDate(item.adultStartDate),
        recalculateGradStatus: item.recalculateGradStatus === 'Y' ? 'Yes' : 'No',
        recalculateProjectedGrad: item.recalculateProjectedGrad === 'Y' ? 'Yes' : 'No'
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
      const defaultFilename = `StudentProgramSearch-${dateStr}.csv`;

      StudentProgramService.downloadProgramStudentSearchReport(
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

.program-search-form {
  background-color: #fff;
  padding-left: 10px;
  padding-right: 10px;
}

.program-search-field {
  padding-right: 10px;
}

.program-search-field label {
  float: left;
  clear: both;
}

.program-search-field input {
  float: left;
  clear: both;
  padding-left: 10px;
  width: 100%;
}

.program-search-button {
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

