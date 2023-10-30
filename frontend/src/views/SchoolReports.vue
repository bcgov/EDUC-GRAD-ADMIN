<template>
  <div class="reports-view">
    <h1>School Reports</h1>

    <b-card no-body>
      <b-tabs card>
        <b-tab title="Search" active>
          <b-card-text>
            <b-container class="p-3">
              <b-row align-v="stretch" class="row-eq-height">
                <b-col>
                  <label class="col-6 p-0">Mincode</label>
                </b-col>
              </b-row>

              <b-row align-v="stretch" class="row-eq-height">
                <b-col>
                  <div
                    href="#"
                    v-on:click="mincode.contains = !mincode.contains"
                    v-bind:class="{ active: mincode.contains }"
                    class="wild-card-button"
                    v-b-tooltip.hover
                    title="Mincode contains"
                  >
                    [.*]
                  </div>
                  <b-input
                    v-model="mincode.value"
                    v-on:keyup="keyHandler"
                    placeholder=""
                    id="mincode"
                    minlength="3"
                    trim
                  />
                </b-col>
                <b-col class="col-6" />
              </b-row>

              <b-row class="p-3">
                <b-col align-self="baseline">
                  <div class="row">
                    <div class="advanced-search-button">
                      <button
                        v-on:click="schoolReportSearch"
                        v-if="!searchLoading"
                        class="btn btn-primary"
                        tabindex="6"
                      >
                        Search
                      </button>
                      <button class="btn btn-success" v-if="searchLoading">
                        Search
                      </button>
                      <button
                        @click="clearInput"
                        class="btn btn-outline-primary mx-2"
                      >
                        Reset
                      </button>
                      <b-spinner v-if="searchLoading" label="Loading"
                        >Loading</b-spinner
                      >
                    </div>
                  </div>
                </b-col>
              </b-row>
              <div v-if="reports">
                <div v-if="totalResults > 0 && !searchLoading" class="row">
                  <div class="search-results-message my-3 col-12 col-md-8">
                    <strong>{{ totalResults }}</strong> report{{
                      totalResults === 1 ? "" : "s"
                    }}
                    found.
                  </div>
                </div>
              </div>
              <div v-if="searchMessage" class="row">
                <div class="search-results-message my-2 col-12 col-md-8">
                  <strong>{{ searchMessage }}</strong>
                </div>
              </div>
            </b-container>

            <DisplayTable
              title="Results"
              v-bind:items="reports"
              v-bind:fields="reportFields"
              sortKey="report"
              id="mincode"
              v-bind:showFileter="true"
              pagination="true"
              >schoolReportSearch
              <template #cell(report)="row">
                <a
                  @click="
                    downloadFile(
                      row.item.report,
                      'application/pdf',
                      'school-report_' +
                        row.item.reportTypeCode +
                        '_' +
                        row.item.schoolOfRecord
                    )
                  "
                  href="#"
                  class="pdf-link float-left mt-2"
                >
                  {{ row.item.reportTypeLabel }} (PDF)
                </a>
              </template>

              <template #cell(updateDate)="row">
                {{ $filters.formatTime(row.item.updateDate) }}
              </template>
            </DisplayTable>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import GraduationReportService from "@/services/GraduationReportService.js";
import sharedMethods from "../sharedMethods";
import { showNotification } from "../utils/common.js";
import { mapGetters } from "vuex";

export default {
  name: "SchoolReports",
  components: {
    DisplayTable: DisplayTable,
  },
  data() {
    return {
      url: null,
      file: [],
      mincode: {
        value: "",
        contains: false,
      },
      totalResults: "",
      searchMessage: "",
      searchLoading: false,
      reports: {},
      reportFields: [
        {
          key: "report",
          label: "Report",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "reportTypeCode",
          label: "Report Type Code",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "schoolOfRecord",
          label: "Mincode",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "schoolOfRecordName",
          label: "School Name",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "updateUser",
          label: "Last Update User",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "updateDate",
          label: "Last Update Date",
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
    ...mapGetters({
      token: "auth/getToken",
    }),
  },
  created() {
    this.showNotification = showNotification;
  },
  methods: {
    keyHandler: function (e) {
      if (e.keyCode === 13) {
        //enter key pressed
        this.schoolReportSearch();
      }
    },
    schoolReportSearch() {
      //reset results
      this.totalResults = "";
      this.searchMessage = "";
      this.searchLoading = true;

      if (!this.mincode.value) {
        this.totalResults = "";
        this.searchLoading = false;
        this.searchMessage = "Enter a school mincode to view reports.";
      } else {
        GraduationReportService.getAllReportsForSchool(
          this.mincode.value + (this.mincode.contains ? "*" : ""),
          this.token
        )
          .then((response) => {
            this.reports = response.data;
            this.searchLoading = false;
            this.totalResults = this.reports.length;
            if (this.reports.length === 0) {
              this.searchMessage = "No reports found for this school";
            }
          })
          .catch((error) => {
            this.searchLoading = false;
            this.searchMessage = "No reports found for this school";
            this.showNotification(
              "danger",
              "There was an error with the web service." + error.response
            );
          });
      }
    },
    clearInput: function () {
      this.reports = "";
      this.mincode.value = "";
      this.mincode.contains = false;
    },
    downloadFile: function (data, mimeType, filename) {
      sharedMethods.base64ToFileTypeAndDownload(data, mimeType, filename);
    },
  },
};
</script>

<style scoped>
.table th,
.table td {
  border-top: none !important;
}
.wild-card-button:hover {
  cursor: pointer;
}
.wild-card-button {
  color: #dee2eb;
  position: absolute;
  right: 21px;
  top: 10px;
  z-index: 10;
  text-decoration: none;
}

.wild-card-button:visited {
  color: #dee2eb;
  text-decoration: none;
}

.wild-card-button.active {
  color: green;
}
</style>
