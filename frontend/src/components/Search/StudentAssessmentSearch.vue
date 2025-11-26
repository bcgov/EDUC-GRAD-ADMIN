<template>
  <div class="assessment-search-form mb-4">
    <v-form v-on:submit.prevent>
      <v-row class="mt-1">
        <div class="assessment-search-field col-12 col-md-2">
          <v-text-field id="assessment-code"
            label="Assessment Code"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model.trim="searchParams.assessmentTypeCode"
            v-on:keyup="keyHandler"
          />
        </div>
        <div class="assessment-search-field col-12 col-md-2">
          <v-text-field id="assessment-session-from"
            label="Assessment Session From"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model.trim="searchParams.assessmentSession.startDate"
            v-on:keyup="keyHandler"
            disabled
          />
        </div>
          <div class="assessment-search-field col-12 col-md-2">
            <v-text-field id="assessment-session-to"
              label="Assessment Session To"
              variant="outlined"
              density="compact"
              class="form__input"
              v-model.trim="searchParams.assessmentSession.endDate"
              v-on:keyup="keyHandler"
              disabled
            />
        </div>
      </v-row>
      <v-row class="mt-1">
        <div class="assessment-search-field col-12 col-md-2">
          <v-text-field id="school-of-record"
              label="School of Record"
              variant="outlined"
              density="compact"
              class="form__input"
              v-model.trim="searchParams.schoolOfRecordSchoolID"
              v-on:keyup="keyHandler"
          />
        </div>
        <div class="assessment-search-field col-12 col-md-2">
          <v-text-field id="school-of-record-at-write"
              label="School of Record at Write"
              variant="outlined"
              density="compact"
              class="form__input"
              v-model.trim="searchParams.schoolAtWriteSchoolID"
              v-on:keyup="keyHandler"
          />
        </div>
        <div class="assessment-search-field col-12 col-md-2">
          <v-text-field id="grade"
              label="Grade"
              variant="outlined"
              density="compact"
              class="form__input"
              v-model.trim="searchParams.gradeAtRegistration"
              v-on:keyup="keyHandler"
          />
        </div>
      </v-row>
      <v-row class="mt-1">
        <div class="assessment-search-field col-12 col-md-2">
          <v-text-field id="proficiency-score"
            label="Proficiency Score"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model.trim="searchParams.proficiencyScore"
            v-on:keyup="keyHandler"
          />
        </div>
        <div class="assessment-search-field col-12 col-md-2">
          <v-text-field id="special-case"
            label="Special Case"
            variant="outlined"
            density="compact"
            class="form__input"
            v-model.trim="searchParams.provincialSpecialCaseCode"
            v-on:keyup="keyHandler"
          />
        </div>
        <div class="assessment-search-field col-12 col-md-2">
          <v-text-field id="wrote-flag"
              label="Wrote Flag"
              variant="outlined"
              density="compact"
              class="form__input"
              v-model.trim="searchParams.wroteFlag"
              v-on:keyup="keyHandler"
              disabled
          />
        </div>
      </v-row>
      <v-row>
        <div class="assessment-search-button">
          <v-btn
            prepend-icon="mdi-magnify"
            id="adv-search-submit"
            v-on:click="search"
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
    <div v-if="searchResults?.length > 0">
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
      <div v-if="searchResults" class="table-responsive">
        <DisplayTable
          class="mt-12"
          v-if="searchResults.length"
          v-bind:items="searchResults"
          title="Assessment Search Results"
          v-bind:fields="searchResultsFields"
          id="pen"
          v-bind:showFilter="false"
        >
          <template v-slot:item.pen="{ item }">
            <router-link :to="'/student-profile/' + item.studentID">
              {{ item.pen }}
            </router-link></template
          >
        </DisplayTable>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/store/modules/app";
import DisplayTable from "@/components/DisplayTable.vue";
import {assessmentSearchStore} from "@/store/modules/assessmentSearch";
import StudentAssessmentService from "@/services/StudentAssessmentService";
import { useSnackbarStore } from "@/store/modules/snackbar";
import schoolsService from "@/services/SchoolsService";

export default {
  name: "StudentAssessmentSearch",
  components: {
    DisplayTable: DisplayTable,
  },
  setup() {
    const snackbarStore = useSnackbarStore();
    return { snackbarStore };
  },
  data() {
    return {
      searchResults: [],
      searchResultsFields: [
        {
          key: "data-table-expand",
          title: "",
          class: "text-left",
        },
        {
          key: "pen",
          title: "PEN",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "surname",
          title: "Surname",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "givenName",
          title: "Given Name",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "gradeAtRegistration",
          title: "Grade",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecordSchoolID",
          title: "School of Record",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolAtWriteSchoolID",
          title: "School at Write",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "assessmentTypeCode",
          title: "Assessment Code",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "assessmentSession",
          title: "Assessment Session",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "proficiencyScore",
          title: "Proficiency Score",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "provincialSpecialCaseCode",
          title: "Special Case",
          sortable: true,
          editable: false,
          class: "w-1",
        },
      ],
      totalElements: "",
      resultsPerPage: 25,
      totalPages: "",
      selectedPage: 1,
      searchMessage: "",
      errorMessage: "",
      searchLoading: false,
      showAdvancedSearchForm: false,
    };
  },
  watch: {},
  validations() {},
  created() {},
  computed: {
    ...mapState(assessmentSearchStore, ['pageNumber', 'headerSortParams', 'assessmentSearchResponse', 'searchParams']),
    ...mapState(useAppStore, {
      getSchoolsList: "getSchoolsList",
      displaySchoolCategoryCode: "displaySchoolCategoryCode",
    }),
  },
  methods: {
    search() {
      // TODO validate fields
      const searchKeys = Object.keys(this.searchParams).filter(k => (this.searchParams[k] && this.searchParams[k].length !== 0));
      let searchParams;
      if (searchKeys?.length > 0) {
        searchParams = {};
        searchKeys.forEach(element => {
          if(element === 'assessmentSession'){
            // TODO expand when we get to this
            return;
          }
          searchParams[element] = this.searchParams[element];
        });
      //console.log(`You want to search on... ${JSON.stringify(searchParams)}`);
      let sort = {
        //updateDate: "DESC",
      };
      StudentAssessmentService.getStudentAssessmentsBySearchCriteria(
          searchParams,
          sort,
          this.selectedPage,
          this.resultsPerPage
      )
          .then((response) => {
            if(response.data){
              this.searchLoading = false;
              this.responseContent = response.data;
              this.searchResults =
                  this.responseContent?.content;
              this.convertSchoolIDsToMincodes();
              this.totalElements = this.responseContent.totalElements;
              this.totalPages = this.responseContent.totalPages;
              if (this.totalElements > 0) {
                this.searchMessage = (this.responseContent.totalElements === 1) ? "1 student record found. ": this.totalElements + " student records found. ";
              } else {
                this.snackbarStore.showSnackbar(
                    "There are [0] more matches on PEN. Please refine your search criteria",
                    "error",
                    5000
                );
              }
            }


            console.log(response.data);
          })
          .catch((error) => {
            if (error?.response?.status) {
              this.snackbarStore.showSnackbar(
                  "ERROR " + error?.response?.statusText,
                  "error",
                  10000,
                  "There was an error with the Student Service (getting the Student Course History): " +
                  error?.response?.status
              );
            }
          });
      }
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
    keyHandler: function (e) {
      if (e.keyCode === 13) {
        //enter key pressed
      }
    },
    clearInput: function () {
      this.searchResults = [];
      assessmentSearchStore().clearSearchParams();
    },
    isEmpty(obj) {
      let isEmpty = true;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] != "") {
            isEmpty = false;
          }
        }
      }
      return isEmpty;
    },
  },
};
</script>

<style scoped>
.table th {
  border-bottom: 2px solid #5475a7;
}

.assessment-search {
  float: left;
  clear: both;
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
.wild-card-button:hover {
  cursor: pointer;
}
.wild-card-button {
  color: #dee2eb;
  position: absolute;
  right: 21px;
  top: 10px;
  z-index: 10;
  text-decoration: none;
}

.wild-card-button:visited {
  color: #dee2eb;
  text-decoration: none;
}

.wild-card-button.active {
  color: green;
}

.advanced-loading-spinner {
  margin-top: 32px;
}

.results-option-group {
  text-align: right;
  margin-top: 10px;
}
.results-option {
  width: 100px;
  margin-left: 10px;
}
.input-group-append {
  margin-left: -1px;
  position: absolute;
  right: 0;
  z-index: 99;
}
</style>
