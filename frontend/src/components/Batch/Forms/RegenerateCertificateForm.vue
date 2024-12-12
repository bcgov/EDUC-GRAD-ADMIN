<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          v-if="hasPermissions('BATCH', 'runCertificateRegeneration')"
          color="primary"
          v-bind="props"
          class="mr-2"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
      </template>
      <v-card>
        <div class="d-flex justify-space-between align-center">
          <v-card-title>User Request Certificate Regeneration</v-card-title>
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
                    <v-select
                      class="mt-2"
                      v-model="group"
                      :items="[
                        {
                          title: 'All',
                          value: 'all',
                          disabled: !hasPermissions('BATCH', 'selectAllOption'),
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
                      label="Select a group"
                      variant="outlined"
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

                <v-stepper-window-item value="1">
                  <v-card flat>
                    <ScheduleInput>
                      <template #batchDetails>
                        <v-data-table
                          :items="[
                            {
                              label: 'Run Type',
                              value: 'User Request Certificate Regeneration',
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
          "Must contain at least one " + this.getGroup,
          (value) => {
            if (this.getBatchRequest) {
              let isValid = false;
              if (
                this.getGroup &&
                ["Student", "School Category", "all"].includes(this.getGroup)
              ) {
                if (this.getGroup === "Student") {
                  isValid =
                    this.getBatchRequest.pens &&
                    this.getBatchRequest.pens.length > 0;
                } else if (this.getGroup === "School Category") {
                  isValid =
                    this.getBatchRequest.districts &&
                    this.getBatchRequest.districts.length > 0;
                } else if (this.getGroup === "all") {
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
    DistrictInput: DistrictInput,
    StudentInput: StudentInput,
    ProgramInput: ProgramInput,
    ScheduleInput: ScheduleInput,
    Notifications: Notifications,
  },
  data: () => ({
    snackbarStore: useSnackbarStore(),
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
      this.batchLoading = true;
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
        if (this.getGroup == "all") {
          let response = await BatchProcessingService.runCERTREGEN_ALL();
        } else {
          let response = await BatchProcessingService.runCERTREGEN(
            requestPayload,
            this.getBatchRequestCrontime
          );
        }

        this.batchLoading = false;
        if (this.getBatchRequestCrontime) {
          this.snackbarStore.showSnackbar(
            "User Request Certificate Regeneration has been successfully scheduled",
            10000
          );
        } else {
          this.snackbarStore.showSnackbar(
            "Batch " +
              response.data.batchId +
              "- User Request Certificate Regeneration submitted",
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
