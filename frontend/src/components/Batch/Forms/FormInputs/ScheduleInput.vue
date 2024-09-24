<template>
  <v-container>
    <v-row>
      <v-col sm="12">
        <v-card title="Group">
          <v-text>
            <div v-if="getGroup == 'School'">
              <v-data-table
                :items="getGroupData"
                :headers="[
                  {
                    key: 'mincode',
                    title: 'Mincode',
                    sortable: true,
                    class: 'text-left',
                  },
                  {
                    key: 'info.schoolName',
                    title: 'School',
                    sortable: true,
                    class: 'text-left',
                  },
                ]"
              >
                <template #bottom></template
              ></v-data-table>
            </div>
            <div v-if="getGroup == 'School Category'">
              {{ getGroupData }}
              <v-data-table
                :items="getGroupData"
                :headers="[
                  {
                    key: 'district',
                    title: 'District',
                    sortable: true,
                    class: 'text-left',
                  },
                  {
                    key: 'info.districtName',
                    title: 'District Name',
                    sortable: true,
                    class: 'text-left',
                  },
                ]"
              >
                <template #bottom></template
              ></v-data-table>
            </div>
            <div v-if="getGroup == 'Program'">
              <v-data-table
                :items="getGroupData"
                :headers="[
                  {
                    key: 'program',
                    title: 'Program',
                    sortable: true,
                    class: 'text-left',
                  },
                  {
                    key: 'info',
                    title: 'Program Name',
                    sortable: true,
                    class: 'text-left',
                  },
                ]"
              >
                <template #bottom></template
              ></v-data-table>
            </div>
            <div v-if="getGroup == 'PSI'">
              Schools: {{ getBatchRequest.psis }}
            </div>
          </v-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Select Batch Run Time</v-card-title>
          <v-card-text>
            <v-row>
              <v-radio-group v-model="batchRunTime">
                <v-radio label="Run Now" value="Run Now"></v-radio>
                <v-radio label="Run Later" value="Run Later"></v-radio>
              </v-radio-group>
            </v-row>
            <v-row v-if="batchRunTime == 'Run Later'">
              <v-col cols="12">
                <v-radio-group v-model="batchRunSchedule">
                  <label>Time to schedule</label>
                  <v-radio label="Tonight at 6:30PM" value="N"></v-radio>
                  <v-radio
                    label="Weekend Batch - Saturday 12:00PM"
                    value="W"
                  ></v-radio>
                  <v-radio label="Tomorrow at 6:30AM" value="M"></v-radio>
                  <v-radio label="Custom" value="Custom"></v-radio>
                  <v-row v-if="batchRunSchedule == 'Custom'" class="pl-4">
                    <v-col>
                      {{ batchRunCustomDate }}

                      <v-container>
                        <v-date-input label="Date input"></v-date-input>
                      </v-container>
                      <v-date-picker
                        v-model="batchRunCustomDate"
                        label="Choose a date"
                      ></v-date-picker> </v-col
                    ><v-col>
                      {{ batchRunCustomTime }}

                      <VTimePicker format="24hr" v-model="batchRunCustomTime" />
                    </v-col>

                    custom CRONTIME{{ getBatchRequestCrontime }}
                  </v-row>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div>
      <ul>
        <li v-for="(error, index) in v$.$silentErrors" :key="index">
          {{ error.$message }}
        </li>
      </ul>
    </div>
  </v-container>
</template>
<script>
import { isProxy, toRaw, ref, watch } from "vue";
import SchoolService from "@/services/SchoolService.js";
import { VTimePicker } from "vuetify/labs/VTimePicker";
import { useDate } from "vuetify";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useBatchRequestFormStore } from "../../../../store/modules/batchRequestFormStore";
import { mapActions, mapState } from "pinia";

export default {
  components: { VTimePicker },

  setup() {
    const date = useDate();
    const batchRequestFormStore = useBatchRequestFormStore();

    const batchRunTime = ref(batchRequestFormStore.batchRunTime);
    const batchRunSchedule = ref(batchRequestFormStore.batchRunSchedule);
    const batchRunCustomDate = ref(batchRequestFormStore.batchRunCustomDate);
    const batchRunCustomTime = ref(batchRequestFormStore.batchRunCustomTime);

    watch(batchRunTime, (newValue) => {
      batchRequestFormStore.batchRunTime = newValue;
    });

    watch(batchRunSchedule, (newValue) => {
      batchRequestFormStore.batchRunSchedule = newValue;
    });

    watch(batchRunCustomDate, (newValue) => {
      batchRequestFormStore.batchRunCustomDate = newValue;
    });

    watch(batchRunCustomTime, (newValue) => {
      batchRequestFormStore.batchRunCustomTime = newValue;
    });

    return {
      batchRunTime,
      batchRunSchedule,
      batchRunCustomDate,
      batchRunCustomTime,
      date,
      v$: useVuelidate(),
    };
  },

  validations() {
    return {
      batchRunTime: {
        required: helpers.withMessage("This field cannot be empty", required),
        RunLaterScheduleSet: helpers.withMessage(
          "Schedule date and time not set",
          (value) => {
            if (value == "Run Later") {
              if (this.batchRunSchedule) {
                return true;
              } else return false;
            } else return true;
          }
        ),
        batchRunSchedule: helpers.withMessage(
          "Set a Custom Date and time",
          (value) => {
            if (this.batchRunSchedule == "Custom") {
              if (this.batchRunCustomDate && this.batchRunCustomTime) {
                return true;
              } else return false;
            } else return true;
          }
        ),
      },
    };
  },
  data() {
    return {
      time: null,
      menu2: false,
      modal2: false,
    };
  },

  created() {},
  methods: {
    ...mapActions(useBatchRequestFormStore, []),
    resetModal() {},
  },
  props: {},

  computed: {
    ...mapState(useBatchRequestFormStore, [
      "getBatchRequest",
      "getBatchRunSchedule",
      "getBatchRequestCrontime",
      "getBatchRunTime",
      "getBatchRunCustomDate",
      "getbatchRunCustomTime",
      "getGroupData",
      "getGroup",
    ]),
    isEmpty() {
      return this.students.length > 0;
    },
  },
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
</style>
