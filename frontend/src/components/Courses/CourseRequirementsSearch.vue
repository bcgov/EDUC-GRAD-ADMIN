<template>
  <div>
    <h3 class="ml-2 mt-5">Course Requirements Search</h3>
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
        <v-row class="mt-n3">
          <div class="advanced-search-button">
            <v-btn
              v-on:click="courseRequirementsSearch"
              v-if="!courseRequirementLoading"
              color="primary"
              tabindex="6"
            >
              <i class="fas fa-search" aria-hidden="true"></i>
              &nbsp;Search
            </v-btn>
            <v-btn color="success" v-if="courseRequirementLoading" tabindex="6">
              <i class="fas fa-search" aria-hidden="true"></i>
              &nbsp;Search
              <v-progress-circular
                v-if="courseRequirementLoading"
                indeterminate
                color="green"
              >
              </v-progress-circular>
            </v-btn>
            <v-btn
              v-on:click="clearInput()"
              class="btn btn-outline-primary mx-2"
            >
              Reset
            </v-btn>
          </div>
        </v-row>
        <div v-if="courseRequirements">
          <v-alert
            type="success"
            variant="tonal"
            border="start"
            class="mt-8 mb-0 ml-1 py-3 width-fit-content"
            v-if="totalRequirementResults > 0"
            :text="`${totalRequirementResults} course requirements
              found`"
          ></v-alert>
          <v-alert
            type="error"
            variant="tonal"
            border="start"
            class="mt-8 mb-0 ml-1 py-3 width-fit-content"
            v-if="!!courseRequirementMessage"
            :text="courseRequirementMessage"
          ></v-alert>
        </div>
      </div>
    </v-form>
    <DisplayTable
      class="mt-n5"
      v-if="courseRequirements.length"
      title="Course requirements"
      v-bind:items="courseRequirements"
      v-bind:fields="courseRequirementFields"
      id="courseRestrictionId"
      :showFilter="true"
      pagination="true"
    >
    </DisplayTable>
  </div>
</template>
<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import CourseService from "@/services/CourseService.js";
import DisplayTable from "@/components/DisplayTable.vue";

export default {
  name: "CourseRequirementsSearch",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {},
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      courseRequirementLoading: false,
      courseRequirementMessage: "",
      courseRequirements: [],
      totalRequirementResults: "",
      params: "",
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
    };
  },
  methods: {
    clearInput() {
      this.courseRequirements = "";

      for (const reqKey in this.requirementsSearchInput) {
        if (this.requirementsSearchInput.hasOwnProperty(reqKey)) {
          this.requirementsSearchInput[reqKey].value = "";
          this.requirementsSearchInput[reqKey].contains = false;
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
              this.snackbarStore.showSnackbar(error.message, "error", 5000);
            });
        } catch (error) {
          this.courseRequirementLoading = false;
          this.courseRequirementMessage = "Search Error";
          // eslint-disable-next-line
          console.log("There was an error:" + error);
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
