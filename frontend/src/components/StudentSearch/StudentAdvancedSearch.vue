<template>
  <div class="advanced-search-form mb-4">
    <h3>Advanced Student Search</h3>
    <p class="px-1">
      Use the advanced search to look up students by specified criteria.
    </p>
    <v-form v-on:submit.prevent>
      <v-row class="mt-1">
        <div class="advanced-search-field col-12 col-md-2">
          <div
            href="#"
            v-on:click="
              advancedSearchInput.legalLastName.contains =
                !advancedSearchInput.legalLastName.contains
            "
            v-bind:class="{
              active: advancedSearchInput.legalLastName.contains,
            }"
            class="wild-card-button"
          >
            <v-tooltip activator="parent" location="top"
              >Legal Surname Starts With</v-tooltip
            >
            [.*]
          </div>
          <v-text-field
            label="Legal Surname:"
            id="legal-surname-input"
            class="form__input"
            v-model="advancedSearchInput.legalLastName.value"
            placeholder=""
            v-on:keyup="keyHandler"
            tabindex="2"
          />
        </div>
        <div class="advanced-search-field col-12 col-md-2">
          <div
            href="#"
            v-on:click="
              advancedSearchInput.legalFirstName.contains =
                !advancedSearchInput.legalFirstName.contains
            "
            v-bind:class="{
              active: advancedSearchInput.legalFirstName.contains,
            }"
            class="wild-card-button"
          >
            <v-tooltip activator="parent" location="top"
              >Legal Given Starts With</v-tooltip
            >
            [.*]
          </div>
          <v-text-field
            label="Legal Given:"
            id="legal-given-input"
            v-model="advancedSearchInput.legalFirstName.value"
            placeholder=""
            v-on:keyup="keyHandler"
            tabindex="2"
          />
        </div>

        <div class="advanced-search-field col-12 col-md-2">
          <div
            href="#"
            v-on:click="
              advancedSearchInput.legalMiddleNames.contains =
                !advancedSearchInput.legalMiddleNames.contains
            "
            v-bind:class="{
              active: advancedSearchInput.legalMiddleNames.contains,
            }"
            class="wild-card-button"
          >
            <v-tooltip activator="parent" location="top"
              >Legal Middle Starts With</v-tooltip
            >
            [.*]
          </div>
          <v-text-field
            label="Legal Middle:"
            id="legal-middle-input"
            v-model="advancedSearchInput.legalMiddleNames.value"
            placeholder=""
            v-on:keyup="keyHandler"
            tabindex="3"
          />
        </div>
        <div class="advanced-search-field col-12 col-md-2">
          <v-select
            v-model="advancedSearchInput.gender.value"
            label="Gender:"
            id="gender-select"
            :items="genderOptions"
            item-title="text"
            item-value="value"
            tabindex="4"
          ></v-select>
        </div>
        <div class="form-group advanced-search-field col-12 col-md-2">
          <v-text-field
            label="Birthdate From:"
            class="form__input"
            id="datepicker-birthdate-from"
            v-model="advancedSearchInput.birthdateFrom.value"
            type="date"
            placeholder="YYYY-MM-DD"
            max="9999-12-30"
            :date-format-options="{ year: '4-digit' }"
            autocomplete="off"
            tabindex="6"
            v-on:keyup="keyHandler"
          ></v-text-field>
        </div>
        <div class="advanced-search-field col-12 col-md-2">
          <v-text-field
            label="Birthdate to:"
            id="datepicker-birthdate-to"
            v-model="advancedSearchInput.birthdateTo.value"
            type="date"
            placeholder="YYYY-MM-DD"
            max="9999-12-30"
            :date-format-options="{ year: '4-digit' }"
            autocomplete="off"
            tabindex="6"
            v-on:keyup="keyHandler"
          ></v-text-field>
        </div>
      </v-row>
      <v-row>
        <div class="advanced-search-field col-12 col-md-2">
          <div
            href="#"
            v-on:click="
              advancedSearchInput.usualLastName.contains =
                !advancedSearchInput.usualLastName.contains
            "
            v-bind:class="{
              active: advancedSearchInput.usualLastName.contains,
            }"
            class="wild-card-button"
          >
            <v-tooltip activator="parent" location="top"
              >Usual Surname Starts With</v-tooltip
            >
            [.*]
          </div>
          <v-text-field
            label="Usual Surname:"
            id="usual-surname-input"
            v-model="advancedSearchInput.usualLastName.value"
            placeholder=""
            v-on:keyup="keyHandler"
            tabindex="7"
          ></v-text-field>
        </div>
        <div class="advanced-search-field col-12 col-md-2">
          <div
            href="#"
            v-on:click="
              advancedSearchInput.usualFirstName.contains =
                !advancedSearchInput.usualFirstName.contains
            "
            v-bind:class="{
              active: advancedSearchInput.usualFirstName.contains,
            }"
            class="wild-card-button"
          >
            <v-tooltip activator="parent" location="top"
              >Usual Given Starts With</v-tooltip
            >
            [.*]
          </div>
          <v-text-field
            label="Usual Given:"
            id="usual-given-input"
            v-model="advancedSearchInput.usualFirstName.value"
            placeholder=""
            v-on:keyup="keyHandler"
            tabindex="8"
          ></v-text-field>
        </div>
        <div class="advanced-search-field col-12 col-md-2">
          <div
            href="#"
            v-on:click="
              advancedSearchInput.usualMiddleNames.contains =
                !advancedSearchInput.usualMiddleNames.contains
            "
            v-bind:class="{
              active: advancedSearchInput.usualMiddleNames.contains,
            }"
            class="wild-card-button"
          >
            <v-tooltip activator="parent" location="top"
              >Usual Middle Starts With</v-tooltip
            >
            [.*]
          </div>
          <v-text-field
            label="Usual Middle:"
            id="usual-middle-input"
            v-model="advancedSearchInput.usualMiddleNames.value"
            placeholder=""
            v-on:keyup="keyHandler"
            tabindex="9"
          ></v-text-field>
        </div>
      </v-row>
      <v-row>
        <div class="advanced-search-button">
          <v-btn
            id="adv-search-submit"
            @click="findStudentsByAdvancedSearch()"
            v-if="!advancedSearchLoading"
            color="primary"
            tabindex="12"
          >
            <i class="fas fa-search" aria-hidden="true"></i>
            &nbsp;Search
          </v-btn>
          <v-btn
            id="adv-search-submit"
            @click="findStudentsByAdvancedSearch()"
            v-if="advancedSearchLoading"
            color="success"
            tabindex="12"
          >
            <i class="fas fa-search" aria-hidden="true"></i>
            &nbsp;Search
            <v-progress-circular
              v-if="advancedSearchLoading"
              indeterminate
              color="green"
            >
            </v-progress-circular>
          </v-btn>
          <v-btn
            id="adv-search-reset-button"
            color="grey-lighten-3"
            @click="clearInput"
            class="mx-2"
          >
            Reset
          </v-btn>
          &nbsp;&nbsp;
        </div>
      </v-row>
    </v-form>
    <div v-if="studentSearchResults">
      <v-alert
        type="success"
        variant="tonal"
        border="start"
        class="mt-8 mb-2 ml-1 py-3 width-fit-content"
        v-if="advancedSearchMessage && advancedSearchAPIMessage"
        :text="`${advancedSearchMessage}\n${advancedSearchAPIMessage}`"
      ></v-alert>
      <!-- <div class="results-option-group col-12 col-md-4">
        <label v-if="totalPages > 1">Results per page</label>
        <v-select
          class="results-option"
          v-if="totalPages > 1"
          @change="findStudentsByAdvancedSearch()"
          v-model="resultsPerPage"
          :items="resultsPerPageOptions"
          :value="resultsPerPage"
          label="Results Per Page"
        ></v-select>
      </div> -->
    </div>

    <transition name="fade">
      <div v-if="studentSearchResults" class="table-responsive">
        <DisplayTable
          class="mt-12"
          v-if="studentSearchResults.length"
          v-bind:items="studentSearchResults"
          title="Student Search Results"
          v-bind:fields="studentSearchResultsFields"
          id="pen"
          v-bind:showFilter="false"
          v-bind:pagination="true"
        >
          <template v-slot:item.pen="{ item }">
            <router-link :to="'/student-profile/' + item.studentID">
              {{ item.pen }}
            </router-link></template
          >
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <ul>
                  <li>
                    <strong>Usual given:</strong>
                    {{ item.usualFirstName }}
                  </li>
                  <li>
                    <strong>Usual middle:</strong>
                    {{ item.usualMiddleNames }}
                  </li>
                  <li>
                    <strong>Usual surname:</strong>
                    {{ item.usualLastName }}
                  </li>
                </ul>
              </td>
            </tr>
          </template>
        </DisplayTable>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions, mapWritableState, storeToRefs } from "pinia";
import { useVuelidate } from "@vuelidate/core";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { useStudentStore } from "@/store/modules/student";
import StudentService from "@/services/StudentService.js";
import DisplayTable from "@/components/DisplayTable.vue";

export default {
  name: "StudentAdvancedSearch",
  components: {
    DisplayTable: DisplayTable,
  },
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      advancedSearchAPIMessage: "",
      resultsPerPageOptions: [
        { value: 10, text: "10" },
        { value: 25, text: "25" },
        { value: 50, text: "50" },
        { value: 100, text: "100" },
      ],
      genderOptions: [
        { value: "M", text: "Male (M)" },
        { value: "F", text: "Female (F)" },
        { value: "X", text: "Gender diverse (X)" },
        { value: "U", text: "Unknown (U)" },
      ],
      variants: [],
      studentSearchResults: [],
      studentSearchResultsFields: [
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
          key: "legalLastName",
          title: "Legal Surname",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "legalFirstName",
          title: "Legal Given",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "legalMiddleNames",
          title: "Legal Middle",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "dob",
          title: "Birthdate",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "genderCode",
          title: "Gender",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "program",
          title: "Program (GRAD)",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "studentGrade",
          title: "Student Grade (GRAD)",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecord",
          title: "School of Record (GRAD)",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecordName",
          title: "School of Record Name (GRAD)",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "studentStatus",
          title: "Student Status (GRAD)",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecordindependentAffiliation",
          title: "School Independent Affiliation (GRAD)",
          sortable: true,
          editable: false,
          class: "w-1",
        },
      ],
      totalElements: "",
      resultsPerPage: 25,
      totalPages: "",
      selectedPage: 1,
      advancedSearchMessage: "",
      errorMessage: "",
      advancedSearchLoading: false,
      showAdvancedSearchForm: false,
      advancedSearchInput: {
        legalFirstName: {
          value: "",
          contains: false,
        },
        legalLastName: {
          value: "",
          contains: false,
        },
        legalMiddleNames: {
          value: "",
          contains: false,
        },
        gender: {
          value: "",
          contains: false,
        },
        localId: {
          value: "",
          contains: false,
        },
        birthdateFrom: {
          value: "",
          contains: false,
          error: false,
        },
        birthdateTo: {
          value: "",
          contains: false,
        },
        usualFirstName: {
          value: "",
          contains: false,
        },
        usualLastName: {
          value: "",
          contains: false,
        },
        usualMiddleNames: {
          value: "",
          contains: false,
        },
      },
    };
  },
  watch: {},
  validations() {},
  created() {
    if (this.savedAdvSearchInput != "") {
      this.advancedSearchInput = this.savedAdvSearchInput;
      this.findStudentsByAdvancedSearch();
    }
  },
  computed: {
    ...mapState(useStudentStore, {
      profile: "getStudentProfile",
      savedAdvSearchInput: "getAdvancedSearchProps",
    }),
    ...mapWritableState(useStudentStore, {
      savedAdvSearchInput: "advancedSearchProps",
    }),
  },
  ...mapActions(useStudentStore, ["unsetStudent"]),
  closeRecord: function () {
    this.unsetStudent();
  },
  methods: {
    keyHandler: function (e) {
      if (e.keyCode === 13) {
        //enter key pressed
        this.studentSearchResults = [];
        if (this.penInput) {
          this.findStudentByPen();
        } else if (this.surnameInput) {
          this.findStudentBySurname();
        }
      }
    },
    findStudentsByAdvancedSearch: function () {
      this.advancedSearchMessage = "";
      this.message = "";
      this.errorMessage = "";

      if (this.v$.$invalid) {
        this.advancedSearchMessage +=
          "Form Validation Error: please correct the form input";
      } else if (
        !this.v$.$invalid &&
        this.advancedSearchValidate(this.advancedSearchInput)
      ) {
        // this.advancedSearchValidate(this.advancedSearchInput);
        this.advancedSearchLoading = true;
        this.studentSearchResults = [];
        if (!this.advancedSearchInput.birthdateTo.value) {
          this.advancedSearchInput.birthdateTo.value =
            this.advancedSearchInput.birthdateFrom.value;
        }
        try {
          StudentService.getStudentsByAdvancedSearch(this.advancedSearchInput)
            .then((response) => {
              this.advancedSearchLoading = false;
              if (response.data) {
                this.searchResults = response.data;
                this.advancedSearchAPIMessage = response.data.searchMessage;
                this.studentSearchResults =
                  this.searchResults.gradSearchStudents;
                this.totalElements = this.studentSearchResults.length;
                this.totalPages = this.searchResults.totalPages;
                this.savedAdvSearchInput = this.advancedSearchInput;
                // this.$store.dispatch(
                //   "setAdvancedSearchProps",
                //   this.advancedSearchInput
                // );
                if (this.totalElements > 0) {
                  if (this.searchResults.totalElements == 1) {
                    this.advancedSearchMessage = "1 student record found. ";
                  } else {
                    this.advancedSearchMessage =
                      this.totalElements + " student records found. ";
                  }
                }
              } else {
                this.snackbarStore.showSnackbar(
                  "Please refine your search criteria",
                  "error",
                  5000
                );
              }
            })
            .catch((err) => {
              this.advancedSearchLoading = false;
              this.advancedSearchMessage = "Student not found";
              this.errorMessage = err;
              this.snackbarStore.showSnackbar(err.message, "error", 5000);
            });
        } catch (error) {
          this.advancedSearchLoading = false;
          this.advancedSearchMessage = "Advanced Search Error";
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
        }
      }
    },
    showAdvancedSearch: function () {
      this.showAdvancedSearchForm = true;
    },
    clearInput: function () {
      // this.penInput = "";
      this.studentSearchResults = "";
      for (const key in this.advancedSearchInput) {
        if (this.advancedSearchInput.hasOwnProperty(key)) {
          this.advancedSearchInput[key].value = "";
          this.advancedSearchInput[key].contains = false;
        }
      }
      this.advancedSearchInput.birthdateFrom.value = "";
      this.advancedSearchInput.birthdateTo.value = "";
    },
    advancedSearchValidate(obj) {
      //check if all inputs are empty
      let isValid = true;
      let isEmpty = true;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key].value != "") {
            isEmpty = false;
            if (key == "birthdateFrom") {
              let dateToCheck = Date.parse(obj[key].value);
              let today = new Date();
              if (dateToCheck > today) {
                this.advancedSearchMessage +=
                  "The Birthdate From must not be greater than today. ";
                isValid = false;
              }
            }
          }
          //add wildcard to mincode if at least 3 digits are included
        } //mincode
      }

      if (isEmpty) {
        isValid = false;
        this.advancedSearchMessage += "Enter at least one field to search.";
      }

      return isValid;
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

.advanced-search {
  float: left;
  clear: both;
}

.advanced-search-form {
  background-color: #fff;
}

.advanced-search-field {
  padding-right: 10px;
}

.advanced-search-field label {
  float: left;
  clear: both;
}

.advanced-search-field input {
  float: left;
  clear: both;
  padding-left: 10px;
  width: 100%;
}

.advanced-search-button {
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
