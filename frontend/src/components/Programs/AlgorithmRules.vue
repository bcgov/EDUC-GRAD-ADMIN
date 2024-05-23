<template>
  <div id="algorithm-rules">
    <h3>Algorithm Rules</h3>
    <DisplayTable
      v-bind:items="algorithmRules"
      v-bind:filterOn="toFilterItem"
      v-bind:fields="algorithmRulesFields"
      id="specialCase"
      showFilter="true"
    >
      <template #cell(ruleName)="row">
        {{ row.item.algorithmRuleCode.title }}
      </template>
      <template #cell(ruleDescription)="row">
        {{ row.item.algorithmRuleCode.description }}
      </template>
      <template #cell(isActive)="row">
        {{ row.item.algorithmRuleCode.isActiveRule }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import { showNotification } from "../../utils/common.js";
import DisplayTable from "../DisplayTable.vue";
import ProgramManagementService from "@/services/ProgramManagementService.js";

export default {
  name: "AlgorithmRules",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    this.showNotification = showNotification;
    ProgramManagementService.getAlgorithmRules()
      .then((response) => {
        this.algorithmRules = response.data;
      })
      .catch((error) => {
        this.showNotification("danger", "There was an error: " + error);
      });
  },
  data: function () {
    return {
      algorithmRules: [],
      toFilterItem: ["graduationProgramCode", "isActive"],
      algorithmRulesFields: [
        {
          key: "graduationProgramCode",
          title: "Program Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "ruleName",
          title: "Rule Name",
          sortable: true,
        },
        {
          key: "ruleDescription",
          title: "Rule Description",
          sortable: true,
        },
        {
          key: "sortOrder",
          title: "Sort Order",
          sortable: true,
        },
        {
          key: "isActive",
          title: "Active Flag",
          sortable: true,
        },
      ],
    };
  },
  methods: {},
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}
</style>
