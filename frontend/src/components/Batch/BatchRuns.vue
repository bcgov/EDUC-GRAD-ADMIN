<template>
  <v-container>
    <v-row>
      <!-- First Column (col-5 for medium screens, col-12 for small screens) -->
      <v-col :cols="12" :md="isBatchShowing || isErrorShowing ? 7 : 12">
        <v-data-table
          title="Job/Runs"
          :items="batchRuns"
          :headers="batchRunsFields"
          id="id"
          :showFilter="false"
          pagination="true"
          class="mt-5"
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
          <template v-slot:item.updateDate="{ item }">
            {{ item.updateDate.replace("T", ", ") }}
          </template>
          <template v-slot:item.jobExecutionId="{ item }">
            <v-menu location="end" :width="item.jobParameters ? 600 : 350">
              <template v-slot:activator="{ props }">
                <v-btn
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
                      {{ JSON.stringify(item.jobParameters, null, "\t") }}
                    </pre
                >
              </v-card>
            </v-menu>

            <v-popover
              :target="'batch-job-id-btn' + item.jobExecutionId"
              triggers="focus"
              :ref="'popover-' + item.jobExecutionId"
              class="w-40"
            >
            </v-popover>
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
        </v-data-table>
      </v-col>
      <v-col cols="12" md="5" v-if="isBatchShowing">
        <BatchJobSearchResults :selectedBatchId="adminSelectedBatchId"
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
        <BatchJobErrorResults :selectedErrorId="adminSelectedErrorId">
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
      snackbarStore: useSnackbarStore(),
      batchRunsFields: [
        {
          key: "jobDownload",
          title: "",
          sortable: true,
          class: "text-left p-0 m-0",
          editable: true,
        },
        {
          key: "jobExecutionId",
          title: "Job Execution ID",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "jobType",
          title: "Batch Job Type Code",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "triggerBy",
          title: "Batch Job Trigger",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "updateUser",
          title: "Run By",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "updateDate",
          title: "Update date",
          sortable: true,
          class: "text-left",
          editable: true,
          sortDirection: "desc",
          formatter: (value) => {
            let newValue = new Date(value);
            value = newValue.toLocaleString("en-CA", { hourCycle: "h23" });
            return value;
          },
        },
        {
          key: "status",
          title: "Status",
          sortable: true,
          class: "text-left",
          editable: true,
        },

        {
          key: "expectedStudentsProcessed",
          title: "Expected",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "actualStudentsProcessed",
          title: "Actual",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "failedStudentsProcessed",
          title: "Error",
          sortable: true,
          class: "text-center",
          editable: true,
        },
      ],
    };
  },
  created() {
    this.getAdminDashboardData();
  },
  computed: {
    ...mapState(useBatchProcessingStore, {
      batchRuns: "getBatchRuns",
    }),
  },
  methods: {
    ...mapActions(useBatchProcessingStore, ["setBatchJobs"]),
    getRowClass(item) {
      // Conditionally apply a class based on the item's status
      return item.jobExecutionId === "104848" ? "highlight-row" : "";
    },
    rerunBatch(bid) {
      BatchProcessingService.rerunBatch(bid).then((response) => {
        if (response) {
          // this.$bvToast.toast(
          //   "Created a new batch job based on batch #" + bid,
          //   {
          //     title: "NEW BATCH JOB STARTED",
          //     variant: "success",
          //     noAutoHide: true,
          //   }
          // );
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
      this.$refs["popover-" + bid].$emit("close");
      BatchProcessingService.rerunBatchSchoolReports(bid).then((response) => {
        if (response) {
          // this.$bvToast.toast("Running school reports for batch job #" + bid, {
          //   title: "SCHOOL REPORTS BATCH",
          //   variant: "success",
          //   noAutoHide: true,
          // });
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
      this.$refs["popover-" + bid].$emit("close");
      BatchProcessingService.rerunBatch(bid).then((response) => {
        if (response) {
          // this.$bvToast.toast(
          //   "Created a new batch job based on batch #" + bid,
          //   {
          //     title: "NEW BATCH JOB STARTED",
          //     variant: "success",
          //     noAutoHide: true,
          //   }
          // );
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
    getAdminDashboardData() {
      this.adminDashboardLoading = true;
      this.setBatchJobs();
      this.adminDashboardLoading = false;
      window.scrollTo(0, 0);
    },
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
