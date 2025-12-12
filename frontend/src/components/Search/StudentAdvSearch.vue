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
          >
          </v-text-field>
        </div>
      </v-row>
      <v-row class="mt-1"></v-row>
      <v-row class="mt-1"></v-row>
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
</template>
<script>

export default {
name: "StudentAdvSearch",
  setup(){

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
      searchParams: {
        pen: null,
        studentStatus: null,
        legalFirstName: null,
        legalLastName: null,
        legalMiddleNames: null,
        dob: null,
        genderCode: null,
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
  methods: {
    onSearchClicked() {
      this.hasSearched = true;
      this.search();
    },
    search() {
      if (!this.hasSearched) {
        return;
      }
      this.searchLoading = true;
      console.log(`Searching for: ${this.searchParams.pen}`);
      this.searchLoading = false;
    },
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
    }
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