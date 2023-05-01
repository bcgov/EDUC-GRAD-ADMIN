<template>
  <div>
    <p>
      Students' in the GRAD system may have several types of individual reports
      associated with their GRAD data. Schools also have several types of
      reports associated with their school and students' GRAD data. The list of
      report types are maintained in this table. The description in the Report
      Type table differentiates between individual student and school reports.
    </p>
    <DisplayTable
      title="Report Types"
      v-bind:items="reportTypes"
      v-bind:fields="reportTypesFields"
      id="code"
      showFilter="true"
    >
      <template #cell(effectiveDate)="row">
        {{ row.item.effectiveDate | formatSimpleDate }}
      </template>
      <template #cell(expiryDate)="row">
        {{ row.item.expiryDate | formatSimpleDate }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable";
import GraduationReportService from "@/services/GraduationReportService.js";

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
        this.$bvToast.toast("ERROR " + error.response.statusText, {
          title: "ERROR" + error.response.status,
          variant: "danger",
          noAutoHide: true,
        });
      });
  },
  data: function () {
    return {
      reportTypes: [],
      reportTypesFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
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
  methods: {},
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}
</style>
