<template>
  <div>
    <h3>Digitized Signatures</h3>
    <p>Digitized signatures used on students' certificates and transcript.</p>
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

export default {
  name: "DigitalSignatures",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    GraduationReportService.getDigitalSignatures()
      .then((response) => {
        this.digitalSignatures = response.data;
        this.isLoading = false;
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
