<template>
  <div>
    <h3>Letter Grades</h3>
    <DisplayTable
      v-bind:items="letterGrades"
      v-bind:filterOn="toFilterItem"
      v-bind:fields="letterGradesFields"
      id="letterGrade"
      showFilter="true"
    >
      <template #cell(expiryDate)="row">
        <div v-if="row.item.expiryDate">
          {{ $filters.formatSimpleDate(row.item.expiryDate) }}
        </div>
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "../DisplayTable.vue";
import ProgramManagementService from "@/services/ProgramManagementService.js";
import { showNotification } from "../../utils/common.js";
export default {
  name: "LetterGrades",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    this.showNotification = showNotification;
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
          title: "Letter Grade",
          sortable: true,
          sortDirection: "desc",
          class: "text-center",
        },
        {
          key: "percentRangeHigh",
          title: "Percentage Range High",
          sortable: true,
          class: "text-center",
        },
        {
          key: "percentRangeLow",
          title: "Percentage Range Low",
          sortable: true,
          class: "text-center",
        },
        {
          key: "passFlag",
          title: "Pass",
          sortable: true,
          class: "text-center",
        },
        {
          key: "gpaMarkValue",
          title: "GPA Mark Value",
          sortable: true,
          class: "text-center",
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
