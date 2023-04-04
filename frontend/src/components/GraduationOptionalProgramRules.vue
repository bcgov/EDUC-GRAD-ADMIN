<template>
  <div class="">
    <b-modal>HELLO WORLD</b-modal>
    <DisplayTable
      v-bind:items="optionalProgramRules"
      v-bind:fields="optionalOptionalProgramRulesFields"
      title="Program"
      id="programCode"
      showFilter="true"
    >
      <template #cell(ruleCode)="row">
        <b-btn
          variant="outline primary"
          style="color: #666"
          size="xs"
          class="p-0"
          @click="row.toggleDetails"
        >
          <router-link
            :to="{
              name: 'programRuleCourses',
              params: {
                isOptionalProgram: true,
                programCode: row.item.optionalProgramID.optionalProgramID,
                category:
                  row.item.optionalProgramRequirementCode.requirementCategory,
                rule: row.item.optionalProgramRequirementCode.optProReqCode,
                ruleName: row.item.optionalProgramRequirementCode.label,
              },
            }"
            >{{
              row.item.optionalProgramRequirementCode.optProReqCode
            }}</router-link
          >
        </b-btn>
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import ProgramManagementService from "@/services/ProgramManagementService.js";
import DisplayTable from "@/components/DisplayTable";
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
          label: "Rule Category (C-courses, A-Assessments)",
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
  methods: {},
};
</script>

<style>
.table th {
  border-bottom: 2px solid #38598a !important;
}
</style>
