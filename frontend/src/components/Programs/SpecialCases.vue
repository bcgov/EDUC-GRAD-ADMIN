<template>
  <div>
    <DisplayTable
      v-bind:items="specialCases"
      title="Program"
      v-bind:filterOn="toFilterItem"
      v-bind:fields="specialCasesFields"
      id="specialCase"
      showFilter="true"
    >
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable";
import ProgramManagementService from "@/services/ProgramManagementService.js";
import sharedMethods from "../../sharedMethods";
export default {
  name: "SpecialCases",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    this.showNotification = sharedMethods.showNotification;
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
          label: "Special Case",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "label",
          label: "Label",
          sortable: true,
        },
        {
          key: "description",
          label: "Description",
          sortable: true,
        },
        {
          key: "passFlag",
          label: "Pass",
          sortable: true,
        },
        {
          key: "effectiveDate",
          label: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          label: "Expiry Date",
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
