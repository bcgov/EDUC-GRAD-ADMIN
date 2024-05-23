<template>
  <div>
    <h3>Assessment Special Case Codes</h3>
    <DisplayTable
      v-bind:items="specialCases"
      v-bind:filterOn="toFilterItem"
      v-bind:fields="specialCasesFields"
      id="specialCase"
      showFilter="true"
    >
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "../DisplayTable.vue";
import ProgramManagementService from "@/services/ProgramManagementService.js";
import { showNotification } from "../../utils/common.js";
export default {
  name: "SpecialCases",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    this.showNotification = showNotification;
    ProgramManagementService.getSpecialCases()
      .then((response) => {
        this.specialCases = response.data;
      })
      .catch((error) => {
        this.showNotification("danger", "There was an error: " + error);
      });
  },
  data: function () {
    return {
      specialCases: [],
      toFilterItem: [
        "spCase",
        "label",
        "description",
        "passFlag",
        "effectiveDate",
        "expiryDate",
      ],
      specialCasesFields: [
        {
          key: "spCase",
          title: "Special Case",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "label",
          title: "Label",
          sortable: true,
        },
        {
          key: "description",
          title: "Description",
          sortable: true,
        },
        {
          key: "passFlag",
          title: "Pass",
          sortable: true,
        },
        {
          key: "effectiveDate",
          title: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          title: "Expiry Date",
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
