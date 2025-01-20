<template>
  <v-alert v-if="warning" type="info" dense text border="left" color="orange">
    {{ warning }}
  </v-alert>
  <v-card title="Batch Details" class="">
    <v-card-text>
      <slot name="batchDetails"></slot>
    </v-card-text>
  </v-card>
  <v-card
    v-if="!hideGroup"
    :title="getGroup ? 'Group - ' + getGroup : 'Group - Not Selected'"
    class=""
  >
    <v-card-text>
      <v-row
        class="pl-3"
        v-if="getBatchRequest.gradDateFrom && getBatchRequest.gradDateTo"
      >
        <v-col>
          <ul>
            <li>Grad Start Date: {{ getBatchRequest.gradDateFrom }}</li>
            <li>Grad End Date: {{ getBatchRequest.gradDateTo }}</li>
          </ul>
        </v-col>
      </v-row>

      <!-- Group-specific details -->
      <div v-if="getGroup == 'School'">
        <v-data-table
          :items="getGroupData"
          :headers="[
            { text: 'Mincode', value: 'mincode' },
            { text: 'School', value: 'info.schoolName' },
            { text: 'displayName', value: 'info.displayName' },
          ]"
          hide-default-header
          hide-default-footer
          ><template #no-data>
            At least one school must be selected
          </template></v-data-table
        >
      </div>

      <div v-if="getGroup == 'School Category'">
        <div
          v-if="
            getBatchRequest.schoolCategoryCodes &&
            getBatchRequest.schoolCategoryCodes.length
          "
        >
          School Category: {{ getBatchRequest.schoolCategoryCodes }}
        </div>
        <v-data-table
          :items="getGroupData"
          :headers="[
            { text: 'District', value: 'district' },
            { text: 'District Name', value: 'info.districtName' },
          ]"
          hide-default-header
          hide-default-footer
          ><template #no-data>
            At least one school category must be selected
          </template></v-data-table
        >
      </div>
      <div v-if="getGroup == 'Student'">
        <v-data-table
          :items="getGroupData"
          :headers="[
            { title: 'Pen', value: 'pen' },
            { title: 'Student Name', value: 'name' },
            { title: 'DOB', value: 'info.dob' },
            { title: 'status', value: 'info.status' },
          ]"
          hide-default-footer
        >
          <template #item.name="{ item }">
            {{ item.info.firstName }} {{ item.info.lastName }}
          </template>
          <template #no-data>
            At least one student must be selected
          </template></v-data-table
        >
      </div>
      <div v-if="getGroup == 'Program'">
        <v-data-table
          :items="getGroupData"
          :headers="[
            { text: 'Program', value: 'program' },
            { text: 'Program Name', value: 'info' },
          ]"
          hide-default-header
          hide-default-footer
          ><template #no-data>
            At least one program must be selected
          </template></v-data-table
        >
      </div>
      <div v-if="getGroup === 'Psi'">
        <v-data-table
          :items="getGroupData"
          hide-default-header
          hide-default-footer
        >
          <template #item="{ item }">
            <tr>
              <td>{{ item.info.psiCode }} ({{ item.info.psiName }})</td>
            </tr>
          </template>

          <template #no-data>
            <div class="d-flex align-start text-left">
              At least one post secondary institute must be selected
            </div>
          </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>

  <slot name="confirmations"></slot>

  <v-card title="Select Batch Run Time" class="">
    <div>
      <v-radio-group v-model="batchRunTime">
        <v-radio label="Run Now" value="Run Now"></v-radio>
        <v-radio label="Run Later" value="Run Later"></v-radio>
      </v-radio-group>
    </div>
    <v-row v-if="batchRunTime == 'Run Later'">
      <v-col cols="12">
        <v-radio-group v-model="batchRunSchedule">
          <label>Time to schedule</label>
          <v-radio label="Tonight at 6:30PM" value="N"></v-radio>
          <v-radio label="Weekend Batch - Saturday 12:00PM" value="W"></v-radio>
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
          </v-row>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-card>

  <div>
    <ul>
      <li v-for="(error, index) in v$.$silentErrors" :key="index">
        {{ error.$message }}
      </li>
    </ul>
  </div>
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
        required: helpers.withMessage("Select a run time", required),
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
  props: {
    // Define the warning prop
    warning: {
      type: String, // You can change the type if needed
      required: false, // Make it optional
    },
    hideGroup: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

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
      "getDistribution",
    ]),
  },
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
</style>
