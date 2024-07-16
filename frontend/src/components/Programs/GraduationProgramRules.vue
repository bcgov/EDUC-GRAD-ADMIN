<template>
  <div id="graduation-program-rules">
    <h3>Program Rules</h3>
    <div v-if="!selectedProgramCode">
      <DisplayTable
        v-bind:items="graduationProgramRules"
        v-bind:fields="graduationProgramsFields"
        id="programCode"
        v-bind:role="roles"
        :slots="templates"
        showFilter="true"
        pagination="true"
      >
        <template v-slot:item.ruleCode="{ item }">
          <td>
            <v-dialog max-width="800px">
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-progress-circular
                    v-if="loadingRuleMatch"
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                  <div v-else-if="!ruleMatchList.length">Not applicable</div>
                  <div v-else>
                    <v-card-title>
                      <!-- :id="
                'modal-' +
                row.item.graduationProgramCode +
                row.item.programRequirementCode.proReqCode
              " -->
                      {{
                        "Rule # " +
                        item.raw.programRequirementCode.proReqCode +
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
                      item.raw.programRequirementCode.requirementCategory,
                      item.raw.programRequirementCode.proReqCode
                    )
                  "
                  v-b-modal="
                    'modal-' +
                    item.raw.graduationProgramCode +
                    item.raw.programRequirementCode.proReqCode
                  "
                  >{{ item.raw.programRequirementCode.proReqCode }}
                </v-btn>
              </template>
            </v-dialog>
          </td>
        </template>

        <template v-slot:item.programRequirementCode="{ item }">
          {{
            item.raw.programRequirementCode.traxReqNumber ===
            item.raw.programRequirementCode.proReqCode
              ? ""
              : item.raw.programRequirementCode.traxReqNumber
          }}
        </template>

        <template v-slot:item.traxReqChar="{ item }">
          {{ item.raw.programRequirementCode.traxReqChar }}
        </template>
      </DisplayTable>
    </div>
  </div>
</template>

<script>
import ProgramManagementService from "@/services/ProgramManagementService.js";
import DisplayTable from "../DisplayTable.vue";
import CourseService from "@/services/CourseService.js";
import AssessmentService from "@/services/AssessmentService.js";
import { mapGetters } from "vuex";
export default {
  name: "GraduationProgramRules",
  components: {
    DisplayTable: DisplayTable,
  },
  props: {},

  computed: { ...mapGetters("auth", ["roles"]) },
  data: function () {
    return {
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
          title: "TRAX Start Date",
          sortable: true,
          editable: false,
        },
        {
          key: "endDate",
          title: "TRAX End Date",
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
  created() {
    ProgramManagementService.getProgramRules()
      .then((response) => {
        this.graduationProgramRules = response.data;
      })
      .catch((error) => {
        //eslint-disable-next-line
        console.log("There was an error:" + error.response);
      });
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
