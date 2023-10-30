<template>
  <div class="batch-processing-view">
    <h1>Batch Processing</h1>

    <b-btn
      class="position-absolute"
      style="z-index: 10; right: 0; margin-top: 10px; margin-right: 30px"
      variant="info"
      small
      @click="updateDashboard"
      ><i class="fas fa-sync-alt" aria-hidden="true"></i> Update</b-btn
    >
    <b-overlay :show="isLoading">
      <b-card>
        <b-tabs>
          <b-tab
            :title="'Batch Runs (' + batchRuns.length + ')'"
            :active="activeTab === 0"
          >
            <b-card-text class="p-2">
              <BatchRuns></BatchRuns>
            </b-card-text>
          </b-tab>
          <b-tab
            :title="'Scheduled (' + numberOfQueuedScheduledRuns + ')'"
            :active="activeTab === 1"
          >
            <b-card-text class="row">
              <ScheduledBatchRuns></ScheduledBatchRuns>
            </b-card-text>
          </b-tab>
          <b-tab
            :title="'Routines (' + batchRoutines.length + ')'"
            :active="activeTab === 2"
          >
            <b-card-text class="p-2">
              <BatchRoutines></BatchRoutines>
            </b-card-text>
          </b-tab>

          <b-tab title="New Batch Request">
            <b-card-text class="py-2 m-0">
              <div>
                <b-card-group deck>
                  <b-card header="GRAD Updates" header-tag="header">
                    <b-card-text>
                      <b-table
                        striped
                        hover
                        :items="batchRunGradOptions"
                        :fields="batchFields"
                        :show-header="false"
                      >
                        <template #cell(description)="row">
                          <strong>{{ row.item.label }}</strong>
                          <hr />

                          {{ row.item.description }}
                        </template>
                        <template #cell(newrequest)="row">
                          <b-btn
                            :disabled="row.item.disabled"
                            @click="
                              newBatchRequest(
                                row.item.code,
                                row.item.label,
                                row.item.description
                              )
                            "
                            >+</b-btn
                          ></template
                        >
                      </b-table>
                    </b-card-text>
                  </b-card>
                  <b-card
                    header="Distribution Runs"
                    header-tag="header"
                    footer-tag="footer"
                  >
                    <b-card-text>
                      <div>
                        <b-table
                          striped
                          hover
                          :items="distributionBatchRunOptions"
                          :fields="batchFields"
                          :show-header="false"
                        >
                          <template #cell(description)="row">
                            <strong>{{ row.item.label }}</strong>
                            <hr />
                            {{ row.item.description }}
                          </template>
                          <template #cell(newrequest)="row">
                            <b-btn
                              :disabled="!row.item.disabled"
                              @click="
                                newBatchRequest(
                                  row.item.code,
                                  row.item.label,
                                  row.item.description
                                )
                              "
                              >+</b-btn
                            ></template
                          >
                        </b-table>
                      </div>
                    </b-card-text>
                  </b-card>
                  <b-card header="PSI" header-tag="header">
                    <b-card-text>
                      <div>
                        <b-table
                          striped
                          hover
                          :items="PSIBatchRunOptions"
                          :fields="batchFields"
                          :show-header="false"
                        >
                          <template #cell(description)="row">
                            <strong>{{ row.item.label }}</strong>
                            <hr />

                            {{ row.item.description }}
                          </template>
                          <template #cell(newrequest)="row">
                            <b-btn
                              :disabled="row.item.disabled"
                              @click="
                                newBatchRequest(
                                  row.item.code,
                                  row.item.label,
                                  row.item.description
                                )
                              "
                              >+</b-btn
                            ></template
                          >
                        </b-table>
                      </div>
                    </b-card-text>
                  </b-card>
                </b-card-group>
              </div>
            </b-card-text>
          </b-tab>
          <b-tab title="Administration">
            <b-card-text class="py-2 m-0">
              <div>
                <b-card-group deck>
                  <b-card header="Year End" header-tag="header">
                    <b-card-text>
                      <b-table
                        striped
                        hover
                        :items="adminBatchRunOptions"
                        :fields="batchFields"
                        :show-header="false"
                      >
                        <template #cell(description)="row">
                          <strong>{{ row.item.label }}</strong>
                          <hr />

                          {{ row.item.description }}
                        </template>
                        <template #cell(newrequest)="row">
                          <b-btn
                            :disabled="!row.item.disabled"
                            @click="
                              newBatchRequest(
                                row.item.code,
                                row.item.label,
                                row.item.description
                              )
                            "
                            >+</b-btn
                          ></template
                        >
                      </b-table>
                    </b-card-text>
                  </b-card>
                  <b-card
                    header="Utilities"
                    header-tag="header"
                    footer-tag="footer"
                  >
                    <b-card-text>
                      <div>
                        <b-table
                          striped
                          hover
                          :items="utilitiesBatchRunOptions"
                          :fields="batchFields"
                          :show-header="false"
                        >
                          <template #cell(description)="row">
                            <strong>{{ row.item.label }}</strong>
                            <hr />

                            {{ row.item.description }}
                          </template>
                          <template #cell(newrequest)="row">
                            <b-btn
                              :disabled="!row.item.disabled"
                              @click="
                                newBatchRequest(
                                  row.item.code,
                                  row.item.label,
                                  row.item.description
                                )
                              "
                              >+</b-btn
                            ></template
                          >
                        </b-table>
                      </div>
                    </b-card-text>
                  </b-card>
                </b-card-group>
              </div>
            </b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-overlay>
    <div>
      <!-- Modal Dialogs -->

      <b-modal ref="newBatchRequestModal" size="xl" :title="runTypeLabel">
        <div class="pt-1 d-block">
          <b-alert show>{{ runTypeDescription }}</b-alert>
          <div v-if="runType == 'DISTRUN_SUPP'">
            <DistrunFormYearEndSupplementalForm></DistrunFormYearEndSupplementalForm>
          </div>
          <div v-if="runType == 'DISTRUNUSER'">
            <DistrunForm></DistrunForm>
          </div>
          <div v-if="runType == 'DISTRUN_YE'">
            <DistrunFormYearEndForm></DistrunFormYearEndForm>
          </div>
          <div v-if="runType == 'REGALG'">
            <GRADForm></GRADForm>
          </div>
          <div v-if="runType == 'TVRRUN'">
            <GRADForm></GRADForm>
          </div>
          <div v-if="runType == 'PSIRUN'">
            <PSIRunForm></PSIRunForm>
          </div>
        </div>
        <div class="d-block">
          <div v-if="runType == 'DISTRUNUSER'"></div>
          <div class="runSchedule">
            <b-form-group
              class="font-weight-bold mt-3"
              label="Batch Run"
              v-slot="{ ariaDescribedby }"
            >
              <b-form-radio-group v-model="batchRunTime">
                <b-form-radio
                  :aria-describedby="ariaDescribedby"
                  name="batch-runtime-options"
                  value="Run Now"
                  >Run Now</b-form-radio
                >
                <b-form-radio
                  :aria-describedby="ariaDescribedby"
                  name="batch-runtime-options"
                  value="Run Later"
                  >Run Later</b-form-radio
                >
              </b-form-radio-group>

              <b-form-group
                v-if="batchRunTime == 'Run Later'"
                label="Schedule"
                v-slot="{ ariaDescribedby }"
              >
                <b-form-radio
                  v-model="batchRunSchedule"
                  :aria-describedby="ariaDescribedby"
                  name="schedule-options"
                  value="N"
                  >Tonight at 6:30PM</b-form-radio
                >
                <b-form-radio
                  v-model="batchRunSchedule"
                  :aria-describedby="ariaDescribedby"
                  name="schedule-options"
                  value="W"
                  >Weekend Batch - Saturday 12:00PM</b-form-radio
                >
                <b-form-radio
                  v-model="batchRunSchedule"
                  :aria-describedby="ariaDescribedby"
                  name="schedule-options"
                  value="M"
                  >Tomorrow at 6:30AM</b-form-radio
                >
                <b-form-radio
                  v-model="batchRunSchedule"
                  :aria-describedby="ariaDescribedby"
                  name="schedule-options"
                  value="Custom"
                  >Custom</b-form-radio
                >
                <div class="pl-4" v-if="batchRunSchedule == 'Custom'">
                  <b-form-datepicker
                    id="batch-datepicker"
                    v-model="batchRunCustomDate"
                    class="mb-2"
                  ></b-form-datepicker>
                  <b-form-timepicker
                    id="timepicker-buttons"
                    v-model="batchRunCustomTime"
                    now-button
                    reset-button
                    locale="en"
                  ></b-form-timepicker>
                </div>
              </b-form-group>
            </b-form-group>
          </div>
        </div>
        <template #modal-footer="{ ok, cancel, hide }">
          <b-button
            v-if="batchRunTime == 'Run Now'"
            size="sm"
            variant="success"
            :disabled="v$.$invalid || groupData.length == 0"
            @click="runBatchRequest()"
            >Run Now</b-button
          >
          <b-button
            v-if="batchRunTime == 'Run Later'"
            size="sm"
            variant="success"
            :disabled="
              v$.$invalid || batchRunSchedule == '' || groupData.length == 0
            "
            @click="runBatchRequest()"
            >Schedule</b-button
          >
          <b-button size="sm" variant="danger" @click="hideBatchRequestModal()">
            Cancel
          </b-button>
        </template>
      </b-modal>
    </div>
  </div>
</template>
<script>
import BatchProcessingService from "@/services/BatchProcessingService.js";
import DistrunForm from "@/components/Batch/Forms/DistrunForm.vue";
import DistrunFormYearEndForm from "@/components/Batch/Forms/DistrunFormYearEndForm.vue";
import DistrunFormYearEndSupplementalForm from "@/components/Batch/Forms/DistrunFormYearEndForm.vue";
import BatchRuns from "@/components/Batch/BatchRuns.vue";
import GRADForm from "@/components/Batch/Forms/GRADForm.vue";
import PSIRunForm from "@/components/Batch/Forms/PSIRunForm.vue";
import ScheduledBatchRuns from "@/components/Batch/ScheduledBatchRuns.vue";
import BatchRoutines from "@/components/Batch/BatchRoutines.vue";
import { useVuelidate } from "@vuelidate/core";
import { isProxy, toRaw } from "vue";
import { useBatchProcessingStore } from "../store/modules/batchprocessing";
import { useAppStore } from "../store/modules/app";
import { mapState, mapActions } from "pinia";

export default {
  components: {
    DistrunForm: DistrunForm,
    PSIRunForm: PSIRunForm,
    GRADForm: GRADForm,
    DistrunFormYearEndForm: DistrunFormYearEndForm,
    DistrunFormYearEndSupplementalForm: DistrunFormYearEndSupplementalForm,

    BatchRoutines: BatchRoutines,
    BatchRuns: BatchRuns,
    ScheduledBatchRuns: ScheduledBatchRuns,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      isLoading: false,
      activeTab: 3,
      batchTypes: [],
      runType: "",
      runTypeLabel: "",
      runTypeDescription: "",
      cronTime: "",
      batchRunCustomDate: "",
      batchRunCustomTime: "",
      batchRunSchedule: "",
      batchRunTime: "Run Now",
      schools: [],
      batchRunData: [],
      batchFields: [
        {
          key: "description",
          label: "",
          sortable: true,
        },
        {
          key: "newrequest",
          label: "",
          sortable: true,
        },
      ],
      batchRunGradOptions: [],
      PSIBatchRunOptions: [],
      batchRunArchiveDatabaseTypes: [
        {
          createUser: "API_GRAD_BATCH",
          createDate: "2022-08-05T21:23:56.000+00:00",
          updateUser: "API_GRAD_BATCH",
          updateDate: "2022-08-05T21:23:56.000+00:00",
          code: "PSIRUN",
          label: "PSI Run FTP / Paper",
          description:
            "The batch PSI student transcript process  supports the printing of student transcript reports to PSIs via paper printed through BC Mail or through a secure FTP process which supplies data files to the PSI.",
          displayOrder: 40,
          effectiveDate: "2021-09-27T07:00:00.000+00:00",
          expiryDate: null,
        },
      ],
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
  computed: {
    ...mapState(useBatchProcessingStore, {
      batchRuns: "getBatchRuns",
      batchRoutines: "getBatchRoutines",
      scheduledRuns: "getScheduledBatchRuns",
      groupData: "getGroupData",
      getGroup: "getGroup",
      getBatchRequest: "getBatchRequest",
      getCredential: "getCredential",
    }),
    ...mapState(useAppStore, {
      getBatchJobTypes: "getBatchTypeCodes",
    }),

    numberOfQueuedScheduledRuns() {
      // Assuming `scheduledRuns` is an array of objects with a "status" property
      const queuedStatus = "QUEUED"; // Change this to "COMPLETED" if needed
      return this.scheduledRuns.filter((item) => item.status === queuedStatus)
        .length;
    },
  },
  created() {
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

        this.$bvToast.toast("ERROR " + error.response.statusText, {
          title: "ERROR " + error.response.status,
          variant: "danger",
          noAutoHide: true,
        });
      });
  },
  methods: {
    ...mapActions(useBatchProcessingStore, [
      "clearBatchGroupData",
      "updateDashboards",
      "updateScheduledBatchJobs",
      "setGroup",
    ]),
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
    changeTab(newTab) {
      // Handle tab changes here
      this.activeTab = newTab;
      console.log("Tab changed to index:", this.activeTab);
      // You can perform actions or set data based on the selected tab
    },
    async openTab(tab) {
      this.activeTab = tab; // Set activeTab to 2 to open Tab 3
    },
    async validateForm() {
      const result = await this.v$.$validate();
    },
    async getBatchJobs() {},
    async addScheduledJob(request) {
      BatchProcessingService.addScheduledJob(request)
        .then(() => {
          //update the admin dashboard
          this.updateScheduledBatchJobs();
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
    getCronTime() {
      console.log(this.batchRunSchedule);
      if (this.batchRunSchedule == "N") {
        let today = new Date();
        return (
          "0 30 18 " + today.getDate() + " " + (today.getMonth() + 1) + " *"
        );
      } else if (this.batchRunSchedule == "W") {
        const today = new Date();
        const first = today.getDate() - today.getDay() + 1;
        const sixth = first + 5;
        const saturday = new Date(today.setDate(sixth));
        return (
          "0 30 18 " +
          saturday.getDate() +
          " " +
          (saturday.getMonth() + 1) +
          " *"
        );
      } else if (this.batchRunSchedule == "M") {
        const today = new Date();
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return (
          "0 30 18 " +
          tomorrow.getDate() +
          " " +
          (tomorrow.getMonth() + 1) +
          " *"
        );
      } else if (this.batchRunSchedule == "Custom") {
        let dateTime = new Date(
          this.batchRunCustomDate + "T" + this.batchRunCustomTime
        );
        return (
          dateTime.getSeconds() +
          " " +
          dateTime.getMinutes() +
          " " +
          dateTime.getHours() +
          " " +
          dateTime.getDate() +
          " " +
          (dateTime.getMonth() + 1) +
          " *"
        );
      } else {
        return null;
      }
    },
    async runBatchRequest() {
      const result = await this.v$.$validate();

      if (!result) {
        console.log("INVALID");
        return;
      }

      if (this.runType == "DISTRUNUSER") {
        console.log("DISTRUN_USER");
        console.log(this.getBatchRequest);
        if (this.batchRunTime == "Run Later") {
          await BatchProcessingService.runDISTRUNUSER(
            this.getBatchRequest,
            this.getCredential,
            this.getCronTime(this.cronTime)
          );
          this.openTab(1);
        } else {
          await BatchProcessingService.runDISTRUNUSER(
            this.getBatchRequest,
            this.getCredential
          );
          this.openTab(0);
        }
        this.hideBatchRequestModal();
        await this.updateDashboard();

        console.log(toRaw(this.getBatchRequest));
        this.hideBatchRequestModal();
      } else if (this.runType == "DISTRUN_YE") {
        console.log("DISTRUN_YE");
        console.log(this.getBatchRequest);
        if (this.batchRunTime == "Run Later") {
          await BatchProcessingService.runDISTRUN_YE(
            this.getBatchRequest,
            this.getCronTime(this.cronTime)
          );
          this.openTab(1);
        } else {
          await BatchProcessingService.runDISTRUN_YE(this.getBatchRequest);
          this.openTab(0);
        }
        this.hideBatchRequestModal();
        await this.updateDashboard();
      } else if (this.runType == "REGALG") {
        console.log("REQUEST");
        console.log(this.getBatchRequest);
        if (this.batchRunTime == "Run Later") {
          await BatchProcessingService.runREGALG(
            toRaw(this.getBatchRequest),
            this.getCronTime(this.cronTime)
          );
          this.openTab(1);
        } else {
          await BatchProcessingService.runREGALG(toRaw(this.getBatchRequest));
          this.openTab(0);
        }
        this.hideBatchRequestModal();
        await this.updateDashboard();
      } else if (this.runType == "TVRRUN") {
        if (this.batchRunTime == "Run Later") {
          await BatchProcessingService.runTVRRUN(
            this.getBatchRequest,
            this.getCronTime(this.cronTime)
          );
          this.openTab(1);
        } else {
          await BatchProcessingService.runTVRRUN(this.getBatchRequest);
          this.openTab(0);
        }
        this.updateDashboard();
        this.hideBatchRequestModal();
      }
    },
    newBatchRequest(runType, label, description) {
      this.runType = runType;
      this.runTypeLabel = label;
      this.runTypeDescription = description;
      if (
        this.runType == "DISTRUN_YE" ||
        this.runType == "NONGRADRUN" ||
        this.runType == "DISTRUN_SUPP"
      ) {
        this.setGroup("District");
      }
      this.showBatchRequestModal();
    },
    showBatchRequestModal() {
      this.$refs["newBatchRequestModal"].show();
    },
    hideBatchRequestModal() {
      this.$refs["newBatchRequestModal"].hide();
      this.clearBatchRequest();
    },
    clearBatchRequest() {
      this.runType = "";
      this.runTypeLabel = "";
      this.runTypeDescription = "";
      this.cronTime = "";
      this.batchRunTime = "Run Now";
      this.batchRunSchedule = "";
      this.batchRunCustomDate = "";
      this.batchRunCustomTime = "";
      this.clearBatchGroupData();
    },
    async updateDashboard() {
      this.isLoading = true;
      await this.updateDashboards();
      this.isLoading = false;
    },
  },
  compatConfig: { MODE: 2 },
};
</script>
