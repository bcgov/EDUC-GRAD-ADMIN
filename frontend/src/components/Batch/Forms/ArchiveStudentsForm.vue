<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="hasPermissions('BATCH', 'runArchiveStudents')"
          color="primary"
          v-bind="props"
          class="mr-2"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>Archive Student Batch Process</v-card-title>
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
                    <v-col>
                      <v-select
                        class="mt-2"
                        v-model="group"
                        :items="['School', 'All Students']"
                        label="Select a group"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row v-if="group == 'School'">
                    <SchoolInput>
                      <template #inputWarning>
                        <p>
                          All students with a School of Record matching the
                          entered school and with a student status of CUR or a
                          student status of TER will have their status changed
                          to ARC
                        </p>
                      </template>
                    </SchoolInput>
                  </v-row>
                  <v-row v-if="group == 'All Students'">
                    <v-alert>
                      All students with a status of CUR (current) and TER
                      (terminated) will have their student status changed to ARC
                      (archived)
                    </v-alert>
                  </v-row>
                </v-stepper-window-item>

                <v-stepper-window-item value="1">
                  <v-card flat>
                    <div v-if="group === 'School Category'">
                      Districts:
                      <v-list>
                        <v-list-item
                          v-for="(
                            district, index
                          ) in getBatchRequest.districtIds"
                          :key="index"
                        >
                          <v-list-item-content>
                            <v-list-item-title>{{
                              district
                            }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>
                    <div v-if="group === 'Program'">
                      Districts: {{ getBatchRequest.programs }}
                    </div>
                    <div v-if="group === 'PSI'">
                      Post Secondary Institutions: REQUEST
                      {{ getBatchRequest.psi }}
                    </div>
                    <v-card class="">
                      <v-card-text> </v-card-text>
                    </v-card>
                    <ScheduleInput>
                      <template #batchDetails>
                        <v-data-table
                          :items="[
                            {
                              label: 'Run Type',
                              value: 'Archive Student Batch Process',
                            },
                            {
                              label: 'Select Students',
                              value: 'Current and Terminated Students',
                            },
                          ]"
                          hide-default-header
                          hide-default-footer
                        >
                        </v-data-table>
                      </template>
                      <template #confirmations>
                        <v-card title="Confirmations" class="text-h5">
                          <v-table>
                            <thead>
                              <tr>
                                <th>
                                  Batch Confirmation: please read and accept
                                  before submitting
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
                                  Regenerate School Reports process has been
                                  completed for any schools that require final
                                  updates
                                </td>
                                <td>
                                  <v-checkbox
                                    v-model="selectedConfirmations"
                                    value="REQUIRED_CONFIRMATION_2"
                                    hide-details
                                  ></v-checkbox>
                                </td>
                              </tr>

                              <!-- Third Confirmation Checkbox -->
                              <tr>
                                <td>
                                  Archive School Reports process has been
                                  completed
                                </td>
                                <td>
                                  <v-checkbox
                                    v-model="selectedConfirmations"
                                    value="REQUIRED_CONFIRMATION_3"
                                    hide-details
                                  ></v-checkbox>
                                </td>
                              </tr>
                            </tbody>
                          </v-table>
                        </v-card>
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
                  variant="outlined">
                  Back
                </v-btn>
                <v-spacer />
                <!-- Right Action Button -->
                <v-btn
                  v-if="step < 1" 
                  @click="step++" 
                  :disabled="v$.getBatchRequest.hasAtLeastOneGroupValue.$invalid" 
                  color="bcGovBlue">
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
import BatchProcessingService from "@/services/BatchProcessingService.js";
import SchoolInput from "@/components/Batch/Forms/FormInputs/SchoolInput.vue";
import ScheduleInput from "@/components/Batch/Forms/FormInputs/ScheduleInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useBatchRequestFormStore } from "../../../store/modules/batchRequestFormStore";
import { useBatchProcessingStore } from "../../../store/modules/batchprocessing";
import { useAccessStore } from "../../../store/modules/access";
import { useSnackbarStore } from "../../../store/modules/snackbar";
import { generateRequestPayload } from "@/utils/common.js";
import { mapActions, mapState } from "pinia";
export default {
  setup() {
    const batchRequestFormStore = useBatchRequestFormStore();
    const group = ref(batchRequestFormStore.who);
    watch(group, (newValue) => {
      batchRequestFormStore.who = newValue;
      if (newValue == "All Students") {
        batchRequestFormStore.setActivityCode("ALL");
      } else {
        batchRequestFormStore.setActivityCode(null);
      }
    });

    return {
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
          "You must check all 3 confirmations",
          (value) => {
            return (
              value.includes("REQUIRED_CONFIRMATION_1") &&
              value.includes("REQUIRED_CONFIRMATION_2") &&
              value.includes("REQUIRED_CONFIRMATION_3")
            );
          }
        ),
      },
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
          "Must contain at least one " + this.group,
          (value) => {
            if (this.getBatchRequest) {
              let isValid = false;
              if (
                this.group &&
                ["All Students", "School"].includes(this.group)
              ) {
                if (this.group === "School") {
                  isValid =
                    this.getBatchRequest.schoolIds &&
                    this.getBatchRequest.schoolIds.length > 0;
                } else if (this.group === "All Students") {
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
    snackbarStore: useSnackbarStore(),
    step: 0,
    batchLoading: false,
    dialog: false,
    selectedConfirmations: [],
  }),
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useBatchRequestFormStore, [
      "getBatchRequest",
      "getBatchRunTime",
      "batchRunTimeSet",
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
        "activityCode",
      ];
      const requestPayload = generateRequestPayload(
        this.getBatchRequest,
        requestTemplate
      );
      try {
        let response = await BatchProcessingService.runArchiveStudents(
          requestPayload,
          this.getBatchRequestCrontime
        );
        this.batchLoading = false;
        if (this.getBatchRequestCrontime) {
          this.snackbarStore.showSnackbar(
            "Archive student batch process has been successfully scheduled",
            10000
          );
        } else {
          this.snackbarStore.showSnackbar(
            "Batch " +
              response.data.batchId +
              "- Archive student batch process submitted",
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
        // handle the error and show the notification
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
