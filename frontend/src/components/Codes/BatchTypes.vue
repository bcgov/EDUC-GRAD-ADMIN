<template>
  <div>
    <h3 class="ml-2 mt-5">Batch Type Codes</h3>
    <p class="ml-2 w-66">A list of Batch Runs used by the GRAD system.</p>
    <DisplayTable
      v-bind:items="batchTypes"
      v-bind:fields="batchTypesFields"
      id=""
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
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
export default {
  name: "BatchTypes",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    BatchProcessingService.getBatchJobTypes()
      .then((response) => {
        this.batchTypes = response.data;
      })
      // eslint-disable-next-line
      .catch((error) => {
        this.snackbarStore.showSnackbar(
          "ERROR " + error.response.status,
          "error",
          5000
        );
      });
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      batchTypes: [],
      batchTypesFields: [
        {
          key: "code",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
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
