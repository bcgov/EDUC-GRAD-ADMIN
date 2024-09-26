<template>
  <div>
    <h3>Document Status Codes</h3>
    <p>
      A student's Transcript, Student Achievement Report (TVR) and
      Certificate(s) will show a status as the student progresses through the
      system. The list of document statuses are maintained in this table.
      Documents will show In Progress until the student graduates, once a
      student graduates and the final documents are created, the documents will
      show a status of Completed. If, and only if, the student has completed the
      SCCP program and the User moves the SCCP student to a graduation program
      will the students existing documents get Archived.
    </p>
    <DisplayTable
      title="Program Certificate Transcripts"
      v-bind:items="documentStatusCodes"
      v-bind:fields="documentStatusCodesFields"
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
  name: "DocumentStatusCode",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    GraduationReportService.getDocumentStatusCodes()
      .then((response) => {
        this.documentStatusCodes = response.data;
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(error);
        this.snackbarStore.showSnackbar(error.message, "error", 5000);
      });
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      documentStatusCodes: [],
      documentStatusCodesFields: [
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
