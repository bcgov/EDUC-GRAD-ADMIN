<template>
  <div>
    <p>
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
      <template #cell(effectiveDate)="row">
        {{ $filters.formatSimpleDate(row.item.effectiveDate) }}
      </template>
      <template #cell(expiryDate)="row">
        {{ $filters.formatSimpleDate(row.item.expiryDate) }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import CourseService from "@/services/CourseService";

// import shared functions & validations
import { applyDisplayOrder } from "@/utils/common.js";

export default {
  name: "ExamSpecialCaseCodes",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    // get codes
    CourseService.getExamSpecialCaseCodes()
      .then((response) => {
        this.examSpecialCaseCodes = response.data;
      })
      // eslint-disable-next-line
      .catch((error) => {
        this.$bvToast.toast("ERROR " + error.response.statusText, {
          title: "ERROR" + error.response.status,
          variant: "danger",
          noAutoHide: true,
        });
      });
  },
  data: function () {
    return {
      examSpecialCaseCodes: [],
      examSpecialCaseCodesFields: [
        {
          key: "examSpecialCaseCode",
          label: "Code",
          sortable: true,
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
          class: "w-25",
        },
        {
          key: "expiryDate",
          label: "Expiry Date",
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
