<template>
  <div class="reports-view">
    <h1>School Reports</h1>

    <v-card no-body>
      <v-form v-on:submit.prevent id="psiReqForm">
        <div class="advanced-search-form">
          <div class="row my-3">
            <div class="advanced-search-field col-12 col-md-2">
              <div
                href="#"
                v-on:click="mincode.contains = !mincode.contains"
                v-bind:class="{ active: mincode.contains }"
                class="wild-card-button"
                v-b-tooltip.hover
              >
                <v-tooltip activator="parent" location="top"
                  >Mincode contains</v-tooltip
                >
                [.*]
              </div>
              <v-text-field
                label="Mincode:"
                v-model="mincode.value"
                v-on:keyup="keyHandler"
                placeholder=""
                id="mincode"
                minlength="3"
                trim
              />
            </div>
          </div>
          <div class="row">
            <div class="advanced-search-button">
              <v-btn
                v-on:click="schoolReportSearch"
                v-if="!searchLoading"
                color="primary"
                tabindex="6"
              >
                <i class="fas fa-search" aria-hidden="true"></i>
                Search
              </v-btn>
              <v-btn color="success" v-if="searchLoading" tabindex="6"
                ><i class="fas fa-search" aria-hidden="true"></i>Search
                <v-progress-circular
                  v-if="searchLoading"
                  indeterminate
                  color="green"
                ></v-progress-circular
              ></v-btn>
              <v-btn @click="clearInput" class="btn btn-outline-primary mx-2">
                Reset
              </v-btn>
              <b-spinner v-if="searchLoading" label="Loading"
                >Loading</b-spinner
              >
            </div>
          </div>

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
        </div>
      </v-form>
      <v-card-text>
        <DisplayTable
          title="Results"
          v-bind:items="reports"
          v-bind:fields="reportFields"
          sortKey="report"
          id="mincode"
          v-bind:showFileter="true"
          pagination="true"
        >
          <template v-slot:item.report="{ item }">
            <a
              @click="
                downloadFile(
                  item.raw.report,
                  'application/pdf',
                  'school-report_' +
                    item.raw.reportTypeCode +
                    '_' +
                    item.raw.schoolOfRecord
                )
              "
              href="#"
              class="pdf-link float-left mt-2"
            >
              {{ item.raw.reportTypeLabel }} (PDF)
            </a>
          </template>
          <template v-slot:item.updateDate="{ item }">
            {{ $filters.formatTime(item.raw.updateDate) }}
          </template>
        </DisplayTable>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import GraduationReportService from "@/services/GraduationReportService.js";
import sharedMethods from "../sharedMethods";
import { showNotification } from "../utils/common.js";

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
          key: "schoolOfRecord",
          title: "Mincode",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "schoolOfRecordName",
          title: "School Name",
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
  computed: {},
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
          this.mincode.value + (this.mincode.contains ? "*" : "")
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
.advanced-search-form {
  background-color: #fff;
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
.search-results-message {
  float: left;
  clear: both;
}
.advanced-search-button {
  padding-left: 1 5px;
}
.tab-loading {
  color: green !important;
}

.profile-name {
  padding-bottom: 10px;
}
.table-filter {
  top: 0px !important;
}
.reports-view {
  padding-left: 25px;
  padding-right: 25px;
}
</style>
