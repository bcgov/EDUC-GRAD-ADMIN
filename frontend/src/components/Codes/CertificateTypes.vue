<template>
  <div>
    <p>A list of certificate types used by the GRAD system.</p>
    <DisplayTable
      title="Certificate Types"
      v-bind:items="certificateTypes"
      v-bind:fields="certificateTypesFields"
      id="code"
      showFilter="true"
    >
      <template #cell(effectiveDate)="row">
        {{ $filters.formatYYYYMMDate(row.item.effectiveDate) }}
      </template>
      <template #cell(expiryDate)="row">
        {{ $filters.formatYYYYMMDate(row.item.expiryDate) }}
      </template>
      <template #cell(language)="row">
        {{ row.item.language }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import GraduationReportService from "@/services/GraduationReportService.js";

export default {
  name: "CertificateTypes",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    GraduationReportService.getCertificateTypes()
      .then((response) => {
        this.certificateTypes = response.data;
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
      certificateTypes: [],
      certificateTypesFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-10",
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
          key: "language",
          label: "Language",
          sortable: true,
          class: "w-10",
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
