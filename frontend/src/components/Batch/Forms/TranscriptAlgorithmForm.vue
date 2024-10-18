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
        <v-card-title>
          <span class="text-h5">Transcript Verification Report</span>
        </v-card-title>
        <v-card-text>
          <v-stepper alt-labels show-actions v-model="step">
            <template v-slot:default="{ prev, next }">
              <v-stepper-header>
                <v-stepper-item
                  :rules="[
                    () => !v$.getBatchRequest.hasAtLeastOneGroupValue.$invalid,
                  ]"
                  complete
                  editable
                  title="Group"
                  value="1"
                ></v-stepper-item>

                <v-divider></v-divider>

                <v-stepper-item
                  :rules="[() => !v$.getBatchRequest.batchRunTimeSet.$invalid]"
                  complete
                  editable
                  title="Run/Schedule"
                  value="2"
                ></v-stepper-item>
              </v-stepper-header>

              <v-stepper-window>
                <v-stepper-window-item value="1">
                  <v-row>
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
                      label="Select group"
                      hide-details
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :subtitle="item.raw.department"
                          :disabled="item.raw.disabled"
                        ></v-list-item> </template
                    ></v-select>
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

                <v-stepper-window-item value="2">
                  <v-card flat>
                    <ScheduleInput></ScheduleInput>
                  </v-card>
                </v-stepper-window-item>

                <v-stepper-window-item value="3">
                  <span>Step Window 3</span>
                </v-stepper-window-item>
              </v-stepper-window>
              <v-stepper-actions
                @click:prev="prev"
                @click:next="next"
                @click:submit="submit"
              ></v-stepper-actions>
            </template>
          </v-stepper>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions class="sticky-form-actions">
          <v-spacer></v-spacer>
          <v-btn
            color="bcGovBlue"
            variant="outlined"
            class="text-none"
            density="default"
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="v$.$invalid"
            color="error"
            variant="flat"
            class="text-none"
            density="default"
            @click="submit"
          >
            Submit
          </v-btn>
        </v-card-actions>
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
                    this.getBatchRequest.schoolOfRecords &&
                    this.getBatchRequest.schoolOfRecords.length > 0;
                } else if (this.group === "Student") {
                  isValid =
                    this.getBatchRequest.pens &&
                    this.getBatchRequest.pens.length > 0;
                } else if (this.group === "School Category") {
                  isValid =
                    this.getBatchRequest.districts &&
                    this.getBatchRequest.districts.length > 0;
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
        let response = await BatchProcessingService.runTVRRUN(
          requestPayload,
          this.getBatchRequestCrontime
        );

        this.activeTab = "batchRuns";
        if (this.getBatchRequestCrontime) {
          this.snackbarStore.showSnackbar(
            "Transcript verification report has been successfully scheduled",
            5000
          );
        } else {
          this.snackbarStore.showSnackbar(
            "Transcript verification report request submitted",
            "success",
            5000
          );
        }
        this.closeDialogAndResetForm();
      } catch (error) {
        // handle the error and show the notification
        this.snackbarStore.showSnackbar(
          "An error occurred: " + error.message,
          "danger",
          5000
        );
        console.error("Error:", error);
      }
    },
  },
};
</script>
