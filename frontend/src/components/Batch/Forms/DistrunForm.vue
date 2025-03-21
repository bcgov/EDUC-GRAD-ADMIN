<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="
            hasPermissions(
              'BATCH',
              'runCredentialsandTranscriptDistributionRun'
            )
          "
          color="primary"
          v-bind="props"
          class="mr-2"
          @click="setCredentialForForm()"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title
            >Credentials and Transcript Distribution Run</v-card-title
          >
          <v-btn
            @click="closeDialogAndResetForm()"
            color="error"
            variant="outlined"
            class="m-4"
            :loading="batchLoading"
            >Cancel</v-btn
          >
        </div>
        <v-card-text>
          <ScheduleInput hideGroup>
            <template #batchDetails>
              <v-data-table
                :items="[
                  {
                    label: 'Run Type',
                    value: 'Credentials and Transcript Distribution Run',
                  },
                  {
                    label: 'Where',
                    value: getDistribution,
                  },
                ]"
                hide-default-header
                hide-default-footer
              >
              </v-data-table>
            </template>
          </ScheduleInput>

          <div class="row mx-6 mb-6 justify-end">
            <v-btn
              color="error"
              variant="flat"
              class="text-none"
              density="default"
              @click="submit"
              :loading="batchLoading"
              :disabled="v$.$invalid || batchLoading"
              >Submit</v-btn
            >
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { ref, watch } from "vue";
import SchoolInput from "@/components/Batch/Forms/FormInputs/SchoolInput.vue";
import DistrictInput from "@/components/Batch/Forms/FormInputs/DistrictInput.vue";
import StudentInput from "@/components/Batch/Forms/FormInputs/StudentInput.vue";
import ProgramInput from "@/components/Batch/Forms/FormInputs/ProgramInput.vue";
import ScheduleInput from "@/components/Batch/Forms/FormInputs/ScheduleInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import GraduationReportService from "@/services/GraduationReportService.js";
import DistributionInput from "@/components/Batch/Forms/FormInputs/DistributionInput.vue";

import { mapActions, mapState } from "pinia";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import { useAccessStore } from "../../../store/modules/access";
import { useSnackbarStore } from "../../../store/modules/snackbar";
import { useBatchProcessingStore } from "../../../store/modules/batchprocessing";
import { useBatchRequestFormStore } from "../../../store/modules/batchRequestFormStore";
import { generateRequestPayload } from "@/utils/common.js";
export default {
  components: {
    SchoolInput: SchoolInput,
    DistrictInput: DistrictInput,
    StudentInput: StudentInput,
    ProgramInput: ProgramInput,
    ScheduleInput: ScheduleInput,
    DistributionInput: DistributionInput,
  },

  setup() {
    const batchProcessingStore = useBatchProcessingStore();
    const batchRequestFormStore = useBatchRequestFormStore();
    const notifications = ref(null);
    const activeTab = ref(batchProcessingStore.activeTab);
    watch(activeTab, (newValue) => {
      batchProcessingStore.activeTab = newValue;
    });
    const changeTab = (tabName) => {
      activeTab.value = tabName;
    };

    const group = ref(batchRequestFormStore.who);

    const blankCertificateDetails = ref(
      batchRequestFormStore.blankCertificateDetails
    );

    const blankTranscriptDetails = ref(
      batchRequestFormStore.blankTranscriptDetails
    );

    watch(blankCertificateDetails, (newValue) => {
      batchRequestFormStore.blankCertificateDetails = newValue;
    });

    watch(blankTranscriptDetails, (newValue) => {
      batchRequestFormStore.blankTranscriptDetails = newValue;
    });

    watch(group, (newValue) => {
      batchRequestFormStore.who = newValue;
    });

    return {
      activeTab,
      blankCertificateDetails,
      blankTranscriptDetails,
      group,
      notifications,
      changeTab,
      v$: useVuelidate(),
    };
  },
  props: ["credentialSelected"],
  created() {
    this.transcriptTypes = this.getTranscriptTypes();
    this.certificateTypes = this.getCertificateTypes();
  },
  validations() {
    return {
      getBatchRequest: {
        batchRunTimeSet: helpers.withMessage("Runtime not set", (value) => {
          if (this.getBatchRunTime) {
            if (this.getBatchRunTime == "Run Now") {
              return true;
            } else if (this.getBatchRunTime == "Run Later") {
              if (this.getBatchRequestCrontime) {
                return true;
              } else return false;
            }
          } else return false;
        }),
      },
    };
  },
  data: () => ({
    snackbarStore: useSnackbarStore(),
    step: 0,
    batchLoading: false,
    dialog: false,
    groupSelected: "",
    transcriptTypes: [],
    certificateTypes: [],
    options: [
      { title: "Blank certificate print", value: "Blank certificate print" },
      {
        title: "Reprint certificate – no principal signature block",
        value: "RC",
      },
      {
        title:
          "Original certificate (includes transcript) – with principal signature block",
        value: "OC",
      },
      { title: "Blank transcript print", value: "Blank transcript print" },
      { title: "Transcript", value: "OT" },
    ],
  }),
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useBatchRequestFormStore, [
      "getBatchRequest",
      "getBatchRunTime",
      "getBatchRequestCrontime",
      "getBlankCertificateDetails",
      "getBlankTranscriptDetails",
      "getCredential",
      "getDistribution",
      "getCopies",
    ]),
    groupItems() {
      if (this.getCredential === "Blank certificate print") {
        if (
          this.blankCertificateDetails.length === 1 &&
          this.blankCertificateDetails[0] === "A"
        ) {
          return ["School", "Ministry of Advanced Education"];
        } else {
          this.group = "School";
          return ["School"];
        }
      } else if (this.getCredential === "Blank transcript print") {
        let groupOptions = [
          { title: "Student", value: "Student" },
          { title: "School", value: "School" },
        ];
        return groupOptions;
      } else {
        let groupOptions = [
          { title: "Student", value: "Student" },
          { title: "School", value: "School" },
        ];
        if (this.hasPermissions("BATCH", "selectSchoolCategoryGroup"))
          groupOptions.push({
            title: "School Category",
            value: "School Category",
          });
        if (this.hasPermissions("BATCH", "selectProgramGroup"))
          groupOptions.push({ title: "Program", value: "Program" });
        return groupOptions;
      }
    },
  },
  methods: {
    setCredentialForForm() {
      this.setCredential(this.credentialSelected);
    },
    ...mapActions(useBatchRequestFormStore, [
      "clearBatchDetails",
      "clearBatchGroupData",
      "setBatchRunType",
      "setCredential",
    ]),
    ...mapActions(useBatchProcessingStore, [
      "setActiveTab",
      "updateDashboards",
    ]),
    getTranscriptTypes() {
      GraduationReportService.getTranscriptTypes()
        .then((response) => {
          this.transcriptTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          if (error.response.statusText) {
            this.snackbarStore.showSnackbar(
              "ERROR " + error.response.statusText,
              10000
            );
          } else {
            this.snackbarStore.showSnackbar(
              "ERROR " + "error with webservervice",
              10000
            );
          }
        });
    },
    getCertificateTypes() {
      GraduationReportService.getCertificateTypes()
        .then((response) => {
          this.certificateTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          if (error.response.statusText) {
            this.snackbarStore.showSnackbar(
              "ERROR " + error.response.statusText,
              10000
            );
          } else {
            this.snackbarStore.showSnackbar(
              "ERROR " + "error with webservervice",
              10000
            );
          }
        });
    },
    closeDialogAndResetForm() {
      this.group = null;
      this.dialog = false;
      this.clearBatchDetails();
      this.step = 0;
    },
    cancel() {
      this.closeDialogAndResetForm();
    },
    changeStep(step) {
      this.step = step;
    },
    async submit() {
      this.batchLoading = true;
      try {
        const requestTemplate = [
          "pens",
          "schoolIds",
          "districtIds",
          "credentialTypeCode",
          "schoolCategoryCodes",
          "programs",
          "psiCodes",
          "reportTypes",
          "gradDateFrom",
          "gradDateTo",
          "validateInput",
          "quantity",
          "localDownload",
        ];
        const requestPayload = generateRequestPayload(
          this.getBatchRequest,
          requestTemplate
        );

        let response = await BatchProcessingService.runDISTRUN_MONTHLY(
          requestPayload,
          this.getBatchRequestCrontime
        );
        this.batchLoading = false;
        if (response) {
          if (this.getBatchRequestCrontime) {
            this.snackbarStore.showSnackbar(
              "Credentials and Transcript Distribution Run request has been successfully scheduled",
              10000
            );
          } else {
            this.snackbarStore.showSnackbar(
              "Batch " +
                response.data.batchId +
                "- Credentials and Transcript Distribution Run request submitted",
              "success",
              10000
            );
          }
        }
        this.setActiveTab("batchRuns");
        this.closeDialogAndResetForm();
        //add a wait before updating dashboard
        setTimeout(() => {
          this.updateDashboards();
        }, 2000);
      } catch (error) {
        // handle the error and show the notification
        console.error("Error:", error);
        this.snackbarStore.showSnackbar(
          "An error occurred: " + error.message,
          "error",
          10000
        );
      }
    },
  },
};
</script>
<style scoped></style>
