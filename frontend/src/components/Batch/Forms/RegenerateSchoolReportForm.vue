<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="hasPermissions('BATCH', 'runSchoolReportRegeneration')"
          color="primary"
          v-bind="props"
          class="mr-2"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
      </template>
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>User Request School Report Regeneration</v-card-title>
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
                  :rules="[() => !v$.getBatchRequest.batchRunTimeSet.$invalid]"
                  complete
                  editable
                  title="Run/Schedule"
                  value="1"
                ></v-stepper-item>
              </v-stepper-header>

              <v-stepper-window>
                <v-stepper-window-item value="0">
                  <v-row>
                    <v-col sm="2" class="mt-3"
                      ><strong>Report Type</strong></v-col
                    >
                    <v-col sm="10">
                      <v-select
                        v-model="reportType"
                        :items="[
                          {
                            text: 'Projected Non-Graduates - Summary Report (MM YYYY to MM YYYY)',
                            value: 'NONGRADPRJ',
                          },
                          {
                            text: 'Graduated Students (MM YYYY to MM YYYY) Report and Not-Yet Graduated Students (MM YYYY to MM YYYY) Report',
                            value: 'GRADREG and NONGRADREG',
                          },
                        ]"
                        item-title="text"
                        item-value="value"
                        label="Select a report type"
                        variant="outlined"
                        class="mt-2"
                      ></v-select>
                    </v-col>
                    <v-col> </v-col>
                  </v-row>
                  <v-row>
                    <v-select
                      class="mt-2"
                      v-model="group"
                      :item-title="title"
                      :item-value="value"
                      :items="[
                        'School',
                        'School Category',
                        { title: 'All', value: 'All Schools' },
                      ]"
                      label="Select a group"
                      variant="outlined"
                    />
                  </v-row>
                  <v-row v-if="group == 'School'">
                    <SchoolInput disableSelectStudents> </SchoolInput>
                  </v-row>
                  <v-row v-if="group == 'School Category'">
                    <DistrictInput disableSelectStudents> </DistrictInput>
                  </v-row>
                </v-stepper-window-item>

                <v-stepper-window-item value="1">
                  <v-card flat>
                    <ScheduleInput
                      ><template #batchDetails>
                        <v-data-table
                          :items="[
                            {
                              label: 'Run Type',
                              value: 'User Request School Report Regeneration',
                            },
                          ]"
                          hide-default-header
                          hide-default-footer
                        >
                        </v-data-table> </template
                    ></ScheduleInput>
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
                <v-btn v-if="step < 1" @click="step++" color="bcGovBlue"
                  >Next</v-btn
                >
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
import DistrictInput from "@/components/Batch/Forms/FormInputs/DistrictInput.vue";
import ScheduleInput from "@/components/Batch/Forms/FormInputs/ScheduleInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useAccessStore } from "../../../store/modules/access";
import { useBatchRequestFormStore } from "../../../store/modules/batchRequestFormStore";
import { useBatchProcessingStore } from "../../../store/modules/batchprocessing";
import { useSnackbarStore } from "../../../store/modules/snackbar";
import { mapActions, mapState } from "pinia";
import { generateRequestPayload } from "@/utils/common.js";
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
                ["All Schools", "School", "School Category"].includes(
                  this.group
                )
              ) {
                if (this.group === "School") {
                  isValid =
                    this.getBatchRequest.schoolOfRecords &&
                    this.getBatchRequest.schoolOfRecords.length > 0;
                } else if (this.group === "School Category") {
                  isValid =
                    this.getBatchRequest.districts &&
                    this.getBatchRequest.districts.length > 0;
                } else if (this.group === "All Schools") {
                  isValid = true;
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
    DistrictInput: DistrictInput,
  },
  data: () => ({
    step: 0,
    batchLoading: false,
    dialog: false,
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
      try {
        const requestTemplate = [
          "districts",
          "gradDateFrom",
          "gradDateTo",
          "localDownload",
          "pens",
          "programs",
          "psiCodes",
          "quantity",
          "reportTypes",
          "schoolCategoryCodes",
          "schoolOfRecords",
          "validateInput",
        ];
        const requestPayload = generateRequestPayload(
          this.getBatchRequest,
          requestTemplate
        );
        let response = await BatchProcessingService.runSCHL_RPT_REGEN(
          requestPayload,
          this.getBatchRequestCrontime
        );
        this.batchLoading = false;
        if (this.getBatchRequestCrontime) {
          this.snackbarStore.showSnackbar(
            "User Request School Report Regeneration has been successfully scheduled",
            10000
          );
        } else {
          this.snackbarStore.showSnackbar(
            "Batch " +
              response.data.batchId +
              "- User Request School Report Regeneration submitted",
            "success",
            10000
          );
        }
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
