<template>
  <v-container>
    <v-row>
      {{ v$ }}
      <br /><br />
      {{ getGroup }}ss
      <div v-if="getGroup === 'School'">
        Schools: {{ getBatchRequest.schoolOfRecords }}
      </div>
      <div v-if="getGroup === 'School Category'">
        Districts: {{ getBatchRequest.districts }}
      </div>
      <div v-if="getGroup === 'Program'">
        Schools: {{ getBatchRequest.programs }}
      </div>
      <div v-if="getGroup === 'PSI'">Schools: {{ getBatchRequest.psis }}</div>
      RUNTIME {{ getBatchRunTime }}<br />

      RUN SCHEDULE {{ batchRunSchedule }}<br />
      CUSTOM DATE {{ batchRunCustomDate }}<br />
      CUSTOM TIME {{ batchRunCustomTime }}<br />
      <v-col cols="12">
        <v-radio-group v-model="batchRunTime">
          <v-radio label="Run Now" value="Run Now"></v-radio>
          <v-radio label="Run Later" value="Run Later"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row v-if="batchRunTime == 'Run Later'">
      <v-col cols="12">
        <v-radio-group v-model="batchRunSchedule">
          <v-radio label="Tonight at 6:30PM" value="N"></v-radio>
          <v-radio label="Weekend Batch - Saturday 12:00PM" value="W"></v-radio>
          <v-radio label="Tomorrow at 6:30AM" value="M"></v-radio>
          <v-radio label="Custom" value="Custom"></v-radio>
          <div v-if="batchRunSchedule == 'Custom'" class="pl-4">
            <v-date-picker
              v-model="batchRunCustomDate"
              label="Choose a date"
            ></v-date-picker>
            <v-time-picker
              v-model="batchRunCustomTime"
              format="ampm"
            ></v-time-picker>
          </div>
        </v-radio-group>
        {{ batchRunSchedule }}
        x{{ batchRunCustomDate }}x
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { isProxy, toRaw, ref, watch } from "vue";
import SchoolService from "@/services/SchoolService.js";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useBatchProcessingStore } from "../../../../store/modules/batchprocessing";
import { mapActions, mapState } from "pinia";

export default {
  components: {},

  setup() {
    const batchProcessingStore = useBatchProcessingStore();

    const batchRunTime = ref(batchProcessingStore.batchRunTime);
    const batchRunSchedule = ref(batchProcessingStore.batchRunSchedule);
    const batchRunCustomDate = ref(batchProcessingStore.batchRunCustomDate);
    const batchRunCustomTime = ref(batchProcessingStore.batchRunCustomTime);

    watch(batchRunTime, (newValue) => {
      batchProcessingStore.batchRunTime = newValue;
    });

    watch(batchRunSchedule, (newValue) => {
      batchProcessingStore.batchRunSchedule = newValue;
    });

    watch(batchRunCustomDate, (newValue) => {
      batchProcessingStore.batchRunCustomDate = newValue;
    });

    watch(batchRunCustomTime, (newValue) => {
      batchProcessingStore.batchRunCustomTime = newValue;
    });

    return {
      batchRunTime,
      batchRunSchedule,
      batchRunCustomDate,
      batchRunCustomTime,
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
              if (this.batchRunCustomDate) {
                return true;
              } else return false;
            } else return true;
          }
        ),
      },
    };
  },
  data() {
    return {};
  },
  beforeMount() {
    // Trigger Vuelidate validations on mount
    console.log("mounted schedule input");
    this.v$.$touch();
  },
  created() {},
  methods: {
    ...mapActions(useBatchProcessingStore, []),
    resetModal() {},
    getCronTime() {
      if (this.getBatchRunSchedule == "N") {
        let today = new Date();
        return (
          "0 30 18 " + today.getDate() + " " + (today.getMonth() + 1) + " *"
        );
      } else if (this.getBatchRunSchedule == "W") {
        const today = new Date();
        const first = today.getDate() - today.getDay() + 1;
        const sixth = first + 5;
        const saturday = new Date(today.setDate(sixth));
        return (
          "0 30 18 " +
          saturday.getDate() +
          " " +
          (saturday.getMonth() + 1) +
          " *"
        );
      } else if (this.getBatchRunSchedule == "M") {
        const today = new Date();
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return (
          "0 30 18 " +
          tomorrow.getDate() +
          " " +
          (tomorrow.getMonth() + 1) +
          " *"
        );
      } else if (this.getBatchRunSchedule == "Custom") {
        let dateTime = new Date(
          this.getBatchRunCustomDate + "T" + this.getBatchRunCustomTime
        );
        return (
          dateTime.getSeconds() +
          " " +
          dateTime.getMinutes() +
          " " +
          dateTime.getHours() +
          " " +
          dateTime.getDate() +
          " " +
          (dateTime.getMonth() + 1) +
          " *"
        );
      } else {
        return null;
      }
    },
  },
  props: {},

  computed: {
    ...mapState(useBatchProcessingStore, [
      "getBatchRequest",
      "getGroup",
      "getBatchRunSchedule",
      "getCronTime",
      "getBatchRunTime",
      "getBatchRunCustomDate",
      "getbatchRunCustomTime",
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
