<template>
  <div>
    <h3 class="ml-2 mt-5">Digitized Signatures</h3>
    <p class="ml-2 w-66">
      Digitized signatures used on students' certificates and transcript.
    </p>
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
        {{ formatLastUpdatedDate(item.updatedTimestamp) }}
      </template>
      <template v-slot:item.edit="{ item }">
        <DigitalSignatureUpdateForm
          :digitalSignatureToUpdate="item"
          @saved="loadDigitalSignatures"
        />
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import DigitalSignatureUpdateForm from "@/components/Codes/Forms/DigitalSignatureUpdateForm.vue";
import ReportService from "@/services/ReportService.js";
import { useAppStore } from "@/store/modules/app";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapState } from "pinia";

export default {
  name: "DigitalSignatures",
  components: {
    DisplayTable: DisplayTable,
    DigitalSignatureUpdateForm: DigitalSignatureUpdateForm,
  },
  created() {
    this.loadDigitalSignatures();
  },

  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      snackbarVisible: false,
      snackbarMessage: "",
      isLoading: true,
      digitalSignatures: [],
    };
  },
  computed: {
    ...mapState(useAppStore, ["enableCRUD"]),
    digitalSignaturesFields() {
      const tableFields = [
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
      ];

      if (this.enableCRUD) {
        tableFields.push({
          key: "edit",
          title: "Edit",
        });
      }

      return tableFields;
    },
  },
  methods: {
    loadDigitalSignatures() {
      ReportService.getDigitalSignatures()
        .then((response) => {
          this.isLoading = false;
          this.digitalSignatures = response.data;
        })
        .catch((error) => {
          this.isLoading = false;
          // eslint-disable-next-line
          console.error("API error:", error);
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
        });
    },
    formatLastUpdatedDate(updatedTimestamp) {
      // local date, not UTC, so evening updates in BC don't show as the next day
      return updatedTimestamp
        ? new Date(updatedTimestamp).toLocaleDateString("en-CA")
        : "";
    },
  },
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}
</style>
