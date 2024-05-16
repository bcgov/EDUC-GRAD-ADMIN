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
            <v-stepper show-actions v-model="step">
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
                        v-model="groupSelected"
                        :items="[
                          'Student',
                          'School',
                          'School Category',
                          'Program',
                          'PSI',
                        ]"
                        label="Select Option"
                        @update:modelValue="setGroup(groupSelected)"
                      ></v-select>
                    </v-row>
                    <v-row v-if="groupSelected == 'Student'">
                      <StudentInput></StudentInput>
                    </v-row>
                    <v-row v-if="groupSelected == 'School Category'">
                      <DistrictInput></DistrictInput>
                    </v-row>
                    <v-row v-if="groupSelected == 'PSI'">
                      <DistrictInput></DistrictInput>
                    </v-row>
                    <v-row v-if="groupSelected == 'Program'">
                      <ProgramInput></ProgramInput>
                    </v-row>
                    <v-row v-if="groupSelected == 'School'">
                      <SchoolInput></SchoolInput>
                    </v-row>
                  </v-stepper-window-item>

                  <v-stepper-window-item value="2">
                    <v-card title="Schedule" flat>
                      <div v-if="getGroup === 'School Category'">
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
                      <div v-if="getGroup === 'Program'">
                        Districts: {{ getBatchRequest.programs }}
                      </div>
                      <div v-if="getGroup === 'PSI'">
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
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import SchoolInput from "@/components/Batch/Forms/FormInputs/SchoolInput.vue";
import DistrictInput from "@/components/Batch/Forms/FormInputs/DistrictInput.vue";
import StudentInput from "@/components/Batch/Forms/FormInputs/StudentInput.vue";
import ProgramInput from "@/components/Batch/Forms/FormInputs/ProgramInput.vue";
import ScheduleInput from "@/components/Batch/Forms/FormInputs/ScheduleInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useBatchProcessingStore } from "../../../store/modules/batchprocessing";
import { mapActions, mapState } from "pinia";
export default {
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      getBatchRequest: {
        hasAtLeastOneGroupValue: helpers.withMessage(
          "Must contain at least one " + this.getGroup,
          (value) => {
            if (this.getBatchRequest) {
              let isValid = false;
              if (
                this.getGroup &&
                [
                  "Student",
                  "School",
                  "School Category",
                  "Program",
                  "Psi",
                ].includes(this.getGroup)
              ) {
                if (this.getGroup === "School") {
                  isValid =
                    this.getBatchRequest.schoolOfRecords &&
                    this.getBatchRequest.schoolOfRecords.length > 0;
                } else if (this.getGroup === "Student") {
                  isValid = getBatchRequest.psi;
                  this.getBatchRequest.students &&
                    this.getBatchRequest.students.length > 0;
                } else if (this.getGroup === "School Category") {
                  isValid =
                    this.getBatchRequest.districts &&
                    this.getBatchRequest.districts.length > 0;
                } else if (this.getGroup === "Program") {
                  isValid =
                    this.getBatchRequest.programs &&
                    this.getBatchRequest.programs.length > 0;
                } else if (this.getGroup === "Psi") {
                  isValid =
                    this.getBatchRequest.psi &&
                    this.getBatchRequest.psi.length > 0;
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
      getBatchSchedule: {
        hasAtLeastOneGroupValue: helpers.withMessage(
          "Must contain at least one " + this.getGroup,
          (value) => {
            if (this.getBatchRequest) {
              let isValid = false;
              if (
                this.getGroup &&
                [
                  "Student",
                  "School",
                  "School Category",
                  "Program",
                  "Psi",
                ].includes(this.getGroup)
              ) {
                if (this.getGroup === "School") {
                  isValid =
                    this.getBatchRequest.schoolOfRecords &&
                    this.getBatchRequest.schoolOfRecords.length > 0;
                } else if (this.getGroup === "Student") {
                  isValid = getBatchRequest.psi;
                  this.getBatchRequest.students &&
                    this.getBatchRequest.students.length > 0;
                } else if (this.getGroup === "School Category") {
                  isValid =
                    this.getBatchRequest.districts &&
                    this.getBatchRequest.districts.length > 0;
                } else if (this.getGroup === "Program") {
                  isValid =
                    this.getBatchRequest.programs &&
                    this.getBatchRequest.programs.length > 0;
                } else if (this.getGroup === "Psi") {
                  isValid =
                    this.getBatchRequest.psi &&
                    this.getBatchRequest.psi.length > 0;
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
    groupSelected: "",
  }),
  computed: {
    ...mapState(useBatchProcessingStore, [
      "getBatchRequest",
      "getGroup",
      "getDistricts",
      "getSchools",
      "getPSI",
      "getPrograms",
    ]),
  },
  methods: {
    ...mapActions(useBatchProcessingStore, [
      "clearBatchDetails",
      "clearBatchGroupData",
      "setGroup",
    ]),
    submit() {},
    cancel() {
      this.clearBatchDetails();
      this.dialog = false;
      console.log("CLEARING BATCH");
    },
    changeStep(step) {
      this.step = step;
    },
  },
};
</script>
