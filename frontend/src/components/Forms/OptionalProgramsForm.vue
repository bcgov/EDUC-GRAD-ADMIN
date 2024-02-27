<template>
  <div>
    <!-- btn to open optional program edit form-->
    <b-btn
      variant="primary"
      class="float-right mb-2 mr-2"
      @click="editOptionalPrograms()"
      >Add Optional Program <i class="fas fa-plus" aria-hidden="true"></i
    ></b-btn>

    <DisplayModal
      header="Add Optional Program"
      :showModal="editStudentOptionalPrograms"
    >
      <template v-slot:body>
        <!-- Prevent users from editing status of MER students & display error -->
        <div
          v-if="studentGradStatus.studentStatus === 'MER'"
          class="opt-program-form-body"
        >
          <b-alert variant="danger" show
            ><i class="fa-solid fa-circle-xmark"></i> <strong>Error</strong>
            <p>
              This student is showing as merged. Student GRAD Optional Program
              data cannot be updated for students with a status of "MER" merged.
            </p>
          </b-alert>
        </div>
        <div v-else class="opt-program-form-body">
          <!-- Student status warnings that inform user without blocking action -->
          <b-alert
            show
            variant="warning"
            v-if="studentGradStatus.studentStatus === 'TER'"
          >
            <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
            <strong>Warning</strong>
            <p>
              This student has been terminated. Re-activate by setting their
              status to "CUR" if they are currently attending school.
            </p>
          </b-alert>
          <b-alert
            show
            variant="warning"
            v-else-if="studentGradStatus.studentStatus === 'ARC'"
          >
            <i class="fa-solid fa-triangle-exclamation"></i>&nbsp;
            <strong>Warning</strong>
            <p>
              This student is not active. Re-activate by setting their status to
              "CUR" if they are currently attending school.
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
            :options="activeOptionalPrograms"
            value-field="optionalProgramID"
            text-field="optionalProgramName"
          ></b-form-select>

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
                getOptionalProgramByID(selectedOptionalProgram).optProgramCode
              }})
            </strong>
            <p>
              {{ getOptionalProgramByID(selectedOptionalProgram).description }}
            </p>
            <p>
              <strong>Effective Date: </strong
              >{{
                $filters.formatSimpleDate(
                  getOptionalProgramByID(selectedOptionalProgram).effectiveDate
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
              :options="careerProgramList"
              value-field="code"
              text-field="name"
            ></b-form-select>
            <div v-if="careerProgramsToAdd.length > 0" class="mx-4 my-2">
              <div
                v-for="item in careerProgramsToAdd"
                :key="item.code"
                class="my-1"
              >
                {{ item.code }} - {{ item.name }}
                <b-btn
                  variant="outline-danger"
                  size="sm"
                  class="px-1 py-0"
                  @click="removeCareerProgram(item.code)"
                >
                  <i class="fa-solid fa-xmark"></i>
                </b-btn>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <b-btn
          variant="outline-danger"
          class="float-left"
          size="xs"
          @click="editStudentOptionalPrograms = false"
          >Cancel</b-btn
        >
        <b-btn
          variant="primary"
          class="float-right"
          :disabled="studentGradStatus.studentStatus === 'MER'"
          >Next</b-btn
        >
      </template>
    </DisplayModal>
  </div>
</template>

<script>
//import components
import DisplayModal from "../DisplayModal.vue";

//import services
import ProgramManagementService from "@/services/ProgramManagementService.js";

//import stores & pinia utilities
//import { useAppStore } from "@/store/modules/app";
import { useStudentStore } from "@/store/modules/student";
import { mapState } from "pinia";

export default {
  name: "StudentOptionalProgramsForm",
  props: {
    studentProgramId: {
      type: String,
      default: "",
    },
  },
  components: {
    DisplayModal: DisplayModal,
  },
  mounted() {
    this.fetchPrograms();
  },
  data() {
    return {
      formSteps: "",
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
      optionalPrograms: "getStudentOptionalPrograms",
      studentGradStatus: "getStudentGradStatus",
    }),
    // ...mapState(useAppStore, {
    //   optionalPrograms
    // })
    careerProgramChange() {
      return this.selectedCareerProgram;
    },
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
      }); //TODO - map to filter out existing opt programs
    },
  },
  methods: {
    editOptionalPrograms() {
      this.editStudentOptionalPrograms = true;
    },
    isCareerProgram() {
      //determines if optional program selected is a career program
      return (
        !!this.selectedOptionalProgram &&
        this.getOptionalProgramByID(this.selectedOptionalProgram)
          .optProgramCode === "CP"
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
    addCareerProgram() {
      this.careerProgramsToAdd.push(
        this.getCareerProgramByCode(this.selectedCareerProgram)
      );
    },
    removeCareerProgram(selectedCode) {
      // The following using array.splice DOES NOT WORK due to multiple versions of Vue running on this branch
      // let index = this.careerProgramsToAdd.indexOf(selectedCode);
      // console.log(index);
      // if (index !== -1) {
      //   this.careerProgramsToAdd.splice(index, 1);
      // }
      this.careerProgramsToAdd = this.careerProgramsToAdd.filter(
        (item) => item.code !== selectedCode
      );
    },
    // Do we need these for bootstrap vue? Modal struct is different
    //openCreateOptionalProgramDialog()
    //closeCreateOptionalProgramDialog()
    //clearForm()
    //submitForm()
  },
  watch: {
    careerProgramChange: function () {
      this.careerProgramsToAdd.push(
        this.getCareerProgramByCode(this.selectedCareerProgram)
      );
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
