<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          v-bind="props"
          @click="setGroup('School Category')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5"
            >Year-End Credentials and Transcript Distribution Run</span
          >
        </v-card-title>
        <v-card-text>
          {{ getGroup }}
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
                        v-model="getGroup"
                        :items="['School Category']"
                        label="Select a Group"
                      ></v-select>
                    </v-row>
                    <v-row v-if="getGroup == 'School Category'">
                      <DistrictInput></DistrictInput>
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
        <v-card-actions>
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
import SchoolInput from "@/components/Batch/Forms/FormInputs/SchoolInput.vue";
import DistrictInput from "@/components/Batch/Forms/FormInputs/DistrictInput.vue";
import StudentInput from "@/components/Batch/Forms/FormInputs/StudentInput.vue";
import ProgramInput from "@/components/Batch/Forms/FormInputs/ProgramInput.vue";
import ScheduleInput from "@/components/Batch/Forms/FormInputs/ScheduleInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useBatchRequestFormStore } from "../../../store/modules/batchRequestFormStore";
import { useSnackbarStore } from "../../../store/modules/snackbar";
import { mapActions, mapState } from "pinia";
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
    dialog: false,
  }),
  computed: {
    ...mapState(useBatchRequestFormStore, [
      "getBatchRequest",
      "getBatchRunTime",
      "getGroup",
      "batchRunTimeSet",
      "getBatchRequestCrontime",
    ]),
  },
  methods: {
    ...mapActions(useBatchRequestFormStore, [
      "clearBatchDetails",
      "clearBatchGroupData",
      "setGroup",
    ]),
    async submit() {
      try {
        let response = await BatchProcessingService.runDISTRUN_YE(
          this.getBatchRequest,
          this.getBatchRequestCrontime
        );
        this.closeDialogAndResetForm();
        this.activeTab = "batchRuns";
      } catch (error) {
        // handle the error and show the notification
        console.error("Error:", error);
        if (this.notifications) {
          this.notifications.show("An error occurred: " + error.message);
        }
      }
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
  },
};
</script>
