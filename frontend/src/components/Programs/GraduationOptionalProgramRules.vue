<template>
  <div id="optional-graduation-program-rules">
    <h3>Optional Program Rules</h3>
    <v-progress-circular
      v-if="isLoading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <DisplayTable
      v-bind:items="optionalProgramRules"
      v-bind:fields="optionalOptionalProgramRulesFields"
      id="programCode"
      showFilter="true"
    >
      <template v-slot:item.ruleCode="{ item }">
        <td>
          <v-dialog max-width="600px">
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-card-title>
                  {{
                    (item.optionalProgramRequirementCode.requirementCategory ===
                    "C"
                      ? "Courses"
                      : "Assessments") +
                    " that match rule #" +
                    item.optionalProgramRequirementCode.optProReqCode
                  }}
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row v-if="loadingRuleMatch">
                      <v-col>
                        <v-progress-circular
                          indeterminate
                          color="primary"
                        ></v-progress-circular>
                      </v-col>
                    </v-row>
                    <v-row v-else-if="!ruleMatchList.length">
                      <v-col> Not applicable </v-col>
                    </v-row>
                    <v-row v-else>
                      <DisplayTable
                        v-bind:items="ruleMatchList"
                        title="OptionalProgramRuleMatch"
                        :fields="ruleMatchFields"
                        id="optionalProgramRuleMatch"
                        :showFilter="false"
                        :pagination="false"
                      ></DisplayTable>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    @click="isActive.value = false"
                    outlined
                    color="secondary"
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
                    item.optionalProgramRequirementCode.requirementCategory,
                    item.optionalProgramRequirementCode.optProReqCode
                  )
                "
              >
                {{ item.optionalProgramRequirementCode.optProReqCode }}
              </v-btn>
            </template>
          </v-dialog>

          <!-- <v-btn
            variant="link"
            size="xs"
            class="p-0"
            @click="
              ruleNumberClicked(
                item.optionalProgramRequirementCode.requirementCategory,
                item.optionalProgramRequirementCode.optProReqCode
              )
            "
          >
            {{ item.optionalProgramRequirementCode.optProReqCode }}
          </v-btn> -->
        </td>
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import ProgramManagementService from "@/services/ProgramManagementService.js";
import DisplayTable from "../DisplayTable.vue";
import CourseService from "@/services/CourseService.js";
import AssessmentService from "@/services/AssessmentService.js";
import { mapGetters } from "vuex";
export default {
  name: "GraduationOptionalProgramRules",
  props: {},
  computed: { ...mapGetters({}) },
  components: {
    DisplayTable: DisplayTable,
  },
  data: function () {
    return {
      isLoading: true,
      opened: [],
      optionalProgramRules: [],
      optionalOptionalProgramRulesFields: [
        {
          key: "optionalProgramID.graduationProgramCode",
          title: "Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramID.optProgramCode",
          title: "Optional Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "",
        },
        {
          key: "ruleCode",
          value: "optionalProgramRequirementCode.optProReqCode",
          title: "Rule #",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.requirementCategory",
          title: "Rule Category (C-Courses, A-Assessments)",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.label",
          title: "Requirement Name",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.description",
          title: "Requirement Description",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.requiredCredits",
          title: "Required Credits",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.notMetDesc",
          title: "Not Met Description",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.requirementTypeCode.label",
          title: "Requirement Type",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.requiredLevel",
          title: "Required Level",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.languageOfInstruction",
          title: "Required Language of Instruction",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.activeRequirement",
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
    };
  },
  created() {
    ProgramManagementService.getAllOptionalProgramRules()
      .then((response) => {
        this.optionalProgramRules = response.data;
        this.isLoading = false;
      })
      .catch((error) => {
        // eslint-disable-next-line
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
  },
};
</script>

<style>
.table th {
  border-bottom: 2px solid #38598a !important;
}
</style>
