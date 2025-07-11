<template>
  <div>
    <h3 class="ml-2 mt-5">Equivalency or Challenge Codes</h3>
    <p class="ml-2">
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
  name: "EquivalentOrChallengeCodes",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    // get codes
    CodesService.getEquivalentOrChallengeCodes()
      .then((response) => {
        this.equivalentOrChallengeCodes = response.data;
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
      equivalentOrChallengeCodes: [],
      equivalentOrChallengeCodesFields: [
        {
          key: "equivalentOrChallengeCode",
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
        },
        {
          key: "expiryDate",
          title: "Expiry Date",
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
