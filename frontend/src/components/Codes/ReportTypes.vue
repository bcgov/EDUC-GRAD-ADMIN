<template>
  <div>
    <h3>Report Types</h3>
    <p>
      Students' in the GRAD system may have several types of individual reports
      associated with their GRAD data. Schools also have several types of
      reports associated with their school and students' GRAD data. The list of
      report types are maintained in this table. The description in the Report
      Type table differentiates between individual student and school reports.
    </p>
    <DisplayTable
      v-bind:items="reportTypes"
      v-bind:fields="reportTypesFields"
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
import DisplayTable from "@/components/DisplayTable.vue";
import GraduationReportService from "@/services/GraduationReportService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
export default {
  name: "ReportTypes",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    GraduationReportService.getReportTypes()
      .then((response) => {
        this.reportTypes = response.data;
      })
      // eslint-disable-next-line
      .catch((error) => {
        this.snackbarStore.showSnackbar(error.message, "error", 5000);
      });
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      reportTypes: [],
      reportTypesFields: [
        {
          key: "code",
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
