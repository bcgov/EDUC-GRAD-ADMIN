<template>
  <div>
    <h3 class="ml-2 mt-5">Exam Special Case Codes</h3>
    <p class="ml-2">
      Identifies the special cases associated with writing the exam or allowing
      an exemption from exam writing.
    </p>
    <DisplayTable
      title="Exam Special Case Codes"
      v-bind:items="sortedExamSpecialCaseCodes"
      v-bind:fields="examSpecialCaseCodesFields"
      id="examSpecialCaseCode"
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
import DisplayTable from "@/components/DisplayTable.vue";
import CodesService from "@/services/CodesService";

// import shared functions & validations
import { applyDisplayOrder } from "@/utils/common.js";
import { useSnackbarStore } from "../../store/modules/snackbar";
export default {
  name: "ExamSpecialCaseCodes",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    // get codes
    CodesService.getExamSpecialCaseCodes()
      .then((response) => {
        this.examSpecialCaseCodes = response.data;
      })
      // eslint-disable-next-line
      .catch((error) => {
        // this.$bvToast.toast("ERROR " + error.response.statusText, {
        //   title: "ERROR" + error.response.status,
        //   variant: "danger",
        //   noAutoHide: true,
        // });
        this.snackbarStore.showSnackbar(
          "ERROR " + error.response.statusText,
          "error",
          10000,
          "ERROR" + error.response.status
        );
      });
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      examSpecialCaseCodes: [],
      examSpecialCaseCodesFields: [
        {
          key: "examSpecialCaseCode",
          title: "Code",
          sortable: true,
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
          class: "w-25",
        },
        {
          key: "expiryDate",
          title: "Expiry Date",
          sortable: true,
          class: "w-25",
        },
      ],
    };
  },
  computed: {
    sortedExamSpecialCaseCodes() {
      return applyDisplayOrder(this.examSpecialCaseCodes);
    },
  },
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}
</style>
