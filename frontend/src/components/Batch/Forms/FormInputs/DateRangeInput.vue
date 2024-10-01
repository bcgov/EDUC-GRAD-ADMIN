<template>
  <div>
    <v-row>
      <v-col md="2">
        <label class="font-weight-bold">Select Students</label>
      </v-col>
      <v-col md="10">
        <v-select
          v-model="includeStudents"
          :items="['Current Students', 'Date Range']"
          label="Select which students to include"
          class=""
          hide-details
          @change="handleStudentSelectionChange"
        ></v-select>
        <v-row v-if="includeStudents === 'Date Range'">
          <v-col sm="6">
            <v-text-field
              v-model="gradDateFrom"
              label="Graduation Date From:"
              placeholder="yyyy-mm-dd"
              @blur="validateAndFormatDate(gradDateFrom, 'gradDateFrom')"
              @input="debouncedCheckAndConvertDate('from')"
            ></v-text-field>
            <div v-if="v$.gradDateFrom.$invalid && !v$.gradDateFrom.$pending">
              <span class="text-red">Start Date is invalid or required.</span>
            </div>
          </v-col>
          <v-col sm="6">
            <v-text-field
              v-model="gradDateTo"
              label="Graduation Date To:"
              placeholder="yyyy-mm-dd"
              @blur="validateAndFormatDate(gradDateTo, 'gradDateTo')"
              @input="debouncedCheckAndConvertDate('to')"
            ></v-text-field>
            <div
              v-if="
                gradDateTo &&
                gradDateFrom &&
                new Date(gradDateTo) < new Date(gradDateFrom)
              "
            >
              <span class="text-red"
                >End Date must be greater than Start Date.</span
              >
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
import { ref, watch, defineComponent } from "vue";
import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useBatchRequestFormStore } from "../../../../store/modules/batchRequestFormStore";
import { debounce } from "lodash";

const formatDateString = (dateString) => {
  const dateParts = dateString.split("-");
  if (dateParts.length === 3) {
    const [year, month, day] = dateParts.map(Number);
    const date = new Date(year, month - 1, day);
    return !isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : "";
  }
  return "";
};

export default defineComponent({
  setup() {
    const batchRequestFormStore = useBatchRequestFormStore();

    // Reactive references from the store
    const gradDateFrom = ref(batchRequestFormStore.gradDateFrom);
    const gradDateTo = ref(batchRequestFormStore.gradDateTo);

    const rules = {
      gradDateFrom: {
        required: helpers.withMessage("Start Date is required", required),
        dateFormat: (value) =>
          /^\d{4}-\d{2}-\d{2}$/.test(value) ||
          "Invalid date format (yyyy-mm-dd)",
      },
      gradDateTo: {
        required: helpers.withMessage("End Date is required", required),
        dateFormat: (value) =>
          /^\d{4}-\d{2}-\d{2}$/.test(value) ||
          "Invalid date format (yyyy-mm-dd)",
      },
    };

    const v$ = useVuelidate(rules, { gradDateFrom, gradDateTo });

    const validateAndFormatDate = (dateRef, emitKey) => {
      if (dateRef.value) {
        const formatted = formatDateString(dateRef.value);
        dateRef.value = formatted;
        // Emit updates to the store
        batchRequestFormStore[emitKey] = formatted;
      }
    };

    const checkAndConvertDate = (type) => {
      const targetDate = type === "from" ? gradDateFrom : gradDateTo;

      // Check if the input length is 8
      if (targetDate.value.length === 8) {
        const year = targetDate.value.substring(0, 4);
        const month = targetDate.value.substring(4, 6);
        const day = targetDate.value.substring(6, 8);
        targetDate.value = `${year}-${month}-${day}`;
        // Emit the change to the store
        if (type === "from") {
          batchRequestFormStore.gradDateFrom = targetDate.value;
        } else {
          batchRequestFormStore.gradDateTo = targetDate.value;
        }
      }
    };

    // Create a debounced version of checkAndConvertDate
    const debouncedCheckAndConvertDate = debounce(checkAndConvertDate, 300); // 300 ms delay
    const handleStudentSelectionChange = (newValue) => {
      console.log("Student selection changed:", newValue);
      if (newValue === "Current Students") {
        console.log("Clearing gradDateFrom and gradDateTo");
        gradDateFrom.value = ""; // Clear local ref
        gradDateTo.value = ""; // Clear local ref
        // Update the store
        batchRequestFormStore.gradDateFrom = "";
        batchRequestFormStore.gradDateTo = "";
      }
    };
    // Watch for store updates to keep component state in sync
    watch(
      () => batchRequestFormStore.gradDateFrom,
      (newValue) => {
        gradDateFrom.value = newValue;
      }
    );

    watch(
      () => batchRequestFormStore.gradDateTo,
      (newValue) => {
        gradDateTo.value = newValue;
      }
    );

    return {
      gradDateFrom,
      gradDateTo,
      v$,
      validateAndFormatDate,
      debouncedCheckAndConvertDate,
      handleStudentSelectionChange,
    };
  },
  data() {
    return {
      includeStudents: "Current Students",
    };
  },
});
</script>

<style scoped>
.text-red {
  color: red;
}
</style>
