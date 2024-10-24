<template>
  <div class="reports-view">
    <h1>School Reports</h1>

    <v-card no-body>
      <v-card-text>
        <v-form v-on:submit.prevent id="psiReqForm">
          <div class="advanced-search-form">
            <div class="row mt-3">
              <div class="advanced-search-field col-12 col-md-2">
                <div
                  href="#"
                  v-on:click="mincode.contains = !mincode.contains"
                  v-bind:class="{ active: mincode.contains }"
                  class="wild-card-button"
                >
                  <v-tooltip activator="parent" location="top"
                    >Mincode contains</v-tooltip
                  >
                  [.*]
                </div>
                <v-text-field
                  label="Mincode:"
                  variant="outlined"
                  density="compact"
                  v-model="mincode.value"
                  v-on:keyup="keyHandler"
                  placeholder=""
                  id="mincode"
                  minlength="3"
                  trim
                />
              </div>
            </div>
            <div class="row ml-1">
              <div class="advanced-search-button">
                <v-btn
                  prepend-icon="mdi-magnify"
                  v-on:click="schoolReportSearch"
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
          id="mincode"
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
                    item.schoolOfRecord
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
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable.vue";
import GraduationReportService from "@/services/GraduationReportService.js";
import sharedMethods from "../sharedMethods";
import { useSnackbarStore } from "@/store/modules/snackbar";

export default {
  name: "SchoolReports",
  components: {
    DisplayTable: DisplayTable,
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      url: null,
      file: [],
      mincode: {
        value: "",
        contains: false,
      },
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
            this.totalResults = response.data.length;
            if (response.data.length < 1) {
              this.searchMessage = "No reports found for this school";
            }
          })
          .catch((error) => {
            this.searchLoading = false;
            this.searchMessage = "No reports found for this school";
            this.snackbarStore.showSnackbar(error.message, "error", 5000);
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
