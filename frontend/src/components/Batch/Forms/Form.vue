<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"> + </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">User Request Distribution Run</span>
        </v-card-title>
        <v-card-text>
          {{ getBatchRequest }}
          <v-container>
            <v-stepper alt-labels show-actions v-model="step">
              <template v-slot:default="{ prev, next }">
                <v-stepper-header>
                  <v-stepper-item
                    :rules="[
                      () => !v$.getBatchRequest.credentialTypeSelected.$invalid,
                    ]"
                    complete
                    editable
                    title="Credential Type"
                    value="1"
                  ></v-stepper-item>

                  <v-divider></v-divider>
                  <v-stepper-item
                    :rules="[
                      () =>
                        !v$.getBatchRequest.hasAtLeastOneGroupValue.$invalid,
                    ]"
                    complete
                    editable
                    title="Group"
                    value="2"
                  ></v-stepper-item>
                  <v-stepper-item
                    complete
                    editable
                    title="Distribution"
                    value="3"
                  ></v-stepper-item>
                  <v-stepper-item
                    complete
                    editable
                    title="Run/Schedule"
                    value="4"
                  ></v-stepper-item>
                </v-stepper-header>

                <v-stepper-window>
                  <v-stepper-window-item value="1">
                    Credential Type
                    <v-select
                      v-model="credentialType"
                      :items="options"
                      label="Choose..."
                      class=""
                      id=""
                    ></v-select>
                    <div v-if="credentialType == 'Blank transcript print'">
                      {{ blankTranscriptDetails }}
                      <v-checkbox
                        v-for="(option, index) in transcriptTypes"
                        :key="index"
                        :label="option.description"
                        :value="option.code"
                        v-model="blankTranscriptDetails"
                      ></v-checkbox>
                    </div>
                    <div v-if="credentialType == 'Blank certificate print'">
                      {{ blankCertificateDetails }}
                      <v-checkbox
                        v-for="(option, index) in certificateTypes"
                        :key="index"
                        :label="option.description"
                        :value="option.code"
                        v-model="blankCertificateDetails"
                      ></v-checkbox>
                    </div>
                  </v-stepper-window-item>
                  <v-stepper-window-item value="2">
                    <v-row>
                      <v-col md="2">
                        <label class="font-weight-bold">Group</label>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-select
                          v-if="
                            credentialType != 'Blank certificate print' &&
                            credentialType != 'Blank transcript print'
                          "
                          v-model="group"
                          :items="[
                            'Student',
                            'School',
                            'School Category',
                            'Program',
                            'PSI',
                          ]"
                          label="Select a group"
                        ></v-select>

                        <v-select
                          v-else-if="!blankCertificateDetails.includes('A')"
                          v-model="group"
                          :items="[
                            'School',
                            'Ministry of Education Advanced Education ',
                          ]"
                          label="Select a group"
                        ></v-select>
                        <v-select
                          v-else-if="blankTranscriptDetails.includes('A')"
                          v-model="group"
                          :items="[
                            'School',
                            'Ministry of Education Advanced Education',
                          ]"
                          label="Select a group"
                        ></v-select>
                      </v-col>
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
                  <v-stepper-window-item value="3">
                    <DistributionInput></DistributionInput>
                  </v-stepper-window-item>
                  <v-stepper-window-item value="4">
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
                      <v-btn
                        @click="
                          changeStep(0);
                          setBatchRunType('DISTRUNUSER');
                        "
                        >Edit</v-btn
                      >

                      <ScheduleInput></ScheduleInput>
                      {{ v$ }}
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
            v-if="getBatchRequest.localDownload == 'Y'"
            color="blue-darken-1"
            variant="text"
            @click="submit"
          >
            Download
          </v-btn>
          <v-btn v-else color="blue-darken-1" variant="text" @click="submit">
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
import GraduationReportService from "@/services/GraduationReportService.js";
import DistributionInput from "@/components/Batch/Forms/FormInputs/DistributionInput.vue";
import { useBatchProcessingStore } from "../../../store/modules/batchprocessing";
import { useBatchRequestFormStore } from "../../../store/modules/batchRequestFormStore";
import { mapActions, mapState } from "pinia";
import BatchProcessingService from "@/services/BatchProcessingService.js";
export default {
  components: {
    SchoolInput: SchoolInput,
    DistrictInput: DistrictInput,
    StudentInput: StudentInput,
    ProgramInput: ProgramInput,
    ScheduleInput: ScheduleInput,
    DistributionInput: DistributionInput,
  },

  setup() {
    const batchProcessingStore = useBatchProcessingStore();
    const batchRequestFormStore = useBatchRequestFormStore();
    const notifications = ref(null);
    const activeTab = ref(batchProcessingStore.activeTab);
    watch(activeTab, (newValue) => {
      batchProcessingStore.activeTab = newValue;
    });
    const changeTab = (tabName) => {
      activeTab.value = tabName;
    };

    const group = ref(batchRequestFormStore.who);

    const blankCertificateDetails = ref(
      batchRequestFormStore.blankCertificateDetails
    );

    const blankTranscriptDetails = ref(
      batchRequestFormStore.blankTranscriptDetails
    );

    const credentialType = ref(batchRequestFormStore.credential);

    watch(blankCertificateDetails, (newValue) => {
      console.log("BC update");
      batchRequestFormStore.blankCertificateDetails = newValue;
    });

    watch(blankTranscriptDetails, (newValue) => {
      console.log("BT UPDATE");
      batchRequestFormStore.blankTranscriptDetails = newValue;
    });

    watch(credentialType, (newValue, oldValue) => {
      if (newValue !== oldValue) {
        console.log("update credential");
        batchRequestFormStore.updateCredential(newValue);
      }
    });

    watch(group, (newValue) => {
      batchRequestFormStore.who = newValue;
    });

    return {
      activeTab,
      blankCertificateDetails,
      blankTranscriptDetails,
      credentialType,
      group,
      notifications,
      changeTab,
      v$: useVuelidate(),
    };
  },
  created() {
    this.transcriptTypes = this.getTranscriptTypes();
    this.certificateTypes = this.getCertificateTypes();
  },
  validations() {
    return {
      getBatchRequest: {
        batchRunTimeSet: helpers.withMessage("Runtime not set", (value) => {
          console.log("VALIDATE" + this.getBatchRunTime);
          if (this.getBatchRunTime) {
            return true;
          } else return false;
        }),
        credentialTypeSelected: helpers.withMessage(
          "Runtime not set",
          (value) => {
            if (this.credentialType) {
              console.log(this.credentialType);
              if (this.credentialType == "Blank certificate print") {
                if (
                  this.blankCertificateDetails &&
                  this.blankCertificateDetails.length == 0
                ) {
                  return false;
                }
              }
              if (this.credentialType == "Blank transcript print") {
                if (
                  this.blankTranscriptDetails &&
                  this.blankTranscriptDetails.length == 0
                ) {
                  return false;
                }
              }

              return true;
            } else return false;
          }
        ),

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
  data: () => ({
    step: 0,
    dialog: false,
    groupSelected: "",
    transcriptTypes: [],
    certificateTypes: [],
    options: [
      { title: "Blank certificate print", value: "Blank certificate print" },
      {
        title: "Reprint certificate – no principal signature block",
        value: "RC",
      },
      {
        title:
          "Original certificate (includes transcript) – with principal signature block",
        value: "OC",
      },
      { title: "Blank transcript print", value: "Blank transcript print" },
      { title: "Transcript", value: "OT" },
    ],
  }),
  computed: {
    ...mapState(useBatchRequestFormStore, [
      "getBatchRequest",
      "getBatchRunTime",
      "getBatchRequestCrontime",
      "getBlankCertificateDetails",
      "getBlankTranscriptDetails",
    ]),
  },
  methods: {
    ...mapActions(useBatchRequestFormStore, [
      "clearBatchDetails",
      "clearBatchGroupData",
      "setBatchRunType",
    ]),
    getTranscriptTypes() {
      GraduationReportService.getTranscriptTypes()
        .then((response) => {
          this.transcriptTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          if (error.response.statusText) {
            this.makeToast("ERROR " + error.response.statusText, "danger");
          } else {
            this.makeToast("ERROR " + "error with webservervice", "danger");
          }
        });
    },
    getCertificateTypes() {
      GraduationReportService.getCertificateTypes()
        .then((response) => {
          this.certificateTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          if (error.response.statusText) {
            this.makeToast("ERROR " + error.response.statusText, "danger");
          } else {
            this.makeToast("ERROR " + "error with webservervice", "danger");
          }
        });
    },
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
        let response = await BatchProcessingService.runDISTRUNUSER(
          this.getBatchRequest,
          this.credentialType,
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
