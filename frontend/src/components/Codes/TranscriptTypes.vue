<template>
  <div>
    <p>A list of transcript types used by the GRAD system.</p>
    <DisplayTable
      title="Transcript Type Codes"
      v-bind:items="transcriptTypes"
      v-bind:fields="transcriptTypesFields"
      id=""
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
  name: "TranscriptsTypes",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    GraduationReportService.getTranscriptTypes()
      .then((response) => {
        this.transcriptTypes = response.data;
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
      transcriptTypes: [],
      transcriptTypesFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
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
