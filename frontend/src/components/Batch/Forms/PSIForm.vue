<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="hasPermissions('BATCH', 'runPSIBatch')"
          color="primary"
          v-bind="props"
          class="mr-2"
          @click="setGroup('Psi')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>PSI Run FTP / Paper</v-card-title>
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
                    () => !v$.getBatchRequest.hasAtLeastOnePSiValue.$invalid,
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
                    <v-col> <PSIInput></PSIInput> </v-col
                  ></v-row>
                </v-stepper-window-item>

                <v-stepper-window-item value="1">
                  <v-card flat>
                    <ScheduleInput>
                      <template #batchDetails>
                        <v-data-table
                          :items="[
                            {
                              label: 'Run Type',
                              value: 'PSI Run FTP / PAPER',
                            },
                            {
                              label: 'Transmission Mode',
                              value: getBatchRequest.psiTransmissionMode,
                            },
                            {
                              label: 'PSI Year',
                              value: getBatchRequest.psiYear,
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
                  :disabled="v$.$invalid"
                  >Submit</v-btn
                >
              </div>
            </template>
          </v-stepper>
        </v-card-text>

        <p v-for="error of v$.$errors" :key="error.$uid">
          {{ error.$message }}
        </p>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { ref, watch } from "vue";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import PSIInput from "@/components/Batch/Forms/FormInputs/PSIInput.vue";
import ScheduleInput from "@/components/Batch/Forms/FormInputs/ScheduleInput.vue";
import Notifications from "@/components/Common/Notifications.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useBatchRequestFormStore } from "../../../store/modules/batchRequestFormStore";
import { useBatchProcessingStore } from "../../../store/modules/batchprocessing";
import { useAccessStore } from "../../../store/modules/access";
import { useSnackbarStore } from "../../../store/modules/snackbar";
import { mapActions, mapState } from "pinia";
import { generateRequestPayload } from "@/utils/common.js";
export default {
  setup() {
    const batchProcessingStore = useBatchProcessingStore();
    const batchRequestFormStore = useBatchRequestFormStore();
    const notifications = ref(null);
    const activeTab = ref(batchProcessingStore.activeTab);
    watch(activeTab, (newValue) => {
      batchRequestFormStore.activeTab = newValue;
    });
    const changeTab = (tabName) => {
      activeTab.value = tabName;
    };
    const group = ref(batchRequestFormStore.who);
    watch(group, (newValue) => {
      batchRequestFormStore.who = newValue;
    });

    return {
      activeTab,
      group,
      notifications,
      changeTab,
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
        hasAtLeastOnePSiValue: helpers.withMessage(
          "Must contain at least one " + this.getGroup,
          (value) => {
            if (this.getBatchRequest) {
              let isValid = false;
              isValid =
                this.getBatchRequest.psiCodes &&
                this.getBatchRequest.psiCodes.length > 0;

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
    PSIInput: PSIInput,
    ScheduleInput: ScheduleInput,
    Notifications: Notifications,
  },
  data: () => ({
    step: 0,
    dialog: false,
    snackbarStore: useSnackbarStore(),
  }),
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useBatchRequestFormStore, [
      "getBatchRequest",
      "getBatchRunTime",
      "getBatchRequestCrontime",
      "getGroup",
      "getPsiTrasmissionMode",
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
      this.closeDialogAndResetForm();
    },
    changeStep(step) {
      this.step = step;
    },
    async submit() {
      this.dialog = false;
      try {
        const requestTemplate = [
          "credentialTypeCode",
          "districts",
          "gradDateFrom",
          "gradDateTo",
          "localDownload",
          "pens",
          "programs",
          "psiCodes",
          "psiYear",
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
        let response = await BatchProcessingService.runPSIRun(
          requestPayload,
          this.getPsiTrasmissionMode,
          this.getBatchRequestCrontime
        );

        if (this.getBatchRequestCrontime) {
          this.snackbarStore.showSnackbar(
            "PSI Run FTP / Paper has been successfully scheduled",
            5000
          );
        } else {
          this.snackbarStore.showSnackbar(
            "Batch " +
              response.data.batchId +
              "- PSI Run FTP / Paper submitted",
            "success",
            5000
          );
        }
        this.closeDialogAndResetForm();

        this.setActiveTab("batchRuns");
        this.updateDashboards();
      } catch (error) {
        this.snackbarStore.showSnackbar(
          "An error occurred: " + error.message,
          "danger",
          5000
        );
      }
    },
  },
};
</script>
