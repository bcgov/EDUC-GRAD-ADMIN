<template>
  <div>
    <p>
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
        {{ $filters.formatSimpleDate(item.raw.effectiveDate) }}
      </template>
      <template v-slot:item.expiryDate="{ item }">
        {{ $filters.formatSimpleDate(item.raw.expiryDate) }}
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
        this.$bvToast.toast("ERROR " + error.response.statusText, {
          title: "ERROR" + error.response.status,
          variant: "danger",
          noAutoHide: true,
        });
      });
  },
  data: function () {
    return {
      fineArtsAppliedSkillsTypes: [],
      fineArtsAppliedSkillsTypesFields: [
        {
          key: "fineArtsAppliedSkillsCode",
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
