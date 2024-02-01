<template>
  <div id="optional-graduation-program-rules">
    <DisplayModal
      :header="ruleMatchType + ' Matching Rule # ' + ruleNumMatch"
      :showModal="showModal"
    >
      <template v-slot:body>
        <b-spinner v-if="loadingRuleMatch" class="px-1 my-2"></b-spinner>
        <div v-else-if="!ruleMatchList.length">Not applicable</div>
        <DisplayTable
          v-else
          v-bind:items="ruleMatchList"
          title="OptionalProgramRuleMatch"
          v-bind:fields="ruleMatchFields"
          id="optionalProgramRuleMatch"
          :showFilter="false"
          :pagination="true"
          :sort-by="
            (ruleMatchType = 'Courses' ? 'courseCode' : 'assessmentCode')
          "
        >
        </DisplayTable>
      </template>
      <template v-slot:footer>
        <b-btn
          variant="danger"
          size="xs"
          class="float-right"
          @click="showModal = false"
          >Close</b-btn
        >
      </template>
    </DisplayModal>
    <DisplayTable
      v-bind:items="optionalProgramRules"
      v-bind:fields="optionalOptionalProgramRulesFields"
      title="Program"
      id="programCode"
      showFilter="true"
    >
      <template #cell(ruleCode)="row">
        <b-btn
          variant="link"
          size="xs"
          class="p-0"
          @click="
            ruleNumberClicked(
              row.item.optionalProgramRequirementCode.requirementCategory,
              row.item.optionalProgramRequirementCode.optProReqCode
            )
          "
          v-b-modal="'modal-' + row.item.optionalProgramRequirementID"
          >{{ row.item.optionalProgramRequirementCode.optProReqCode }}
        </b-btn>
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import ProgramManagementService from "@/services/ProgramManagementService.js";
import DisplayTable from "../DisplayTable.vue";
import DisplayModal from "../DisplayModal.vue";
import CourseService from "@/services/CourseService.js";
import AssessmentService from "@/services/AssessmentService.js";
import { mapGetters } from "vuex";
export default {
  name: "GraduationOptionalProgramRules",
  props: {},
  computed: { ...mapGetters({}) },
  components: {
    DisplayTable: DisplayTable,
    DisplayModal: DisplayModal,
  },
  data: function () {
    return {
      opened: [],
      optionalProgramRules: [],
      optionalOptionalProgramRulesFields: [
        {
          key: "optionalProgramID.graduationProgramCode",
          label: "Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramID.optProgramCode",
          label: "Optional Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "",
        },
        {
          key: "ruleCode",
          label: "Rule #",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.requirementCategory",
          label: "Rule Category (C-Courses, A-Assessments)",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.label",
          label: "Requirement Name",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.description",
          label: "Requirement Description",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.requiredCredits",
          label: "Required Credits",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.notMetDesc",
          label: "Not Met Description",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.requirementTypeCode.label",
          label: "Requirement Type",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.requiredLevel",
          label: "Required Level",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.languageOfInstruction",
          label: "Required Language of Instruction",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "optionalProgramRequirementCode.activeRequirement",
          label: "Active",
          sortable: true,
          editable: true,
          class: "",
        },
      ],
      courseFields: [
        {
          key: "courseCode",
          label: "Course",
          sortable: true,
          sortDirection: "desc",
          editable: false,
        },
        {
          key: "courseLevel",
          label: "Course Level",
          sortable: true,
          editable: false,
        },
        {
          key: "courseName",
          label: "Course Title",
          sortable: true,
          editable: false,
        },
        {
          key: "startDate",
          label: "TRAX Start Date",
          sortable: true,
          editable: false,
        },
        {
          key: "endDate",
          label: "TRAX End Date",
          sortable: true,
          editable: false,
        },
      ],
      assessmentFields: [
        {
          key: "assessmentCode",
          label: "Assessment Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "assessmentName",
          label: "Assessment Name",
          sortable: true,
          editable: true,
        },
      ],
      ruleMatchList: [],
      ruleMatchFields: [],
      ruleMatchType: "",
      ruleNumMatch: "",
      loadingRuleMatch: false,
      showModal: false,
    };
  },
  created() {
    ProgramManagementService.getAllOptionalProgramRules()
      .then((response) => {
        this.optionalProgramRules = response.data;
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log("There was an error:" + error.response);
      });
  },
  methods: {
    ruleNumberClicked(categoryCode, ruleNum) {
      this.showModal = true;
      this.ruleNumMatch = ruleNum;
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
