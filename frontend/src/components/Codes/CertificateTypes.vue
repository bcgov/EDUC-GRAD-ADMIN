<template>
  <div>
    <h3 class="ml-2 mt-5">Certificate Types</h3>
    <p class="ml-2 w-66">
      A list of certificate types used by the GRAD system.
    </p>
    <DisplayTable
      v-bind:items="certificateTypes"
      v-bind:fields="certificateTypesFields"
      id="code"
      showFilter="true"
    >
      <template v-slot:item.effectiveDate="{ item }">
        {{ $filters.formatYYYYMMDate(item.effectiveDate) }}
      </template>
      <template v-slot:item.expiryDate="{ item }">
        {{ $filters.formatYYYYMMDate(item.expiryDate) }}
      </template>
      <template v-slot:item.language="{ item }">
        {{ item.language }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import GraduationReportService from "@/services/GraduationReportService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
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
        this.snackbarStore.showSnackbar(error.response.status, "error", 5000);
      });
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      certificateTypes: [],
      certificateTypesFields: [
        {
          key: "code",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-10",
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
          key: "language",
          title: "Language",
          sortable: true,
          class: "w-10",
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
