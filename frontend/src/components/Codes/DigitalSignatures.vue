<template>
  <div>
    <h3>Digitized Signatures</h3>
    <p>Digitized signatures used on students' certificates and transcript.</p>
    <Snackbar
      v-model="snackbarVisible"
      :message="snackbarMessage"
      color="error"
    />
    <v-progress-circular
      v-if="isLoading"
      color="primary"
      indeterminate
    ></v-progress-circular>
    <DisplayTable
      title="Report Types"
      v-bind:items="digitalSignatures"
      v-bind:fields="digitalSignaturesFields"
      showFilter="true"
      id="signatureId"
    >
      <template v-slot:item.signatureContent="{ item }">
        <v-card header="" class="overflow-hidden">
          <v-img
            :src="'data:image/png;base64, ' + item.signatureContent"
          ></v-img>
        </v-card>
      </template>
      <template v-slot:item.updatedTimestamp="{ item }">
        {{ $filters.formatTime(item.updatedTimestamp) }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import GraduationReportService from "@/services/GraduationReportService.js";
import Snackbar from "@/components/Common/Snackbar.vue";

export default {
  name: "DigitalSignatures",
  components: {
    DisplayTable: DisplayTable,
    Snackbar: Snackbar,
  },
  created() {
    GraduationReportService.getDigitalSignatures()
      .then((response) => {
        this.digitalSignatures = response.data;
        this.isLoading = false;
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error("API error:", error);
        this.snackbarMessage = error.message;
        this.snackbarVisible = true;
        this.isLoading = false;
      });
  },

  data: function () {
    return {
      snackbarVisible: false,
      snackbarMessage: "",
      isLoading: true,
      digitalSignatures: [],
      digitalSignaturesFields: [
        {
          key: "signatureContent",
          title: "Signature",
          sortable: true,
        },
        {
          key: "gradReportSignatureCode",
          title: "Code",
          sortable: true,
        },
        {
          key: "gradReportSignatureName",
          title: "Signature Name",
          sortable: true,
        },
        {
          key: "gradReportSignatureOrganizationName",
          title: "Organization",
          sortable: true,
        },
        {
          key: "updatedTimestamp",
          title: "Last Updated",
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
