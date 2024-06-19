<template>
  <div>
    <p>
      Indicates if credit for the course was granted through the Equivalency (E)
      or Challenge (C) process.
    </p>
    <DisplayTable
      title="Exam Special Case Codes"
      v-bind:items="sortedEquivalentOrChallengeCodes"
      v-bind:fields="equivalentOrChallengeCodesFields"
      id="equivalentOrChallengeCode"
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
  name: "EquivalentOrChallengeCodes",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    // get codes
    CourseService.getEquivalentOrChallengeCodes()
      .then((response) => {
        this.equivalentOrChallengeCodes = response.data;
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
      equivalentOrChallengeCodes: [],
      equivalentOrChallengeCodesFields: [
        {
          key: "equivalentOrChallengeCode",
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
        },
        {
          key: "expiryDate",
          label: "Expiry Date",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    sortedEquivalentOrChallengeCodes() {
      return applyDisplayOrder(this.equivalentOrChallengeCodes);
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
