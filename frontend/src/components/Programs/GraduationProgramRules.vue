<template>
  <div id="graduation-program-rules">
    <h3 class="ml-3 mt-5">Program Rules</h3>
    <v-progress-circular
      v-if="isLoading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <DisplayTable
      v-bind:items="graduationProgramRules"
      v-bind:fields="graduationProgramsFields"
      id="programCode"
      :slots="templates"
      showFilter="true"
      pagination="true"
    >
      <template v-slot:item.ruleCode="{ item }">
        <td>
          <v-dialog max-width="800px">
            <template v-slot:default="{ isActive }">
              <v-card>
                <!-- <h3>Courses Matching Rule #</h3> -->
                <v-progress-circular
                  v-if="loadingRuleMatch"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <div v-else-if="!ruleMatchList.length">Not applicable</div>
                <div v-else>
                  <v-card-title class="mb-12">
                    <!-- :id="
                'modal-' +
                row.item.graduationProgramCode +
                row.item.programRequirementCode.proReqCode
              " -->
                    {{
                      "Rule # " +
                      item.programRequirementCode.proReqCode +
                      " - " +
                      ruleMatchType
                    }}
                  </v-card-title>
                  <DisplayTable
                    v-bind:items="ruleMatchList"
                    title="GradProgramRuleMatch"
                    v-bind:fields="ruleMatchFields"
                    id="gradProgramRuleMatch"
                    :showFilter="false"
                    :pagination="false"
                  >
                  </DisplayTable>
                </div>
                <v-card-actions>
                  <v-btn
                    outlined
                    color="secondary"
                    @click="isActive.value = false"
                  >
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                @click="
                  ruleNumberClicked(
                    item.programRequirementCode.requirementCategory,
                    item.programRequirementCode.proReqCode
                  )
                "
                >{{ item.programRequirementCode.proReqCode }}
              </v-btn>
              <!-- v-b-modal="
                  'modal-' +
                  item.graduationProgramCode +
                  item.programRequirementCode.proReqCode
                " -->
            </template>
          </v-dialog>
        </td>
      </template>

      <template v-slot:item.programRequirementCode="{ item }">
        {{
          item.programRequirementCode.traxReqNumber ===
          item.programRequirementCode.proReqCode
            ? ""
            : item.programRequirementCode.traxReqNumber
        }}
      </template>

      <template v-slot:item.traxReqChar="{ item }">
        {{ item.programRequirementCode.traxReqChar }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import ProgramService from "@/services/ProgramService.js";
import DisplayTable from "../DisplayTable.vue";
import CourseService from "@/services/CourseService.js";
import AssessmentService from "@/services/AssessmentService.js";
import { mapGetters } from "vuex";
export default {
  name: "GraduationProgramRules",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    ProgramService.getProgramRules()
      .then((response) => {
        this.graduationProgramRules = response.data;
        this.isLoading = false;
      })
      .catch((error) => {
        //eslint-disable-next-line
        console.log("There was an error:" + error.response);
      });
  },
  data: function () {
    return {
      isLoading: true,
      show: false,
      isHidden: false,
      opened: [],
      graduationProgramRules: [],
      templates: [
        {
          name: "programCode",
          field: "programCode",
        },
      ],
      graduationProgramsFields: [
        {
          key: "graduationProgramCode",
          title: "Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "",
        },
        {
          key: "ruleCode",
          title: "Rule #",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.traxReqNumber",
          title: "Transcript Req #",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.traxReqChar",
          title: "TRAX Non-Grad Code",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.requirementCategory",
          title: "Rule category (C-Courses, A-Assessments)",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.label",
          title: "Requirement Name",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.description",
          title: "Requirement Description",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.requiredCredits",
          title: "Required Credits",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.notMetDesc",
          title: "Not Met Description",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.requirementTypeCode.label",
          title: "Requirement Type",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.requiredLevel",
          title: "Required Level",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.languageOfInstruction",
          title: "Required Language of Instruction",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.activeRequirement",
          title: "Active",
          sortable: true,
          editable: true,
          class: "",
        },
      ],
      courseFields: [
        {
          key: "courseCode",
          title: "Course",
          sortable: true,
          sortDirection: "desc",
          editable: false,
        },
        {
          key: "courseLevel",
          title: "Course Level",
          sortable: true,
          editable: false,
        },
        {
          key: "courseName",
          title: "Course Title",
          sortable: true,
          editable: false,
        },
        {
          key: "startDate",
          title: "Start Date",
          sortable: true,
          editable: false,
        },
        {
          key: "completionEndDate",
          title: "Completion Date",
          sortable: true,
          editable: false,
        },
      ],
      assessmentFields: [
        {
          key: "assessmentCode",
          title: "Assessment Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "assessmentName",
          title: "Assessment Name",
          sortable: true,
          editable: true,
        },
      ],
      ruleMatchList: [],
      ruleMatchFields: [],
      ruleMatchType: "",
      loadingRuleMatch: false,
      selectedProgramCode: "",
      selectedProgramId: "",
    };
  },

  methods: {
    ruleNumberClicked(categoryCode, ruleNum) {
      switch (categoryCode) {
        case "A":
          this.ruleMatchFields = this.assessmentFields;
          this.ruleMatchType = "Assessments";
          this.getAssessmentRules(ruleNum);
          break;
        case "C":
          this.ruleMatchFields = this.courseFields;
          this.ruleMatchType = "Courses";
          this.getCourseRules(ruleNum);
          break;
        default:
          this.ruleMatchType = "No Courses/Assessments Associated With Rule";
          this.ruleMatchFields = [];
          this.ruleMatchList = [];
      }
    },
    getCourseRules(ruleNum) {
      this.loadingRuleMatch = true;
      CourseService.getRuleCourseRequirements(ruleNum).then((response) => {
        this.ruleMatchList = response.data;
        this.loadingRuleMatch = false;
        if (!this.ruleMatchList.length) {
          this.ruleMatchList = [];
        }
      });
    },
    getAssessmentRules(ruleNum) {
      this.loadingRuleMatch = true;
      AssessmentService.getRuleCourseRequirements(ruleNum).then((response) => {
        this.ruleMatchList = response.data;
        this.loadingRuleMatch = false;
        if (!this.ruleMatchList.length) {
          this.ruleMatchList = [];
        }
      });
    },
    onClickChild(value) {
      this.selectedProgramId = value;
    },
    selectGradRule(programCode) {
      this.selectedProgramCode = programCode;
    },
    resetProgramCode() {
      this.selectedProgramCode = "";
    },
    getCourseName: function (cid) {
      let result = "";
      this.courses.filter(function (n) {
        if (n.id === cid) {
          result = n.name;
          return result;
        }
      });
      return result;
    },
  },
};
</script>

<style>
.table th {
  border-bottom: 2px solid #38598a !important;
}
</style>
