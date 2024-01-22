<template>
  <div class="mt-2 row">
    <div
      :class="
        isBatchShowing || isErrorShowing
          ? 'col-12 col-md-7 float-left p-0'
          : 'col-12 col-md-12 float-left p-0'
      "
      class="col-12 col-md-7 float-left p-0"
    >
      <div v-if="adminDashboardLoading">LOADING</div>
      <DisplayTable
        title="Job/Runs"
        :items="batchRuns"
        v-bind:fields="batchRunsFields"
        id="id"
        :showFilter="false"
        pagination="true"
      >
        <template #cell(jobExecutionId)="row">
          <div
            class="float-left downloadIcon"
            v-if="row.item.jobParameters && row.item.jobParameters"
          >
            <div class="float-left py-2 px-0">
              <b-link
                :disabled="row.item.status != 'COMPLETED'"
                v-if="
                  row.item?.jobParameters?.payload?.localDownload == 'Y' ||
                  (row.item.jobParameters.transmissionType &&
                    row.item.jobParameters.transmissionType == 'FTP')
                "
                href="#"
                @click="
                  downloadDISTRUNUSER(
                    row.item.jobExecutionId,
                    row.item.jobParameters.transmissionType
                  )
                "
                ><i class="fas fa-download"></i
              ></b-link>
              <div v-else class="px-1">&nbsp;&nbsp;</div>
            </div>
          </div>
          <div v-else class="float-left downloadIcon p-1">&nbsp;&nbsp;</div>
          <b-btn
            v-if="row.item.status == 'COMPLETED'"
            :id="'batch-job-id-btn' + row.item.jobExecutionId"
            variant="link"
            size="xs"
          >
            {{ row.item.jobExecutionId }}
          </b-btn>

          <b-btn v-else disabled variant="link" size="xs">
            {{ row.item.jobExecutionId }}
          </b-btn>
          <b-popover
            :target="'batch-job-id-btn' + row.item.jobExecutionId"
            triggers="focus"
            :ref="'popover-' + row.item.jobExecutionId"
            class="w-50"
          >
            <template #title>Batch Job #{{ row.item.jobExecutionId }}</template>
            <div class="row border-bottom">
              <div class="col-9"></div>
              <div class="col-3"></div>
            </div>
            <!-- view Batch Results -->
            <div class="row border-bottom p-2">
              <div class="col-12">
                <a
                  href="#"
                  :id="'batch-job-id-btn' + row.item.jobExecutionId"
                  variant="link"
                  size="xs"
                  @click="setBatchId(row.item.jobExecutionId, 'batch')"
                >
                  View Batch Results
                </a>
              </div>
            </div>
            <div
              class="row border-bottom p-2"
              v-if="row.item.jobType != 'DISTRUNUSER'"
            >
              <div class="col-10 p-2">
                Rerun this batch for <br />{{
                  row.item.expectedStudentsProcessed != 0
                    ? row.item.expectedStudentsProcessed
                    : ""
                }}
                students
              </div>
              <div
                class="col-2 px-2 m-0"
                v-if="row.item.jobType != 'DISTRUNUSER'"
              >
                <b-btn
                  :id="'batch-job-id-rerun-btn' + row.item.jobExecutionId"
                  :disabled="
                    row.item.jobType != 'TVRRUN' && row.item.jobType != 'REGALG'
                  "
                  class="p-0 m-0 float-right"
                  variant="link"
                  size="xs"
                  @click="rerunBatch(row.item.jobExecutionId)"
                >
                  <img width="35" src="../../assets/images/play_icon.png" />
                </b-btn>
              </div>
            </div>
            <div
              class="row border-bottom p-2"
              v-if="
                row.item.jobType != 'DISTRUNUSER' &&
                row.item.failedStudentsProcessed != 0
              "
            >
              <div class="col-10 p-2">
                Rerun
                {{
                  row.item.failedStudentsProcessed != 0
                    ? row.item.failedStudentsProcessed
                    : ""
                }}
                students with errors
              </div>
              <div class="col-2 px-2 m-0">
                <b-btn
                  :disabled="
                    row.item.jobType != 'TVRRUN' &&
                    row.item.jobType != 'REGALG' &&
                    row.item.failedStudentsProcessed == 0
                  "
                  :id="'batch-job-id-error-rerun-btn' + row.item.jobExecutionId"
                  class="p-0 m-0 float-right"
                  variant="link"
                  size="xs"
                  @click="rerunBatchStudentErrors(row.item.jobExecutionId)"
                >
                  <img width="35" src="../../assets/images/play_icon.png" />
                </b-btn>
              </div>
            </div>

            <div
              class="row p-2 border-bottom"
              v-if="row.item.jobType != 'DISTRUNUSER'"
            >
              <div class="col-10 p-2">Rerun school reports</div>
              <div class="col-2 px-2 m-0">
                <b-btn
                  :disabled="
                    row.item.jobType != 'TVRRUN' && row.item.jobType != 'REGALG'
                  "
                  :id="
                    'batch-job-id-student-report-rerun-btn' +
                    row.item.jobExecutionId
                  "
                  class="p-0 m-0 float-right"
                  variant="link"
                  size="xs"
                  @click="rerunBatchSchoolReports(row.item.jobExecutionId)"
                >
                  <img width="35" src="../../assets/images/play_icon.png" />
                </b-btn>
              </div>
            </div>
            <b-card class="mt-3 p-0" title="Batch Job Parameters">
              <b-card-text>
                <div v-if="row.item.jobParameters">
                  {{ JSON.stringify(row.item.jobParameters, null, "\t") }}
                </div>
              </b-card-text>
            </b-card>
          </b-popover>
        </template>
        <template #cell(failedStudentsProcessed)="row">
          <b-btn
            v-if="row.item.failedStudentsProcessed != 0"
            variant="link"
            size="xs"
            @click="setBatchId(row.item.jobExecutionId, 'error')"
          >
            {{ row.item.failedStudentsProcessed }}
          </b-btn>
          <div v-if="row.item.failedStudentsProcessed == 0">
            {{ row.item.failedStudentsProcessed }}
          </div>
        </template>
      </DisplayTable>
    </div>
    <!-- All batch results -->
    <div v-if="isBatchShowing" class="col-12 col-md-5 float-right pl-2 pr-0">
      <b-card
        bg-variant="light"
        :header="'Batch Job ' + this.adminSelectedBatchId"
        class="text-left mb-2"
      >
        <b-card-text>
          <BatchJobSearchResults
            :selectedBatchId="adminSelectedBatchId"
          ></BatchJobSearchResults>
          <b-btn
            variant="danger"
            size="xs"
            class="float-right"
            @click="isBatchShowing ^= true"
          >
            Close
          </b-btn>
        </b-card-text>
      </b-card>
    </div>
    <div v-if="isErrorShowing" class="col-12 col-md-5 float-right pl-2 pr-0">
      <b-card
        bg-variant="light"
        :header="'Batch Job ' + this.adminSelectedErrorId"
        class="text-left mb-2"
      >
        <b-card-text>
          <BatchJobErrorResults
            :selectedErrorId="adminSelectedErrorId"
          ></BatchJobErrorResults>
          <b-btn
            variant="danger"
            size="xs"
            class="float-right"
            @click="isErrorShowing ^= true"
          >
            Close
          </b-btn>
        </b-card-text>
      </b-card>
    </div>
  </div>
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
          key: "jobExecutionId",
          label: "Job Execution ID",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "jobType",
          label: "Batch Job Type Code",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "triggerBy",
          label: "Batch Job Trigger",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "updateUser",
          label: "Run By",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "updateDate",
          label: "Update date",
          sortable: true,
          class: "text-left",
          editable: true,
          sortDirection: "desc",
          formatter: (value) => {
            let newValue = new Date(value);
            value = newValue.toLocaleString("en-CA", { timeZone: "PST" });
            return value;
          },
        },
        {
          key: "status",
          label: "Status",
          sortable: true,
          class: "text-center",
          editable: true,
        },
        {
          key: "expectedStudentsProcessed",
          label: "Expected",
          sortable: true,
          class: "text-center",
          editable: true,
        },
        {
          key: "actualStudentsProcessed",
          label: "Actual",
          sortable: true,
          class: "text-center",
          editable: true,
        },
        {
          key: "failedStudentsProcessed",
          label: "Error",
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
        this.$refs["popover-" + id].$emit("close");
        // this.$emit(this.$refs["popover" + id]);
      }
      if (type == "error") {
        this.isBatchShowing = false;
        this.isErrorShowing = true;
        this.adminSelectedErrorId = id.toString();
        this.$refs["popover-" + id].$emit("close");
        console.log(this.adminSelectedErrorId);
      }
      // var element = this.$refs["top"];
      // var top = element.offsetTop;
      // window.scrollTo(0, top);
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
    //TODO: Transfer to common method
    makeToast(message, variant) {
      this.$bvToast.toast(message, {
        title: message,
        variant: variant,
        noAutoHide: true,
      });
    },
  },
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
</style>
