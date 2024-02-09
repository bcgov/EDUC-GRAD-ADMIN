<template>
  <div class="container">
    <h2>Batch Processing</h2>
    <div>
      <v-btn
        class="position-absolute"
        style="z-index: 10; right: 0; margin-top: 10px; margin-right: 30px"
        color="info"
        small
        @click="updateDashboards"
      >
        <v-icon left> mdi-sync-alt </v-icon>
        Update
      </v-btn>
      <v-card>
        <v-tabs v-model="selectedTab" bg-color="transparent">
          <v-tab value="batchRuns"
            >Batch Runs ({{ batchInfoListData.length }})</v-tab
          >
          <v-tab value="scheduledRuns"
            >User Scheduled ({{ queueScheduledJobs.length }} Queued)</v-tab
          >
          <v-tab value="batchRoutines">Scheduled Routines</v-tab>
          <v-tab value="newBatchRequest">New Batch Request</v-tab>
          <v-tab value="administration">Administration</v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="selectedTab">
            <v-window-item value="batchRuns">
              <BatchRuns></BatchRuns>
            </v-window-item>

            <v-window-item value="scheduledRuns">
              <v-container>
                <v-row v-if="!scheduledJobs.length">
                  <v-col> No Scheduled Jobs </v-col>
                </v-row>
                <v-row v-else>
                  <v-col> <ScheduledBatchRuns></ScheduledBatchRuns></v-col>
                </v-row>
              </v-container>
            </v-window-item>

            <v-window-item value="batchRoutines">
              <BatchRoutines></BatchRoutines>
            </v-window-item>
            <v-window-item value="newBatchRequest">
              <v-container>
                <v-row>
                  <v-col sm="12" md="4">
                    <v-data-table
                      :items="batchRunGradOptions"
                      :headers="batchFields"
                      items-per-page="-1"
                      :disable-pagination="true"
                      :sortBy="[{ key: 'displayOrder', order: 'asc' }]"
                    >
                      <template #bottom></template>
                      <template v-slot:item.description="{ item }">
                        <strong>{{ item.raw.label }}</strong>
                        <br />
                        {{ item.raw.description }}
                      </template>
                      <template v-slot:item.newRequest="{ item }">
                        <v-btn
                          :disabled="item.raw.disabled"
                          @click="
                            newBatchRequest(
                              item.raw.code,
                              item.raw.label,
                              item.raw.description
                            )
                          "
                          >+</v-btn
                        ></template
                      >
                    </v-data-table>
                    <Form></Form>
                  </v-col>
                  <v-col sm="12" md="4">
                    <v-data-table
                      :items="distributionBatchRunOptions"
                      :headers="batchFields"
                      items-per-page="-1"
                      :sortBy="[{ key: 'displayOrder', order: 'asc' }]"
                    >
                      <template #bottom></template>
                      <template v-slot:item.description="{ item }">
                        <strong>{{ item.raw.label }}</strong>
                        <br />
                        {{ item.raw.description }}
                      </template>
                      <template v-slot:item.newRequest="{ item }">
                        <v-btn
                          :disabled="item.raw.disabled"
                          @click="
                            newBatchRequest(
                              item.raw.code,
                              item.raw.label,
                              item.raw.description
                            )
                          "
                          >+</v-btn
                        ></template
                      >
                    </v-data-table>
                  </v-col>
                  <v-col sm="12" md="4">
                    <v-data-table
                      :items="PSIBatchRunOptions"
                      :headers="batchFields"
                      items-per-page="-1"
                      :sortBy="[{ key: 'displayOrder', order: 'asc' }]"
                    >
                      <template #bottom></template>
                      <template v-slot:item.description="{ item }">
                        <strong>{{ item.raw.label }}</strong>
                        <br />
                        {{ item.raw.description }}
                      </template>
                      <template v-slot:item.newRequest="{ item }">
                        <v-btn
                          :disabled="item.raw.disabled"
                          @click="
                            newBatchRequest(
                              item.raw.code,
                              item.raw.label,
                              item.raw.description
                            )
                          "
                          >+</v-btn
                        ></template
                      >
                    </v-data-table>
                  </v-col></v-row
                >
              </v-container>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import BatchProcessingService from "@/services/BatchProcessingService.js";
import DistributionService from "@/services/DistributionService.js";
import DisplayTable from "@/components/DisplayTable.vue";
import BatchJobForm from "@/components/Batch/Batch.vue";
import ScheduledBatchRuns from "@/components/Batch/ScheduledBatchRuns.vue";
import Form from "@/components/Batch/Forms/Form.vue";
import BatchRuns from "@/components/Batch/BatchRuns.vue";
import BatchRoutines from "@/components/Batch/BatchRoutines.vue";
import sharedMethods from "../sharedMethods";

import { useAccessStore } from "../store/modules/access";
import { useBatchProcessingStore } from "../store/modules/batchprocessing";
import { useAuthStore } from "../store/modules/auth";
import { mapState, mapActions } from "pinia";
import { nextTick } from "vue";

export default {
  name: "Batch Processing",

  computed: {
    ...mapState(useAccessStore, [
      "allowUpdateGradStatus",
      "allowRunGradAlgorithm",
      "allowCreateBatchJob",
    ]),
    ...mapState(useBatchProcessingStore, {
      tabCounter: "getBatchCounter",
      tabContent: "getBatchDetails",
      tabs: "getBatchProcessingTabs",
      spinners: "getBatchTabsLoading",
      scheduledJobs: "getScheduledBatchJobs",
    }),
    ...mapState(useAuthStore, {
      userFullName: "userFullName",
    }),
    queueScheduledJobs() {
      let queuedJobs = this.scheduledJobs;
      if (queuedJobs) {
        return queuedJobs.filter(
          (queuedJobs) =>
            queuedJobs.status == "QUEUED" || queuedJobs.status == "PROCESSING"
        );
      } else {
        return [];
      }
    },
    results() {
      return this.searchResults;
    },
    batchInfoListDataChange() {
      return this.batchInfoListData;
    },
  },
  props: [
    //'adminSelectedBatchId',
  ],
  components: {
    Form: Form,
    DisplayTable: DisplayTable,
    BatchRuns: BatchRuns,
    BatchJobForm: BatchJobForm,
    BatchRoutines: BatchRoutines,
    ScheduledBatchRuns: ScheduledBatchRuns,
  },
  data() {
    return {
      value: "",
      batchTypes: [],
      batchFields: [
        {
          key: "description",
          title: "",
          sortable: true,
        },
        {
          key: "newRequest",
          title: "",
          sortable: true,
        },
        {
          key: "displayOrder",
          title: "",
          sortable: true,
        },
      ],
      validationMessage: "",
      validating: false,
      adminSelectedBatchId: "",
      adminSelectedErrorId: "",
      errorOn: false,
      displayMessage: null,
      adminDashboardLoading: false,
      dashboardData: "",
      processed: "",
      lastRunStatus: "",
      lastExpectedStudentsProcessed: "",
      processedLastRun: "",
      errors: "32",
      expected: "56",
      processingTime: "",
      lastJobstartTime: "",
      lastJobendTime: "",
      processedLastJobstartTime: "",
      processedLastJobendTime: "",
      timespan: "6:00pm to 7:12pm",
      timePerRecord: "18s",
      isErrorShowing: false,
      isBatchShowing: false,
      batchInfoListData: [],
      certificateTypes: [],
      transcriptTypes: [],
      fields: ["date", "program", "success", "view"],
      jobFields: ["date", "user", "success", "status"],
      items: [],
      jobs: [],
      selectedTab: 0,
      searchResults: [],
      batchValid: false,
      batchRunGradOptions: [],
      distributionBatchRunOptions: [],
      PSIBatchRunOptions: [],
      adminBatchRunOptions: [
        {
          createUser: "API_GRAD_BATCH",
          createDate: "2022-11-26T00:53:27.000+00:00",
          updateUser: "API_GRAD_BATCH",
          updateDate: "2022-11-26T00:53:27.000+00:00",
          code: "ARCHIVE_PROCESS",
          label: "Archive Process",
          description:
            "A Year-End Distribution Run that sends printed certificate and transcript packages (including distribution reports) to districts and schools. Includes students with new program completions where a certificate has not yet been distributed and students with updated transcripts after a previous completion.",
          displayOrder: 50,
          effectiveDate: "2021-09-27T07:00:00.000+00:00",
          expiryDate: null,
        },
        {
          createUser: "API_GRAD_BATCH",
          createDate: "2022-11-26T00:53:27.000+00:00",
          updateUser: "API_GRAD_BATCH",
          updateDate: "2022-11-26T00:53:27.000+00:00",
          code: "EDW_DOWNLOADS",
          label: "EDW Downloads",
          description:
            "A Supplemental Year-End Distribution Run that sends printed certificate and transcript packages (including distribution reports) to schools only. Includes students with new program completions where a certificate has not yet been distributed and students with updated transcripts after a previous completion.",
          displayOrder: 70,
          effectiveDate: "2021-09-27T07:00:00.000+00:00",
          expiryDate: null,
        },
        {
          createUser: "API_GRAD_BATCH",
          createDate: "2022-11-26T00:53:27.000+00:00",
          updateUser: "API_GRAD_BATCH",
          updateDate: "2022-11-26T00:53:27.000+00:00",
          code: "Purge/Rollover/Delete School Reports",
          label: "PURGE_ROLLOVER_DELETE_SCHOOL_REPORTS",
          description:
            "A Non-Graduate Transcript Distribution Run sends transcript packages (including distribution reports) to districts and schools for any current students in Grade 12 or AD who were on a graduation program but did not graduate.",
          displayOrder: 80,
          effectiveDate: "2021-09-27T07:00:00.000+00:00",
          expiryDate: null,
        },
        {
          createUser: "API_GRAD_BATCH",
          createDate: "2022-04-05T16:26:11.000+00:00",
          updateUser: "API_GRAD_BATCH",
          updateDate: "2022-04-05T16:26:11.000+00:00",
          code: "Challenges Report",
          label: "CHALLENGES_REPORT",
          description:
            "A Credentials Distribution Run that sends printed certificate and transcript packages (including distribution reports) to schools only. Includes students with new program completions where a certificate has not yet been distributed.",
          displayOrder: 60,
          effectiveDate: "2021-09-27T07:00:00.000+00:00",
          expiryDate: null,
        },
      ],
      utilitiesBatchRunOptions: [
        {
          createUser: "API_GRAD_BATCH",
          createDate: "2022-11-26T00:53:27.000+00:00",
          updateUser: "API_GRAD_BATCH",
          updateDate: "2022-11-26T00:53:27.000+00:00",
          code: "ADOPT_STUDENT",
          label: "Adopt Student",
          description:
            "A Year-End Distribution Run that sends printed certificate and transcript packages (including distribution reports) to districts and schools. Includes students with new program completions where a certificate has not yet been distributed and students with updated transcripts after a previous completion.",
          displayOrder: 50,
          effectiveDate: "2021-09-27T07:00:00.000+00:00",
          expiryDate: null,
        },
        {
          createUser: "API_GRAD_BATCH",
          createDate: "2022-11-26T00:53:27.000+00:00",
          updateUser: "API_GRAD_BATCH",
          updateDate: "2022-11-26T00:53:27.000+00:00",
          code: "MERGE_DEMERGE_STUDENT_DATA",
          label: "Merge/Demerge Student Data",
          description:
            "A Supplemental Year-End Distribution Run that sends printed certificate and transcript packages (including distribution reports) to schools only. Includes students with new program completions where a certificate has not yet been distributed and students with updated transcripts after a previous completion.",
          displayOrder: 70,
          effectiveDate: "2021-09-27T07:00:00.000+00:00",
          expiryDate: null,
        },
        {
          createUser: "API_GRAD_BATCH",
          createDate: "2022-11-26T00:53:27.000+00:00",
          updateUser: "API_GRAD_BATCH",
          updateDate: "2022-11-26T00:53:27.000+00:00",
          code: "TRANSFER_STUDENT_ASSESSMENT_DATA",
          label: "Transfer Student Course/Assessment Data",
          description:
            "A Non-Graduate Transcript Distribution Run sends transcript packages (including distribution reports) to districts and schools for any current students in Grade 12 or AD who were on a graduation program but did not graduate.",
          displayOrder: 80,
          effectiveDate: "2021-09-27T07:00:00.000+00:00",
          expiryDate: null,
        },
      ],
    };
  },
  created() {
    this.updateAllDashboards();
    BatchProcessingService.getBatchJobTypes()
      .then((response) => {
        this.batchTypes = response.data;
        this.batchRunGradOptions = this.filterBatchTypes(this.batchTypes, [
          "REGALG",
          "TVRRUN",
        ]);
        this.distributionBatchRunOptions = this.filterBatchTypes(
          this.batchTypes,
          ["DISTRUN_YE", "DISTRUN_SUPP", "NONGRADRUN", "DISTRUN", "DISTRUNUSER"]
        );

        this.PSIBatchRunOptions = this.filterBatchTypes(this.batchTypes, [
          "PSIRUN",
        ]);

        this.distributionBatchRunOptions = this.disableBatchRuns(
          this.distributionBatchRunOptions,
          ["DISTRUN_SUPP"]
        );
      })
      .catch((error) => {
        // Handle errors during the asynchronous call
        console.error("Error fetching batch job types:", error);

        // this.$bvToast.toast("ERROR " + error.response.statusText, {
        //   title: "ERROR " + error.response.status,
        //   variant: "danger",
        //   noAutoHide: true,
        // });
      });
  },
  methods: {
    disableBatchRuns(batchRunOptions, codeList) {
      batchRunOptions.forEach((option, index, array) => {
        if (codeList.includes(option.code)) {
          array[index].disabled = false;
        } else {
          array[index].disabled = true;
        }
      });
      return batchRunOptions;
    },
    filterBatchTypes(batchRunTypeCodes, batchCodes) {
      return batchRunTypeCodes.filter((batchJob) =>
        batchCodes.includes(batchJob.code)
      );
    },
    jobLabel(jobId) {
      return jobId.replace("job-", "");
    },
    ...mapActions(useBatchProcessingStore, [
      "clearBatchDetails",
      "editBatchDetails",
      "addBatchJob",
      "setTabLoading",
      "setScheduledBatchJobs",

      "clearBatchGroupData",
      "updateDashboards",
      "updateScheduledBatchJobs",
      "setGroup",
    ]),

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
    removeEmpty(obj) {
      Object.keys(obj).forEach(
        (k) => !obj[k] && obj[k] !== undefined && delete obj[k]
      );
      return obj;
    },
    getCurrentPSIYear() {
      let date = new Date();
      if (date.getMonth() + 1 > 8) {
        return String(date.getFullYear() + 1);
      } else {
        return String(date.getFullYear());
      }
    },
    cancelBatchJob(id) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i] == id) {
          this.tabs.splice(i, 1);
          this.spinners.splice(i, 1);
          this.clearBatchDetails(id);
          return;
        }
      }
    },

    newBatchJob() {
      let batchDetail = {
        details: {
          what: "",
          who: "",
          credential: "",
          where: "",
          copies: "1",
          psiYear: this.getCurrentPSIYear(),
          reportType: "",
        },
        students: [{}],
        schools: [{}],
        districts: [{}],
        programs: [{}],
        blankTranscriptDetails: [{}],
        blankCertificateDetails: [{}],
      };
      let id = "job-" + this.tabCounter;
      this.$set(this.spinners, id, false);
      this.editBatchDetails({
        batchDetail,
        id,
      });
      this.addBatchJob("job-" + this.tabCounter);
      nextTick(() => {
        nextTick(() => {
          requestAnimationFrame(() => {
            this.selectedTab = this.tabs.length;
          });
        });
      });
    },
    formatDate(value) {
      return value.toLocaleString("en-CA", { timeZone: "PST" });
    },
    getAdminDashboardData() {},
    updateAllDashboards() {
      this.updateDashboards();
    },
    batchHasErrors(batch) {
      batch.validationMessage = "";
      //check for what
      if (!batch.details["what"]) {
        this.validationMessage = "Type of batch Not Specified";
        return true;
      }
      //check for who

      if (
        !batch.details["who"] &&
        batch.details["what"] != "DISTRUN_SUPP" &&
        batch.details["what"] != "DISTRUN" &&
        batch.details["what"] != "DISTRUN_YE" &&
        batch.details["what"] != "NONGRADRUN"
      ) {
        this.validationMessage = "Group not specified";
        return true;
      }
      //check for local download
      if (batch.details["where"] == "localDownload") {
        if (batch.details["what"] == "DISTRUNUSER") {
          if (batch.details["credential"] == "Blank certificate print") {
            if (!batch.details["blankCertificateDetails"].length) {
              this.validationMessage =
                "Please choose at least one certificate type";
              return true;
            }
          }
          if (batch.details["credential"] == "Blank transcript print") {
            if (!batch.details["blankTranscriptDetails"].length) {
              this.validationMessage =
                "Please choose at least one transcript type";
              return true;
            }
          }
        }
      }
      return false;
    },
    getBatchData(item) {
      if (item.raw.value) {
        return item.raw.value;
      } else {
        return item;
      }
    },
    runDISTRUN_MONTHLY(id) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.setTabLoading({ index, value });
      BatchProcessingService.runDISTRUN_MONTHLY()
        .then((response) => {
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          if (response.data) {
            alert(
              "Batch run " +
                response.data.batchId +
                " has started for request " +
                requestId +
                "BATCH PROCESSING STARTED"
            );
          }
        })
        .catch((error) => {
          if (error) {
            this.getAdminDashboardData();
            this.cancelBatchJob(id);
            this.selectedTab = 0;
            alert(
              "This request is running in the background" +
                "BATCH PROCESSING UPDATE"
            );
          }
        });
    },
    runDISTRUN_YE(request, id) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.setTabLoading({ index, value });
      BatchProcessingService.runDISTRUN_YE(request)
        .then((response) => {
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          if (response.data) {
            this.$bvToast.toast(
              "Batch run " +
                response.data.batchId +
                " has started for request " +
                requestId,
              {
                title: "BATCH PROCESSING STARTED",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        })
        .catch((error) => {
          if (error) {
            this.getAdminDashboardData();
            this.cancelBatchJob(id);
            this.selectedTab = 0;
            this.$bvToast.toast("This request is running in the background", {
              title: "BATCH PROCESSING UPDATE",
              variant: "success",
              noAutoHide: true,
            });
          }
        });
    },
    runDISTRUN_SUPP(request, id) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.setTabLoading({ index, value });
      BatchProcessingService.runDISTRUN_SUPP(request)
        .then((response) => {
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          if (response.data) {
            this.$bvToast.toast(
              "Batch run " +
                response.data.batchId +
                " has started for request " +
                requestId,
              {
                title: "BATCH PROCESSING STARTED",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        })
        .catch((error) => {
          if (error) {
            this.getAdminDashboardData();
            this.cancelBatchJob(id);
            this.selectedTab = 0;
            this.$bvToast.toast("This request is running in the background", {
              title: "BATCH PROCESSING UPDATE",
              variant: "success",
              noAutoHide: true,
            });
          }
        });
    },
    runNONGRADRUN(request, id) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.setTabLoading({ index, value });
      BatchProcessingService.runNONGRADRUN(request)
        .then((response) => {
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          if (response.data) {
            this.$bvToast.toast(
              "Batch run " +
                response.data.batchId +
                " has started for request " +
                requestId,
              {
                title: "BATCH PROCESSING STARTED",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        })
        .catch((error) => {
          if (error) {
            this.getAdminDashboardData();
            this.cancelBatchJob(id);
            this.selectedTab = 0;
            this.$bvToast.toast("This request is running in the background", {
              title: "BATCH PROCESSING UPDATE",
              variant: "success",
              noAutoHide: true,
            });
          }
        });
    },
    runBlankDISTRUNUSERUserRequest(request, id, credentialType) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.setTabLoading({ index, value });
      BatchProcessingService.runDISTRUNUSER(request, credentialType)
        .then((response) => {
          //update the admin dashboard
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;

          if (request.localDownload == "Y") {
            let bid = response.data.batchId;
            setTimeout(this.downloadDISTRUNUSER, 3000, bid);
          } else {
            if (response.data) {
              this.$bvToast.toast(
                "Batch run " +
                  response.data.batchId +
                  " has started for request " +
                  requestId,
                {
                  title: "BATCH PROCESSING STARTED",
                  variant: "success",
                  noAutoHide: true,
                }
              );
            }
          }
        })
        .catch((error) => {
          if (error) {
            this.cancelBatchJob(id);
            this.$bvToast.toast("There was an error processing " + requestId, {
              title: "BATCH PROCESSING UPDATE",
              variant: "error",
              noAutoHide: true,
            });
          }
        });
    },
    runDISTRUNUSER(request, id, credentialType) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.setTabLoading({ index, value });
      BatchProcessingService.runDISTRUNUSER(request, credentialType)
        .then((response) => {
          //update the admin dashboard
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          if (request.localDownload == "Y") {
            let bid = response.data.batchId;
            setTimeout(this.downloadDISTRUNUSER, 3000, bid);
          } else {
            if (response.data) {
              this.$bvToast.toast(
                "Batch run " +
                  response.data.batchId +
                  " has started for request " +
                  requestId,
                {
                  title: "BATCH PROCESSING STARTED",
                  variant: "success",
                  noAutoHide: true,
                }
              );
            }
          }
        })
        .catch((error) => {
          if (error) {
            this.cancelBatchJob(id);
            this.$bvToast.toast("There was an error processing " + requestId, {
              title: "BATCH PROCESSING UPDATE",
              variant: "error",
              noAutoHide: true,
            });
          }
        });
    },
    runArchiveStudents(request, id) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.setTabLoading({ index, value });
      BatchProcessingService.runYearlyArchiveBatchJobStudents(request)
        .then((response) => {
          //update the admin dashboard
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          if (response) {
            this.$bvToast.toast(
              "Batch run has started for request " + requestId,
              {
                title: "BATCH PROCESSING STARTED",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        })
        .catch((error) => {
          if (error) {
            this.cancelBatchJob(id);
            this.$bvToast.toast("There was an error processing " + requestId, {
              title: "BATCH PROCESSING UPDATE",
              variant: "error",
              noAutoHide: true,
            });
          }
        });
    },
    runManageSchoolReports(request, id) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.setTabLoading({ index, value });
      BatchProcessingService.runYearlyArchiveBatchJobSchools(request)
        .then((response) => {
          //update the admin dashboard
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          if (response) {
            this.$bvToast.toast(
              "Batch run has started for request " + requestId,
              {
                title: "BATCH PROCESSING STARTED",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        })
        .catch((error) => {
          if (error) {
            this.cancelBatchJob(id);
            this.$bvToast.toast("There was an error processing " + requestId, {
              title: "BATCH PROCESSING UPDATE",
              variant: "error",
              noAutoHide: true,
            });
          }
        });
    },
    runPSIRUN(request, id, transmissionType) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.setTabLoading({ index, value });
      BatchProcessingService.runPSIRUN(request, transmissionType)
        .then((response) => {
          //update the admin dashboard
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          if (response) {
            this.$bvToast.toast(
              "Batch run has started for request " + requestId,
              {
                title: "BATCH PROCESSING STARTED",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        })
        .catch((error) => {
          if (error) {
            this.cancelBatchJob(id);
            this.$bvToast.toast("There was an error processing " + requestId, {
              title: "BATCH PROCESSING UPDATE",
              variant: "error",
              noAutoHide: true,
            });
          }
        });
    },
    runTVRRUN(request, id) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.setTabLoading({ index, value });
      BatchProcessingService.runTVRRUN(request)
        .then((response) => {
          //update the admin dashboard
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          if (response.data) {
            this.$bvToast.toast(
              "Batch run " +
                response.data.batchId +
                " has started for request " +
                requestId,
              {
                title: "BATCH PROCESSING STARTED",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        })
        .catch((error) => {
          if (error) {
            this.cancelBatchJob(id);
            this.$bvToast.toast("There was an error processing " + requestId, {
              title: "BATCH PROCESSING UPDATE",
              variant: "error",
              noAutoHide: true,
            });
          }
        });
    },
    runREGALG(request, id) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.setTabLoading({ index, value });
      BatchProcessingService.runREGALG(request)
        .then((response) => {
          //update the admin dashboard
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          if (response.data) {
            this.$bvToast.toast(
              "Batch run " +
                response.data.batchId +
                " has started for request " +
                requestId,
              {
                title: "BATCH PROCESSING STARTED",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        })
        .catch((error) => {
          if (error) {
            this.cancelBatchJob(id);
            this.$bvToast.toast("There was an error processing " + requestId, {
              title: "BATCH PROCESSING UPDATE",
              variant: "error",
              noAutoHide: true,
            });
          }
        });
    },
    addScheduledJob(request, id) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.setTabLoading({ index, value });
      BatchProcessingService.addScheduledJob(request)
        .then(() => {
          //update the admin dashboard
          this.getScheduledJobs();
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          this.$bvToast.toast(
            "Request " + requestId + " has successfully been scheduled",
            {
              title: "SCHEDULING USER REQUEST",
              variant: "success",
              noAutoHide: true,
            }
          );
        })
        .catch((error) => {
          if (error) {
            this.$bvToast.toast("There was an error scheduling your request", {
              title: "SCHEDULING ERROR",
              variant: "success",
              noAutoHide: true,
            });
          }
        });
    },
    getScheduledJobs() {
      BatchProcessingService.getScheduledBatchJobs().then((response) => {
        this.setScheduledBatchJobs(response.data);
      });
    },
    runbatch(id, cronTime) {
      let pens = [],
        schools = [],
        districts = [],
        programs = [],
        psi = [],
        districtCategoryCode = "";

      if (this.tabContent[id].details["who"] == "School") {
        schools = this.tabContent[id].schools.map(this.getBatchData);
        schools.pop();
        if (!schools.length) {
          this.validationMessage = "Please select a school.";
          return;
        }
      } else if (this.tabContent[id].details["who"] == "Student") {
        pens = this.tabContent[id].students.map(this.getBatchData);
        pens.pop();
        if (!pens.length) {
          this.validationMessage = "Please select a student.";
          return;
        }
      } else if (this.tabContent[id].details["who"] == "District") {
        districts = this.tabContent[id].districts.map(this.getBatchData);
        districtCategoryCode = this.tabContent[id]["details"].categoryCode;
        if (this.tabContent[id]["details"].categoryCode == "") {
          districtCategoryCode = [];
        }
        if (!districtCategoryCode.length) {
          this.validationMessage = "Please select a district category";
          return;
        }
        districts.pop();
        if (!districts.length) {
          this.validationMessage = "Please select a district.";
          return;
        }
      } else if (this.tabContent[id].details["who"] == "PSI") {
        psi = this.tabContent[id].psi.map(this.getBatchData);
        psi.pop();
        if (!psi.length) {
          this.validationMessage =
            "Please select a Post Secondary Institution.";
          return;
        }
      } else if (this.tabContent[id].details["who"] == "Program") {
        programs = this.tabContent[id].programs.map(this.getBatchData);
        programs.pop();
        if (!programs.length) {
          this.validationMessage = "Please select a program.";
          return;
        }
      }
      let gradDateFrom = this.tabContent[id].details["gradDateFrom"];
      let gradDateTo = this.tabContent[id].details["gradDateTo"];
      let localDownload =
        this.tabContent[id].details["where"] == "localDownload" ? "Y" : "N";
      let credentialTypeCode = [];
      let quantity = this.tabContent[id].details["copies"];

      if (this.tabContent[id].details["blankCertificateDetails"].length) {
        credentialTypeCode =
          this.tabContent[id].details["blankCertificateDetails"];
      }
      if (this.tabContent[id].details["blankTranscriptDetails"].length) {
        credentialTypeCode =
          this.tabContent[id].details["blankTranscriptDetails"];
      }
      let request = {
        pens: pens,
        schoolOfRecords: schools,
        districts: districts,
        credentialTypeCode: credentialTypeCode,
        schoolCategoryCodes: [this.tabContent[id].details["categoryCode"]],
        programs: programs,
        psiCodes: psi,
        reportType: [this.tabContent[id].details["reportType"]],
        gradDateFrom: gradDateFrom,
        gradDateTo: gradDateTo,
        validateInput: false,
        quantity: quantity,
        localDownload: localDownload,
      };

      if (this.batchHasErrors(this.tabContent[id])) {
        return;
      }
      if (this.tabContent[id].details["what"] == "REGALG") {
        if (cronTime) {
          let scheduledRequest = {};
          scheduledRequest.cronExpression = cronTime;
          scheduledRequest.jobName = "SGBJ";
          scheduledRequest.blankPayLoad = null;
          scheduledRequest.payload = request;
          this.addScheduledJob(scheduledRequest, id);
        } else {
          this.runREGALG(request, id);
        }
      } else if (this.tabContent[id].details["what"] == "TVRRUN") {
        if (cronTime) {
          let scheduledRequest = {};
          scheduledRequest.cronExpression = cronTime;
          scheduledRequest.jobName = "STBJ";
          scheduledRequest.blankPayLoad = null;
          scheduledRequest.payload = request;
          scheduledRequest.psiPayload = null;
          this.addScheduledJob(scheduledRequest, id);
        } else {
          this.runTVRRUN(request, id);
        }
      } else if (this.tabContent[id].details["what"] == "PSIRUN") {
        if (cronTime) {
          let scheduledRequest = {};
          scheduledRequest.cronExpression = cronTime;
          scheduledRequest.jobName = "URPDBJ";
          scheduledRequest.blankPayLoad = null;
          scheduledRequest.payload = null;
          scheduledRequest.psiPayLoad = request;
          scheduledRequest.psiYear = this.tabContent[id].details["psiYear"];
          this.addScheduledJob(scheduledRequest, id);
        } else {
          request.psiYear = this.tabContent[id].details["psiYear"];
          this.runPSIRUN(
            request,
            id,
            this.tabContent[id].details["psiTransmissionMode"]
          );
        }
      } else if (this.tabContent[id].details["what"] == "DISTRUN") {
        if (cronTime) {
          let scheduledRequest = {};
          scheduledRequest.cronExpression = cronTime;
          scheduledRequest.jobName = "MDBJ";
          scheduledRequest.blankPayLoad = null;
          scheduledRequest.payload = request;
          this.addScheduledJob(scheduledRequest, id);
        } else {
          this.runDISTRUN_MONTHLY(id);
        }
      } else if (this.tabContent[id].details["what"] == "NONGRADRUN") {
        if (cronTime) {
          let scheduledRequest = {};
          scheduledRequest.cronExpression = cronTime;
          scheduledRequest.jobName = "NDBJ";
          scheduledRequest.blankPayLoad = null;
          scheduledRequest.payload = request;
          this.addScheduledJob(scheduledRequest, id);
        } else {
          this.runNONGRADRUN(request, id);
        }
      } else if (this.tabContent[id].details["what"] == "DISTRUN_YE") {
        if (cronTime) {
          let scheduledRequest = {};
          scheduledRequest.cronExpression = cronTime;
          scheduledRequest.jobName = "YDBJ";
          scheduledRequest.blankPayLoad = null;
          scheduledRequest.payload = request;
          this.addScheduledJob(scheduledRequest, id);
        } else {
          this.runDISTRUN_YE(request, id);
        }
      } else if (this.tabContent[id].details["what"] == "DISTRUNUSER") {
        if (cronTime) {
          let scheduledRequest = {};
          scheduledRequest.cronExpression = cronTime;
          scheduledRequest.jobName = "URDBJ";
          scheduledRequest.blankPayLoad = null;
          scheduledRequest.payload = null;
          scheduledRequest.psiPayLoad = null;

          if (
            this.tabContent[id].details["credential"] ==
              "Blank certificate print" ||
            this.tabContent[id].details["credential"] ==
              "Blank transcript print"
          ) {
            scheduledRequest.blankPayLoad = request;
          } else if (
            this.tabContent[id].details["credential"] == "Transcript" &&
            this.tabContent[id].details["who"] == "PSI"
          ) {
            scheduledRequest.psiPayLoad = request;
          } else {
            scheduledRequest.payload = request;
          }
          this.addScheduledJob(scheduledRequest, id);
        } else if (this.tabContent[id].details["where"] == "User") {
          console.log("user");
          request.user = this.userFullName;
          request.address = {
            streetLine1: "4TH FLOOR 620 SUPERIOR",
            streetLine2: "PO BOX 9886 STN PROV GOVT",
            city: "VICTORIA",
            region: "BRITISH COLUMBIA",
            country: "CANADA",
            code: "V8W9T6",
          };

          this.runBlankDISTRUNUSERUserRequest(
            request,
            id,
            this.tabContent[id].details["credential"]
          );
        } else {
          this.runDISTRUNUSER(
            request,
            id,
            this.tabContent[id].details["credential"]
          );
        }
        this.validationMessage = "";
      } else if (this.tabContent[id].details["what"] == "DISTRUN_SUPP") {
        if (cronTime) {
          let scheduledRequest = {};
          scheduledRequest.cronExpression = cronTime;
          scheduledRequest.jobName = "SDBJ";
          scheduledRequest.blankPayLoad = null;
          scheduledRequest.payload = request;
          this.addScheduledJob(scheduledRequest, id);
        } else {
          this.runDISTRUN_SUPP(request, id);
        }
      } else if (this.tabContent[id].details["what"] == "ARC_STUDENTS") {
        if (cronTime) {
          let scheduledRequest = {};
          scheduledRequest.cronExpression = cronTime;
          scheduledRequest.jobName = "ARCS";
          scheduledRequest.blankPayLoad = null;
          scheduledRequest.payload = request;
          this.addScheduledJob(scheduledRequest, id);
        } else {
          this.runArchiveStudents(request, id);
        }
      } else if (this.tabContent[id].details["what"] == "ARC_SCH_REPORTS") {
        if (cronTime) {
          let scheduledRequest = {};
          scheduledRequest.cronExpression = cronTime;
          scheduledRequest.jobName = "ARCS";
          scheduledRequest.blankPayLoad = null;
          scheduledRequest.payload = request;
          this.addScheduledJob(scheduledRequest, id);
        } else {
          this.runManageSchoolReports(request, id);
        }
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
    displaySearchResults(value) {
      this.searchResults = value;
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
  },
};
</script>
<style scoped>
.downloadIcon {
  min-width: 25px;
  margin-left: 5px;
  margin-top: 5px;
}
.alert,
.card,
.btn.btn-primary {
  position: inherit;
}
h6 {
  font-size: 1.5rem;
}
.find {
  padding-bottom: 1rem;
}
.delete-button {
  border-radius: 0px;
}
</style>
