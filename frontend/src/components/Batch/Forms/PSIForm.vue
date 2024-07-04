<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"> + </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">GRADUATION ALGORITHM</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-stepper alt-labels show-actions v-model="step">
              <template v-slot:default="{ prev, next }">
                <v-stepper-header>
                  <v-stepper-item
                    :rules="[() => false]"
                    complete
                    editable
                    title="Group"
                    value="1"
                  ></v-stepper-item>

                  <v-divider></v-divider>

                  <v-stepper-item
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
                          'Student',
                          'School',
                          'School Category',
                          'Program',
                          'PSI',
                        ]"
                        label="Select Option"
                      ></v-select>
                    </v-row>
                    <v-row v-if="group == 'Student'">
                      <StudentInput></StudentInput>
                    </v-row>
                    <v-row v-if="group == 'School Category'">
                      <DistrictInput></DistrictInput>
                    </v-row>
                    <v-row v-if="group == 'PSI'">
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
        {{ activeTab }}
        STORE - GETBATCHREQUEST
        {{ getBatchRequest }}

        <br />
        <br />
        GRAD FORM VALIDATIONS V$
        {{ v$.getBatchRequest }}
        <br />
        <br />
        RUN SCHEDULE COMPONENT VALIDATIONS
        {{ v$.RunLaterScheduleSet }}
        <br />
        <br />

        ALL VAIDATIONS V$
        {{ v$ }}
        <br />
        <br />
        BATCH RUN TIME {{ batchRunTime }}
        {{ v$.batchRunTime }}

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
import SchoolInput from "@/components/Batch/Forms/FormInputs/SchoolInput.vue";
import DistrictInput from "@/components/Batch/Forms/FormInputs/DistrictInput.vue";
import StudentInput from "@/components/Batch/Forms/FormInputs/StudentInput.vue";
import ProgramInput from "@/components/Batch/Forms/FormInputs/ProgramInput.vue";
import ScheduleInput from "@/components/Batch/Forms/FormInputs/ScheduleInput.vue";
import Notifications from "@/components/Common/Notifications.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useBatchRequestFormStore } from "../../../store/modules/batchRequestFormStore";
import { useBatchProcessingStore } from "../../../store/modules/batchProcessing";
import { mapActions, mapState } from "pinia";
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
          console.log("VALIDATE" + this.getBatchRunTime);
          if (this.getBatchRunTime) {
            console.log("VTRUE");
            return true;
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
                  console.log(this.getBatchRequest.students);
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
                console.log(this.group);
                console.log(isValid + " VALIDA");
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
    step: 0,
    dialog: false,
  }),
  computed: {
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
      try {
        console.log(this.getBatchRequestCrontime);
        let response = await BatchProcessingService.runREGALG(
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
  },
};
</script>
