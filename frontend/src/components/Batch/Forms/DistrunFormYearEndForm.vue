<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="hasPermissions('BATCH', 'runDistrunYE')"
          color="primary"
          v-bind="props"
          class="mr-2"
          @click="setGroup('School Category')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title
            >-End Credentials and Transcript DistrYearibution Run</v-card-title
          >
          <v-btn
            @click="closeDialogAndResetForm()"
            color="error"
            variant="outlined"
            class="m-4"
            >Cancel</v-btn
          >
        </div>

        <v-card-text>
          <v-stepper show-actions v-model="step">
            <template v-slot:default="{ prev, next }">
              <v-stepper-header>
                <v-stepper-item
                  :rules="[
                    () => !v$.getBatchRequest.hasAtLeastOneGroupValue.$invalid,
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
                    <v-select
                      v-model="getGroup"
                      :items="['School Category']"
                      label="Select a group"
                      variant="outlined"
                    ></v-select>
                  </v-row>
                  <v-row v-if="getGroup == 'School Category'">
                    <DistrictInput disableSelectStudents></DistrictInput>
                  </v-row>
                </v-stepper-window-item>

                <v-stepper-window-item value="1">
                  <v-card flat>
                    <ScheduleInput>
                      <template #batchDetails>
                        <v-data-table
                          :items="[
                            {
                              label: 'Run Type',
                              value:
                                'Year-End Credentials and Transcript Distribution Run',
                            },

                            {
                              label: 'Where',
                              value: 'BC Mail',
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
import DistrictInput from "@/components/Batch/Forms/FormInputs/DistrictInput.vue";
import ScheduleInput from "@/components/Batch/Forms/FormInputs/ScheduleInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useBatchProcessingStore } from "../../../store/modules/batchprocessing";
import { useBatchRequestFormStore } from "../../../store/modules/batchRequestFormStore";
import { useAccessStore } from "../../../store/modules/access";
import { useSnackbarStore } from "../../../store/modules/snackbar";
import { mapActions, mapState } from "pinia";
import { generateRequestPayload } from "@/utils/common.js";
export default {
  setup() {
    const batchRequestFormStore = useBatchRequestFormStore();
    const group = ref(batchRequestFormStore.who);
    watch(group, (newValue) => {
      batchRequestFormStore.who = newValue;
    });

    return {
      group,
      v$: useVuelidate(),
    };
  },
  created() {},
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
        hasAtLeastOneGroupValue: helpers.withMessage(
          "Must contain at least one " + this.getGroup,
          (value) => {
            if (this.getBatchRequest) {
              let isValid = false;
              if (this.getGroup == "School Category") {
                isValid =
                  this.getBatchRequest.districts &&
                  this.getBatchRequest.districts.length > 0;
              }
              return isValid;
            } else {
              return false;
            }
          }
        ),
      },
    };
  },
  components: {
    DistrictInput: DistrictInput,
    ScheduleInput: ScheduleInput,
  },
  data: () => ({
    step: 0,
    batchLoading: false,
    dialog: false,
  }),
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useBatchRequestFormStore, [
      "getBatchRequest",
      "getBatchRunTime",
      "getGroup",
      "batchRunTimeSet",
      "getBatchRequestCrontime",
    ]),
    requestPayload() {
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
      const batchRequest = this.getBatchRequest;

      // Filter the batch request using the requestTemplate array
      return requestTemplate.reduce((acc, field) => {
        if (batchRequest[field] !== undefined) {
          acc[field] = batchRequest[field];
        }
        return acc;
      }, {});
    },
  },
  methods: {
    ...mapActions(useBatchRequestFormStore, [
      "clearBatchDetails",
      "clearBatchGroupData",
      "setGroup",
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
      const requestTemplate = [
        "credentialTypeCode",
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
      try {
        let response = await BatchProcessingService.runDISTRUN_YE(
          requestPayload,
          this.getBatchRequestCrontime
        );
        this.batchLoading = false;
        if (this.getBatchRequestCrontime) {
          this.snackbarStore.showSnackbar(
            "Year-End Credentials and Transcript Distribution Run has been successfully scheduled",
            10000
          );
        } else {
          this.snackbarStore.showSnackbar(
            "Batch " +
              response.data.batchId +
              "- Year-End Credentials and Transcript Distribution Run submitted",
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
