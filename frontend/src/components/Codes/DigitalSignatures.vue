<template>
  <div>
    <p>Digitized signatures used on students' certificates and transcript.</p>
    <DisplayTable
      title="Report Types"
      v-bind:items="digitalSignatures"
      v-bind:fields="digitalSignaturesFields"
      showFilter="true"
      id="signatureId"
    >
      <template #cell(signatureContent)="row">
        <b-card header="" class="overflow-hidden">
          <b-row no-gutters>
            <b-col md="6">
              <b-card-img
                :src="'data:image/png;base64, ' + row.item.signatureContent"
              ></b-card-img>
            </b-col>
          </b-row>
        </b-card>
      </template>

      <template #cell(updatedTimestamp)="row">
        {{ $filters.formatTime(row.item.updatedTimestamp) }}
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
      digitalSignatures: [],
      digitalSignaturesFields: [
        {
          key: "signatureContent",
          label: "Signature",
          sortable: true,
        },
        {
          key: "gradReportSignatureCode",
          label: "Code",
          sortable: true,
        },
        {
          key: "gradReportSignatureName",
          label: "Signature Name",
          sortable: true,
        },
        {
          key: "gradReportSignatureOrganizationName",
          label: "Organization",
          sortable: true,
        },
        {
          key: "updatedTimestamp",
          label: "Last Updated",
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
