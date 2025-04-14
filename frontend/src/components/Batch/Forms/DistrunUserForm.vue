<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="hasPermissions('BATCH', 'runDistrun')"
          color="primary"
          v-bind="props"
          @click="setCredentialForForm()"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title
            >User Request Distribution Run - {{ getCredential }}</v-card-title
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
          <v-stepper v-model="step">
            <template v-slot:default="{ prev, next }">
              <v-stepper-header>
                <v-stepper-item
                  v-show="
                    getCredential == 'Blank certificate print' ||
                    getCredential == 'Blank transcript print'
                  "
                  :rules="[
                    () => !v$.getBatchRequest.credentialTypeSelected.$invalid,
                  ]"
                  complete
                  editable
                  title="Credential Type"
                  value="0"
                ></v-stepper-item>

                <v-divider></v-divider>
                <v-stepper-item
                  :rules="[
                    () => !v$.getBatchRequest.hasAtLeastOneGroupValue.$invalid,
                  ]"
                  complete
                  editable
                  title="Group"
                  value="1"
                ></v-stepper-item>
                <v-stepper-item
                  :rules="[() => !v$.getBatchRequest.distribution.$invalid]"
                  complete
                  editable
                  title="Distribution"
                  value="2"
                ></v-stepper-item>
                <v-stepper-item
                  :rules="[() => !v$.getBatchRequest.batchRunTimeSet.$invalid]"
                  complete
                  editable
                  title="Run/Schedule"
                  value="3"
                ></v-stepper-item>
              </v-stepper-header>

              <v-stepper-window>
                <v-stepper-window-item value="0">
                  <div v-if="getCredential === 'Blank transcript print'">
                    Select transcript type
                    <v-row>
                      <v-col
                        v-for="(option, index) in transcriptTypes"
                        :key="index"
                        cols="auto"
                        class="p-0 m-0"
                        :style="{ minWidth: '500px' }"
                      >
                        <v-checkbox
                          :label="option.description"
                          :value="option.code"
                          v-model="blankTranscriptDetails"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </div>

                  <div v-if="getCredential === 'Blank certificate print'">
                    Select certificate type
                    <v-row>
                      <v-col
                        v-for="(option, index) in certificateTypes"
                        :key="index"
                        cols="auto"
                        class="p-0 m-0"
                        :style="{ minWidth: '450px' }"
                      >
                        <v-checkbox
                          :label="option.label"
                          :value="option.code"
                          v-model="blankCertificateDetails"
                          hide-details
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </div>
                </v-stepper-window-item>
                <v-stepper-window-item value="1">
                  <v-row>
                    <v-col>
                      <v-select
                        class="mt-2"
                        variant="outlined"
                        v-model="group"
                        :items="groupItems"
                        label="Select a group"
                        hide-details
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-row v-if="group == 'Student'">
                    <StudentInput
                      runType="DISTRUNUSER"
                      :credentialType="credentialSelected"
                    ></StudentInput>
                  </v-row>
                  <v-row v-if="group == 'School Category'">
                    <DistrictInput></DistrictInput>
                  </v-row>
                  <v-row v-if="group == 'PSI'">
                    <DistrictInput></DistrictInput>
                  </v-row>
                  <v-row v-if="group == 'Program'">
                    <ProgramInput></ProgramInput>
                  </v-row>
                  <v-row v-if="group == 'School'">
                    <SchoolInput
                      :disableSelectStudents="
                        getCredential == 'Blank certificate print' ||
                        getCredential == 'Blank transcript print'
                      "
                    ></SchoolInput>
                  </v-row>
                </v-stepper-window-item>
                <v-stepper-window-item value="2">
                  <DistributionInput></DistributionInput>
                </v-stepper-window-item>
                <v-stepper-window-item value="3">
                  <ScheduleInput>
                    <template #batchDetails>
                      <v-data-table
                        :items="[
                          {
                            label: 'Run Type',
                            value:
                              'User Request Distribution Run - ' +
                              getCredential,
                          },
                          {
                            label: 'Copies',
                            value: getBatchRequest.quantity,
                          },
                          ...(getCredential == 'Blank certificate print' ||
                          getCredential == 'Blank transcript print'
                            ? [
                                {
                                  label: 'Credential Type',
                                  value:
                                    getBatchRequest.credentialTypeCode.join(
                                      ', '
                                    ),
                                },
                              ]
                            : []),
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
                </v-stepper-window-item>
              </v-stepper-window>
            </template>
            <template v-slot:actions>
              <div class="row mx-6 mb-6">
                <!-- Left Action Button -->
                <v-btn
                  @click="step--"
                  color="bcGovBlue"
                  :disabled="
                    step == 0 ||
                    (step == 1 &&
                      getCredential !== 'Blank certificate print' &&
                      getCredential !== 'Blank transcript print')"
                  variant="outlined">
                  Back
                </v-btn>
                <v-spacer />
                <!-- Right Action Button -->
                <v-btn
                  v-if="step < 3" 
                  @click="step++" 
                  :disabled="step!==0 && v$.getBatchRequest.hasAtLeastOneGroupValue.$invalid" 
                  color="bcGovBlue">
                  Next
                </v-btn>
                <v-btn
                  v-else-if="getBatchRequest.localDownload == 'Y'"
                  color="error"
                  variant="flat"
                  class="text-none"
                  density="default"
                  :loading="batchLoading"
                  :disabled="v$.$invalid || batchLoading"
                  @click="submit">
                  Download
                </v-btn>
                <v-btn
                  v-else
                  color="error"
                  variant="flat"
                  class="text-none"
                  density="default"
                  @click="submit"
                  :loading="batchLoading"
                  :disabled="v$.$invalid || batchLoading">
                  Submit
                </v-btn>
              </div>
            </template>
          </v-stepper>
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
import { useAppStore } from "../../../store/modules/app";
import { useAccessStore } from "../../../store/modules/access";
import { useAuthStore } from "../../../store/modules/auth";
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
      if (newValue == "Ministry of Advanced Education") {
        batchRequestFormStore.distribution = "User";
        batchRequestFormStore.schools = [];
      }
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
        distribution: helpers.withMessage("Select a distribution", (value) => {
          if (this.getDistribution && this.getCopies) {
            return true;
          } else return false;
        }),
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
        credentialTypeSelected: helpers.withMessage(
          "Credential type not selected",
          (value) => {
            if (this.getCredential) {
              if (this.getCredential == "Blank certificate print") {
                if (
                  this.blankCertificateDetails &&
                  this.blankCertificateDetails.length == 0
                ) {
                  return false;
                }
              }
              if (this.getCredential == "Blank transcript print") {
                if (
                  this.blankTranscriptDetails &&
                  this.blankTranscriptDetails.length == 0
                ) {
                  return false;
                }
              }

              return true;
            } else return false;
          }
        ),

        hasAtLeastOneGroupValue: helpers.withMessage(
          "Must contain at least one " + this.group,
          (value) => {
            if (this.getBatchRequest) {
              let isValid = false;
              if (
                this.group &&
                [
                  "Student",
                  "School",
                  "School Category",
                  "Program",
                  "Ministry of Advanced Education",
                ].includes(this.group)
              ) {
                if (this.group === "School") {
                  isValid =
                    this.getBatchRequest.schoolIds &&
                    this.getBatchRequest.schoolIds.length > 0;
                } else if (this.group === "Student") {
                  isValid =
                    this.getBatchRequest.pens &&
                    this.getBatchRequest.pens.length > 0;
                } else if (this.group === "School Category") {
                  isValid =
                    this.getBatchRequest.districtIds &&
                    this.getBatchRequest.districtIds.length > 0;
                } else if (this.group === "Program") {
                  isValid =
                    this.getBatchRequest.programs &&
                    this.getBatchRequest.programs.length > 0;
                } else if (this.group === "Psi") {
                  isValid =
                    this.getBatchRequest.psiCodes &&
                    this.getBatchRequest.psiCodes.length > 0;
                } else {
                  isValid = true; // Return true if none of the above conditions matched
                }
                return isValid;
              }
            } else {
              return false;
            }
          }
        ),
      },
    };
  },
  data: () => ({
    snackbarStore: useSnackbarStore(),
    step: 0,
    dialog: false,
    batchLoading: false,
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
    ...mapState(useAuthStore, ["userFullName"]),
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
      "gwtWhere",
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
        let groupOptions = [{ title: "School", value: "School" }];
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
      if (
        this.getCredential === "Blank certificate print" ||
        this.getCredential === "Blank transcript print"
      ) {
        this.step = 0;
      } else {
        this.step = 1;
      }
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
    ...mapState(useAppStore, ["getTranscriptTypes", "getCertificateTypes"]),
    closeDialogAndResetForm() {
      this.blankCertificateDetails = [];
      this.blankTranscriptDetails = [];
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
          "credentialTypeCode",
          "districtIds",
          "gradDateFrom",
          "gradDateTo",
          "localDownload",
          "pens",
          "programs",
          "psiCodes",
          "quantity",
          "reportTypes",
          "schoolCategoryCodes",
          "schoolIds",
          "validateInput",
        ];
        const requestPayload = generateRequestPayload(
          this.getBatchRequest,
          requestTemplate
        );
        // set payload.user and payload.address for the request
        if (
          (this.group == "Ministry of Advanced Education" &&
            this.getCredential == "Blank certificate print") ||
          this.getDistribution == "User"
        ) {
          requestPayload.user = this.userFullName;
          requestPayload.address = {
            streetLine1: "4TH FLOOR 620 SUPERIOR",
            streetLine2: "PO BOX 9886 STN PROV GOVT",
            city: "VICTORIA",
            region: "BRITISH COLUMBIA",
            country: "CANADA",
            code: "V8W9T6",
          };
        }

        //set schoolIds to "000000" for Ministry of Advanced Education
        if (
          this.group == "Ministry of Advanced Education" &&
          this.getCredential == "Blank certificate print"
        ) {
          requestPayload.schoolIds = ["00000000-0000-0000-0000-000000000000"];
        }
        BatchProcessingService.runDISTRUNUSER(
          requestPayload,
          this.getCredential,
          this.getBatchRequestCrontime
        )
          .then((response) => {
            if (response && this.batchLoading) {
              this.batchLoading = false;
              if (this.getBatchRequestCrontime) {
                this.snackbarStore.showSnackbar(
                  "User distribution batch request has been successfully scheduled",
                  10000
                );
              } else {
                this.snackbarStore.showSnackbar(
                  "Batch " +
                    response.data.batchId +
                    "- User distribution batch request submitted",
                  "success",
                  10000
                );
              }
              this.setActiveTab("batchRuns");
              this.closeDialogAndResetForm();
              //add a wait before updating dashboard
              setTimeout(() => {
                this.updateDashboards();
              }, 2000);
            }
          })
          .catch((error) => {
            // handle any errors here
          });
        setTimeout(() => {
          //Close the request after 5 seconds.
          if (this.batchLoading) {
            this.batchLoading = false;
            this.snackbarStore.showSnackbar(
              "The user distribution batch request is currently running in the background. Click the Update button on the Batch Processing page to view the results once the job is complete.",
              "success",
              10000
            );
            this.setActiveTab("batchRuns");
            this.closeDialogAndResetForm();
            //add a wait before updating dashboard
            setTimeout(() => {
              this.updateDashboards();
            }, 2000);
          }
        }, 10000);
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
