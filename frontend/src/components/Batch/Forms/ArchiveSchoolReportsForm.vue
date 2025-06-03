<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="hasPermissions('BATCH', 'runArchiveSchoolReports')"
          color="primary"
          v-bind="props"
          class="mr-2"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
      </template>
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>Archive School Reports Process</v-card-title>
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
          <v-stepper show-actions v-model="step">
            <template v-slot:default="{ prev, next }">
              <v-stepper-header>
                <v-stepper-item
                  :rules="[
                    () =>
                      !v$.getBatchRequest.hasAtLeastOneGroupValue.$invalid &&
                      !v$.getBatchRequest.reportTypeRequired.$invalid,
                  ]"
                  complete
                  editable
                  title="Group"
                  value="0"
                ></v-stepper-item>

                <v-divider></v-divider>

                <v-stepper-item
                  :rules="[
                    () =>
                      !v$.getBatchRequest.batchRunTimeSet.$invalid &&
                      !v$.selectedConfirmations.allConfirmationsSelected
                        .$invalid,
                  ]"
                  complete
                  editable
                  title="Run/Schedule"
                  value="1"
                ></v-stepper-item>
              </v-stepper-header>

              <v-stepper-window>
                <v-stepper-window-item value="0">
                  <v-row>
                    <v-col sm="2">Report Type </v-col>
                    <v-col sm="10">
                      <v-select
                        v-model="reportType"
                        :items="[
                          {
                            text: 'NONGRADPRJ - Projected Non-Graduates - Summary Report (MM YYYY to MM YYYY)',
                            value: 'NONGRADPRJ',
                          },
                          {
                            text: 'GRADREG - Graduated Students (MM YYYY to MM YYYY) Report',
                            value: 'GRADREG',
                          },
                          {
                            text: 'NONGRADREG - Not-Yet Graduated Students (MM YYYY to MM YYYY) Report',
                            value: 'NONGRADREG',
                          },
                        ]"
                        item-title="text"
                        item-value="value"
                        label="Select a report type"
                        variant="outlined"
                        class="mt-2"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-select
                        class="mt-2"
                        v-model="group"
                        :items="['School', 'All Schools']"
                        label="Select a group"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row v-if="group == 'School'">
                    <SchoolInput disableSelectStudents>
                      <template #inputWarning>
                        <p>
                          This will archive current school reports, which will
                          become static and no longer be updated. School reports
                          must be archived before the new data collection cycle
                          begins so they are not overwritten entirely.
                        </p>
                      </template>
                    </SchoolInput>
                  </v-row>
                  <v-row v-if="group == 'All Schools'">
                    <v-alert type="info" class="pb-2">
                      <p>
                        This will archive current school reports, which will
                        become static and no longer be updated. School reports
                        must be archived before the new data collection cycle
                        begins so they are not overwritten entirely.
                      </p>
                    </v-alert>
                  </v-row>
                </v-stepper-window-item>

                <v-stepper-window-item value="1">
                  <v-card flat>
                    <ScheduleInput warning="">
                      <template #confirmations>
                        <v-card title="Confirmations" class="text-h5">
                          <v-table>
                            <thead>
                              <tr>
                                <th>
                                  <strong
                                    >Batch Confirmation: please read and accept
                                    before submitting</strong
                                  >
                                </th>
                                <th>Confirm</th>
                              </tr>
                            </thead>
                            <tbody>
                              <!-- First Confirmation Checkbox -->
                              <tr>
                                <td>
                                  Final Graduation Algorithm and TVR batch jobs
                                  have been run for students from the previous
                                  cycle
                                </td>
                                <td>
                                  <v-checkbox
                                    v-model="selectedConfirmations"
                                    value="REQUIRED_CONFIRMATION_1"
                                    hide-details
                                  ></v-checkbox>
                                </td>
                              </tr>

                              <!-- Second Confirmation Checkbox -->
                              <tr>
                                <td>
                                  Regenerate School Reports are completed for
                                  any schools that require final updates
                                </td>
                                <td>
                                  <v-checkbox
                                    v-model="selectedConfirmations"
                                    value="REQUIRED_CONFIRMATION_2"
                                    hide-details
                                  ></v-checkbox>
                                </td>
                              </tr>
                            </tbody>
                          </v-table>
                        </v-card>
                      </template>
                      <template #batchDetails>
                        <v-data-table
                          :items="[
                            {
                              label: 'Run Type',
                              value: 'Archive School Reports Process',
                            },
                          ]"
                          hide-default-header
                          hide-default-footer
                        >
                        </v-data-table>
                      </template>
                    </ScheduleInput>
                  </v-card>
                </v-stepper-window-item>
              </v-stepper-window>
            </template>
            <template v-slot:actions>
              <div class="row mx-6 mb-6">
                <!-- Left Action Button -->
                <v-btn
                  @click="step--"
                  color="bcGovBlue"
                  :disabled="step == 0"
                  variant="outlined"
                  >Back</v-btn
                >
                <v-spacer />
                <!-- Right Action Button -->
                <v-btn
                  v-if="step < 1"
                  @click="step++"
                  :disabled="
                    v$.getBatchRequest.hasAtLeastOneGroupValue.$invalid ||
                    v$.getBatchRequest.reportTypeRequired.$invalid
                  "
                  color="bcGovBlue"
                >
                  Next
                </v-btn>
                <v-btn
                  v-else
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
            </template>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { ref, watch } from "vue";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import SchoolInput from "@/components/Batch/Forms/FormInputs/SchoolInput.vue";
import ScheduleInput from "@/components/Batch/Forms/FormInputs/ScheduleInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useAccessStore } from "../../../store/modules/access";
import { useBatchRequestFormStore } from "../../../store/modules/batchRequestFormStore";
import { useBatchProcessingStore } from "../../../store/modules/batchprocessing";
import { useSnackbarStore } from "../../../store/modules/snackbar";
import { generateRequestPayload } from "@/utils/common.js";
import { mapActions, mapState } from "pinia";
export default {
  setup() {
    const batchRequestFormStore = useBatchRequestFormStore();
    const group = ref(batchRequestFormStore.who);
    const reportType = ref(batchRequestFormStore.reportType);
    watch(group, (newValue) => {
      batchRequestFormStore.who = newValue;
      if (newValue == "All Schools") {
        batchRequestFormStore.setActivityCode("ALL");
      } else {
        batchRequestFormStore.setActivityCode(null);
      }
    });
    watch(reportType, (newValue) => {
      batchRequestFormStore.reportType = newValue;
    });
    return {
      reportType,
      group,
      v$: useVuelidate(),
    };
  },
  created() {},
  validations() {
    return {
      selectedConfirmations: {
        required,
        allConfirmationsSelected: helpers.withMessage(
          "You must check both confirmations",
          (value) => {
            return (
              value.includes("REQUIRED_CONFIRMATION_1") &&
              value.includes("REQUIRED_CONFIRMATION_2")
            );
          }
        ),
      },
      getBatchRequest: {
        reportTypeRequired: helpers.withMessage(
          "Select a Report Type",
          (value) => {
            if (this.getReportType.length > 0) {
              return true;
            } else {
              return false;
            }
          }
        ),
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
        hasAtLeastOneGroupValue: helpers.withMessage(
          "Must contain at least one " + this.group,
          (value) => {
            if (this.getBatchRequest) {
              let isValid = false;
              if (
                this.group &&
                ["All Schools", "School"].includes(this.group)
              ) {
                if (this.group === "School") {
                  isValid =
                    this.getBatchRequest.schoolIds &&
                    this.getBatchRequest.schoolIds.length > 0;
                } else if (this.group === "All Schools") {
                  isValid = true;
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
  components: {
    ScheduleInput: ScheduleInput,
    SchoolInput: SchoolInput,
  },
  data: () => ({
    step: 0,
    batchLoading: false,
    dialog: false,
    selectedConfirmations: [],

    snackbarStore: useSnackbarStore(),
    batchProcessingStore: useBatchProcessingStore(),
  }),
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useBatchRequestFormStore, [
      "getBatchRequest",
      "getBatchRunTime",
      "batchRunTimeSet",
      "getReportType",
      "getBatchRequestCrontime",
    ]),
  },
  methods: {
    ...mapActions(useBatchRequestFormStore, [
      "clearBatchDetails",
      "clearBatchGroupData",
    ]),
    ...mapActions(useBatchProcessingStore, [
      "setActiveTab",
      "updateDashboards",
    ]),

    closeDialogAndResetForm() {
      this.group = null;
      this.dialog = false;
      this.clearBatchDetails();
      this.step = 0;
      this.selectedConfirmations = [];
      this.reportType = null;
    },
    cancel() {
      this.group = null;
      this.dialog = false;
      this.clearBatchDetails();
      this.step = 0;
    },
    changeStep(step) {
      this.step = step;
    },

    async submit() {
      this.batchLoading = true;
      const requestTemplate = [
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
      try {
        let response = await BatchProcessingService.runArchiveSchoolReports(
          requestPayload,
          this.getBatchRequestCrontime
        );
        this.batchLoading = false;
        if (this.getBatchRequestCrontime) {
          this.snackbarStore.showSnackbar(
            "Archive School Reports Process has been successfully scheduled",
            10000
          );
        } else {
          this.snackbarStore.showSnackbar(
            "Batch " +
              response.data.batchId +
              "- Archive School Reports Process submitted",
            "success",
            10000
          );
        }
        this.batchLoading = false;
        this.closeDialogAndResetForm();
        this.setActiveTab("batchRuns");
        //add a wait before updating dashboard
        setTimeout(() => {
          this.updateDashboards();
        }, 2000);
      } catch (error) {
        this.snackbarStore.showSnackbar(
          "An error occurred: " + error.message,
          "danger",
          10000
        );
      }
    },
  },
};
</script>
