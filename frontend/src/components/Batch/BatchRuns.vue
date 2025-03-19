<template>
  <v-container>
    <!-- <v-overlay
      v-model="isBatchJobsLoading"
      class="align-center justify-center"
      contained
    >
      <v-progress-circular
        v-if="isBatchJobsLoading"
        indeterminate
        color="primary"
        size="64"
      >
      </v-progress-circular>
    </v-overlay> -->
    <v-row>
      <!-- First Column (col-5 for medium screens, col-12 for small screens) -->
      <v-col :cols="12" :md="isBatchShowing || isErrorShowing ? 7 : 12">
        <v-data-table-server
          title="Job/Runs"
          v-model:items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          :headers="batchRunHeaders"
          :items="batchRuns"
          :items-length="totalElements"
          :loading="isBatchJobsLoading"
          :page="currentPage"
          item-value="id"
          @update:options="updateBatchDashboard"
        >
          <template v-slot:item.data-table-expand="{ item }"> </template>
          <template v-slot:item.jobDownload="{ item }">
            <v-btn
              size="small"
              v-if="
                (item?.jobParameters?.payload?.localDownload === 'Y' ||
                  (item?.jobParameters?.transmissionType &&
                    item?.jobParameters?.transmissionType === 'FTP')) &&
                item.status === 'COMPLETED'
              "
              :disabled="item.status !== 'COMPLETED'"
              @click="
                downloadDISTRUNUSER(
                  item.jobExecutionId,
                  item.jobParameters.transmissionType
                )
              "
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.startTime="{ item }">
            {{ $filters.formatTime(item.startTime) }}
          </template>
          <template v-slot:item.endTime="{ item }">
            {{ $filters.formatTime(item.endTime) }}
          </template>
          <template v-slot:item.duration="{ item }">
            {{
              !!item.startTime && !!item.endTime
                ? getTimeDifference(item.startTime, item.endTime)
                : "-"
            }}
          </template>
          <template v-slot:item.jobExecutionId="{ item }">
            <v-menu location="end" :width="item.jobParameters ? 600 : 350">
              <template v-slot:activator="{ props }">
                <v-btn
                  @click="showBatchPayload(item.jobExecutionId)"
                  variant="plain"
                  v-bind="props"
                  :class="
                    item.jobExecutionId == adminSelectedBatchId
                      ? 'no-outline-btn v-btn-link selected'
                      : 'no-outline-btn v-btn-link'
                  "
                >
                  {{ item.jobExecutionId }}
                </v-btn>
              </template>
              <v-card
                max-width="500"
                :title="'Batch Job #' + item.jobExecutionId"
              >
                <v-list>
                  <v-list-item
                    @click="setBatchId(item.jobExecutionId, 'batch')"
                  >
                    <v-list-item-title>
                      <v-icon>mdi-play-circle-outline</v-icon> View Batch
                      Results</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="item.jobType != 'TVRRUN' && item.jobType != 'REGALG'"
                    @click="rerunBatch(item.jobExecutionId)"
                  >
                    <v-list-item-title>
                      <div class="" v-if="item.jobType != 'DISTRUNUSER'">
                        <v-btn
                          :id="'batch-job-id-rerun-btn' + item.jobExecutionId"
                          class=""
                          variant="link"
                          size="xs"
                        >
                          <v-icon>mdi-play-circle-outline</v-icon>
                        </v-btn>
                        Rerun this batch for
                        {{
                          item.expectedStudentsProcessed != 0
                            ? item.expectedStudentsProcessed
                            : ""
                        }}
                        students
                      </div>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="item.failedStudentsProcessed > 0"
                    @click="rerunBatchStudentErrors(item.jobExecutionId)"
                  >
                    <v-list-item-title>
                      <div>
                        <v-btn
                          :id="'batch-job-id-rerun-btn' + item.jobExecutionId"
                          class=""
                          variant="link"
                          size="xs"
                        >
                          <v-icon>mdi-play-circle-outline</v-icon>
                        </v-btn>
                        Rerun
                        {{
                          item.failedStudentsProcessed != 0
                            ? item.failedStudentsProcessed
                            : ""
                        }}
                        students with errors
                      </div>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="item.jobType == 'TVRRUN' || item.jobType == 'REGALG'"
                  >
                    <v-list-item-title>
                      <div>
                        <v-btn
                          :id="'batch-job-id-rerun-btn' + item.jobExecutionId"
                          class=""
                          variant="link"
                          size="xs"
                          @click="rerunBatchSchoolReports(item.jobExecutionId)"
                        >
                          <v-icon>mdi-play-circle-outline</v-icon>
                        </v-btn>
                        Rerun School Reports
                      </div>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>

                <v-divider></v-divider>
                <pre
                  v-if="item.jobParameters"
                  style="height: 200px; overflow-y: scroll"
                >
                {{ item.jobParameters }}
                    </pre
                >
              </v-card>
            </v-menu>
          </template>

          <template v-slot:item.failedStudentsProcessed="{ item }">
            <div class="text-center">
              <v-btn
                v-if="item.failedStudentsProcessed != 0"
                text
                small
                variant="plain"
                class="no-outline-btn v-btn-link"
                @click="setBatchId(item.jobExecutionId, 'error')"
              >
                {{ item.failedStudentsProcessed }}
              </v-btn>

              <div v-else>
                {{ item.failedStudentsProcessed }}
              </div>
            </div>
          </template>
        </v-data-table-server>
      </v-col>

      <v-col cols="12" md="5" v-if="isBatchShowing">
        <BatchJobSearchResults
          v-if="isBatchShowing"
          :selectedBatchId="adminSelectedBatchId"
          ><template v-slot:close>
            <v-btn
              color="bcGovBlue"
              variant="outlined"
              class="text-none mr-3"
              density="default"
              @click="
                isBatchShowing ^= true;
                adminSelectedBatchId = '';
              "
            >
              Close
            </v-btn></template
          ></BatchJobSearchResults
        >
      </v-col>
      <v-col cols="12" md="5" v-if="isErrorShowing">
        <BatchJobErrorResults
          v-if="isErrorShowing"
          :selectedErrorId="adminSelectedErrorId"
        >
          <template v-slot:close>
            <v-btn
              color="bcGovBlue"
              variant="outlined"
              class="text-none mr-3"
              density="default"
              @click="
                isErrorShowing ^= true;
                adminSelectedBatchId = '';
              "
            >
              Close
            </v-btn>
          </template>
        </BatchJobErrorResults>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import DisplayTable from "@/components/DisplayTable.vue";
import BatchJobSearchResults from "@/components/Batch/BatchJobSearchResults.vue";
import BatchJobErrorResults from "@/components/Batch/BatchJobErrorResults.vue";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import DistributionService from "@/services/DistributionService.js";
import sharedMethods from "../../sharedMethods.js";
import { useBatchProcessingStore } from "../../store/modules/batchprocessing";
import { mapState, mapActions } from "pinia";
import { useSnackbarStore } from "../../store/modules/snackbar";
import { useAppStore } from "../../store/modules/app";

export default {
  setup() {},
  components: {
    DisplayTable: DisplayTable,
    BatchJobSearchResults: BatchJobSearchResults,
    BatchJobErrorResults: BatchJobErrorResults,
  },
  data: function () {
    return {
      isBatchShowing: false,
      isErrorShowing: false,
      adminDashboardLoading: false,
      adminSelectedErrorId: null,
      adminSelectedBatchId: null,
      itemsPerPageOptions: [
        { title: "10", value: 10 },
        { title: "25", value: 25 },
        { title: "50", value: 50 },
        { title: "100", value: 100 },
      ],
      snackbarStore: useSnackbarStore(),
      appStore: useAppStore(),
      batchRunHeaders: [
        {
          key: "jobDownload",
          title: "",
          class: "text-left p-0 m-0",
          sortable: false,
        },
        {
          key: "jobExecutionId",
          title: "Batch ID",
          class: "text-left",
          sortable: false,
        },
        {
          key: "jobType",
          title: "Type",
          class: "text-left",
          sortable: false,
        },
        {
          key: "triggerBy",
          title: "Trigger",
          class: "text-left",
          sortable: false,
        },
        {
          key: "updateUser",
          title: "Run By",
          class: "text-left",
          sortable: false,
        },
        {
          key: "startTime",
          title: "Start Time",
          class: "text-left",
          sortable: false,
        },
        {
          key: "endTime",
          title: "End Time",
          class: "text-left",
          sortable: false,
        },
        {
          key: "duration",
          title: "Duration",
          class: "text-left",
          sortable: false,
        },
        {
          key: "status",
          title: "Status",
          class: "text-left",
          sortable: false,
        },
        {
          key: "expectedStudentsProcessed",
          title: "Expected",
          class: "text-left",
          sortable: false,
        },
        {
          key: "actualStudentsProcessed",
          title: "Actual",
          class: "text-left",
          sortable: false,
        },
        {
          key: "failedStudentsProcessed",
          title: "Error",
          class: "text-center",
          sortable: false,
        },
      ],
    };
  },
  created() {},
  computed: {
    ...mapState(useBatchProcessingStore, {
      batchRuns: "getBatchRuns",
      totalElements: "getBatchRunsTotalElements",
      itemsPerPage: "getBatchRunsItemsPerPage",
      currentPage: "getBatchRunsCurrentPage",
      isBatchJobsLoading: "getIsGettingBatchJobsLoading",
    }),
    ...mapState(useAppStore, {
      getSchoolMincodeById: "getSchoolMincodeById",
      getDistrictCodeById: "getDistrictCodeById",
    }),
  },
  methods: {
    ...mapActions(useBatchProcessingStore, [
      "setBatchJobs",
      "setBatchJobsCurrentPage",
    ]),
    getBatchDashboard() {
      this.setBatchJobs();
    },
    updateBatchDashboard({ page }) {
      this.setBatchJobsCurrentPage(page);
      this.getBatchDashboard();
    },
    showBatchPayload(id) {
      const batchRun = this.batchRuns.find(
        (batch) => batch.jobExecutionId === id
      );

      if (batchRun?.jobParameters?.payload?.schoolIds) {
        if (Array.isArray(batchRun?.jobParameters?.payload?.schoolIds)) {
          batchRun.jobParameters.payload.schoolIds =
            batchRun.jobParameters.payload.schoolIds.map((schoolId) =>
              schoolId && schoolId.length == 36
                ? this.getSchoolMincodeById(schoolId)
                : schoolId
            );
        }
      }
      if (batchRun?.jobParameters?.payload?.districtIds) {
        if (Array.isArray(batchRun?.jobParameters?.payload?.districtIds)) {
          batchRun.jobParameters.payload.districtIds =
            batchRun.jobParameters.payload.districtIds.map((districtId) =>
              districtId && districtId.length == 36
                ? this.getDistrictCodeById(districtId)
                : districtId
            );
        }
      } else {
        console.log(`Batch run with jobExecutionId ${id} not found.`);
      }
    },
    rerunBatch(bid) {
      BatchProcessingService.rerunBatch(bid).then((response) => {
        if (response) {
          this.snackbarStore.showSnackbar(
            "Created a new batch job based on batch #" + bid,
            "success",
            10000,
            "NEW BATCH JOB STARTED"
          );
        }
        this.getAdminDashboardData();
      });
    },
    downloadDISTRUNUSER(bid, transmissionMode = null) {
      DistributionService.downloadDISTRUNUSER(bid, transmissionMode)
        .then((response) => {
          if (!response.data || response.data.length === 0) {
            this.snackbarStore.showSnackbar(
              "This file is not available",
              "error",
              5000
            );
            return; // Exit the function if the file is not available
          }

          sharedMethods.base64ToFileTypeAndDownload(
            response.data,
            "application/zip",
            bid
          );
          this.snackbarStore.showSnackbar(
            "Download Completed",
            "success",
            5000
          );
        })
        .catch((error) => {
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
        });
    },
    setBatchId(id, type) {
      this.isBatchShowing = false;
      this.isErrorShowing = false;

      if (type == "batch") {
        this.isBatchShowing = true;
        this.isErrorShowing = false;
        this.adminSelectedBatchId = id.toString();
      }
      if (type == "error") {
        this.isBatchShowing = false;
        this.isErrorShowing = true;
        this.adminSelectedErrorId = id.toString();
      }
    },

    rerunBatchSchoolReports(bid) {
      BatchProcessingService.rerunBatchSchoolReports(bid).then((response) => {
        if (response) {
          this.snackbarStore.showSnackbar(
            "Running school reports for batch job #" + bid,
            "success",
            10000,
            "SCHOOL REPORTS BATCH"
          );
        }
        this.getAdminDashboardData();
      });
    },
    rerunBatch(bid) {
      BatchProcessingService.rerunBatch(bid).then((response) => {
        if (response) {
          this.snackbarStore.showSnackbar(
            "Created a new batch job based on batch #" + bid,
            "success",
            10000,
            "NEW BATCH JOB STARTED"
          );
        }
        this.getAdminDashboardData();
      });
    },
    rerunBatchStudentErrors(bid) {
      BatchProcessingService.rerunBatchStudentErrors(bid).then((response) => {
        if (response) {
          this.snackbarStore.showSnackbar(
            "Created a new batch job based on batch #" + bid,
            "success",
            10000,
            "NEW BATCH JOB STARTED"
          );
        }
        this.getAdminDashboardData();
      });
    },
    getTimeDifference(startTime, endTime) {
      return sharedMethods.getTimeDifference(startTime, endTime);
    },
    // getAdminDashboardData() {
    //   this.adminDashboardLoading = true;
    //   this.setBatchJobs();
    //   this.adminDashboardLoading = false;
    //   window.scrollTo(0, 0);
    // },
  },
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
.link-button {
  text-decoration: underline;
  /* You can add more styles as needed to make it look like a link */
}
.v-btn-link.selected {
  font-weight: bold;
}
</style>
