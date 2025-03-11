<template>
  <v-card no-body>
    <v-card-text>
      <v-form v-on:submit.prevent id="psiReqForm">
        <div class="advanced-search-form">
          <div class="row mt-3">
            <div class="advanced-search-field col-12 col-md-4">
              <v-autocomplete
                id="districtId"
                label="District Code"
                v-model="searchDistrictId"
                item-value="districtId"
                :items="getDistrictList"
                :item-title="districtTitle"
                density="compact"
                variant="outlined"
                clearable
              >
              </v-autocomplete>
            </div>
          </div>
          <div class="row ml-1">
            <div class="advanced-search-button">
              <v-btn
                prepend-icon="mdi-magnify"
                v-on:click="districtReportSearch"
                :loading="searchLoading"
                :disabled="searchLoading"
                variant="flat"
                color="primary"
                class="text-none"
                >Search</v-btn
              >
              <v-btn
                @click="clearInput"
                variant="outlined"
                color="primary"
                class="text-none mx-2"
              >
                Reset
              </v-btn>
            </div>
          </div>
          <div v-if="reports">
            <v-alert
              type="success"
              variant="tonal"
              border="start"
              class="mt-6 mb-0 ml-1 py-3 width-fit-content"
              v-if="totalResults > 0 && !searchLoading"
              :text="`${totalResults} report${
                totalResults > 1 ? 's' : ''
              } found`"
            >
            </v-alert>
            <v-alert
              type="error"
              variant="tonal"
              border="start"
              class="mt-6 mb-0 ml-1 py-3 width-fit-content"
              v-if="!!searchMessage"
              :text="searchMessage"
            ></v-alert>
          </div>
        </div>
      </v-form>

      <DisplayTable
        v-if="reports.length"
        class="mt-12"
        title="Results"
        v-bind:items="reports"
        v-bind:fields="reportFields"
        sortKey="report"
        id="districtId"
        v-bind:showFilter="true"
        pagination="true"
      >
        <template v-slot:item.report="{ item }">
          <a
            @click="
              downloadFile(
                item.report,
                'application/pdf',
                'school-report_' +
                  item.reportTypeCode +
                  '_' +
                  item.districtNumber
              )
            "
            href="#"
            class="pdf-link float-left mt-2"
          >
            {{ item.reportTypeLabel }} (PDF)
          </a>
        </template>
        <template v-slot:item.updateDate="{ item }">
          {{ $filters.formatTime(item.updateDate) }}
        </template>
      </DisplayTable>
    </v-card-text>
  </v-card>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import GraduationReportService from "@/services/GraduationReportService.js";
import sharedMethods from "../../sharedMethods";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapState } from "pinia";
import { useAppStore } from "@/store/modules/app";

export default {
  name: "DistrictReports",
  components: {
    DisplayTable: DisplayTable,
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      url: null,
      file: [],
      searchDistrictId: "",
      selectedDistrict: {},
      totalResults: 0,
      searchMessage: "",
      searchLoading: false,
      reports: {},
      reportFields: [
        {
          key: "report",
          title: "Report",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "reportTypeCode",
          title: "Report Type Code",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "districtNumber",
          title: "District Code",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "districtName",
          title: "District Name",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "updateUser",
          title: "Last Update User",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "updateDate",
          title: "Last Update Date",
          sortable: true,
          sortDirection: "asc",
        },
      ],
      groupOptions: [
        { text: "Schools", value: "schools" },
        { text: "Students", value: "students" },
      ],
    };
  },
  computed: {
    ...mapState(useAppStore, {
      getDistrictList: "getDistrictList",
      getDistrictById: "getDistrictById",
    }),
  },
  methods: {
    keyHandler: function (e) {
      if (e.keyCode === 13) {
        //enter key pressed
        this.districtReportSearch();
      }
    },
    districtTitle(item) {
      if (item) {
        return `${item.districtNumber} - ${item.displayName}`;
      } else {
        return null;
      }
    },
    districtReportSearch() {
      //reset results
      this.totalResults = "";
      this.searchMessage = "";
      this.searchLoading = true;
      this.selectedDistrict = this.getDistrictById(this.searchDistrictId);

      if (!this.searchDistrictId) {
        this.totalResults = "";
        this.searchLoading = false;
        this.searchMessage = "Select a district to view reports.";
      } else {
        GraduationReportService.getAllReportsForDistrict(this.searchDistrictId)
          .then((response) => {
            this.reports = response.data;
            this.searchLoading = false;
            this.totalResults = response.data.length;
            if (response.data.length < 1) {
              this.searchMessage = "No reports found for this district";
            } else {
              this.reports.forEach(
                (report) =>
                  (report.districtNumber = this.selectedDistrict.districtNumber)
              );
            }
          })
          .catch((error) => {
            this.searchLoading = false;
            this.searchMessage = "No reports found for this district";
            this.snackbarStore.showSnackbar(error.message, "error", 5000);
          });
      }
    },
    clearInput: function () {
      this.reports = "";
      this.searchDistrictId = null;
    },
    downloadFile: function (data, mimeType, filename) {
      sharedMethods.base64ToFileTypeAndDownload(data, mimeType, filename);
    },
  },
};
</script>
