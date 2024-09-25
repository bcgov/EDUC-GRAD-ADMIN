<template>
  <div>
    <h3>Program Certificate Transcripts</h3>
    <p>
      The rules governing which certificate type or transcript type will be used
      for a student.
    </p>
    <DisplayTable
      v-bind:items="programCertificateTranscripts"
      v-bind:fields="programCertificateTranscriptsFields"
      id="code"
      showFilter="true"
    >
      <template v-slot:item.schoolCategoryCode="{ item }">
        {{ $filters.formatNullsToNA(item.schoolCategoryCode) }}
      </template>
      <template v-slot:item.certificateTypeCode="{ item }">
        {{ $filters.formatNullsToNA(item.certificateTypeCode) }}
      </template>
      <template v-slot:item.transcriptTypeCode="{ item }">
        {{ $filters.formatNullsToNA(item.transcriptTypeCode) }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import GraduationReportService from "@/services/GraduationReportService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
export default {
  name: "ProgramCertificateTranscripts",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    GraduationReportService.getProgramCertificateTranscripts()
      .then((response) => {
        this.programCertificateTranscripts = response.data;
      })
      // eslint-disable-next-line
      .catch((error) => {
        this.snackbarStore.showSnackbar(error.message, "error", 5000);
      });
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      programCertificateTranscripts: [],
      programCertificateTranscriptsFields: [
        {
          key: "graduationProgramCode",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "schoolCategoryCode",
          title: "School Category Code",
          sortable: true,
        },
        {
          key: "certificateTypeCode",
          title: "Certificate Type Code",
          sortable: true,
        },
        {
          key: "transcriptTypeCode",
          title: "Transcript Type Code",
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
