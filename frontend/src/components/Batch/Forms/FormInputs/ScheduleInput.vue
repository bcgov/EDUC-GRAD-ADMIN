<template>
  <v-container>
    <v-row>
      <v-col sm="12">
        <div v-if="this.group === 'School'">
          <v-data-table :items="getGroupData" :headers="schoolInputFields">
            <template #bottom></template
          ></v-data-table>
        </div>
        <div v-if="this.group === 'School Category'">
          Districts: {{ getBatchRequest.districts }}
        </div>
        <div v-if="this.group === 'Program'">
          Schools: {{ getBatchRequest.programs }}
        </div>
        <div v-if="this.group === 'PSI'">
          Schools: {{ getBatchRequest.psis }}
        </div>
      </v-col>
      <v-col>
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
import { useBatchRequestFormStore } from "../../../../store/modules/batchRequestFormStore";
import { mapActions, mapState } from "pinia";

export default {
  components: {},

  setup() {
    const batchRequestFormStore = useBatchRequestFormStore();
    const group = ref(batchRequestFormStore.who);
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
      group,
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
    return {
      schoolInputFields: [
        {
          key: "mincode",
          title: "Mincode",
          sortable: true,
          class: "text-left",
        },
        {
          key: "info.schoolName",
          title: "School",
          sortable: true,
          class: "text-left",
        },
        {
          key: "remove",
          title: "",
          sortable: true,
          class: "text-left",
        },
      ],
    };
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
      "getGroupData",
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
