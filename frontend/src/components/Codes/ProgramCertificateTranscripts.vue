<template>
  <div>
    <p>
      The rules governing which certificate type or transcript type will be used
      for a student.
    </p>
    <DisplayTable
      title="Program Certificate Transcripts"
      v-bind:items="programCertificateTranscripts"
      v-bind:fields="programCertificateTranscriptsFields"
      id="code"
      showFilter="true"
    >
      <template #cell(schoolCategoryCode)="row">
        {{ $filters.formatNullsToNA(row.item.schoolCategoryCode) }}
      </template>
      <template #cell(certificateTypeCode)="row">
        {{ $filters.formatNullsToNA(row.item.certificateTypeCode) }}
      </template>
      <template #cell(transcriptTypeCode)="row">
        {{ $filters.formatNullsToNA(row.item.transcriptTypeCode) }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import GraduationReportService from "@/services/GraduationReportService.js";

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
        this.$bvToast.toast("ERROR " + error.response.statusText, {
          title: "ERROR" + error.response.status,
          variant: "danger",
          noAutoHide: true,
        });
      });
  },
  data: function () {
    return {
      programCertificateTranscripts: [],
      programCertificateTranscriptsFields: [
        {
          key: "graduationProgramCode",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "schoolCategoryCode",
          label: "School Category Code",
          sortable: true,
        },
        {
          key: "certificateTypeCode",
          label: "Certificate Type Code",
          sortable: true,
        },
        {
          key: "transcriptTypeCode",
          label: "Transcript Type Code",
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
