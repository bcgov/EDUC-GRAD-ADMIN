<template>
  <div>
    <!-- btn to open optional program edit form-->
    <b-btn
      v-if="allowOptionalProgramUpdate"
      variant="primary"
      class="float-right mb-2 mr-2"
      @click="openCreateOptionalProgramDialog()"
      ><i class="fas fa-plus" aria-hidden="true"></i> Add Optional
      Program</b-btn
    >

    <DisplayModal
      header="Add Optional Program"
      :showModal="editStudentOptionalPrograms"
    >
      <template v-slot:body>
        <!-- Prevent users from editing status of MER students & display error -->
        <div v-if="currentStep === formSteps[0]">
          <div
            v-if="studentGradStatus.studentStatus === 'MER'"
            class="opt-program-form-body"
          >
            <b-alert variant="danger" show
              ><i class="fa-solid fa-circle-xmark"></i> <strong>Error</strong>
              <p>This student is showing as merged.</p>
              <p>
                Student GRAD Optional Program data cannot be updated for
                students with a status of "MER" merged.
              </p>
            </b-alert>
          </div>

          <div
            v-else-if="
              isProgramComplete(
                studentGradStatus.programCompletionDate,
                studentGradStatus.program
              )
            "
            class="opt-program-form-body"
          >
            <b-alert variant="danger" show
              ><i class="fa-solid fa-circle-xmark"></i> <strong>Error</strong>
              <p>
                This student has a program completion date of
                {{ studentGradStatus.programCompletionDate }}.
              </p>
              <p>
                You must undo completion to be able to edit the Optional
                Programs for this student.
              </p>
            </b-alert>
          </div>
          <!-- Display form if student status is NOT MER -->
          <div v-else class="opt-program-form-body">
            <!-- Student status warnings that inform user without blocking action -->
            <b-alert
              show
              variant="warning"
              v-if="studentGradStatus.studentStatus === 'TER'"
            >
              <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
              <strong>Warning</strong>
              <p>This student has been terminated.</p>
              <p>
                Re-activate by setting their status to "CUR" if they are
                currently attending school.
              </p>
            </b-alert>
            <b-alert
              show
              variant="warning"
              v-else-if="studentGradStatus.studentStatus === 'ARC'"
            >
              <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
              <strong>Warning</strong>
              <p>This student is not active.</p>
              <p>
                Re-activate by setting their status to "CUR" if they are
                currently attending school.
              </p>
            </b-alert>
            <b-alert
              show
              variant="warning"
              v-else-if="studentGradStatus.studentStatus === 'DEC'"
            >
              <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
              <strong>Warning</strong>
              <p>This student is showing as deceased.</p>
            </b-alert>
            <!-- END student status warnings -->

            <p class="form-label required">Optional Program</p>
            <b-form-select
              v-model="selectedOptionalProgram"
              value-field="optionalProgramID"
              text-field="optionalProgramName"
            >
              <option
                v-for="optionalProgram in activeOptionalPrograms"
                :key="optionalProgram.optionalProgramID"
                :value="optionalProgram.optionalProgramID"
              >
                ({{ optionalProgram.optProgramCode }})
                {{ optionalProgram.optionalProgramName }}
              </option>
            </b-form-select>

            <b-alert
              variant="primary"
              :show="!!selectedOptionalProgram"
              class="my-4"
              ><i class="fa-solid fa-circle-info"></i>&nbsp;<strong>
                {{
                  getOptionalProgramByID(selectedOptionalProgram)
                    .optionalProgramName
                }}
                ({{
                  getOptionalProgramByID(selectedOptionalProgram)
                    .optProgramCode
                }})
              </strong>
              <p>
                {{
                  getOptionalProgramByID(selectedOptionalProgram).description
                }}
              </p>
              <p>
                <strong>Effective Date: </strong
                >{{
                  $filters.formatSimpleDate(
                    getOptionalProgramByID(selectedOptionalProgram)
                      .effectiveDate
                  )
                }}
                <strong class="ml-4">Expiry Date: </strong
                >{{
                  $filters.formatSimpleDate(
                    getOptionalProgramByID(selectedOptionalProgram).expiryDate
                  )
                }}
              </p>
            </b-alert>

            <div v-if="isCareerProgram()">
              <p class="form-label required">Career Program</p>
              <b-form-select
                v-model="selectedCareerProgram"
                value-field="code"
                text-field="name"
              >
                <option
                  v-for="careerProgram in activeCareerPrograms"
                  :key="careerProgram.code"
                  :value="careerProgram.code"
                >
                  ({{ careerProgram.code }})
                  {{ careerProgram.name }}
                </option>
              </b-form-select>
              <div v-if="careerProgramsToAdd.length > 0" class="mx-4 my-3">
                <div
                  v-for="item in careerProgramsToAdd"
                  :key="item"
                  class="my-1"
                >
                  <b-btn
                    variant="outline-danger"
                    size="sm"
                    class="px-1 py-0"
                    @click="unsetCareerProgram(item)"
                  >
                    <i class="fa-solid fa-xmark"></i> </b-btn
                  >&nbsp; {{ item }} - {{ getCareerProgramByCode(item).name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Confirmation Step -->
        <div v-else-if="currentStep === formSteps[1]">
          <b-alert show variant="warning">
            <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
            <strong>Warning</strong>
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
              <li v-for="item in careerProgramsToAdd" :key="item" class="my-1">
                {{ item }} - {{ getCareerProgramByCode(item).name }}
              </li>
            </ul>
          </b-alert>
        </div>
      </template>

      <template v-slot:footer>
        <b-btn
          v-if="currentStep === formSteps[0]"
          variant="outline-danger"
          class="float-left"
          size="xs"
          @click="closeCreateOptionalProgramDialog()"
          >Cancel</b-btn
        >
        <b-btn
          v-else-if="currentStep === formSteps[1]"
          variant="outline-primary"
          class="float-left"
          size="xs"
          @click="currentStep = formSteps[0]"
          >Back</b-btn
        >
        <b-btn
          v-if="currentStep === formSteps[0]"
          variant="primary"
          class="float-right"
          :disabled="validateOptionalPrograms()"
          @click="currentStep = formSteps[1]"
          >Next</b-btn
        >
        <b-btn
          v-else-if="currentStep === formSteps[1]"
          variant="danger"
          class="float-right"
          @click="submitForm()"
          >Add Optional Program</b-btn
        >
      </template>
    </DisplayModal>
  </div>
</template>

<script>
//import components
import DisplayModal from "../DisplayModal.vue";

// import shared functions & validations
import { isProgramComplete, applyDisplayOrder } from "@/utils/common.js";

//import services
import ProgramManagementService from "@/services/ProgramManagementService.js";

//import stores & pinia utilities
import { useStudentStore } from "@/store/modules/student";
import { useAccessStore } from "@/store/modules/access";
import { mapState, mapActions } from "pinia";

export default {
  name: "StudentOptionalProgramsForm",
  components: {
    DisplayModal: DisplayModal,
  },
  mounted() {
    this.fetchPrograms();
  },
  data() {
    return {
      formSteps: [
        { key: 0, label: "Choose Optional Programs" },
        { key: 1, label: "Confirmation" },
      ],
      currentStep: null,
      editStudentOptionalPrograms: false,
      selectedOptionalProgram: null,
      selectedCareerProgram: null,
      careerProgramsToAdd: [],
      optionalProgramList: null,
      careerProgramList: null,
    };
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
      return this.selectedOptionalProgram;
    },
    careerProgramChange() {
      return this.selectedCareerProgram;
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
        this.careerProgramList
          ?.filter(
            (activeCareerProgram) =>
              !this.studentCareerPrograms.some(
                (studentCareerProgram) =>
                  studentCareerProgram.careerProgramCode ==
                  activeCareerProgram.code
              )
          )
          ?.filter(
            (activeCareerProgram) =>
              !this.careerProgramsToAdd.some(
                (careerProgram) => careerProgram == activeCareerProgram.code
              )
          )
      );
    },
  },
  methods: {
    ...mapActions(useStudentStore, [
      "addStudentOptionalProgram",
      "addStudentCareerPrograms",
    ]),
    isProgramComplete(date, program) {
      return isProgramComplete(date, program);
    },
    isCareerProgram() {
      //determines if optional program selected is a career program
      return (
        !!this.selectedOptionalProgram &&
        this.getOptionalProgramByID(this.selectedOptionalProgram)
          .optProgramCode === "CP"
      );
    },
    disableAddOptionalProgram() {
      return (
        !this.studentGradStatus ||
        isProgramComplete(
          this.studentGradStatus.programCompletionDate,
          this.studentGradStatus.program
        )
      );
    },
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
    unsetCareerProgram(selectedCode) {
      console.log("Before", this.selectedCareerProgram);
      console.log("Before", this.careerProgramsToAdd);
      this.careerProgramsToAdd = this.careerProgramsToAdd.filter(
        (item) => item !== selectedCode
      );
      console.log("After", this.selectedCareerProgram);
      console.log("After", this.careerProgramsToAdd);
    },
    validateOptionalPrograms() {
      return !(
        (!!this.selectedOptionalProgram &&
          !this.isCareerProgram(this.selectedOptionalProgram)) ||
        (!!this.selectedOptionalProgram &&
          this.isCareerProgram(this.selectedOptionalProgram) &&
          this.careerProgramsToAdd.length > 0)
      );
    },
    openCreateOptionalProgramDialog() {
      this.editStudentOptionalPrograms = true;
      this.currentStep = this.formSteps[0];
    },
    closeCreateOptionalProgramDialog() {
      this.editStudentOptionalPrograms = false;
      this.currentStep = null;
      this.clearForm();
    },
    clearForm() {
      this.selectedOptionalProgram = null;
      this.selectedCareerProgram = null;
      this.careerProgramsToAdd = [];
    },
    submitForm() {
      if (this.isCareerProgram(this.selectedCareerProgram)) {
        // action to add career program
        this.addStudentCareerPrograms(this.careerProgramsToAdd);
      } else {
        // action to add optional program
        this.addStudentOptionalProgram(this.selectedOptionalProgram);
      }
      this.closeCreateOptionalProgramDialog();
    },
  },
  watch: {
    optionalProgramChange: function () {
      // reset career program values if opt program changes
      this.careerProgramsToAdd = [];
      this.selectedCareerProgram = null;
    },
    careerProgramChange: function () {
      if (!!this.selectedCareerProgram) {
        this.careerProgramsToAdd.push(this.selectedCareerProgram);
        this.selectedCareerProgram = null;
      }
    },
  },
};
</script>

<style>
.opt-program-form-body {
  max-width: 50vw;
}

.form-label {
  font-weight: bold;
}

.form-label.required:after {
  content: " *";
  color: red;
}
</style>

<style scoped></style>
