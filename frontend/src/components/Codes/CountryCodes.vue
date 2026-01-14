<template>
  <div>
    <div class="d-flex justify-space-between align-center ml-2 mt-5 mr-3 mb-6">
      <h3 class="my-0">Country Codes</h3>
      <DownloadLink
          label="Country Codes"
          icon="mdi-download"
          :downloadAction="CodesService.downloadCountryCodesCSV"
          @success="snackbarStore.showSnackbar('CSV downloaded successfully', 'success', 3000)"
          @error="snackbarStore.showSnackbar('Error downloading CSV', 'error', 5000)"
      />
    </div>
    <DisplayTable
      v-bind:items="countryCodes"
      v-bind:fields="countryCodesFields"
      id="countryCode"
      showFilter="true"
      class="pt-16"
    >
      <template v-slot:item.effectiveDate="{ item }">
        {{ $filters.formatSimpleDate(item.effectiveDate) }}
      </template>
      <template v-slot:item.expiryDate="{ item }">
        {{ formatExpiryDate(item.expiryDate) }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapActions, mapState } from "pinia";
import { useAppStore } from "@/store/modules/app";
import DownloadLink from "@/components/Common/DownloadLink.vue";
import CodesService from "@/services/CodesService";

export default {
  name: "CountryCodes",
  components: {
    DownloadLink,
    DisplayTable: DisplayTable,
  },
  async beforeMount() {
    try {
      await this.getCountryCodes(false);
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
  data: function () {
    return {
      snackbarStore: useSnackbarStore(),
      appStore: useAppStore(),
      countryCodesFields: [
        {
          key: "countryCode",
          title: "Code",
          sortable: true,
          sortDirection: "asc",
          class: "w-15",
        },
        {
          key: "label",
          title: "Name",
          sortable: true,
        },
        {
          key: "effectiveDate",
          title: "Effective Date",
          sortable: true,
          class: "w-15",
        },
        {
          key: "expiryDate",
          title: "Expiry Date",
          sortable: true,
          class: "w-15",
        },
      ],
    };
  },
  computed: {
    CodesService() {
      return CodesService
    },
    ...mapState(useAppStore, {
      countryCodesData: "countryCodes",
    }),
    countryCodes() {
      return this.countryCodesData || [];
    }
  },
  methods: {
    ...mapActions(useAppStore, ["getCountryCodes"]),
    formatExpiryDate(expiryDate) {
      if (!expiryDate) return '';
      const formatted = this.$filters.formatSimpleDate(expiryDate);
      if (formatted === '2099-12-31') return '';
      return formatted;
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

