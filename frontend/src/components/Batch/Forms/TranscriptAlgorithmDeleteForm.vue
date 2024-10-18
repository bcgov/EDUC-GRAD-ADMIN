<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="hasPermissions('BATCH', 'runTVRDelete')"
          small
          color="primary"
          v-bind="props"
          class="mr-2"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
      </template>
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>Transcript Verification Report Delete</v-card-title>
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
                      v-model="group"
                      :items="[
                        { title: 'Student', value: 'Student' },
                        {
                          title: 'School',
                          value: 'School',
                          disabled: !hasPermissions(
                            'BATCH',
                            'selectTVRDeleteSchools'
                          ),
                        },
                        {
                          title: 'All Students',
                          value: 'All Students',
                          disabled: !hasPermissions('BATCH', 'selectAllOption'),
                        },
                      ]"
                      label="Select a Group"
                      ><template v-slot:item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :disabled="item.raw.disabled"
                        ></v-list-item> </template
                    ></v-select>
                  </v-row>
                  <v-row v-if="group == 'Student'">
                    <StudentInput></StudentInput>
                  </v-row>
                  <v-row
                    v-if="
                      group == 'School Category' &&
                      hasPermissions('BATCH', 'allowSelectCategoryCodeGroup')
                    "
                  >
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
                    <ScheduleInput>
                      ><template #batchDetails>
                        <v-data-table
                          :items="[
                            {
                              label: 'Run Type',
                              value: 'Delete Student TVR Process',
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
import StudentInput from "@/components/Batch/Forms/FormInputs/StudentInput.vue";
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
                ["Student", "School", "All Students"].includes(this.group)
              ) {
                if (this.group === "School") {
                  isValid =
                    this.getBatchRequest.schoolOfRecords &&
                    this.getBatchRequest.schoolOfRecords.length > 0;
                } else if (this.group === "Student") {
                  isValid =
                    this.getBatchRequest.pens &&
                    this.getBatchRequest.pens.length > 0;
                } else if (this.group === "All Students") {
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
    SchoolInput: SchoolInput,
    StudentInput: StudentInput,
    ScheduleInput: ScheduleInput,
  },
  data: () => ({
    step: 0,
    dialog: false,
    snackbarStore: useSnackbarStore(),
    batchProcessingStore: useBatchProcessingStore(),
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
        let response = await BatchProcessingService.runTVR_DELETE(
          requestPayload,
          this.getBatchRequestCrontime
        );

        if (this.getBatchRequestCrontime) {
          this.snackbarStore.showSnackbar(
            "Transcript verification report delete has been successfully scheduled",
            5000
          );
        } else {
          this.snackbarStore.showSnackbar(
            "Transcript verification report delete request submitted",
            "success",
            5000
          );
        }
        this.closeDialogAndResetForm();
        this.setActiveTab("batchRuns");
        this.updateDashboards();
      } catch (error) {
        // handle the error and show the notification
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
