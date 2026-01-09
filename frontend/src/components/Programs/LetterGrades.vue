<template>
  <div>
    <h3 class="ml-3 mt-5">Letter Grades</h3>
    <DisplayTable
      v-bind:items="letterGrades"
      v-bind:filterOn="toFilterItem"
      v-bind:fields="letterGradesFields"
      id="letterGrade"
      showFilter="true"
    >
      <template v-slot:item.effectiveDate="{ item }">
        {{ $filters.formatSimpleDate(item.effectiveDate) }}
      </template>
      <template v-slot:item.expiryDate="{ item }">
        {{ $filters.formatSimpleDate(item.expiryDate) }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "../DisplayTable.vue";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/store/modules/app";

export default {
  name: "LetterGrades",
  components: {
    DisplayTable: DisplayTable,
  },
  async beforeMount() {
    try {
      await this.getLetterGradeCodes(false);
    } catch (e) {
      if (e.response?.status) {
        this.snackbarStore.showSnackbar(
          "There was an error: " + e.response.status,
          "error",
          5000
        );
      }
    }
  },
  computed: {
    ...mapState(useAppStore, {
      letterGradeCodes: "letterGradeCodes",
    }),
    letterGrades() {
      return this.letterGradeCodes || [];
    }
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
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
          key: "effectiveDate",
          title: "Effective Date",
          sortable: true,
          width: "115px",
        },
        {
          key: "expiryDate",
          title: "Expiry Date",
          sortable: true,
          width: "115px",
        },
      ],
    };
  },
  methods: {
    ...mapActions(useAppStore, ["getLetterGradeCodes"]),
  },
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}
</style>
