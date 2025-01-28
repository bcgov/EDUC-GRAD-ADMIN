<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="hasPermissions('BATCH', 'runTVR')"
          color="primary"
          v-bind="props"
          class="mr-2"
          ><v-icon small>mdi-plus</v-icon></v-btn
        >
      </template>
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>Transcript Verification Report</v-card-title>
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
                        v-model="group"
                        :items="[
                          { title: 'Student', value: 'Student' },
                          { title: 'School', value: 'School' },
                          {
                            title: 'School Category',
                            value: 'School Category',
                            disabled: !this.hasPermissions(
                              'BATCH',
                              'selectSchoolCategoryGroup'
                            ),
                          },
                          {
                            title: 'Program',
                            value: 'Program',
                            disabled: !this.hasPermissions(
                              'BATCH',
                              'selectProgramGroup'
                            ),
                          },
                        ]"
                        label="Select a group"
                        variant="outlined"
                        hide-details
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item
                            v-bind="props"
                            :subtitle="item.raw.department"
                            :disabled="item.raw.disabled"
                          ></v-list-item> </template
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row v-if="group == 'Student'">
                    <StudentInput></StudentInput>
                  </v-row>
                  <v-row v-if="group == 'School Category'">
                    <DistrictInput></DistrictInput>
                  </v-row>
                  <v-row v-if="group == 'Program'">
                    <ProgramInput></ProgramInput>
                  </v-row>
                  <v-row v-if="group == 'School'">
                    <SchoolInput></SchoolInput>
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
                              value: 'Transcript Verification Report',
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
import StudentInput from "@/components/Batch/Forms/FormInputs/StudentInput.vue";
import ProgramInput from "@/components/Batch/Forms/FormInputs/ProgramInput.vue";
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
                  "Psi",
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
  components: {
    SchoolInput: SchoolInput,
    DistrictInput: DistrictInput,
    StudentInput: StudentInput,
    ProgramInput: ProgramInput,
    ScheduleInput: ScheduleInput,
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
        let response = await BatchProcessingService.runTVRRUN(
          requestPayload,
          this.getBatchRequestCrontime
        );
        this.batchLoading = false;
        if (this.getBatchRequestCrontime) {
          this.snackbarStore.showSnackbar(
            "Transcript verification report has been successfully scheduled",
            10000
          );
        } else {
          this.snackbarStore.showSnackbar(
            "Batch " + 
            response.data.batchId +
            "- Transcript verification report request submitted",
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
      } catch (error) {
        // handle the error and show the notification
        this.snackbarStore.showSnackbar(
          "An error occurred: " + error.message,
          "danger",
          10000
        );
        console.error("Error:", error);
      }
    },
  },
};
</script>
