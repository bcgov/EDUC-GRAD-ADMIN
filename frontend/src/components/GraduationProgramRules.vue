<template>
  <div id="graduation-program-rules">
    <div v-if="!selectedProgramCode">
      <DisplayTable
        v-bind:items="graduationProgramRules"
        title="Program"
        v-bind:fields="graduationProgramsFields"
        id="programCode"
        v-bind:role="roles"
        :slots="templates"
        showFilter="true"
        pagination="true"
      >
        <template #cell(ruleCode)="row">
          <b-btn
            variant="outline primary"
            style="color: #666"
            size="xs"
            @click="row.toggleDetails"
            class="p-0"
          >
            <router-link
              :to="{
                name: 'programRuleCourses',
                params: {
                  programCode: row.item.programRequirementCode.programReqCode,
                  category: row.item.programRequirementCode.requirementCategory,
                  rule: row.item.programRequirementCode.proReqCode,
                  ruleName: row.item.programRequirementCode.label,
                },
              }"
              >{{ row.item.programRequirementCode.proReqCode }}</router-link
            >
          </b-btn>
        </template>

        <template #cell(programRequirementCode.traxReqNumber)="row">
          {{
            row.item.programRequirementCode.traxReqNumber ===
            row.item.programRequirementCode.proReqCode
              ? ""
              : row.item.programRequirementCode.traxReqNumber
          }}
        </template>

        <template #cell(programRequirementCode.traxReqChar)="row">
          {{ row.item.programRequirementCode.traxReqChar }}
        </template>
      </DisplayTable>
    </div>

    <router-view v-bind:key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import ProgramManagementService from "@/services/ProgramManagementService.js";
import DisplayTable from "@/components/DisplayTable";
import { mapGetters } from "vuex";
export default {
  name: "GraduationPrograms",
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
          label: "Program Code",
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
          key: "programRequirementCode.traxReqNumber",
          label: "Transcript Req #",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.traxReqChar",
          label: "TRAX Non-Grad Code",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.requirementCategory",
          label: "Rule category (C-courses, A-Assessments)",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.label",
          label: "Requirement Name",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.description",
          label: "Requirement Description",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.requiredCredits",
          label: "Required Credits",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.notMetDesc",
          label: "Not Met Description",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.requirementTypeCode.label",
          label: "Requirement Type",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.requiredLevel",
          label: "Required Level",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.languageOfInstruction",
          label: "Required Language of Instruction",
          sortable: true,
          editable: true,
          class: "",
        },
        {
          key: "programRequirementCode.activeRequirement",
          label: "Active",
          sortable: true,
          editable: true,
          class: "",
        },
      ],
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
