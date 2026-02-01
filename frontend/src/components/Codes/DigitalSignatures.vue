<template>
  <div>

    <v-row class="align-center ml-2 mt-5 mr-3 mb-0">
      <v-col cols="auto">
        <h3 class="my-0">Digitized Signatures</h3>
      </v-col>
      <v-spacer />

<!--      <v-col cols="auto">
        <DownloadLink
            label="Digital Signatures"
            icon="mdi-download"
            :downloadAction="ReportService.downloadDigitalSignaturesCSV"
            @success="snackbarStore.showSnackbar('CSV downloaded successfully', 'success', 3000)"
            @error="snackbarStore.showSnackbar('Error downloading CSV', 'error', 5000)"
        />
      </v-col>
      <v-col cols="auto" v-if="enableCRUD">
        <DigitalSignaturesCreateForm />
      </v-col>-->
    </v-row>
    <v-row class="ml-2 mr-3 mb-0">
      <v-col cols="auto">
        <p class="w-66 my-0">
          Digitized signatures used on students' certificates and transcript.
        </p>
      </v-col>
    </v-row>
    <v-spacer />
    <v-row no-gutters>
      <v-row id="filter" class="mt-4">
        <v-col lg="8" class="px-0 float-left"></v-col>
        <v-col sm="12" lg="4" class="my-1 pr-3 table-filter p-0">
          <v-row>
            <v-col cols="12">
              <v-form>
                <v-text-field
                    v-model="rawSearchInput"
                    @update:modelValue="onSearchInput"
                    label="Filter"
                    variant="outlined"
                    density="comfortable"
                    debounce="500"
                    placeholder=""
                    append-icon="mdi-close"
                    @click:append="clearSearchInput"
                    class="mt-2"
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-data-table
          v-if="!loading && digitalSignatures.length > 0"
          v-model="selected"
          :items="digitalSignatures"
          :headers="digitalSignaturesHeaders"
          :item-value="(item) => item"
          :items-per-page="defaultItemsPerPage"
          title="digitalSignature"
          :search="search"
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
        <template v-slot:item.edit="{ item }" v-if="enableCRUD">
          <DigitalSignaturesUpdateForm
              :selectedDigitalSignatureToUpdate="item"
          >
          </DigitalSignaturesUpdateForm>
        </template>
      </v-data-table>
    </v-row>
    <v-row justify="center">
      <v-progress-circular
          v-if="loading"
          color="primary"
          indeterminate
      ></v-progress-circular>
    </v-row>

  </div>
</template>
<script>
import { useAppStore } from "@/store/modules/app";
import { useReportStore } from "@/store/modules/signatures.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapState, mapActions } from "pinia";
/*import DigitalSignaturesCreateForm from "@/components/Codes/Forms/DigitalSignaturesCreateForm.vue";
import DownloadLink from "@/components/Common/DownloadLink.vue";*/
import DigitalSignaturesUpdateForm from "@/components/Codes/Forms/DigitalSignaturesUpdateForm.vue";
import ReportService from "@/services/SignaturesService.js";
export default {
  name: "DigitalSignatures",
  components: {
    /*DigitalSignaturesCreateForm: DigitalSignaturesCreateForm,*/
    DigitalSignaturesUpdateForm: DigitalSignaturesUpdateForm,
    /*DownloadLink: DownloadLink,*/
  },
  computed: {
    ...mapState(useReportStore, {
      digitalSignatures: "getDigitalSignatures",
    }),
    ...mapState(useAppStore, ["enableCRUD"]),
    ReportService() {
      return ReportService;
    },

    digitalSignaturesHeaders() {
      const tableHeaders = [
        {
          key: "signatureContent",
          title: "Signature",
          sortable: true,
          class: "text-left",
        },
        {
          key: "gradReportSignatureCode",
          title: "Code",
          sortable: true,
          class: "text-left",
        },
        {
          key: "gradReportSignatureName",
          title: "Signature Name",
          sortable: true,
          class: "text-left",
        },
        {
          key: "gradReportSignatureOrganizationName",
          title: "Organization",
          sortable: true,
          class: "text-left",
        },
        {
          key: "updatedTimestamp",
          title: "Last Updated",
          sortable: true,
          class: "text-left",
        },
      ];

      if (this.enableCRUD) {
        tableHeaders.push({
          key: "edit",
          title: "Edit",
          cellProps: {
            style: "vertical-align: baseline;",
            class: "pt-5 pb-5",
          },
        });
      }

      return tableHeaders;
    },
  },
  created() {
    this.loadDigitalSignatures().finally(() => {
      this.loading = false;
    });
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      defaultItemsPerPage: 20,
      rawSearchInput: "",
      search: "",
      selected: [],
      loading: true,
    };
  },
  methods: {
    ...mapActions(useReportStore, ["loadDigitalSignatures"]),
    onSearchInput(value) {
      this.search = value?.replace("-", "/");
    },
    clearSearchInput() {
      this.search = "";
      this.rawSearchInput = "";
    },
  },
};
</script>
<style scoped></style>