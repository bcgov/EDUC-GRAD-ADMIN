<template>
  <div id="algorithm-rules">
    <h3 class="ml-3 mt-5">Algorithm Rules</h3>
    <v-progress-circular
      v-if="isLoading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <DisplayTable
      v-bind:items="algorithmRules"
      v-bind:filterOn="toFilterItem"
      v-bind:fields="algorithmRulesFields"
      id="specialCase"
      showFilter="true"
    >
      <template v-slot:item.algorithmRuleCode="{ item }">
        {{ item.label }}
      </template>
      <template v-slot:item.description="{ item }">
        {{ item.description }}
      </template>
      <template v-slot:item.isActiveRule="{ item }">
        {{ item.isActiveRule }}
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
        this.isLoading = false;
      })
      .catch((error) => {
        this.showNotification("danger", "There was an error: " + error);
      });
  },
  data: function () {
    return {
      isLoading: true,
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
          key: "algorithmRuleCode.label",
          title: "Rule Name",
          sortable: true,
        },
        {
          key: "algorithmRuleCode.description",
          title: "Rule Description",
          sortable: true,
        },
        {
          key: "algorithmRuleCode.isActiveRule",
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
