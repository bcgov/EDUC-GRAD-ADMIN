<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"><v-icon>mdi-plus</v-icon></v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Archive School Reports Process</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-stepper alt-labels show-actions v-model="step">
              <template v-slot:default="{ prev, next }">
                <v-stepper-header>
                  <v-stepper-item
                    :rules="[
                      () =>
                        !v$.getBatchRequest.hasAtLeastOneGroupValue.$invalid,
                    ]"
                    complete
                    editable
                    title="Group"
                    value="1"
                  ></v-stepper-item>

                  <v-divider></v-divider>

                  <v-stepper-item
                    :rules="[
                      () => !v$.getBatchRequest.batchRunTimeSet.$invalid,
                    ]"
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
                      ></v-select>
                    </v-row>
                    <v-row>
                      <v-select
                        v-model="group"
                        :items="['School', 'All Schools']"
                        label="Select a group"
                      ></v-select>
                    </v-row>
                    <v-row v-if="group == 'School'">
                      <SchoolInput>
                        <template #inputWarning>
                          <p>
                            This will archive current school reports, which will
                            become static and no longer be updated. School
                            reports must be archived before the new data
                            collection cycle begins so they are not overwritten
                            entirely.
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

                  <v-stepper-window-item value="2">
                    <v-card title="Schedule" flat>
                      <div v-if="group === 'School Category'">
                        Districts:
                        <v-list>
                          <v-list-item
                            v-for="(
                              district, index
                            ) in getBatchRequest.districts"
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
                        {{ getBatchRequest }}
                      </div>
                      <v-btn @click="changeStep(0)">Edit</v-btn>

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
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions class="batch-form-actions">
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="cancel">
            Cancel
          </v-btn>
          <v-btn
            :disabled="v$.$invalid"
            color="blue-darken-1"
            variant="text"
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
import ScheduleInput from "@/components/Batch/Forms/FormInputs/ScheduleInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useBatchRequestFormStore } from "../../../store/modules/batchRequestFormStore";
import { useBatchProcessingStore } from "../../../store/modules/batchprocessing";
import { useSnackbarStore } from "../../../store/modules/snackbar";
import { mapActions, mapState } from "pinia";
export default {
  setup() {
    const batchRequestFormStore = useBatchRequestFormStore();
    const group = ref(batchRequestFormStore.who);
    const reportType = ref(batchRequestFormStore.reportType);
    watch(group, (newValue) => {
      batchRequestFormStore.who = newValue;
      if (newValue == "All Schools") {
        batchRequestFormStore.setActivityCode("All");
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
                    this.getBatchRequest.schoolOfRecords &&
                    this.getBatchRequest.schoolOfRecords.length > 0;
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
    dialog: false,
    snackbarStore: useSnackbarStore(),
    batchProcessingStore: useBatchProcessingStore(),
  }),
  computed: {
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
      try {
        let response = await BatchProcessingService.runArchiveSchoolReports(
          this.getBatchRequest,
          this.getBatchRequestCrontime
        );
        this.closeDialogAndResetForm();
        this.snackbarStore.showSnackbar(
          "Batch " +
            response.data.batchId +
            "- Archive School Reports Process submitted",
          "success",
          5000
        );
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
