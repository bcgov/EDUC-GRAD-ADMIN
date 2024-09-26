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
          {{ selectedCareerPrograms }}
          Student Program {{ studentProgramId }}
          <v-form @submit.prevent="submitForm">
            <!-- Program Name Input -->
            <v-autocomplete
              v-model="selectedOptionalProgram"
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
              v-if="isCareerProgram(selectedOptionalProgram)"
              v-model="selectedCareerPrograms"
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
          <slot name="text">
            <p>
              You are about to add the
              <strong>
                {{
                  getOptionalProgramByID(selectedOptionalProgram)
                    .optionalProgramName
                }}
                ({{
                  getOptionalProgramByID(selectedOptionalProgram)
                    .optProgramCode
                }})
              </strong>
              Optional Program
              {{
                isCareerProgram(selectedOptionalProgram)
                  ? "with the following Career Programs"
                  : ""
              }}
              for this student.
            </p>

            <ul v-if="isCareerProgram(selectedOptionalProgram)">
              <li
                v-for="item in selectedCareerPrograms"
                :key="item"
                class="my-1"
              >
                {{ item }} - {{ getCareerProgramByCode(item).name }}
              </li>
            </ul>
          </slot>
          <v-alert color="warning"> </v-alert>
          <!-- OPTIONAL PROGRAM:
          <pre>{{ selectedOptionalProgram }}</pre>
          CAREER PROGRAM:
          <pre>{{ selectedCareerPrograms }}</pre> -->
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
    selectedOptionalProgram(newVal) {
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
        //     !this.selectedCareerPrograms.some(
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
      selectedOptionalProgram: "",
      selectedCareerPrograms: "",
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
      this.selectedCareerPrograms = [];
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
    // getters
    getOptionalProgramByID(selectedID) {
      return this.optionalProgramList.find(
        (optProgram) => optProgram.optionalProgramID === selectedID
      );
    },
    getCareerProgramByCode(selectedCode) {
      return this.careerProgramList.find(
        (careerProgram) => careerProgram.code === selectedCode
      );
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
      this.selectedOptionalProgram = "";
      this.selectedCareerPrograms = "";
    },
    submitForm() {
      this.addStudentOptionalProgram(
        this.selectedOptionalProgram,
        this.selectedCareerPrograms
      );
      this.closeCreateOptionalProgramDialog();
    },
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
