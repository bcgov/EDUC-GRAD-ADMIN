<template>
  <div>
    <DisplayTable
      v-bind:items="letterGrades"
      title="Letter Grade"
      v-bind:filterOn="toFilterItem"
      v-bind:fields="letterGradesFields"
      id="letterGrade"
      showFilter="true"
    >
      <template #cell(expiryDate)="row">
        <div v-if="row.item.expiryDate">
          {{ row.item.expiryDate | formatSimpleDate }}
        </div>
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable";
import ProgramManagementService from "@/services/ProgramManagementService.js";
import sharedMethods from "../../sharedMethods";
export default {
  name: "LetterGrades",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    this.showNotification = sharedMethods.showNotification;
    ProgramManagementService.getLetterGrades()
      .then((response) => {
        this.letterGrades = response.data;
      })
      .catch((error) => {
        this.showNotification("danger", "There was an error: " + error);
      });
  },
  data: function () {
    return {
      letterGrades: [],
      toFilterItem: [
        "grade",
        "percentRangeHigh",
        "percentRangeLow",
        "gpaMarkValue",
        "passFlag",
        "description",
      ],
      letterGradesFields: [
        {
          key: "grade",
          label: "Letter grade",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },
        {
          key: "percentRangeHigh",
          label: "Percentage Range High",
          sortable: true,
          class: "text-center",
        },
        {
          key: "percentRangeLow",
          label: "Percentage Range Low",
          sortable: true,
          class: "text-center",
        },
        {
          key: "passFlag",
          label: "Pass",
          sortable: true,
          class: "text-center",
        },
        {
          key: "gpaMarkValue",
          label: "GPA mark value",
          sortable: true,
          class: "text-center",
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
