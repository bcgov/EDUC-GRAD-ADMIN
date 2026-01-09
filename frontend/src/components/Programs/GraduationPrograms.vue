<template>
  <div id="graduation-programs">
    <div class="d-flex justify-space-between align-center ml-3 mt-5 mr-3 mb-6">
      <h3>Programs</h3>
      <DownloadLink
        label="Download CSV"
        icon="mdi-download"
        :downloadAction="CodesService.downloadGradProgramCodesCSV"
        @success="snackbarStore.showSnackbar('CSV downloaded successfully', 'success', 3000)"
        @error="snackbarStore.showSnackbar('Error downloading CSV', 'error', 5000)"
      />
    </div>
    <div v-if="!selectedProgramCode">
      <DisplayTable
        v-bind:items="graduationPrograms"
        v-bind:fields="graduationProgramsFields"
        id="programCode"
        showFilter="true"
        pagination="true"
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
    <router-view v-bind:key="$route.fullPath"></router-view>
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
  name: "GraduationPrograms",
  components: {
    DisplayTable: DisplayTable,
    DownloadLink: DownloadLink,
  },
  props: {},
  async beforeMount() {
    try {
      await this.getProgramOptionCodes(false);
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
    CodesService() {
      return CodesService
    },
    ...mapState(useAppStore, {
      programOptions: "programOptions",
    }),
    graduationPrograms() {
      // filters out the "No Program" option until business is ready to implement
      if (!this.programOptions) return [];
      return this.programOptions.filter((obj) => {
        return obj.programCode !== "NOPROG";
      });
    }
  },
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      CodesService: CodesService,
      isLoading: false,
      show: false,
      isHidden: false,
      opened: [],
      templates: [
        {
          name: "programCode",
          field: "programCode",
        },
      ],
      graduationProgramsFields: [
        {
          key: "programCode",
          title: "Program Code",
          sortable: true,
          sortDirection: "desc",
          editable: true,
        },
        {
          key: "programName",
          title: "Program Name",
          sortable: true,
          editable: true,
        },
        {
          key: "description",
          title: "Description",
          sortable: true,
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
      selectedProgramCode: "",
      selectedProgramId: "",
    };
  },
  methods: {
    ...mapActions(useAppStore, ["getProgramOptionCodes"]),
    onClickChild(value) {
      this.selectedProgramId = value;
    },
    selectGradRule(programCode) {
      this.selectedProgramCode = programCode;
    },
    resetProgramCode() {
      this.selectedProgramCode = "";
    },
    getCourseName: function (cid) {
      let result = "";
      this.courses.filter(function (n) {
        if (n.id === cid) {
          result = n.name;
          return result;
        }
      });
      return result;
    },
  },
};
</script>

<style>
.table th {
  border-bottom: 2px solid #38598a !important;
}
</style>
