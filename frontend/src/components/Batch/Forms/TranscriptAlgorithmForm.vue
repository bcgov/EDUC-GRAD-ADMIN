<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"> + </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-stepper
              :items="[
                'Initialize',
                'Credential Type',
                'Group',
                'Extra',
                'Schedule',
              ]"
            >
              <template v-slot:item.1> User Request Distribution Run </template>
              <template v-slot:item.2>
                Credential Type
                <v-select
                  v-model="credentialTypeSelected"
                  :items="options"
                  label="Choose..."
                  class="custom-select mb-2 mr-sm-2 mb-sm-0 col-12"
                  id="inline-form-select-audience"
                ></v-select>
              </template>
              <template v-slot:item.3>
                {{ credentialTypeSelected }}
                <v-row>
                  <v-select
                    v-if="credentialTypeSelected == 'RC'"
                    v-model="groupSelected"
                    :items="['School', 'Ministry of Advanced Education']"
                    label="Select Option"
                  ></v-select>
                  <v-select
                    v-else
                    v-model="groupSelected"
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
              </template>
              <template v-slot:item.4>
                <v-card title="Group" flat>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          label="Legal first name*"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          label="Legal middle name"
                          hint="example of helper text only on focus"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          label="Legal last name*"
                          hint="example of persistent helper text"
                          persistent-hint
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field label="Email*" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          label="Password*"
                          type="password"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          :items="['0-17', '18-29', '30-54', '54+']"
                          label="Age*"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-autocomplete
                          :items="[
                            'Skiing',
                            'Ice hockey',
                            'Soccer',
                            'Basketball',
                            'Hockey',
                            'Reading',
                            'Writing',
                            'Coding',
                            'Basejump',
                          ]"
                          label="Interests"
                          multiple
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </template>

              <template v-slot:item.5>
                <v-card title="Schedule" flat>
                  <ScheduleInput></ScheduleInput>
                </v-card>
              </template>
            </v-stepper>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="submit">
            Submit
          </v-btn>
        </v-card-actions>
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
export default {
  components: {
    SchoolInput: SchoolInput,
    DistrictInput: DistrictInput,
    StudentInput: StudentInput,
    ProgramInput: ProgramInput,
    ScheduleInput: ScheduleInput,
  },
  data: () => ({
    dialog: false,
    groupSelected: "",
    credentialTypeSelected: null,
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
  methods: {
    submit() {},
    cancel() {
      this.dialog = false;
    },
  },
};
</script>
