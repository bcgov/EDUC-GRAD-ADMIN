<template>
  <div>
    <h3 class="ml-2 mt-5">Fine Arts Applied Skills Codes</h3>
    <p class="ml-2">
      Fine Arts Applied Skills codes indicates that a course is being used for
      the Fine Arts and/or Applied Skills graduation requirement.
    </p>
    <DisplayTable
      title="Fine Arts Applied Skills Codes"
      v-bind:items="sortedFaAsCodes"
      v-bind:fields="fineArtsAppliedSkillsTypesFields"
      id="fineArtsAppliedSkillsCode"
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
import CourseService from "@/services/CourseService";

// import shared functions & validations
import { applyDisplayOrder } from "@/utils/common.js";
import { useSnackbarStore } from "../../store/modules/snackbar";
export default {
  name: "FineArtsAppliedSkillsCodes",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    CourseService.getFineArtsAppliedSkillsTypes()
      .then((response) => {
        this.fineArtsAppliedSkillsTypes = response.data;
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
      fineArtsAppliedSkillsTypes: [],
      fineArtsAppliedSkillsTypesFields: [
        {
          key: "fineArtsAppliedSkillsCode",
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
    sortedFaAsCodes() {
      return applyDisplayOrder(this.fineArtsAppliedSkillsTypes);
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
