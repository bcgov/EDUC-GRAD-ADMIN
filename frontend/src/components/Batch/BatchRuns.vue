<template>
  <v-row>
    <!-- First Column (col-5 for medium screens, col-12 for small screens) -->
    <v-col :cols="12" :md="isBatchShowing || isErrorShowing ? 7 : 12">
      <v-card>
        <v-card-text>
          <DisplayTable
            title="Job/Runs"
            :items="batchRuns"
            :fields="batchRunsFields"
            id="id"
            :showFilter="false"
            pagination="true"
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
                <v-icon>fas fa-download</v-icon>
              </v-btn>
            </template>
            <template v-slot:item.jobExecutionId="{ item }">
              <v-menu :close-on-content-click="true" location="end">
                <template v-slot:activator="{ props }">
                  <v-btn color="indigo" v-bind="props">
                    {{ item.jobExecutionId }}
                  </v-btn>
                </template>
                <v-card max-width="500">
                  <v-divider></v-divider>
                  <v-list>
                    <v-list-item
                      @click="setBatchId(item.jobExecutionId, 'batch')"
                      :title="item.jobExecutionId"
                    >
                      <v-list-item-title> View Batch Results</v-list-item-title>
                    </v-list-item>
                  </v-list>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>
                        Rerun this batch for
                        {{
                          item.expectedStudentsProcessed != 0
                            ? item.expectedStudentsProcessed
                            : ""
                        }}
                        students</v-list-item-title
                      >
                      <div
                        class="row border-bottom p-2"
                        v-if="item.jobType != 'DISTRUNUSER'"
                      >
                        <div
                          class="col-2 px-2 m-0"
                          v-if="item.jobType != 'DISTRUNUSER'"
                        >
                          <b-btn
                            :id="'batch-job-id-rerun-btn' + item.jobExecutionId"
                            :disabled="
                              item.jobType != 'TVRRUN' &&
                              item.jobType != 'REGALG'
                            "
                            class="p-0 m-0 float-right"
                            variant="link"
                            size="xs"
                            @click="rerunBatch(item.jobExecutionId)"
                          >
                            <img
                              width="35"
                              src="../../assets/images/play_icon.png"
                            />
                          </b-btn>
                        </div>
                      </div>
                    </v-list-item>
                  </v-list>

                  <v-divider></v-divider>
                  <pre
                    >{{ JSON.stringify(item.jobParameters, null, "\t") }} </pre
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
              <v-btn
                v-if="item.failedStudentsProcessed !== 0"
                text
                small
                class="v-btn v-btn--text v-btn--small v-btn--link"
                @click="setBatchId(item.jobExecutionId, 'error')"
              >
                {{ item.failedStudentsProcessed }}
              </v-btn>
              <div v-else>
                {{ item.failedStudentsProcessed }}
              </div>
            </template>
          </DisplayTable>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="5" v-if="isBatchShowing">
      <v-card>
        <v-card-text>
          <v-btn
            variant="danger"
            size="xs"
            class="float-right"
            @click="isBatchShowing ^= true"
          >
            Close
          </v-btn>
          <BatchJobSearchResults
            :selectedBatchId="adminSelectedBatchId"
          ></BatchJobSearchResults>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="5" v-if="isErrorShowing">
      <v-card>
        <v-card-text>
          <BatchJobErrorResults
            :selectedErrorId="adminSelectedErrorId"
          ></BatchJobErrorResults>

          <v-btn
            variant="danger"
            size="xs"
            class="float-right"
            @click="isErrorShowing ^= true"
          >
            Close
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import DisplayTable from "@/components/DisplayTable.vue";
import BatchJobSearchResults from "@/components/Batch/BatchJobSearchResults.vue";
import BatchJobErrorResults from "@/components/Batch/BatchJobErrorResults.vue";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import DistributionService from "@/services/DistributionService.js";
import { isProxy, toRaw } from "vue";
import sharedMethods from "../../sharedMethods.js";
import { useBatchProcessingStore } from "../../store/modules/batchprocessing";
import { mapState, mapActions } from "pinia";
export default {
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

    rerunBatch(bid) {
      BatchProcessingService.rerunBatch(bid).then((response) => {
        if (response) {
          this.$bvToast.toast(
            "Created a new batch job based on batch #" + bid,
            {
              title: "NEW BATCH JOB STARTED",
              variant: "success",
              noAutoHide: true,
            }
          );
        }
        this.getAdminDashboardData();
      });
    },
    downloadDISTRUNUSER(bid, transmissionMode = null) {
      DistributionService.downloadDISTRUNUSER(bid, transmissionMode).then(
        (response) => {
          sharedMethods.base64ToFileTypeAndDownload(
            response.data,
            "application/zip",
            bid
          );
          this.showNotification("success", "Download Completed");
        }
      );
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
          this.$bvToast.toast("Running school reports for batch job #" + bid, {
            title: "SCHOOL REPORTS BATCH",
            variant: "success",
            noAutoHide: true,
          });
        }
        this.getAdminDashboardData();
      });
    },
    rerunBatch(bid) {
      this.$refs["popover-" + bid].$emit("close");
      BatchProcessingService.rerunBatch(bid).then((response) => {
        if (response) {
          this.$bvToast.toast(
            "Created a new batch job based on batch #" + bid,
            {
              title: "NEW BATCH JOB STARTED",
              variant: "success",
              noAutoHide: true,
            }
          );
        }
        this.getAdminDashboardData();
      });
    },
    rerunBatchStudentErrors(bid) {
      this.$refs["popover-" + bid].$emit("close");

      BatchProcessingService.rerunBatchStudentErrors(bid).then((response) => {
        if (response) {
          this.$bvToast.toast(
            "Created an new batch job for batch #" + bid + " errors",
            {
              title: "NEW BATCH JOB STARTED",
              variant: "success",
              noAutoHide: true,
            }
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
</style>
