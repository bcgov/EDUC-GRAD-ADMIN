<template>
  <div class="container">
    <h2>Batch Processing</h2>
    <div>
      <div class="mt-2 row">
        <div class="col-12 float-left p-0">
          <div ref="top">
            <b-card no-body>
              <b-tabs v-model="selectedTab" active card>
                <b-tab title="Job/Runs">
                  <div class="w-100">
                    <div
                      class="position-absolute"
                      style="right: 0; padding-right: 15px"
                    >
                      <b-btn
                        class="pb-1 mx-2"
                        @click="getAdminDashboardData"
                        variant="info"
                        small
                      >
                        <i class="fas fa-sync-alt" aria-hidden="true"></i>
                        Update</b-btn
                      >
                    </div>
                  </div>
                  <div>
                    <b-card no-body class="border-0">
                      <b-tabs pills class="border-0">
                        <b-tab title="Batch Runs" active>
                          <b-card-text class="row">
                            <div
                              :class="
                                isBatchShowing || isErrorShowing
                                  ? 'col-12 col-md-7'
                                  : 'col-12'
                              "
                            >
                              <b-overlay :show="adminDashboardLoading">
                                <DisplayTable
                                  title="Job/Runs"
                                  :items="batchInfoListData"
                                  v-bind:fields="jobRunFields"
                                  id="id"
                                  :showFilter="false"
                                  pagination="true"
                                >
                                  <template #cell(jobExecutionId)="row">
                                    <a
                                      v-if="
                                        row.item.jobParameters.localDownload ==
                                        'Y'
                                      "
                                      href="#"
                                      @click="
                                        downloadDISTRUNUSER(
                                          row.item.jobExecutionId
                                        )
                                      "
                                      ><i class="fas fa-download"></i
                                    ></a>
                                    <span v-else class="px-2"></span>
                                    <b-btn
                                      v-if="row.item.status == 'COMPLETED'"
                                      :id="
                                        'batch-job-id-btn' +
                                        row.item.jobExecutionId
                                      "
                                      variant="link"
                                      size="xs"
                                    >
                                      {{ row.item.jobExecutionId }}
                                    </b-btn>

                                    <b-btn
                                      v-else
                                      disabled
                                      variant="link"
                                      size="xs"
                                    >
                                      {{ row.item.jobExecutionId }}
                                    </b-btn>
                                    <b-popover
                                      :target="
                                        'batch-job-id-btn' +
                                        row.item.jobExecutionId
                                      "
                                      triggers="focus"
                                      :ref="
                                        'popover-' + row.item.jobExecutionId
                                      "
                                      class="w-50"
                                    >
                                      <template #title
                                        >Batch Job #{{
                                          row.item.jobExecutionId
                                        }}</template
                                      >
                                      <div class="row border-bottom">
                                        <div class="col-9"></div>
                                        <div class="col-3"></div>
                                      </div>
                                      <div class="row border-bottom p-2">
                                        <div class="col-12">
                                          <a
                                            href="#"
                                            :id="
                                              'batch-job-id-btn' +
                                              row.item.jobExecutionId
                                            "
                                            variant="link"
                                            size="xs"
                                            @click="
                                              setBatchId(
                                                row.item.jobExecutionId,
                                                'batch'
                                              )
                                            "
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
                                            row.item
                                              .expectedStudentsProcessed != 0
                                              ? row.item
                                                  .expectedStudentsProcessed
                                              : ""
                                          }}
                                          students
                                        </div>
                                        <div
                                          class="col-2 px-2 m-0"
                                          v-if="
                                            row.item.jobType != 'DISTRUNUSER'
                                          "
                                        >
                                          <b-btn
                                            :id="
                                              'batch-job-id-rerun-btn' +
                                              row.item.jobExecutionId
                                            "
                                            :disabled="
                                              row.item.jobType != 'TVRRUN' &&
                                              row.item.jobType != 'REGALG'
                                            "
                                            class="p-0 m-0 float-right"
                                            variant="link"
                                            size="xs"
                                            @click="
                                              rerunBatch(
                                                row.item.jobExecutionId
                                              )
                                            "
                                          >
                                            <img
                                              width="35"
                                              src="../../src/assets/images/play_icon.png"
                                            />
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
                                            row.item.failedStudentsProcessed !=
                                            0
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
                                              row.item
                                                .failedStudentsProcessed == 0
                                            "
                                            :id="
                                              'batch-job-id-error-rerun-btn' +
                                              row.item.jobExecutionId
                                            "
                                            class="p-0 m-0 float-right"
                                            variant="link"
                                            size="xs"
                                            @click="
                                              rerunBatchStudentErrors(
                                                row.item.jobExecutionId
                                              )
                                            "
                                          >
                                            <img
                                              width="35"
                                              src="../../src/assets/images/play_icon.png"
                                            />
                                          </b-btn>
                                        </div>
                                      </div>

                                      <div
                                        class="row p-2 border-bottom"
                                        v-if="row.item.jobType != 'DISTRUNUSER'"
                                      >
                                        <div class="col-10 p-2">
                                          Rerun school reports
                                        </div>
                                        <div class="col-2 px-2 m-0">
                                          <b-btn
                                            :disabled="
                                              row.item.jobType != 'TVRRUN' &&
                                              row.item.jobType != 'REGALG'
                                            "
                                            :id="
                                              'batch-job-id-student-report-rerun-btn' +
                                              row.item.jobExecutionId
                                            "
                                            class="p-0 m-0 float-right"
                                            variant="link"
                                            size="xs"
                                            @click="
                                              rerunBatchSchoolReports(
                                                row.item.jobExecutionId
                                              )
                                            "
                                          >
                                            <img
                                              width="35"
                                              src="../../src/assets/images/play_icon.png"
                                            />
                                          </b-btn>
                                        </div>
                                      </div>
                                      <b-card
                                        class="mt-3 p-0"
                                        title="Batch Job Parameters"
                                      >
                                        <b-card-text>
                                          <pre
                                            >{{
                                              JSON.stringify(
                                                row.item.jobParameters,
                                                null,
                                                "\t"
                                              )
                                            }} </pre
                                          >
                                        </b-card-text>
                                      </b-card>
                                    </b-popover>
                                  </template>
                                  <template
                                    #cell(failedStudentsProcessed)="row"
                                  >
                                    <b-btn
                                      v-if="
                                        row.item.failedStudentsProcessed != 0
                                      "
                                      variant="link"
                                      size="xs"
                                      @click="
                                        setBatchId(
                                          row.item.jobExecutionId,
                                          'error'
                                        )
                                      "
                                    >
                                      {{ row.item.failedStudentsProcessed }}
                                    </b-btn>
                                    <div
                                      v-if="
                                        row.item.failedStudentsProcessed == 0
                                      "
                                    >
                                      {{ row.item.failedStudentsProcessed }}
                                    </div>
                                  </template>
                                </DisplayTable>
                              </b-overlay>
                            </div>
                            <!-- All batch results -->
                            <div
                              v-if="isBatchShowing"
                              class="col-12 col-md-5 float-right pl-2 pr-0"
                            >
                              <b-card
                                bg-variant="light"
                                :header="
                                  'Batch Job ' + this.adminSelectedBatchId
                                "
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
                            <!-- All error results -->
                            <div
                              v-if="isErrorShowing"
                              class="col-12 col-md-5 float-right pl-2 pr-0"
                            >
                              <b-card
                                bg-variant="light"
                                :header="
                                  'Batch Job Error ' + this.adminSelectedErrorId
                                "
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
                          </b-card-text>
                        </b-tab>
                        <b-tab
                          class="btn-sm"
                          :title="
                            'User Scheduled (' +
                            queueScheduledJobs.length +
                            ' Queued)'
                          "
                        >
                          <b-card-text>
                            <div v-if="!scheduledJobs.length">
                              No Scheduled Jobs
                            </div>
                            <DisplayTable
                              title="Job/Runs"
                              :items="scheduledJobs"
                              v-bind:fields="scheduledJobFields"
                              id="id"
                              sortBy="status"
                              :sortDesc="true"
                              :showFilter="false"
                              pagination="true"
                              disableDeletefield="status"
                              disableDeleteIfValue="COMPLETED"
                              deleteLabel="Cancel"
                              delete="batchprocessing/removeScheduledJobs"
                            >
                              <template #cell(jobExecutionId)="row">
                                <b-btn
                                  v-if="row.item.status == 'COMPLETED'"
                                  :id="
                                    'batch-job-id-btn' + row.item.jobExecutionId
                                  "
                                  variant="link"
                                  size="xs"
                                >
                                  {{ row.item.jobExecutionId }}
                                </b-btn>
                                <b-btn v-else disabled variant="link" size="xs">
                                  {{ row.item.jobExecutionId }}
                                </b-btn>
                                <b-popover
                                  :target="
                                    'batch-job-id-btn' + row.item.jobExecutionId
                                  "
                                  triggers="focus"
                                  :ref="'popover-' + row.item.jobExecutionId"
                                >
                                  <template #title>Search batch job</template>
                                  <b-btn
                                    :id="
                                      'batch-job-id-btn' +
                                      row.item.jobExecutionId
                                    "
                                    variant="link"
                                    size="xs"
                                    @click="
                                      setBatchId(
                                        row.item.jobExecutionId,
                                        'batch'
                                      )
                                    "
                                  >
                                    All results
                                  </b-btn>
                                </b-popover>
                              </template>
                              <template #cell(failedStudentsProcessed)="row">
                                <b-btn
                                  v-if="row.item.failedStudentsProcessed != 0"
                                  variant="link"
                                  size="xs"
                                  @click="
                                    setBatchId(row.item.jobExecutionId, 'error')
                                  "
                                >
                                  {{ row.item.failedStudentsProcessed }}
                                </b-btn>
                                <div
                                  v-if="row.item.failedStudentsProcessed == 0"
                                >
                                  {{ row.item.failedStudentsProcessed }}
                                </div>
                              </template>
                              <template #cell(jobParameters)="row">
                                <div>
                                  <b-btn
                                    variant="outline primary"
                                    style="color: #666"
                                    size="sm"
                                    @click="row.toggleDetails"
                                    class="more-button"
                                  >
                                    <img
                                      v-show="!row.detailsShowing"
                                      src="../assets/images/icon-right.svg"
                                      width="9px"
                                      aria-hidden="true"
                                      alt=""
                                    />
                                    <img
                                      v-show="row.detailsShowing"
                                      src="../assets/images/icon-down.svg"
                                      height="5px"
                                      aria-hidden="true"
                                      alt=""
                                    />
                                  </b-btn>
                                </div>
                              </template>
                              <template #row-details="row">
                                <b-card class="px-0">
                                  <div
                                    v-for="(value, key) in row.item
                                      .jobParameters.payload"
                                    :key="key"
                                  >
                                    <span v-if="value != null"
                                      ><span v-if="value.length != 0"
                                        >{{ key }} : {{ value }}</span
                                      ></span
                                    >
                                  </div>
                                </b-card>
                              </template>
                            </DisplayTable>
                          </b-card-text>
                        </b-tab>
                        <b-tab class="btn-sm" :title="'Routines'">
                          <b-card-text>
                            <BatchRoutines />
                          </b-card-text>
                        </b-tab>
                      </b-tabs>
                    </b-card>
                  </div>
                </b-tab>
                <b-tab
                  v-for="i in tabs"
                  :key="'dyn-tab-' + i"
                  :title="'Request ' + i"
                >
                  <template #title>
                    <b-spinner
                      v-show="spinners[i]"
                      type="border"
                      small
                    ></b-spinner>
                    Request {{ i | jobIdLabel }}
                  </template>
                  <b-alert v-if="validationMessage" show>{{
                    validationMessage
                  }}</b-alert>
                  <b-overlay :show="spinners[i]">
                    <BatchJobForm
                      :jobId="i"
                      @runbatch="runbatch"
                      @cancelBatchJob="cancelBatchJob"
                      :currentPSIYear="getCurrentPSIYear()"
                    ></BatchJobForm>
                  </b-overlay>
                </b-tab>

                <!-- New Tab Button (Using tabs-end slot) -->
                <template #tabs-end v-if="allowCreateBatchJob">
                  <b-nav-item
                    role="presentation"
                    @click.prevent="newBatchJob"
                    href="#"
                    >+ New Request</b-nav-item
                  >
                </template>

                <!-- Render this if no tabs -->
                <template #empty>
                  <div class="text-center text-muted">
                    There are no open tabs<br />
                    Open a new tab using the <strong>+</strong> button above.
                  </div>
                </template>
              </b-tabs>
            </b-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import BatchProcessingService from "@/services/BatchProcessingService.js";
import DistributionService from "@/services/DistributionService.js";
import DisplayTable from "@/components/DisplayTable.vue";
import BatchJobSearchResults from "@/components/Batch/BatchJobSearchResults.vue";
import BatchJobErrorResults from "@/components/Batch/BatchJobErrorResults.vue";
import BatchJobForm from "@/components/Batch/Batch.vue";
import BatchRoutines from "@/components/Batch/Routines.vue";
import sharedMethods from "../sharedMethods";

import { mapGetters, mapActions } from "vuex";
import { nextTick } from "vue";
export default {
  name: "test",
  computed: {
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
    ...mapGetters("useraccess", ["allowCreateBatchJob"]),
    ...mapGetters({
      tabCounter: "batchprocessing/getBatchCounter",
      tabContent: "batchprocessing/getBatchDetails",
      tabs: "batchprocessing/getBatchProcessingTabs",
      spinners: "batchprocessing/getBatchTabsLoading",
      scheduledJobs: "batchprocessing/getScheduledBatchJobs",
      courses: "getStudentCourses",
      gradStatusCourses: "gradStatusCourses",
      studentGradStatus: "getStudentGradStatus",
      hasGradStatus: "studentHasGradStatus",
      gradStatusPendingUpdates: "getHasGradStatusPendingUpdates",
    }),
  },
  props: [
    //'adminSelectedBatchId',
  ],
  components: {
    DisplayTable: DisplayTable,
    BatchJobSearchResults: BatchJobSearchResults,
    BatchJobErrorResults: BatchJobErrorResults,
    BatchJobForm: BatchJobForm,
    BatchRoutines: BatchRoutines,
  },
  data() {
    return {
      value: "",
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
      scheduledJobFields: [
        {
          key: "jobParameters",
          label: "",
          sortable: true,
          class: "text-left",
        },
        {
          key: "id",
          label: "ID",
          sortable: true,
          class: "text-left",
        },
        {
          key: "jobName",
          label: "Job Name",
          sortable: true,
          class: "text-left",
        },
        {
          key: "cronExpression",
          label: "CRON (Sec Min Hr Date Month)",
          sortable: true,
          class: "text-left",
        },

        {
          key: "createUser",
          label: "Scheduled By",
          sortable: true,
          class: "text-left",
        },
        {
          key: "status",
          label: "Status",
          sortable: true,
          class: "text-left",
        },
        {
          key: "delete",
          label: "Delete",
          sortable: true,
          class: "text-left",
        },
      ],
      jobRunFields: [
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
          class: "text-left",
          editable: true,
        },

        {
          key: "expectedStudentsProcessed",
          label: "Expected",
          sortable: true,
          class: "text-left",
          editable: true,
        },
        {
          key: "actualStudentsProcessed",
          label: "Actual",
          sortable: true,
          class: "text-left",
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
      fields: ["date", "program", "success", "view"],
      jobFields: ["date", "user", "success", "status"],
      items: [],
      jobs: [],
      selectedTab: 0,
      searchResults: [],
      batchValid: false,
    };
  },
  created() {
    this.getAdminDashboardData();
    this.getScheduledJobs();
  },
  methods: {
    ...mapActions("batchprocessing", ["setScheduledBatchJobs"]),
    downloadDISTRUNUSER(bid) {
      DistributionService.downloadDISTRUNUSER(bid).then((res) => {
        this.$bvToast.toast("Download (.zip)", {
          title: "FILE SUCCESSFULLY CREATED",
          href: "data:application/zip;base64," + res.data,
          variant: "success",
          noAutoHide: true,
        });
      });
    },
    removeEmpty(obj) {
      Object.keys(obj).forEach(
        (k) => !obj[k] && obj[k] !== undefined && delete obj[k]
      );
      return obj;
    },
    getZipLink: function (data, mimeType) {
      return sharedMethods.base64ToFileTypeData(data, mimeType);
    },
    getCurrentPSIYear() {
      let date = new Date();
      if (date.getMonth() + 1 > 8) {
        return date.getFullYear() + 1;
      } else {
        return date.getFullYear();
      }
    },
    cancelBatchJob(id) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i] == id) {
          this.tabs.splice(i, 1);
          this.spinners.splice(i, 1);
          this.$store.commit("batchprocessing/clearBatchDetails", id);
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
      this.$store.commit("batchprocessing/editBatchDetails", {
        batchDetail,
        id,
      });
      this.$store.commit(
        "batchprocessing/addBatchJob",
        "job-" + this.tabCounter
      );
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
    getAdminDashboardData() {
      this.adminDashboardLoading = true;
      BatchProcessingService.getDashboardInfo()
        .then((response) => {
          this.dashboardData = response.data;
          this.batchInfoListData = response.data.batchInfoList;
          //Processed
          this.processed = this.dashboardData.lastActualStudentsProcessed;
          this.lastExpectedStudentsProcessed =
            this.dashboardData.lastExpectedStudentsProcessed;
          this.lastRunStatus = this.dashboardData.lastStatus;
          //Errors
          this.errors = this.dashboardData.lastFailedStudentsProcessed;
          if (this.errors > 0) {
            this.errorOn = true;
          } else {
            this.errorOn = false;
          }
          //Processing time bucket
          this.lastJobendTime = new Date(this.dashboardData.lastJobendTime);
          this.lastJobstartTime = new Date(this.dashboardData.lastJobstartTime);
          var lastJobProcessTimeInMilli =
            this.lastJobendTime.getTime() - this.lastJobstartTime.getTime();
          this.processingTime = (
            lastJobProcessTimeInMilli /
            (1000 * 60 * 60)
          ).toFixed(1);
          this.processedLastJobstartTime = this.lastJobstartTime.toLocaleString(
            "en-CA",
            { timeZone: "PST" }
          );
          this.processedLastJobendTime = this.lastJobendTime.toLocaleString(
            "en-CA",
            { timeZone: "PST" }
          );
          this.processedLastRun = this.lastJobendTime.toLocaleString("en-CA", {
            timeZone: "PST",
          });
          //parameters
          for (const [batch] in this.batchInfoListData) {
            this.batchInfoListData[batch].jobParameters = this.removeEmpty(
              JSON.parse(this.batchInfoListData[batch].jobParameters)
            );
          }
          //Expected
          this.expected = this.dashboardData.lastExpectedStudentsProcessed;
          this.adminDashboardLoading = false;
          window.scrollTo(0, 0);
        })
        .catch((error) => {
          this.adminDashboardLoading = false;
          if (error.response) {
            this.$bvToast.toast("ERROR " + error.response.statusText, {
              title: "ERROR" + error.response.status,
              variant: "danger",
              noAutoHide: true,
            });
          }
        });
    },
    batchHasErrors(batch) {
      batch.validationMessage = "";
      //check for what
      if (!batch.details["what"]) {
        batch.validationMessage = "Type of batch Not Specified";
        return true;
      }
      //check for who
      if (!batch.details["who"]) {
        batch.validationMessage = "Group not specified";
        return true;
      }
      return false;
    },
    getBatchData(item) {
      if (item.value) {
        return item.value;
      } else {
        return item;
      }
    },
    runDISTRUN_YE(id) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.$store.commit("batchprocessing/setTabLoading", { index, value });
      BatchProcessingService.runDISTRUN_YE()
        .then((response) => {
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
            this.$bvToast.toast(
              "Batch run is still in progress for request" +
                requestId +
                " and will run in the background",
              {
                title: "BATCH PROCESSING UPDATE",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        });
    },
    runBlankDISTRUNUSERUserRequest(request, id, credentialType) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.$store.commit("batchprocessing/setTabLoading", { index, value });
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
            this.$bvToast.toast(
              "Batch run is still in progress for request" +
                requestId +
                " and will run in the background",
              {
                title: "BATCH PROCESSING UPDATE",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        });
    },
    runDISTRUNUSER(request, id, credentialType) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.$store.commit("batchprocessing/setTabLoading", { index, value });
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
            this.$bvToast.toast(
              "Batch run is still in progress for request" +
                requestId +
                " and will run in the background",
              {
                title: "BATCH PROCESSING UPDATE",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        });
    },
    runPSIRUN(request, id, transmissionType) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.$store.commit("batchprocessing/setTabLoading", { index, value });
      BatchProcessingService.runPSIRUN(request, transmissionType)
        .then(() => {
          //update the admin dashboard
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;

          this.$bvToast.toast(
            "Batch run has started for request " + requestId,
            {
              title: "BATCH PROCESSING STARTED",
              variant: "success",
              noAutoHide: true,
            }
          );
        })
        .catch((error) => {
          if (error) {
            this.cancelBatchJob(id);
            this.$bvToast.toast(
              "Batch run is still in progress for request" +
                requestId +
                " and will run in the background",
              {
                title: "BATCH PROCESSING UPDATE",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        });
    },
    runTVRRUN(request, id) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.$store.commit("batchprocessing/setTabLoading", { index, value });
      BatchProcessingService.runTVRRUN(request)
        .then(() => {
          //update the admin dashboard
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          this.$bvToast.toast(
            "Batch run has started for request " + requestId,
            {
              title: "BATCH PROCESSING STARTED",
              variant: "success",
              noAutoHide: true,
            }
          );
        })
        .catch((error) => {
          if (error) {
            this.cancelBatchJob(id);
            this.$bvToast.toast(
              "Batch run is still in progress for request" +
                requestId +
                " and will run in the background",
              {
                title: "BATCH PROCESSING UPDATE",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        });
    },
    runREGALG(request, id) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.$store.commit("batchprocessing/setTabLoading", { index, value });
      BatchProcessingService.runREGALG(request)
        .then(() => {
          //update the admin dashboard
          this.getAdminDashboardData();
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          this.$bvToast.toast(
            "Batch run has started for request " + requestId,
            {
              title: "BATCH PROCESSING STARTED",
              variant: "success",
              noAutoHide: true,
            }
          );
        })
        .catch((error) => {
          if (error) {
            this.cancelBatchJob(id);
            this.$bvToast.toast(
              "Batch run is still in progress for request" +
                requestId +
                " and will run in the background",
              {
                title: "BATCH PROCESSING UPDATE",
                variant: "success",
                noAutoHide: true,
              }
            );
          }
        });
    },
    addScheduledJob(request, id) {
      let requestId = id.replace("job-", "");
      this.$set(this.spinners, id, true);
      let index = id.replace("job-", "") - 1;
      let value = true;
      this.$store.commit("batchprocessing/setTabLoading", { index, value });
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
    validateBatch(id) {
      let pens = [],
        schools = [],
        psi = [],
        districts = [],
        programs = [],
        districtCategoryCode = "";
      if (this.tabContent[id].details["who"] == "School") {
        schools = this.tabContent[id].schools.map(this.getBatchData);
        schools.pop();
        if (!schools.length) {
          this.validationMessage = "Please select a school.";
          this.batchValid = false;
          return;
        }
      } else if (this.tabContent[id].details["who"] == "Student") {
        pens = this.tabContent[id].students.map(this.getBatchData);
        pens.pop();
        if (!pens.length) {
          this.validationMessage = "Please select a student.";
          this.batchValid = false;
          return;
        }
      } else if (this.tabContent[id].details["who"] == "PSI") {
        psi = this.tabContent[id].psi.map(this.getBatchData);
        psi.pop();
        if (!psi.length) {
          this.validationMessage = "Please select a PSI.";
          this.batchValid = false;
          return;
        }
      } else if (this.tabContent[id].details["who"] == "District") {
        districts = this.tabContent[id].districts.map(this.getBatchData);
        districtCategoryCode = this.tabContent[id]["details"].categoryCode;
        districts.pop();
        if (!districtCategoryCode) {
          this.validationMessage = "Please select a district category";
          this.batchValid = false;
        }
        if (!districts.length) {
          this.validationMessage = "Please select a district.";
          this.batchValid = false;
          return;
        }
      } else if (this.tabContent[id].details["who"] == "Program") {
        programs = this.tabContent[id].programs.map(this.getBatchData);
        programs.pop();
        if (!programs.length) {
          this.validationMessage = "Please select a program.";
          this.batchValid = false;
          return;
        }
      }
      this.batchValid = true;
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
      } else if (this.tabContent[id].details["what"] == "DISTRUN_YE") {
        this.runDISTRUN_YE(id);
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
        this.$refs["popover" + id].$emit("close");
      }
      if (type == "error") {
        this.isBatchShowing = false;
        this.isErrorShowing = true;
        this.adminSelectedErrorId = id.toString();
      }
      var element = this.$refs["top"];
      var top = element.offsetTop;
      window.scrollTo(0, top);
    },
  },
};
</script>
<style scoped>
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
