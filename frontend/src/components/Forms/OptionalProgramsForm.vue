<!-- CreateOptionalProgramDialog.vue -->
<template>
  <v-dialog
    v-model="dialog"
    @click:outside="closeCreateOptionalProgramDialog"
    max-width="500px"
  >
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="NewOptionalProgram"> </v-btn>
    </template>

    <v-card>
      <v-card-title> Add Optional Program </v-card-title>
      <v-card-text>
        {{ careerProgramCodeSelect }}
        Student Program {{ studentProgramId }}
        <v-form @submit.prevent="submitForm">
          <!-- Program Name Input -->
          <v-autocomplete
            v-model="optionalProgramCodeSelect"
            :items="activeOptionalPrograms"
            :item-title="optionalProgramTitle"
            item-value="optionalProgramID"
            label="Choose an Optional Program to add"
            required
            @keyup.enter="submitForm"
          >
          </v-autocomplete>
          <v-autocomplete
            multiple
            clearable
            chips
            v-if="isCareerProgram(optionalProgramCodeSelect)"
            v-model="careerProgramCodeSelect"
            :items="careerProgramList"
            item-title="name"
            item-value="code"
            label="Choose an Optional Program to add"
            required
            @keyup.enter="submitForm"
          ></v-autocomplete>

          <!-- Other form fields go here -->

          <!-- Submit Button -->
          <v-btn type="submit" color="primary">Submit</v-btn>
        </v-form>
      </v-card-text>
      <template v-slot:actions>
        <v-row justify="end">
          <!-- Use v-btn with @click to close the dialog -->
          <v-btn @click="closeCreateOptionalProgramDialog" color="secondary"
            >Close</v-btn
          >
        </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import ProgramManagementService from "@/services/ProgramManagementService.js";
import { useStudentStore } from "../../store/modules/student";
import { mapActions, mapState } from "pinia";
export default {
  watch: {
    optionalProgramCodeSelect(newVal) {
      // The function to be executed when isCareerProgram changes
      if (!this.isCareerProgram(newVal)) {
        this.clearCareerPrograms();
      }
    },
  },
  mounted() {
    this.fetchPrograms();
  },
  computed: {
    activeOptionalPrograms() {
      const studentProgramId = this.studentProgramId;

      const currentDate = new Date().toISOString().split("T")[0];
      return this.optionalProgramList.filter((item) => {
        let effectiveDateUTC = null;
        let expiryDateUTC = null;
        if (item.effectiveDate) {
          effectiveDateUTC = new Date(item.effectiveDate)
            .toISOString()
            .split("T")[0];
        }
        if (item.expiryDate) {
          expiryDateUTC = new Date(item.expiryDate).toISOString().split("T")[0];
        }

        return (
          item.graduationProgramCode === studentProgramId &&
          effectiveDateUTC <= currentDate &&
          (expiryDateUTC == null || currentDate <= expiryDateUTC)
        );
      });
    },
  },
  data() {
    return {
      dialog: false,
      optionalProgramList: [],
      careerProgramList: [],
      optionalProgramCodeSelect: "",
      careerProgramCodeSelect: "",
      // Add other data properties as needed
    };
  },
  props: {
    studentProgramId: {
      type: String,
      default: "",
    },
  },
  create() {
    console.log("OP created");
  },
  methods: {
    isCareerProgram(optionalProgramID) {
      const activeProgram = this.activeOptionalPrograms.find(
        (program) => program.optionalProgramID === optionalProgramID
      );

      return activeProgram && activeProgram.optProgramCode === "CP";
    },
    clearCareerPrograms() {
      this.careerProgramCodeSelect = [];
    },
    optionalProgramTitle(item) {
      if (item) {
        return `${item.graduationProgramCode} - ${item.optionalProgramName}`;
      } else return "";
    },
    ...mapActions(useStudentStore, ["addStudentOptionalProgram"]),
    async fetchPrograms() {
      try {
        const response = await ProgramManagementService.getOptionalPrograms();
        this.optionalProgramList = response.data;
      } catch (error) {
        console.error("Error fetching optional programs:", error);
      }
      try {
        const response = await ProgramManagementService.getCareerPrograms();
        this.careerProgramList = response.data;
      } catch (error) {
        console.error("Error fetching optional programs:", error);
      }
    },
    openCreateOptionalProgramDialog() {
      this.clearForm();
      this.dialog = true;
    },
    closeCreateOptionalProgramDialog() {
      this.clearForm();
      this.dialog = false;
    },
    clearForm() {
      console.log("form cleared");
      this.optionalProgramCodeSelect = "";
      this.careerProgramCodeSelect = "";
    },
    submitForm() {
      this.addStudentOptionalProgram(
        this.optionalProgramCodeSelect,
        this.careerProgramCodeSelect
      );
      this.closeCreateOptionalProgramDialog();
    },
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
