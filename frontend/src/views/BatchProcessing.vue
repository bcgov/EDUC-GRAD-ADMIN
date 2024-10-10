<template>
  <div class="batch-processing-view">
    <h1>Batch Processing</h1>
    <div>
      <v-btn
        class="position-absolute"
        style="z-index: 10; right: 0; margin-right: 40px"
        color="transparent"
        small
        @click="updateDashboards"
      >
        <v-icon color="white" icon="mdi-refresh" size="large"></v-icon>
        Update
      </v-btn>
      <v-tabs v-model="activeTab" bg-color="transparent">
        <v-tab
          value="batchRuns"
          @click="
            getJwtToken;
            activeTab = 'batchRuns';
          "
          >Batch Runs ({{ batchRuns.length }})</v-tab
        >
        <v-tab
          value="scheduledRuns"
          @click="
            getJwtToken;
            activeTab = 'scheduledRuns';
          "
          >User Scheduled ({{ queueScheduledJobs.length }} Queued)</v-tab
        >
        <v-tab
          @click="
            getJwtToken;
            activeTab = 'batchRoutines';
          "
          value="batchRoutines"
          >Scheduled Routines</v-tab
        >
        <v-tab
          @click="
            getJwtToken;
            clearBatchDetails;
          "
          value="newBatchRequest"
          >New Batch Request</v-tab
        >
      </v-tabs>

      <v-tabs-window v-model="getActiveTab">
        <v-tabs-window-item value="batchRuns">
          <BatchRuns></BatchRuns>
        </v-tabs-window-item>

        <v-tabs-window-item value="scheduledRuns">
          <v-row v-if="!scheduledJobs.length">
            <v-col> No Scheduled Jobs </v-col>
          </v-row>
          <v-row v-else>
            <v-col> <ScheduledBatchRuns></ScheduledBatchRuns></v-col>
          </v-row>
        </v-tabs-window-item>

        <v-tabs-window-item value="batchRoutines">
          <BatchRoutines></BatchRoutines>
        </v-tabs-window-item>
        <v-tabs-window-item value="newBatchRequest">
          <v-row class="py-4">
            <v-col justify-md="start">
              <h4>GRAD and TVR</h4>
              <v-data-table
                :items="batchRunGradOptions"
                :headers="batchFields"
                items-per-page="-1"
                :disable-pagination="true"
                hide-default-header
                hide-default-footer
                :sortBy="[{ key: 'displayOrder', order: 'asc' }]"
                class="pb-3"
              >
                <template v-slot:item.description="{ item }">
                  <strong>{{ item.label }} </strong>
                  <br />
                  {{ item.description }}
                </template>
                <template v-slot:item.newRequest="{ item }">
                  <GraduationAlgorithmForm
                    v-if="item.code == 'REGALG'"
                  ></GraduationAlgorithmForm
                  ><TranscriptAlgorithmForm
                    v-else-if="item.code == 'TVRRUN'"
                  ></TranscriptAlgorithmForm>
                  <v-btn v-else :disabled="true">+ </v-btn>
                </template>
              </v-data-table>
            </v-col>
            <v-col sm="12" md="4">
              <label>User Requests</label>
              <v-data-table
                :items="credentialBatchRunOptions.userRequests"
                :headers="batchFields"
                items-per-page="-1"
                hide-default-header
                hide-default-footer
                :sortBy="[{ key: 'displayOrder', order: 'asc' }]"
                class="pb-3"
              >
              </v-data-table>
              <v-table>
                <tbody>
                  <tr>
                    <td class="pl-3">Blank certificate print</td>
                    <td>
                      <DistrunForm
                        credentialSelected="Blank certificate print"
                      ></DistrunForm>
                    </td>
                  </tr>
                  <tr>
                    <td>Reprint certificate – no principal signature block</td>
                    <td>
                      <DistrunForm credentialSelected="RC"></DistrunForm>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Original certificate – with principal signature block
                    </td>
                    <td>
                      <DistrunForm credentialSelected="OC"></DistrunForm>
                    </td>
                  </tr>
                  <tr>
                    <td>Blank transcript print</td>
                    <td>
                      <DistrunForm
                        credentialSelected="Blank transcript print"
                      ></DistrunForm>
                    </td>
                  </tr>
                  <tr>
                    <td>Transcript</td>
                    <td>
                      <DistrunForm credentialSelected="OT"></DistrunForm>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <label>Regeneration</label>
              <v-data-table
                :items="credentialBatchRunOptions.regenerationRequests"
                :headers="batchFields"
                items-per-page="-1"
                :sortBy="[{ key: 'displayOrder', order: 'asc' }]"
                hide-default-header
                hide-default-footer
                class="pb-3"
              >
                <template v-slot:item.description="{ item }">
                  <strong> {{ item.label }} </strong>
                  <br />
                  {{ item.description }}
                </template>
                <template v-slot:item.newRequest="{ item }">
                  <RegenerateCertificateForm
                    v-if="item.code == 'CERT_REGEN'"
                  ></RegenerateCertificateForm>
                  <RegenerateSchoolReportForm
                    v-else-if="item.code == 'SCHL_RPT_REGEN'"
                  ></RegenerateSchoolReportForm>
                  <v-btn v-else :disabled="item.disabled">+ </v-btn>
                </template>
              </v-data-table>
            </v-col>
            <v-col sm="12" md="4">
              <h4>Year-End Administration</h4>
              <v-data-table
                :items="credentialBatchRunOptions.yearEndBatchRunOptions"
                :headers="batchFields"
                items-per-page="-1"
                :sortBy="[{ key: 'displayOrder', order: 'asc' }]"
                class="pb-3"
                hide-default-header
                hide-default-footer
              >
                <template v-slot:item.description="{ item }">
                  <strong>{{ item.label }}</strong>
                  <br />
                  {{ item.description }}
                </template>
                <template v-slot:item.newRequest="{ item }">
                  <DistrunFormYearEnd
                    v-if="item.code == 'DISTRUN_YE'"
                  ></DistrunFormYearEnd>
                  <NongradDistrunForm
                    v-if="item.code == 'NONGRADRUN'"
                  ></NongradDistrunForm>
                  <ArchiveStudentsForm
                    v-if="item.code == 'ARC_STUDENTS'"
                  ></ArchiveStudentsForm>
                  <ArchiveSchoolReportsForm
                    v-if="item.code == 'ARC_SCH_REPORTS'"
                  ></ArchiveSchoolReportsForm>
                  <TranscriptAlgorithmDeleteForm
                    v-if="item.code == 'TVR_DELETE'"
                  ></TranscriptAlgorithmDeleteForm>
                  <PSIForm v-if="item.code == 'PSIRUN'"></PSIForm>
                </template>
              </v-data-table> </v-col
          ></v-row>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </div>
</template>

<script>
import BatchProcessingService from "@/services/BatchProcessingService.js";
import DistributionService from "@/services/DistributionService.js";
import DisplayTable from "@/components/DisplayTable.vue";
import ScheduledBatchRuns from "@/components/Batch/ScheduledBatchRuns.vue";
import DistrunForm from "@/components/Batch/Forms/DistrunForm.vue";
import RegenerateCertificateForm from "@/components/Batch/Forms/RegenerateCertificateForm.vue";
import GraduationAlgorithmForm from "@/components/Batch/Forms/GraduationAlgorithmForm.vue";
import TranscriptAlgorithmForm from "@/components/Batch/Forms/TranscriptAlgorithmForm.vue";
import DistrunFormYearEnd from "@/components/Batch/Forms/DistrunFormYearEndForm.vue";
import RegenerateSchoolReportForm from "@/components/Batch/Forms/RegenerateSchoolReportForm.vue";
import TranscriptAlgorithmDeleteForm from "@/components/Batch/Forms/TranscriptAlgorithmDeleteForm.vue";
import ArchiveStudentsForm from "@/components/Batch/Forms/ArchiveStudentsForm.vue";
import ArchiveSchoolReportsForm from "@/components/Batch/Forms/ArchiveSchoolReportsForm.vue";
import NongradDistrunForm from "@/components/Batch/Forms/NongradDistrunForm.vue";
import PSIForm from "@/components/Batch/Forms/PSIForm.vue";
import BatchRuns from "@/components/Batch/BatchRuns.vue";
import BatchRoutines from "@/components/Batch/BatchRoutines.vue";

import sharedMethods from "../sharedMethods";

import { useAccessStore } from "../store/modules/access";
import { useBatchProcessingStore } from "../store/modules/batchprocessing";
import { useAuthStore } from "../store/modules/auth";
import { mapState, mapActions } from "pinia";
import { ref, watch } from "vue";

export default {
  name: "Batch Processing",
  setup() {
    const batchProcessingStore = useBatchProcessingStore();
    const activeTab = ref(batchProcessingStore.activeTab);
    watch(activeTab, (newValue) => {
      batchProcessingStore.activeTab = newValue;
    });

    return {
      activeTab,
    };
  },
  computed: {
    ...mapState(useAccessStore, [
      "allowUpdateGradStatus",
      "allowRunGradAlgorithm",
      "allowCreateBatchJob",
    ]),
    ...mapState(useBatchProcessingStore, {
      scheduledJobs: "getScheduledBatchJobs",
      getActiveTab: "getActiveTab",
      batchRuns: "getBatchRuns",
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
    batchRunsChange() {
      return this.batchRuns;
    },
  },
  components: {
    DistrunForm: DistrunForm,
    DisplayTable: DisplayTable,
    BatchRuns: BatchRuns,
    BatchRoutines: BatchRoutines,
    ScheduledBatchRuns: ScheduledBatchRuns,
    GraduationAlgorithmForm: GraduationAlgorithmForm,
    TranscriptAlgorithmForm: TranscriptAlgorithmForm,
    RegenerateCertificateForm: RegenerateCertificateForm,
    DistrunFormYearEnd: DistrunFormYearEnd,
    ArchiveStudentsForm: ArchiveStudentsForm,
    ArchiveSchoolReportsForm: ArchiveSchoolReportsForm,
    PSIForm: PSIForm,
    NongradDistrunForm: NongradDistrunForm,
    TranscriptAlgorithmDeleteForm: TranscriptAlgorithmDeleteForm,
    RegenerateSchoolReportForm: RegenerateSchoolReportForm,
  },
  data() {
    return {
      tab: "",
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
          align: "top",
        },
        {
          key: "displayOrder",
          title: "",
          sortable: true,
          align: " d-none",
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

      isErrorShowing: false,
      isBatchShowing: false,
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
      credentialBatchRunOptions: [],
      distributionBatchRunOptions: [],
      PSIBatchRunOptions: [],
      yearEndBatchRunOptions: [],
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
        this.credentialBatchRunOptions.userRequests = this.filterBatchTypes(
          this.batchTypes,
          ["DISTRUNUSER"]
        );

        this.credentialBatchRunOptions.regenerationRequests =
          this.filterBatchTypes(this.batchTypes, [
            "CERT_REGEN",
            "SCHL_RPT_REGEN",
          ]);
        this.credentialBatchRunOptions.yearEndBatchRunOptions =
          this.filterBatchTypes(this.batchTypes, [
            "ARC_STUDENTS",
            "ARC_SCH_REPORTS",
            "DISTRUN_YE",
            "TVR_DELETE",
            "PSIRUN",
            "NONGRADRUN",
          ]);

        this.distributionBatchRunOptions = this.filterBatchTypes(
          this.batchTypes,
          ["DISTRUN_YE", "CERT_REGEN"]
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
    disableBatchRuns(batchRunOptions, disableList) {
      batchRunOptions.forEach((option, index, array) => {
        if (disableList.includes(option.code)) {
          array[index].disabled = true;
        } else {
          array[index].disabled = false;
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
    ...mapActions(useAuthStore, ["getJwtToken"]),

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
    formatDate(value) {
      return value.toLocaleString("en-CA", { timeZone: "PST" });
    },
    getAdminDashboardData() {},
    updateAllDashboards() {
      this.updateDashboards();
    },
    getBatchData(item) {
      if (item.value) {
        return item.value;
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
    //delete
    runbatch(id, cronTime) {},
    rerunBatchSchoolReports(bid) {},
    rerunBatch(bid) {},
    rerunBatchStudentErrors(bid) {},
    displaySearchResults(value) {},
    setBatchId(id, type) {},
  },
};
</script>
<style scoped>
.batch-processing-view {
  padding-left: 25px;
  padding-right: 25px;
}
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
.v-container {
  max-width: 100%;
}
label {
  font-weight: bold;
  border-bottom: 1px solid;
  width: 100%;
  padding-bottom: 5px;
}
</style>
