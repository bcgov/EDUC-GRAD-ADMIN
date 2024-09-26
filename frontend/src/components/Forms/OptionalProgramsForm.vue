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
      <v-stepper :items="['Select Optional Programs', 'Confirmation']">
        <template v-slot:item.1>
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
              :items="activeCareerPrograms"
              :item-title="careerProgramTitle"
              item-value="code"
              label="Choose an Optional Program to add"
              required
              @keyup.enter="submitForm"
            ></v-autocomplete>
          </v-form>
        </template>
        <template v-slot:item.2>
          OPTIONAL PROGRAM:
          <pre>{{ optionalProgramCodeSelect }}</pre>
          CAREER PROGRAM:
          <pre>{{ careerProgramCodeSelect }}</pre>
        </template>
      </v-stepper>
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
// API service
import ProgramManagementService from "@/services/ProgramManagementService.js";

// Shared functions & validations
import { isProgramComplete, applyDisplayOrder } from "@/utils/common.js";

// Pinia store
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
    ...mapState(useStudentStore, {
      studentOptionalPrograms: "getStudentOptionalPrograms",
      studentCareerPrograms: "getStudentCareerPrograms",
      studentGradStatus: "getStudentGradStatus",
    }),
    activeOptionalPrograms() {
      const studentProgramId = this.studentProgramId;

      const currentDate = new Date().toISOString().split("T")[0];
      return applyDisplayOrder(
        this.optionalProgramList
          ?.filter((item) => {
            return item.graduationProgramCode === studentProgramId;
          })
          ?.filter((activeOptionalProgram) => {
            // If student optional programs exist, filter out existing programs. Otherwise returns all possible opt programs for grad program
            if (
              !!this.studentOptionalPrograms &&
              this.studentOptionalPrograms.length > 0
            ) {
              return !this.studentOptionalPrograms.some(
                (studentOptionalProgram) =>
                  studentOptionalProgram.optionalProgramID ==
                    activeOptionalProgram.optionalProgramID &&
                  studentOptionalProgram.optionalProgramCode !== "CP"
              );
            } else {
              return true;
            }
          })
      );
    },
    activeCareerPrograms() {
      return applyDisplayOrder(
        this.careerProgramList?.filter(
          (activeCareerProgram) =>
            !this.studentCareerPrograms.some(
              (studentCareerProgram) =>
                studentCareerProgram.careerProgramCode ==
                activeCareerProgram.code
            )
        )
        // ?.filter(
        //   (activeCareerProgram) =>
        //     !this.careerProgramsToAdd.some(
        //       (careerProgram) => careerProgram == activeCareerProgram.code
        //     )
        // )
      );
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
    careerProgramTitle(item) {
      if (item) {
        return `${item.code} - ${item.name}`;
      }
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
