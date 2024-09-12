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
      <template #cell(effectiveDate)="row">
        <div v-if="row.item.effectiveDate">
          {{ $filters.formatSimpleDate(row.item.effectiveDate) }}
        </div>
      </template>
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
          label: "Letter Grade",
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
          label: "GPA Mark Value",
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
          key: "effectiveDate",
          label: "Effective Date",
          sortable: true,
          class: "table-date",
        },
        {
          key: "expiryDate",
          label: "Expiry Date",
          sortable: true,
          class: "table-date",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style>
.table .table-date {
  width: 110px;
}

.table th,
.table td {
  border-top: none !important;
}
</style>
