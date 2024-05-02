<template>
  <div class="courses-all">
    <h1>Courses</h1>
    <div>
      <v-card no-body>
        <v-tabs v-model="tab" bg-color="transparent" grow>
          <v-tab value="courseTab" color="primary">Course</v-tab>
          <v-tab value="courseRestrictionsTab" color="primary"
            >Course restrictions</v-tab
          >
          <v-tab value="courseRequirementsTab" color="primary"
            >Course requirements</v-tab
          >
        </v-tabs>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="courseTab">
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
                        v-on:click="clearInput('courses')"
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
                        <strong>{{ totalResults }}</strong> course records
                        found.
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
            </v-window-item>
            <v-window-item value="courseRestrictionsTab">
              <b-card-text>
                <DisplayTable
                  title="Course restrictions"
                  v-bind:items="courseRestrictions"
                  v-bind:fields="courseRestrictionFields"
                  id="courseRestrictionId"
                  :showFilter="true"
                  pagination="true"
                >
                </DisplayTable>
              </b-card-text>
            </v-window-item>
            <v-window-item value="courseRequirementsTab">
              <b-card-text>
                <v-form v-on:submit.prevent id="courseReqForm">
                  <div class="advanced-search-form">
                    <v-row class="row my-3">
                      <div class="advanced-search-field col-12 col-md-2">
                        <div
                          href="#"
                          v-on:click="
                            requirementsSearchInput.courseCode.contains =
                              !requirementsSearchInput.courseCode.contains
                          "
                          v-bind:class="{
                            active: requirementsSearchInput.courseCode.contains,
                          }"
                          class="wild-card-button"
                        >
                          <v-tooltip activator="parent" location="top"
                            >Course code starts with</v-tooltip
                          >
                          [.*]
                        </div>
                        <v-text-field
                          label="Course code:"
                          v-model="requirementsSearchInput.courseCode.value"
                          placeholder=""
                          tabindex="1"
                        ></v-text-field>
                      </div>
                      <div class="advanced-search-field col-12 col-md-2">
                        <v-text-field
                          label="Course level:"
                          v-model="requirementsSearchInput.courseLevel.value"
                          placeholder=""
                          tabindex="2"
                          trim
                        ></v-text-field>
                      </div>
                      <div class="advanced-search-field col-12 col-md-2">
                        <div
                          href="#"
                          v-on:click="
                            requirementsSearchInput.rule.contains =
                              !requirementsSearchInput.rule.contains
                          "
                          v-bind:class="{
                            active: requirementsSearchInput.rule.contains,
                          }"
                          class="wild-card-button"
                        >
                          <v-tooltip activator="parent" location="top"
                            >Rule number starts with</v-tooltip
                          >
                          [.*]
                        </div>
                        <v-text-field
                          label="Rule#:"
                          v-model="requirementsSearchInput.rule.value"
                          placeholder=""
                          tabindex="3"
                          trim
                        ></v-text-field>
                      </div>
                    </v-row>
                    <v-row>
                      <div class="advanced-search-button">
                        <v-btn
                          v-on:click="courseRequirementsSearch"
                          v-if="!courseRequirementLoading"
                          color="primary"
                          tabindex="6"
                        >
                          <i class="fas fa-search" aria-hidden="true"></i>
                          Search
                        </v-btn>
                        <v-btn
                          color="success"
                          v-if="courseRequirementLoading"
                          tabindex="6"
                        >
                          <i class="fas fa-search" aria-hidden="true"></i>
                          Search
                          <v-progress-circular
                            v-if="courseRequirementLoading"
                            indeterminate
                            color="green"
                          >
                          </v-progress-circular>
                        </v-btn>
                        <v-btn
                          v-on:click="clearInput('requirements')"
                          class="btn btn-outline-primary mx-2"
                        >
                          Reset
                        </v-btn>
                      </div>
                    </v-row>
                    <div v-if="courseRequirements">
                      <div v-if="totalRequirementResults > 0" class="row">
                        <div
                          class="search-results-message my-3 col-12 col-md-8"
                        >
                          <strong>{{ totalRequirementResults }}</strong> course
                          requirements found.
                        </div>
                      </div>
                      <v-row v-if="courseRequirementMessage">
                        <div
                          class="search-results-message my-5 col-12 col-md-8"
                        >
                          <strong>{{ courseRequirementMessage }}</strong>
                        </div>
                      </v-row>
                    </div>
                  </div>
                </v-form>
                <DisplayTable
                  v-if="courseRequirements.length"
                  title="Course requirements"
                  v-bind:items="courseRequirements"
                  v-bind:fields="courseRequirementFields"
                  id="courseRestrictionId"
                  :showFilter="true"
                  pagination="true"
                >
                </DisplayTable>
              </b-card-text>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { showNotification } from "../utils/common.js";
import CourseService from "@/services/CourseService.js";
import DisplayTable from "@/components/DisplayTable.vue";
export default {
  name: "courses",
  components: {
    DisplayTable: DisplayTable,
  },
  data() {
    return {
      tab: null,
      advancedSearchLoading: false,
      advancedSearchMessage: "",
      courseRequirementLoading: false,
      courseRequirementMessage: "",
      courses: [],
      courseRequirements: [],
      courseRestrictions: [],
      totalResults: "",
      totalRequirementResults: "",
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
      requirementsSearchInput: {
        courseCode: {
          value: "",
          contains: false,
        },
        courseLevel: {
          value: "",
          contains: false,
        },
        rule: {
          value: "",
          contains: false,
        },
      },
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
      courseRestrictionFields: [
        {
          key: "mainCourse",
          title: "Course Code Main",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "mainCourseLevel",
          title: "Course Level Main",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "restrictedCourse",
          title: "Course Code Restricted",
          sortable: true,
          class: "text-left",
          sortDirection: "desc",
          editable: true,
        },
        {
          key: "restrictedCourseLevel",
          title: "Course Level Restricted",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "restrictionStartDate",
          title: "Restriction Start Date",
          sortable: true,
          class: "text-left",
          sortDirection: "desc",
          editable: true,
        },
        {
          key: "restrictionEndDate",
          title: "Restriction End Date",
          sortable: true,
          class: "text-left",
          editable: true,
        },
      ],
      courseRequirementFields: [
        {
          key: "courseCode",
          title: "Course code",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "courseLevel",
          title: "Course level",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "courseName",
          title: "Course name",
          sortable: true,
          class: "text-left",
          sortDirection: "desc",
          editable: true,
        },
        {
          key: "ruleCode",
          title: "Rule #",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "traxReqNumber",
          title: "Transcript Req #",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "requirementName",
          title: "Requirement name",
          sortable: true,
          class: "text-left",
          sortDirection: "desc",
          editable: true,
        },
        {
          key: "requirementProgram",
          title: "Requirement program",
          sortable: true,
          class: "text-left",
          editable: true,
        },
      ],
      courseCode: "",
      show: false,
      displayMessage: null,
      params: "",
    };
  },
  created() {
    this.showNotification = showNotification;
    this.getAllCourseRestrictions();
  },
  methods: {
    clearInput: function (type) {
      this.penInput = "";
      if (type == "requirements") {
        this.courseRequirements = "";
      } else {
        this.courses = "";
      }
      for (const key in this.advancedSearchInput) {
        if (this.advancedSearchInput.hasOwnProperty(key)) {
          this.advancedSearchInput[key].value = "";
          this.advancedSearchInput[key].contains = false;
        }
      }
      for (const reqKey in this.requirementsSearchInput) {
        if (this.requirementsSearchInput.hasOwnProperty(reqKey)) {
          this.requirementsSearchInput[reqKey].value = "";
          this.requirementsSearchInput[reqKey].contains = false;
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
                this.advancedSearchMessage = "No course record found.";
                this.showNotification(
                  "danger",
                  "Please enter the correct search fields."
                );
              } else {
                this.advancedSearchMessage = "No course record found.";
                // eslint-disable-next-line
                console.log("There was an error:" + error);
                this.showNotification(
                  "danger",
                  "There was an error with the web service."
                );
              }
            });
        } catch (error) {
          this.advancedSearchLoading = false;
          this.advancedSearchMessage = "Search Error" + error;
          this.showNotification(
            "danger",
            "There was an error with the web service."
          );
        }
      }
    },
    courseRequirementsSearch() {
      this.totalRequirementResults = "";
      this.courseRequirementMessage = "";
      this.courseRequirementLoading = true;
      this.params = new URLSearchParams();
      this.courseRequirements = [];
      let isEmpty = true;
      for (const key in this.requirementsSearchInput) {
        if (this.requirementsSearchInput.hasOwnProperty(key)) {
          if (this.requirementsSearchInput[key].value != "") {
            isEmpty = false;
          }
        }
      }
      if (isEmpty) {
        this.totalRequirementResults = "";
        this.courseRequirementLoading = false;
        this.courseRequirementMessage += "Enter at least one field to search.";
      } else if (!isEmpty) {
        try {
          if (this.requirementsSearchInput) {
            if (this.requirementsSearchInput.courseLevel.value != "") {
              if (
                this.requirementsSearchInput.courseLevel.contains &&
                !this.requirementsSearchInput.courseLevel.value.includes("*")
              ) {
                this.params.append(
                  "courseLevel",
                  this.requirementsSearchInput.courseLevel.value + "*"
                );
              } else {
                this.params.append(
                  "courseLevel",
                  this.requirementsSearchInput.courseLevel.value
                );
              }
            }
            if (this.requirementsSearchInput.courseCode.value != "") {
              if (
                this.requirementsSearchInput.courseCode.contains &&
                !this.requirementsSearchInput.courseCode.value.includes("*")
              ) {
                this.params.append(
                  "courseCode",
                  this.requirementsSearchInput.courseCode.value + "*"
                );
              } else {
                this.params.append(
                  "courseCode",
                  this.requirementsSearchInput.courseCode.value
                );
              }
            }
            if (this.requirementsSearchInput.rule.value != "") {
              if (
                this.requirementsSearchInput.rule.contains &&
                !this.requirementsSearchInput.rule.value.includes("*")
              ) {
                this.params.append(
                  "rule",
                  this.requirementsSearchInput.rule.value + "*"
                );
              } else {
                this.params.append(
                  "rule",
                  this.requirementsSearchInput.rule.value
                );
              }
            }
          }
          CourseService.getCourseRequirements(this.params)
            .then((response) => {
              this.courseRequirementLoading = false;
              this.courseRequirements = response.data;
              this.totalRequirementResults = this.courseRequirements.length;
              if (this.totalRequirementResults <= 0) {
                this.courseRequirementMessage = "No course requirements found.";
              }
            })
            .catch((error) => {
              this.courseRequirementLoading = false;
              this.courseRequirementMessage = "No course requirements found.";
              // eslint-disable-next-line
              console.log("There was an error:" + error);
              this.showNotification(
                "danger",
                "There was an error with the web service."
              );
            });
        } catch (error) {
          this.courseRequirementLoading = false;
          this.courseRequirementMessage = "Search Error";
          // eslint-disable-next-line
          console.log("There was an error:" + error);
          this.showNotification(
            "danger",
            "There was an error with the web service."
          );
        }
      }
    },
    searchCourseByCourseCode() {
      CourseService.getCourses(this.courseCode)
        .then((response) => {
          this.courses = response.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log("There was an error:" + error);
          this.showNotification(
            "danger",
            "There was an error with the web service."
          );
        });
    },
    getAllCourses() {
      CourseService.getAllCourses()
        .then((response) => {
          this.courses = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.showNotification(
            "danger",
            "There was an error with the web service."
          );
          // eslint-disable-next-line
          console.log("There was an error:" + error);
        });
    },
    getAllCourseRequirements() {
      CourseService.getAllCourseRequirements()
        .then((response) => {
          this.courseRequirements = response.data;
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          this.showNotification(
            "danger",
            "There was an error with the web service."
          );
          // eslint-disable-next-line
          console.log("There was an error:" + error);
        });
    },
    getAllCourseRestrictions() {
      CourseService.getCourseRestrictions()
        .then((response) => {
          this.courseRestrictions = response.data;
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          this.showNotification(
            "danger",
            "There was an error with the web service."
          );
          // eslint-disable-next-line
          console.log("There was an error:" + error);
        });
    },
    getAllCourseRestriction(mainCourseLevel, mainCourseCode) {
      CourseService.getCourseRestriction(mainCourseLevel, mainCourseCode)
        .then((response) => {
          this.courseRestrictions = response.data;
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          this.showNotification(
            "danger",
            "There was an error with the web service."
          );
          // eslint-disable-next-line
          console.log("There was an error:" + error);
        });
    },
  },
};
</script>

<style scoped>
.courses-all {
  padding-left: 25px;
  padding-right: 25px;
}
.close-record {
  float: right;
}
.tab-loading {
  color: green !important;
}
.profile-name {
  padding-bottom: 10px;
}
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
  top: 40px;
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
