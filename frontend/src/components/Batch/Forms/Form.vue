<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"> Open Dialog </v-btn>
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
                  v-model="selectedOption"
                  :items="options"
                  label="Choose..."
                  class="custom-select mb-2 mr-sm-2 mb-sm-0 col-12"
                  id="inline-form-select-audience"
                ></v-select>
              </template>
              <template v-slot:item.3> <SchoolInput></SchoolInput></template>
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
                  <div
                    class="modal-body"
                    id="batch-modal-job-1___BV_modal_body_"
                  >
                    <div data-v-903f8855="">
                      <!---->
                      <ul>
                        <li>
                          <strong>Run Type: </strong>Transcript Verification
                          Report
                        </li>
                        <li><strong>Copies: </strong>1</li>
                        <li><strong>Group: </strong>School</li>
                        <!---->
                        <ul>
                          <li>
                            <strong>Select Students: </strong>Current Students
                          </li>
                          <!---->
                          <li>
                            <strong>School(s): </strong>
                            <div class="list-item-comma">04343000</div>
                            <div class="list-item-comma"></div>
                          </li>
                          <!----><!----><!---->
                          <ul>
                            <!----><!---->
                          </ul>
                          <!----><!----><!---->
                        </ul>
                        <!---->
                      </ul>
                    </div>
                    <fieldset
                      data-v-903f8855=""
                      class="form-group"
                      id="__BVID__467"
                    >
                      <legend
                        tabindex="-1"
                        class="bv-no-focus-ring col-form-label pt-0"
                        id="__BVID__467__BV_label_"
                      >
                        Batch Run
                      </legend>
                      <div>
                        <div
                          data-v-903f8855=""
                          class="bv-no-focus-ring"
                          role="radiogroup"
                          tabindex="-1"
                          id="__BVID__468"
                        >
                          <div
                            data-v-903f8855=""
                            class="custom-control custom-control-inline custom-radio"
                          >
                            <input
                              class="custom-control-input"
                              type="radio"
                              value="Run Now"
                              id="__BVID__469"
                              name="__BVID__468"
                            /><label
                              class="custom-control-label"
                              for="__BVID__469"
                              >Run Now</label
                            >
                          </div>
                          <div
                            data-v-903f8855=""
                            class="custom-control custom-control-inline custom-radio"
                          >
                            <input
                              class="custom-control-input"
                              type="radio"
                              value="Run Later"
                              id="__BVID__470"
                              name="__BVID__468"
                            /><label
                              class="custom-control-label"
                              for="__BVID__470"
                              >Run Later</label
                            >
                          </div>
                        </div>
                        <fieldset
                          data-v-903f8855=""
                          class="form-group"
                          id="__BVID__476"
                        >
                          <legend
                            tabindex="-1"
                            class="bv-no-focus-ring col-form-label pt-0"
                            id="__BVID__476__BV_label_"
                          >
                            Schedule
                          </legend>
                          <div>
                            <div
                              data-v-903f8855=""
                              class="custom-control custom-radio"
                            >
                              <input
                                class="custom-control-input"
                                type="radio"
                                name="schedule-options"
                                value="N"
                                id="__BVID__477"
                              /><label
                                class="custom-control-label"
                                for="__BVID__477"
                                >Tonight at 6:30PM</label
                              >
                            </div>
                            <div
                              data-v-903f8855=""
                              class="custom-control custom-radio"
                            >
                              <input
                                class="custom-control-input"
                                type="radio"
                                name="schedule-options"
                                value="W"
                                id="__BVID__478"
                              /><label
                                class="custom-control-label"
                                for="__BVID__478"
                                >Weekend Batch - Saturday 12:00PM</label
                              >
                            </div>
                            <div
                              data-v-903f8855=""
                              class="custom-control custom-radio"
                            >
                              <input
                                class="custom-control-input"
                                type="radio"
                                name="schedule-options"
                                value="M"
                                id="__BVID__479"
                              /><label
                                class="custom-control-label"
                                for="__BVID__479"
                                >Tomorrow at 6:30AM</label
                              >
                            </div>
                            <div
                              data-v-903f8855=""
                              class="custom-control custom-radio"
                            >
                              <input
                                class="custom-control-input"
                                type="radio"
                                name="schedule-options"
                                value="Custom"
                                id="__BVID__480"
                              /><label
                                class="custom-control-label"
                                for="__BVID__480"
                                >Custom</label
                              >
                            </div>
                            <!----><!----><!----><!---->
                          </div>
                        </fieldset>
                        <!----><!----><!---->
                      </div>
                    </fieldset>
                  </div>
                </v-card>
              </template>
            </v-stepper>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import SchoolInput from "@/components/Batch/Forms/FormInputs/SchoolInput.vue";
export default {
  components: {
    SchoolInput: SchoolInput,
  },
  data: () => ({
    dialog: false,
    selectedOption: null,
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
};
</script>
