<!-- CreateOptionalProgramDialog.vue -->
<template>
  <v-dialog
    v-model="dialog"
    @click:outside="closeCreateOptionalProgramDialog"
    max-width="500px"
  >
    <template v-slot:activator="{ props }">
      <v-btn color="bcGovBlue" prepend-icon="mdi-plus" class="float-right text-none mt-n12 mb-8" @click="openCreateOptionalProgramDialog()" text="Add Optional Program">
      </v-btn>
    </template>

    <v-stepper alt-labels show-actions v-model="step">
      <template v-slot:default>
        <v-stepper-header>
          <v-stepper-item :rules="[ ()=> !v$.form.$invalid]" title="Select Optional Programs" value="1"></v-stepper-item>
          <v-stepper-item  title="Confirmation" value="2"></v-stepper-item>

          
        </v-stepper-header>

        <v-stepper-window>
          <v-stepper-window-item  value="1">
            <v-form @submit.prevent="submitForm">
              <v-alert v-if="v$.ifStudentStatusMerged.$invalid" type="error" variant="tonal" border="start" class="mb-4">
                <p><strong>ERROR</strong></p>
                <p>{{ v$.ifStudentStatusMerged.$message }}</p>
              </v-alert>
              <v-alert v-if="v$.ifProgramComplete.$invalid" type="error" variant="tonal" border="start" class="mb-4">
                <p><strong>ERROR</strong></p>
                <p>{{ v$.ifProgramComplete.$message }}</p>
              </v-alert>
              <v-alert v-if="v$.ifStudentStatusDeceased.$invalid" type="warning" variant="tonal" border="start" class="mb-4">
                <p><strong>WARNING</strong></p>
                <p>{{ v$.ifStudentStatusDeceased.$message }}</p>
              </v-alert>
              <v-alert v-if="v$.ifStudentStatusArchived.$invalid" type="warning" variant="tonal" border="start" class="mb-4">
                <p><strong>WARNING</strong></p>
                <p>{{ v$.ifStudentStatusArchived.$message }}</p>
              </v-alert>
              <v-alert v-if="v$.ifStudentStatusTerminated.$invalid" type="warning" variant="tonal" border="start" class="mb-4">
                <p><strong>WARNING</strong></p>
                <p>{{ v$.ifStudentStatusTerminated.$message }}</p>
              </v-alert>
              <!-- Program Name Input -->
              <v-autocomplete
                v-model="form.selectedOptionalProgram"
                :items="activeOptionalPrograms"
                :item-title="optionalProgramTitle"
                :disabled="v$.ifProgramComplete.$invalid || v$.ifStudentStatusMerged.$invalid"
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
                v-if="isCareerProgram(form.selectedOptionalProgram)"
                v-model="form.selectedCareerPrograms"
                :items="activeCareerPrograms"
                :item-title="careerProgramTitle"
                item-value="code"
                label="Choose an Optional Program to add"
                required
                @keyup.enter="submitForm"
              ></v-autocomplete>
            </v-form>
          </v-stepper-window-item>
    
          <v-stepper-window-item value="2">
            <slot name="text">
              <v-alert type="info" variant="tonal" border="start" class="pb-0">
                <p v-if="isCareerProgram(form.selectedOptionalProgram)">
                  You are about to add the following Career Program{{
                    form.selectedCareerPrograms?.length === 1 ? "" : "s"
                  }}
                  for this student:
                  
                  <ul v-if="isCareerProgram(form.selectedOptionalProgram)">
                    <li
                    v-for="item in form.selectedCareerPrograms"
                    :key="item"
                    class="my-1"
                    >
                    {{ item }} - {{ getCareerProgramByCode(item).name }}
                  </li>
                </ul>
              </p>
              <p v-else>
                You are about to add the
                  <strong>
                    {{
                      getOptionalProgramByID(form.selectedOptionalProgram)
                        ?.optionalProgramName
                    }}
                    ({{
                      getOptionalProgramByID(form.selectedOptionalProgram)
                        ?.optProgramCode
                    }})
                  </strong>
                  Optional Program for this student.
              </p>
              </v-alert>
            </slot>
          </v-stepper-window-item>
        </v-stepper-window>
        
        </template>
        <template v-slot:actions>
          <div class="row mx-6 mb-6">
            <!-- Left Action Button -->
            <v-btn v-if="step == 0" @click="closeCreateOptionalProgramDialog()" color="error" variant="outlined">Cancel</v-btn>
            <v-btn v-else @click="step--" color="bcGovBlue" variant="outlined">Back</v-btn>
            <v-spacer />
            <!-- Right Action Button -->
            <v-btn v-if="step < 1" @click="step++" color="bcGovBlue" :disabled="v$.form.$invalid">Next</v-btn>
            <v-btn v-else @click="submitForm()" color="error">Add Optional Program</v-btn>
          </div>
        </template>
    </v-stepper>

  </v-dialog>
</template>

<script>
// API service
import ProgramManagementService from "@/services/ProgramManagementService.js";

// Shared functions & validations
import { isProgramComplete, applyDisplayOrder } from "@/utils/common.js";

// Pinia store
import { useStudentStore } from "@/store/modules/student";
import { useAccessStore } from "@/store/modules/access";
import { mapActions, mapState } from "pinia";

// vuelidate
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, helpers } from "@vuelidate/validators";

export default {
  setup() {
    return {
      v$: useVuelidate(),
    }
  },
  watch: {
    optionalProgramChange: function (newVal) {
      // The function to be executed when isCareerProgram changes
      if (!this.isCareerProgram(newVal)) {
        this.clearCareerPrograms();
      }
    },
  },
  mounted() {
    this.fetchPrograms();
  },
  validations() {
    return {
      form: {
        selectedOptionalProgram: { required },
        selectedCareerPrograms: { required: requiredIf(function(){
          return !!this.form.selectedOptionalProgram && this.getOptionalProgramByID(this.form.selectedOptionalProgram)?.optProgramCode == 'CP'
        })},
      },
      ifStudentStatusMerged: helpers.withMessage('This student is showing as merged. Student GRAD Optional Program data cannot be updated for students with a status of "MER" merged.', (value) => {
        console.log(this.studentGradStatus.studentStatus)
        return !(this.studentGradStatus.studentStatus == "MER");
      }),
      ifStudentStatusDeceased: helpers.withMessage('This student is showing as deceased.', (value) => {
        return !(this.studentGradStatus.studentStatus == "DEC");
      }),
      ifStudentStatusArchived: helpers.withMessage('This student is not active. Re-activate by setting their status to "CUR" if they are currently attending school.', (value) => {
        return !(this.studentGradStatus.studentStatus == "ARC");
      }),
      ifStudentStatusTerminated: helpers.withMessage('This student has been terminated. Re-activate by setting their status to "CUR" if they are currently attending school.', (value) => {
        return !(this.studentGradStatus.studentStatus == "TER");
      }),
      ifProgramComplete: helpers.withMessage(`This student has a program completion date of ${this.studentGradStatus.programCompletionDate}. You must undo completion to be able to edit the Optional Programs for this student.`, (value) => {
        return !this.isProgramComplete(this.studentGradStatus.programCompletionDate, this.studentGradStatus.program)
      })
    }
  },
  computed: {
    ...mapState(useStudentStore, {
      studentOptionalPrograms: "getStudentOptionalPrograms",
      studentCareerPrograms: "getStudentCareerPrograms",
      studentGradStatus: "getStudentGradStatus",
    }),
    ...mapState(useAccessStore, {
      allowOptionalProgramUpdate: "allowOptionalProgramUpdate",
    }),
    optionalProgramChange() {
      return this.form.selectedOptionalProgram;
    },
    careerProgramChange() {
      return this.form.selectedCareerProgram;
    },
    activeOptionalPrograms() {
      const studentProgramId = this.studentGradStatus.program;

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
      );
    },
  },
  data() {
    return {
      step: 0,
      dialog: false,
      optionalProgramList: [],
      careerProgramList: [],
      form: {
        selectedOptionalProgram: null,
        selectedCareerPrograms: null,
      }
    };
  },
  props: {
    studentProgramId: {
      type: String,
      default: "",
    },
  },
  methods: {
    isCareerProgram(optionalProgramID) {
      const activeProgram = this.activeOptionalPrograms.find(
        (program) => program.optionalProgramID === optionalProgramID
      );

      return activeProgram && activeProgram.optProgramCode === "CP";
    },
    isProgramComplete(date, program) {
      return isProgramComplete(date, program)
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
      this.step = 0;
      this.clearForm();
      this.dialog = true;
    },
    closeCreateOptionalProgramDialog() {
      this.clearForm();
      this.dialog = false;
    },
    clearForm() {
      this.clearOptionalProgram()
      this.clearCareerPrograms()
    },
    clearCareerPrograms() {
      this.form.selectedCareerPrograms = null;
    },
    clearOptionalProgram() {
      this.form.selectedOptionalProgram = null;
    },
    submitForm() {
      this.addStudentOptionalProgram(
        this.form.selectedOptionalProgram,
        this.form.selectedCareerPrograms
      );
      this.closeCreateOptionalProgramDialog();
    },
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
