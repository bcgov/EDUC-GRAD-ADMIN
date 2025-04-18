<template>
  <div>
    <v-row>
      <v-col md="2">
        <label class="font-weight-bold">Select Students</label>
      </v-col>
      <v-col md="10">
        <v-select
          v-model="includeStudents"
          variant="outlined"
          :items="['Current Students', 'Date Range']"
          label="Select which students to include"
          class=""
          hide-details
          @change="handleStudentSelectionChange"
        ></v-select>
        <v-row v-if="includeStudents === 'Date Range'">
          <v-col sm="6">
            <v-text-field
              variant="outlined"
              label="Graduation Date From:"
              class="mt-4"
              id="datepicker-birthdate-from"
              v-model="gradDateFrom"
              type="date"
              placeholder="YYYY-MM-DD"
              max="9999-12-30"
              :date-format-options="{ year: '4-digit' }"
              autocomplete="off"
              tabindex="6"
              @blur="validateAndFormatDate('gradDateFrom')"
              @input="debouncedCheckAndConvertDate('from')"
            ></v-text-field>
            <div
              v-if="
                gradDateTo &&
                gradDateFrom &&
                new Date(gradDateFrom) > new Date(gradDateTo)
              "
            >
              <span class="text-red"
                >Start Date cannot be before the end date.</span
              >
            </div>
            <div v-if="v$.gradDateFrom.$invalid && !v$.gradDateFrom.$pending">
              <span class="text-red">Start Date is invalid or required.</span>
            </div>
          </v-col>
          <v-col sm="6">
            <v-text-field
              variant="outlined"
              label="Graduation Date To:"
              class="mt-4"
              id="datepicker-birthdate-from"
              v-model="gradDateTo"
              type="date"
              placeholder="YYYY-MM-DD"
              max="9999-12-30"
              :date-format-options="{ year: '4-digit' }"
              autocomplete="off"
              tabindex="6"
              @blur="validateAndFormatDate('gradDateTo')"
              @input="debouncedCheckAndConvertDate('to')"
            ></v-text-field>

            <div
              v-if="
                gradDateTo &&
                gradDateFrom &&
                new Date(gradDateTo) < new Date(gradDateFrom)
              "
            >
              <span color="red">End Date must be greater than Start Date.</span>
            </div>
            <div v-if="v$.gradDateTo.$invalid && !v$.gradDateTo.$pending">
              <span class="text-red">End Date is invalid or required.</span>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { required, helpers } from "@vuelidate/validators";
import { ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import { useBatchRequestFormStore } from "../../../../store/modules/batchRequestFormStore";
import { debounce } from "lodash";

export default {
  data() {
    return {
      gradDateFrom: "",
      gradDateTo: "",
      includeStudents: "Current Students",
    };
  },
  computed: {
    batchRequestFormStore() {
      return useBatchRequestFormStore();
    },
  },
  validations() {
    return {
      gradDateFrom: {
        required:
          this.includeStudents === "Date Range"
            ? helpers.withMessage("Start Date is required", required)
            : false,
        dateFormat:
          this.includeStudents === "Date Range"
            ? (value) =>
                /^\d{4}-\d{2}-\d{2}$/.test(value) ||
                "Invalid date format (yyyy-mm-dd)"
            : false,
      },
      gradDateTo: {
        required:
          this.includeStudents === "Date Range"
            ? helpers.withMessage("End Date is required", required)
            : false,
        dateFormat:
          this.includeStudents === "Date Range"
            ? (value) =>
                /^\d{4}-\d{2}-\d{2}$/.test(value) ||
                "Invalid date format (yyyy-mm-dd)"
            : false,
      },
    };
  },

  setup() {
    const batchRequestFormStore = useBatchRequestFormStore();
    const gradDateFrom = ref(batchRequestFormStore.gradDateFrom);
    const gradDateTo = ref(batchRequestFormStore.gradDateTo);

    watch(gradDateFrom, (newValue) => {
      batchRequestFormStore.gradDateFrom = newValue;
    });
    watch(gradDateTo, (newValue) => {
      batchRequestFormStore.gradDateTo = newValue;
    });
    return {
      gradDateFrom,
      gradDateTo,
      v$: useVuelidate(),
    };
  },

  watch: {
    includeStudents(newValue) {
      if (newValue === "Current Students") {
        this.clearDateFields();
      }
    },
  },
  methods: {
    clearDateFields() {
      this.gradDateFrom = "";
      this.gradDateTo = "";
      this.batchRequestFormStore.gradDateFrom = "";
      this.batchRequestFormStore.gradDateTo = "";
    },
    validateAndFormatDate(dateRef) {
      if (this[dateRef]) {
        const formatted = this.formatDateString(this[dateRef]);
        this[dateRef] = formatted;
        // Emit updates to the store
        this.batchRequestFormStore[dateRef] = formatted;
      }
    },
    checkAndConvertDate(type) {
      const targetDate = type === "from" ? this.gradDateFrom : this.gradDateTo;

      // Check if the input length is 8
      if (targetDate.length === 8) {
        const year = targetDate.substring(0, 4);
        const month = targetDate.substring(4, 6);
        const day = targetDate.substring(6, 8);
        this[
          type === "from" ? "gradDateFrom" : "gradDateTo"
        ] = `${year}-${month}-${day}`;
        // Emit the change to the store
        if (type === "from") {
          this.batchRequestFormStore.gradDateFrom = this.gradDateFrom;
        } else {
          this.batchRequestFormStore.gradDateTo = this.gradDateTo;
        }
      }
    },
    formatDateString(dateString) {
      const dateParts = dateString.split("-");
      if (dateParts.length === 3) {
        const [year, month, day] = dateParts.map(Number);
        const date = new Date(year, month - 1, day);
        return !isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : "";
      }
      return "";
    },
    handleStudentSelectionChange(newValue) {
      if (newValue === "Current Students") {
        this.clearDateFields();
      }
    },
  },
  mounted() {
    // Debounced version of checkAndConvertDate
    this.debouncedCheckAndConvertDate = debounce(this.checkAndConvertDate, 300); // 300 ms delay
  },
};
</script>

<style scoped>
.text-red {
  color: red;
}
</style>
