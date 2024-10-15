<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="hasPermissions('BATCH', 'runCertificateRegeneration')"
          color="primary"
          v-bind="props"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">User Request Certificate Regeneration</span>
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
                        v-model="group"
                        :items="[
                          {
                            title: 'All',
                            value: 'all',
                            disabled: !hasPermissions(
                              'BATCH',
                              'selectAllOption'
                            ),
                          },
                          {
                            title: 'Student',
                            value: 'Student',
                          },
                          {
                            title: 'District',
                            value: 'School Category',
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
                      <StudentInput runType="CERT_REGEN"></StudentInput>
                    </v-row>
                    <v-row v-if="group == 'School Category'">
                      <DistrictInput
                        runType="CERT_REGEN"
                        disableSelectStudents
                        disableSelectCategory
                      ></DistrictInput>
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
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions class="sticky-form-actions">
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
import DistrictInput from "@/components/Batch/Forms/FormInputs/DistrictInput.vue";
import StudentInput from "@/components/Batch/Forms/FormInputs/StudentInput.vue";
import ProgramInput from "@/components/Batch/Forms/FormInputs/ProgramInput.vue";
import ScheduleInput from "@/components/Batch/Forms/FormInputs/ScheduleInput.vue";
import Notifications from "@/components/Common/Notifications.vue";
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
        hasAtLeastOneGroupValue: helpers.withMessage(
          "Must contain at least one " + this.group,
          (value) => {
            if (this.getBatchRequest) {
              let isValid = false;
              if (
                this.group &&
                ["Student", "School Category", "All"].includes(this.group)
              ) {
                if (this.group === "Student") {
                  isValid =
                    this.getBatchRequest.pens &&
                    this.getBatchRequest.pens.length > 0;
                } else if (this.group === "School Category") {
                  isValid =
                    this.getBatchRequest.districts &&
                    this.getBatchRequest.districts.length > 0;
                } else if (this.group === "All") {
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
    SchoolInput: SchoolInput,
    DistrictInput: DistrictInput,
    StudentInput: StudentInput,
    ProgramInput: ProgramInput,
    ScheduleInput: ScheduleInput,
    Notifications: Notifications,
  },
  data: () => ({
    snackbarStore: useSnackbarStore(),
    step: 0,
    dialog: false,
  }),
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useBatchRequestFormStore, [
      "getBatchRequest",
      "getBatchRunTime",
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
      this.closeDialogAndResetForm();
    },
    changeStep(step) {
      this.step = step;
    },
    async submit() {
      const requestTemplate = [
        "districts",
        "pens",
        "programs",
        "psiCodes",
        "reportTypes",
        "runMode",
        "schoolOfRecords",
        "validateInput",
      ];
      const requestPayload = generateRequestPayload(
        this.getBatchRequest,
        requestTemplate
      );
      try {
        let response = await BatchProcessingService.runCERTREGEN(
          requestPayload,
          this.getBatchRequestCrontime
        );
        this.closeDialogAndResetForm();
        this.snackbarStore.showSnackbar(
          "Batch " +
            response.data.batchId +
            "- User Request Certificate Regeneration submitted",
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
