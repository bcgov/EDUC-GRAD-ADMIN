<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        {{ copies }}
        <v-text-field
          v-model="copies"
          label="Copies"
          type="number"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        {{ distribution }}
        <v-select
          v-model="distribution"
          :items="['Download', 'BC Mail', 'User']"
          label="Select Option"
          require
        ></v-select>
      </v-col>

      <v-col>
        <template #bottom></template>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { isProxy, toRaw, ref, watch } from "vue";
import SchoolService from "@/services/SchoolService.js";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useBatchRequestFormStore } from "../../../../store/modules/batchRequestFormStore";
import { mapActions, mapState } from "pinia";

export default {
  components: {},

  setup() {
    const batchRequestFormStore = useBatchRequestFormStore();

    const batchRunTime = ref(batchRequestFormStore.batchRunTime);
    const batchRunSchedule = ref(batchRequestFormStore.batchRunSchedule);
    const batchRunCustomDate = ref(batchRequestFormStore.batchRunCustomDate);
    const batchRunCustomTime = ref(batchRequestFormStore.batchRunCustomTime);
    const distribution = ref(batchRequestFormStore.distribution);
    const copies = ref(batchRequestFormStore.copies);
    watch(copies, (newValue) => {
      batchRequestFormStore.copies = newValue;
    });
    watch(distribution, (newValue) => {
      batchRequestFormStore.distribution = newValue;
    });
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
      distribution,
      copies,
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

  created() {
    console.log("STEPPER");
  },
  methods: {
    ...mapActions(useBatchRequestFormStore, []),
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
    ...mapState(useBatchRequestFormStore, [
      "getBatchRequest",
      "getBatchRunSchedule",
      "getCronTime",
      "getBatchRunTime",
      "getBatchRunCustomDate",
      "getbatchRunCustomTime",
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
