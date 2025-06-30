<template>
  <div class="batch-processing-view">
    <h1>Batch Processing</h1>
    <div>
      <v-tabs
        v-model="batchProcessingStore.activeTab"
        bg-color="bcGovLightGrey"
      >
        <v-tab
          value="batchRuns"
          @click="
            getJwtToken;
            activeTab = 'batchRuns';
          "
          class="text-none"
          >Batch Runs</v-tab
        >
        <v-tab
          @click="
            getJwtToken;
            clearBatchDetails;
          "
          value="newBatchRequest"
          class="text-none"
          >New Batch Request</v-tab
        >
        <v-tab
          value="scheduledRuns"
          @click="
            getJwtToken;
            activeTab = 'scheduledRuns';
          "
          class="text-none"
          >User Scheduled ({{ queueScheduledJobs.length }} Queued)</v-tab
        >
        <v-tab
          @click="
            getJwtToken;
            activeTab = 'batchRoutines';
          "
          class="text-none"
          value="batchRoutines"
          >Scheduled Routines</v-tab
        >
        <v-spacer />

        <v-btn
          @click.stop="updateDashboards"
          class="text-none"
          style="margin: 6px"
          color="primary"
          variant="flat"
          append-icon="mdi-refresh"
        >
          Update
        </v-btn>
      </v-tabs>

      <v-tabs-window v-model="getActiveTab">
        <v-tabs-window-item value="batchRuns">
          <BatchRuns></BatchRuns>
        </v-tabs-window-item>
        <v-tabs-window-item value="scheduledRuns">
          <v-row v-if="scheduledJobs && scheduledJobs.length == 0">
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
              <label>GRAD and TVR</label>
              <v-data-table
                :items="batchRunGradOptions"
                :headers="batchFields"
                items-per-page="-1"
                :disable-pagination="true"
                hide-default-header
                hide-default-footer
                :sortBy="[{ key: 'displayOrder', order: 'asc' }]"
                class="pb-3"
                :loading="!batchRunGradOptions"
              >
                <template v-slot:item.description="{ item }">
                  {{ item.label }}
                  <v-tooltip max-width="500">
                    {{ item.description }}
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" color="bcGovBlue" x-small size="18"
                        >mdi-information</v-icon
                      >
                    </template>
                  </v-tooltip>
                </template>
                <template v-slot:item.newRequest="{ item }">
                  <GraduationAlgorithmForm
                    v-if="item.code == 'REGALG'"
                  ></GraduationAlgorithmForm
                  ><TranscriptAlgorithmForm
                    v-else-if="item.code == 'TVRRUN'"
                  ></TranscriptAlgorithmForm>
                  <DistrunForm v-else-if="item.code == 'DISTRUN'"></DistrunForm>
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
                <template v-slot:item.description="{ item }">
                  {{ item.description }}
                </template>
              </v-data-table>
              <v-table>
                <tbody>
                  <tr>
                    <td>Blank certificate print</td>
                    <td>
                      <DistrunUserForm
                        credentialSelected="Blank certificate print"
                      ></DistrunUserForm>
                    </td>
                  </tr>
                  <tr>
                    <td>Reprint certificate – no principal signature block</td>
                    <td>
                      <DistrunUserForm
                        credentialSelected="RC"
                      ></DistrunUserForm>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Original certificate – with principal signature block
                    </td>
                    <td>
                      <DistrunUserForm
                        credentialSelected="OC"
                      ></DistrunUserForm>
                    </td>
                  </tr>
                  <tr>
                    <td>Blank transcript print</td>
                    <td>
                      <DistrunUserForm
                        credentialSelected="Blank transcript print"
                      ></DistrunUserForm>
                    </td>
                  </tr>
                  <tr>
                    <td>Transcript</td>
                    <td>
                      <DistrunUserForm
                        credentialSelected="OT"
                      ></DistrunUserForm>
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
                  {{ item.label }}
                  <v-tooltip max-width="500">
                    {{ item.description }}
                    <template v-slot:activator="{ props }">
                      
                      <v-icon v-bind="props" color="bcGovBlue" small size="18"
                        >mdi-information-outline</v-icon
                      >
                    </template>
                  </v-tooltip>
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
              <label>Year-End Administration</label>
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
                  <v-tooltip max-width="500">
                    {{ item.description }}
                    <template v-slot:activator="{ props }">
                      {{ item.label }}
                      <v-icon v-bind="props" color="bcGovBlue" x-small size="18"
                        >mdi-information</v-icon
                      >
                    </template>
                  </v-tooltip>
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
import DistrunUserForm from "@/components/Batch/Forms/DistrunUserForm.vue";
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
import { useSnackbarStore } from "@/store/modules/snackbar";
import sharedMethods from "../sharedMethods";

import { useAccessStore } from "../store/modules/access";
import { useAppStore } from "../store/modules/app";
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
      batchProcessingStore,
    };
  },
  async beforeMount() {
    try {
      await this.getSchools(false);
      await this.getDistricts(false);
      await this.getProgramOptionCodes(false);
      await this.getBatchJobTypeCodes(false);
      await this.getTranscriptTypeCodes(false);
      await this.getCertificateTypeCodes(false);
    } catch (e) {
      if (e.response.status) {
        this.snackbarStore.showSnackbar(
          "There was an error: " + e.response.status,
          "error",
          5000
        );
      }
    }
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
    DistrunUserForm: DistrunUserForm,
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
      snackbarStore: useSnackbarStore(),
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
      userBatchDistRuleDesc: `If Current Students selected and the User has requested Transcripts,  all students with a status of CUR will be selected by school at graduation. \n
                              If Current Students selected and the User has requested Original Certificate or Reprint Certificate, all students, except 'DEC','MER',  with a certificate with a null distribution date will be selected by school at graduation. \n
                              If Date Range selected, and the User has requested Transcript print, all students, except 'DEC', 'MER', who have completed their program within the date range will be selected by school at graduation. \n
                              If Date Range selected, and the User has requested Original Certificate or Reprint Certificate, all students, except 'DEC','MER', who have completed their program within the date range will be selected by school of graduation.`,
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
          "DISTRUN",
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
    ...mapActions(useAppStore, [
      "getSchools",
      "getDistricts",
      "getProgramOptionCodes",
      "getStudentStatusOptionCodes",
      "getBatchJobTypeCodes",
      "getTranscriptTypeCodes",
      "getCertificateTypeCodes",
    ]),

    downloadDISTRUNUSER(bid, transmissionMode = null) {
      DistributionService.downloadDISTRUNUSER(bid, transmissionMode).then(
        (response) => {
          sharedMethods.base64ToFileTypeAndDownload(
            response.data,
            "application/zip",
            bid
          );
          this.snackbarStore.showSnackbar(
            "Download completed",
            "success",
            5000
          );
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
    updateAllDashboards() {
      this.updateDashboards();
    },
  },
};
</script>
<style scoped>
.batch-processing-view {
  padding-left: 25px;
  padding-right: 25px;
}
h6 {
  font-size: 1.5rem;
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
