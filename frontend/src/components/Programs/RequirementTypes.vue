<template>
  <div>
    <h3 class="ml-3 mt-5">Requirement Type Codes</h3>
    <p class="ml-3">
      Requirement type codes support how the algorithm runs program rules and
      optional program rules.
    </p>
    <DisplayTable
      title="Requirement Types"
      v-bind:items="requirementTypes"
      v-bind:fields="requirementTypesFields"
      id="code"
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
import ProgramManagementService from "@/services/ProgramManagementService.js";
import { useSnackbarStore } from "../../store/modules/snackbar";
export default {
  name: "RequirementTypes",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    ProgramManagementService.getRequirementTypes()
      .then((response) => {
        this.requirementTypes = response.data;
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
      requirementTypes: [],
      requirementTypesFields: [
        {
          key: "reqTypeCode",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
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
  methods: {},
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}
</style>
