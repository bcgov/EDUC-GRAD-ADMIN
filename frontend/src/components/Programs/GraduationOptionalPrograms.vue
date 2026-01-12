<template>
  <div>
    <div class="d-flex justify-space-between align-center ml-3 mt-5 mr-3 mb-6">
      <h3>Optional Programs</h3>
      <DownloadLink
        label="Optional Programs"
        icon="mdi-download"
        :downloadAction="CodesService.downloadOptionalProgramCodesCSV"
        @success="snackbarStore.showSnackbar('CSV downloaded successfully', 'success', 3000)"
        @error="snackbarStore.showSnackbar('Error downloading CSV', 'error', 5000)"
      />
    </div>
    <DisplayTable
      v-bind:items="graduationOptionalPrograms"
      v-bind:fields="graduationOptionalProgramsFields"
      id="id"
      showFilter="true"
      isOptionalProgram="true"
      class="pt-16"
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
import DisplayTable from "../DisplayTable.vue";
import DownloadLink from "@/components/Common/DownloadLink.vue";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/store/modules/app";
import CodesService from "@/services/CodesService.js";

export default {
  name: "GraduationOptionalProgram",
  props: {},
  components: {
    DisplayTable: DisplayTable,
    DownloadLink: DownloadLink,
  },
  async beforeMount() {
    try {
      await this.getOptionalProgramCodes(false);
    } catch (e) {
      if (e.response?.status) {
        this.snackbarStore.showSnackbar(
          "There was an error: " + e.response.status,
          "error",
          5000
        );
      }
    }
  },
  computed: {
    ...mapState(useAppStore, {
      optionalProgramOptions: "optionalProgramOptions",
    }),
    graduationOptionalPrograms() {
      return this.optionalProgramOptions || [];
    }
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      CodesService: CodesService,
      opened: [],
      selectedProgramId: "",
      selectedId: "",
      graduationOptionalProgramsFields: [
        {
          key: "graduationProgramCode",
          title: "Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "w-1",
        },
        {
          key: "optProgramCode",
          title: "Optional Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "w-1",
        },
        {
          key: "optionalProgramName",
          title: "Optional Program Name",
          sortable: true,
          editable: true,
        },
        {
          key: "description",
          title: "Description",
          sortable: true,
          sortDirection: "desc",
          editable: true,
          class: "w-1",
        },
        {
          key: "associatedCredential",
          title: "Associated Credential",
          sortable: true,
          sortDirection: "desc",
          editable: true,
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
  methods: {
    ...mapActions(useAppStore, ["getOptionalProgramCodes"]),
    onClickButton(id) {
      this.$emit("clicked", id);
    },
    resetProgramId() {
      this.selectedProgramId = "";
    },
  },
};
</script>

<style>
.table th {
  border-bottom: 2px solid #38598a !important;
}
</style>
