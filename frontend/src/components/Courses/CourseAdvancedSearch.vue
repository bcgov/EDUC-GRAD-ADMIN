<template>
  <div>
    <div class="advanced-search-form">
      <v-form v-on:submit.prevent>
        <v-row class="row my-3">
          <div class="advanced-search-field col-12 col-md-2">
            <div
              href="#"
              v-on:click="
                advancedSearchInput.courseCode.contains =
                  !advancedSearchInput.courseCode.contains
              "
              v-bind:class="{
                active: advancedSearchInput.courseCode.contains,
              }"
              class="wild-card-button"
            >
              <v-tooltip activator="parent" location="top"
                >Course code starts with</v-tooltip
              >
              [.*]
            </div>
            <v-text-field
              label="TRAX Code:"
              v-model="advancedSearchInput.courseCode.value"
              placeholder=""
              tabindex="1"
            />
          </div>
          <div class="advanced-search-field col-12 col-md-2">
            <div
              href="#"
              v-on:click="
                advancedSearchInput.courseLevel.contains =
                  !advancedSearchInput.courseLevel.contains
              "
              v-bind:class="{
                active: advancedSearchInput.courseLevel.contains,
              }"
              class="wild-card-button"
            >
              <v-tooltip activator="parent" location="top"
                >Course level starts with</v-tooltip
              >
              [.*]
            </div>
            <v-text-field
              label="TRAX Grade Level:"
              v-model="advancedSearchInput.courseLevel.value"
              placeholder=""
              tabindex="2"
            />
          </div>
          <div class="advanced-search-field col-12 col-md-2">
            <div
              href="#"
              v-on:click="
                advancedSearchInput.courseName.contains =
                  !advancedSearchInput.courseName.contains
              "
              v-bind:class="{
                active: advancedSearchInput.courseName.contains,
              }"
              class="wild-card-button"
            >
              <v-tooltip activator="parent" location="top"
                >Course name contains</v-tooltip
              >
              [.*]
            </div>
            <v-text-field
              label="Course Title:"
              v-model="advancedSearchInput.courseName.value"
              placeholder=""
              tabindex="3"
            />
          </div>
          <div class="advanced-search-field col-12 col-md-2">
            <v-select
              label="Instruction Language:"
              v-model="advancedSearchInput.language.value"
              :items="langOptions"
              item-title="text"
              item-value="value"
              tabindex="4"
            ></v-select>
          </div>
          <div class="advanced-search-field col-12 col-md-2">
            <v-text-field
              label="TRAX Start Date:"
              id="datepicker-startDate"
              v-model="advancedSearchInput.startDate.value"
              type="date"
              placeholder="YYYY-MM-DD"
              max="9999-12-30"
              :date-format-options="{ year: '4-digit' }"
              autocomplete="off"
              tabindex="5"
            ></v-text-field>
          </div>
          <div class="advanced-search-field col-12 col-md-2">
            <v-text-field
              label="TRAX End Date:"
              id="datepicker-endDate"
              v-model="advancedSearchInput.endDate.value"
              type="date"
              placeholder="YYYY-MM-DD"
              max="9999-12-30"
              :date-format-options="{ year: '4-digit' }"
              autocomplete="off"
              tabindex="6"
            ></v-text-field>
          </div>
        </v-row>
        <v-row>
          <div class="advanced-search-button">
            <v-btn
              v-on:click="advanceCourseSearch"
              v-if="!advancedSearchLoading"
              class="btn"
              color="primary"
              tabindex="7"
            >
              <i class="fas fa-search" aria-hidden="true"></i>
              Search
            </v-btn>
            <v-btn
              class="btn"
              color="success"
              v-if="advancedSearchLoading"
              tabindex="7"
              ><i class="fas fa-search" aria-hidden="true"></i>
              Search
              <v-progress-circular
                v-if="advancedSearchLoading"
                indeterminate
                color="green"
              >
              </v-progress-circular>
            </v-btn>
            <v-btn
              v-on:click="clearInput()"
              class="btn btn-outline-primary mx-2"
              tabindex="7"
            >
              Reset
            </v-btn>
          </div>
        </v-row>

        <div v-if="courses">
          <div v-if="totalResults > 0" class="row">
            <div class="search-results-message my-3 col-12 col-md-8">
              <strong>{{ totalResults }}</strong> course records found.
            </div>
          </div>
          <div v-if="advancedSearchMessage" class="row">
            <div class="search-results-message my-5 col-12 col-md-8">
              <strong>{{ advancedSearchMessage }}</strong>
            </div>
          </div>
        </div>
      </v-form>
    </div>
    <DisplayTable
      v-if="courses.length"
      title="Courses"
      v-bind:items="courses"
      v-bind:fields="courseFields"
      id="courseCode"
      :showFilter="true"
      pagination="true"
    ></DisplayTable>
  </div>
</template>

<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import CourseService from "@/services/CourseService.js";
import DisplayTable from "@/components/DisplayTable.vue";
export default {
  name: "courseAdvancedSearch",
  components: {
    DisplayTable: DisplayTable,
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      advancedSearchLoading: false,
      advancedSearchMessage: "",
      params: "",
      advancedSearchInput: {
        courseCode: {
          value: "",
          contains: false,
        },
        courseLevel: {
          value: "",
          contains: false,
        },
        courseName: {
          value: "",
          contains: false,
        },
        language: {
          value: "",
          contains: false,
        },
        startDate: {
          value: "",
          contains: false,
        },
        endDate: {
          value: "",
          contains: false,
        },
      },
      courses: [],
      totalResults: "",
      langOptions: [
        { text: "EN", value: "E" },
        { text: "FR", value: "F" },
      ],
      courseFields: [
        {
          key: "courseCode",
          title: "TRAX Course Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "courseLevel",
          title: "Grade Level",
          sortable: true,
          class: "text-center",
        },
        {
          key: "courseName",
          title: "Course Title",
          sortable: true,
        },
        {
          key: "numCredits",
          title: "Credit Value",
          class: "text-center",
          sortable: true,
        },
        {
          key: "language",
          title: "Instruction Language",
          sortable: true,
          class: "text-center",
        },
        {
          key: "startDate",
          title: "TRAX Start Date",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "endDate",
          title: "TRAX End Date",
          sortable: true,
          class: "text-center",
        },
        {
          key: "coRegID",
          title: "Coreg ID",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "workExpFlag",
          title: "Work Experience",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "genericCourseType",
          title: "Generic Course Type",
          sortable: true,
          class: "text-center",
        },
      ],
    };
  },
  methods: {
    clearInput() {
      this.courses = "";
      for (const key in this.advancedSearchInput) {
        if (this.advancedSearchInput.hasOwnProperty(key)) {
          this.advancedSearchInput[key].value = "";
          this.advancedSearchInput[key].contains = false;
        }
      }
    },
    advanceCourseSearch() {
      this.totalResults = "";
      this.advancedSearchMessage = "";
      this.advancedSearchLoading = true;
      this.params = new URLSearchParams();
      this.courses = [];
      let isEmpty = true;
      for (const key in this.advancedSearchInput) {
        if (this.advancedSearchInput.hasOwnProperty(key)) {
          if (this.advancedSearchInput[key].value != "") {
            isEmpty = false;
          }
        }
      }
      if (isEmpty) {
        this.totalResults = "";
        this.advancedSearchLoading = false;
        this.advancedSearchMessage += "Enter at least one field to search.";
      } else if (!isEmpty) {
        try {
          if (this.advancedSearchInput) {
            if (this.advancedSearchInput.courseCode.value != "") {
              if (
                this.advancedSearchInput.courseCode.contains &&
                !this.advancedSearchInput.courseCode.value.includes("*")
              ) {
                this.params.append(
                  "courseCode",
                  this.advancedSearchInput.courseCode.value + "*"
                );
              } else {
                this.params.append(
                  "courseCode",
                  this.advancedSearchInput.courseCode.value
                );
              }
            }
            if (this.advancedSearchInput.courseLevel.value != "") {
              if (
                this.advancedSearchInput.courseLevel.contains &&
                !this.advancedSearchInput.courseLevel.value.includes("*")
              ) {
                this.params.append(
                  "courseLevel",
                  this.advancedSearchInput.courseLevel.value + "*"
                );
              } else {
                this.params.append(
                  "courseLevel",
                  this.advancedSearchInput.courseLevel.value
                );
              }
            }
            if (this.advancedSearchInput.courseName.value != "") {
              if (
                this.advancedSearchInput.courseName.contains &&
                !this.advancedSearchInput.courseName.value.includes("*")
              ) {
                this.params.append(
                  "courseName",
                  this.advancedSearchInput.courseName.value + "*"
                );
              } else {
                this.params.append(
                  "courseName",
                  this.advancedSearchInput.courseName.value
                );
              }
            }
            if (this.advancedSearchInput.language.value != "") {
              if (
                this.advancedSearchInput.language.contains &&
                !this.advancedSearchInput.language.value.includes("*")
              ) {
                this.params.append(
                  "language",
                  this.advancedSearchInput.language.value + "*"
                );
              } else {
                this.params.append(
                  "language",
                  this.advancedSearchInput.language.value
                );
              }
            }
            if (this.advancedSearchInput.startDate.value != "") {
              this.params.append(
                "startDate",
                this.advancedSearchInput.startDate.value
              );
            }
            if (this.advancedSearchInput.endDate.value != "") {
              this.params.append(
                "endDate",
                this.advancedSearchInput.endDate.value
              );
            }
          }
          CourseService.getCoursesByAdvanceSearch(this.params)
            .then((response) => {
              this.advancedSearchLoading = false;
              this.courses = response.data;
              this.totalResults = this.courses.length;
              if (this.totalResults <= 0) {
                this.advancedSearchMessage = "No courses found.";
              }
            })
            .catch((error) => {
              this.advancedSearchLoading = false;
              if (error.response.status == 422) {
                this.snackbarStore.showSnackbar(
                  "Please enter the correct search fields.",
                  "error",
                  5000
                );
                this.advancedSearchMessage = "No course record found.";
              } else {
                this.advancedSearchMessage = "No course record found.";
                // eslint-disable-next-line
                console.log("There was an error:" + error);
                this.snackbarStore.showSnackbar(error.message, "error", 5000);
              }
            });
        } catch (error) {
          this.advancedSearchLoading = false;
          this.advancedSearchMessage = "Search Error" + error.message;
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
        }
      }
    },
  },
};
</script>

<style scoped>
.table-filter {
  top: 0px !important;
}
.advanced-search-form {
  background-color: #fff;
  margin-bottom: 20px;
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
.search-results-message {
  float: left;
  clear: both;
}
.advanced-search-button {
  padding-left: 15px;
}
</style>
