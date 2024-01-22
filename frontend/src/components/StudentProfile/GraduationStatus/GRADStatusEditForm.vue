<template>
  <div>
    <!-- <b-modal id="edit-form" hide-footer title="Edit"> -->
      <b-form>
        <b-form-group
          id="program-group"
          label="Program:"
          label-for="program-group"
          description=""
        >
          <b-form-select
            size="sm"
            v-model="editedGradStatus.program"
            :options="programOptions"
            value-field="programCode"
            text-field="programCode"
          ></b-form-select>
        </b-form-group>

        <b-form-group
          id="program-completion-date-group"
          label="Program completion date:"
          label-for="program-completion-date-group"
          description=""
        >
          <b-input
            size="sm"
            type="text"
            maxLength="7"
            v-model="editedGradStatus.programCompletionDate"
          ></b-input>
        </b-form-group>
        <b-form-group
          id="student-status-group"
          label="Student status:"
          label-for="student-status-group"
          description=""
        >
          <b-form-select
            size="sm"
            v-model="editedGradStatus.studentStatus"
            :options="studentStatusOptions"
            value-field="code"
            text-field="label"
          ></b-form-select>
        </b-form-group>
        <b-form-group
          id="student-grade-group"
          label="Student grade:"
          label-for="student-grade-group"
          description=""
        >
          <b-form-select
            size="sm"
            v-model="editedGradStatus.studentGrade"
            :options="gradeOptions"
          >
          </b-form-select>
        </b-form-group>
        <b-form-group
          id="school-of-record-group"
          label="School of record:"
          label-for="school-of-record-group"
          description=""
        >
          <b-input
            size="sm"
            type="text"
            maxlength="8"
            minength="8"
            v-model="editedGradStatus.schoolOfRecord"
          ></b-input>
        </b-form-group>
        <b-form-group
          id="school-at-grad-group"
          label="School at graduation:"
          label-for="school-at-grad-group"
          description=""
        >
          <b-input
            size="sm"
            type="text"
            maxlength="8"
            v-model="editedGradStatus.schoolAtGrad"
          ></b-input>
        </b-form-group>
        <tr>
          <td>Honours standing:</td>
          <td>
            <span v-if="studentGradStatus.honoursStanding">
              {{ studentGradStatus.honoursStanding }}</span
            >
          </td>
        </tr>
        <tr>
          <td>GPA:</td>
          <td>
            <span v-if="studentGradStatus.gpa && studentGradStatus.gpa > 0">{{
              studentGradStatus.gpa
            }}</span>
          </td>
        </tr>
        <tr>
          <td>Optional Programs:</td>
          <td>
            <ul
              class="p-0"
              v-if="
                optionalPrograms[0] &&
                optionalPrograms[0].studentOptionalProgramData
              "
              id="optional-programs"
            >
              <li
                v-for="item in optionalPrograms"
                :key="item.optionalProgramCode"
              >
                {{ item.optionalProgramName }}
              </li>
            </ul>
          </td>
        </tr>
        <b-form-group
          id="consumer-education-requirement-met-group"
          label="Consumer education requirement met:"
          label-for="consumer-education-requirement-met-group"
          description=""
        >
          <b-form-select
            size="sm"
            v-model="editedGradStatus.consumerEducationRequirementMet"
            :options="consumerEducRecMet"
          >
          </b-form-select>
        </b-form-group>
      </b-form>
    <!-- </b-modal> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      optionalPrograms: "getStudentOptionalPrograms",
      programOptions: "app/getProgramOptions",
      studentStatusOptions: "app/getStudentStatusOptions",
      studentId: "getStudentId",
      studentGradStatus: "getStudentGradStatus",
    }),
  },
  created() {
    this.editGradStatus();
    this.toggleModal();
  },
  components: {},
  data() {
    return {
      consumerEducRecMet: [
        { text: "Y", value: "Y" },
        { text: "N", value: "N" },
      ],
      editedGradStatus: {},
      gradeOptions: [
        { text: "08", value: "8" },
        { text: "09", value: "9" },
        { text: "10", value: "10" },
        { text: "11", value: "11" },
        { text: "12", value: "12" },
        { text: "HS - Homeschool", value: "HS" },
        { text: "OT - Other", value: "OT" },
        { text: "AD - Adult expected to graduate", value: "AD" },
        { text: "AN - Adult not expected to graduate", value: "AN" },
      ],
      gradStatusModal: {
        id: "grad-status-modal",
        title: "GRAD status",
        content: "",
      },
      programsWithExpiry: [
        "1986-EN",
        "1996-EN",
        "1996-PF",
        "2004-EN",
        "2004-PF",
      ],
    };
  },
  methods: {
    dateFormatYYYYMM() {
      let value = this.editedGradStatus.programCompletionDate;
      this.editedGradStatus.programCompletionDate = value.replace(
        /^([\d]{4})([\d]{2})$/,
        "$1/$2"
      );
    },
    dateFormatYYYYMMDD() {
      let value = this.editedGradStatus.programCompletionDate;
      this.editedGradStatus.programCompletionDate = value.replace(
        /^([\d]{4})([\d]{2})([\d]{2})$/,
        "$1/$2/$3"
      );
    },
    editGradStatus() {
      this.$set(
        this.editedGradStatus,
        "program",
        this.studentGradStatus.program
      );
      this.$set(
        this.editedGradStatus,
        "programCompletionDate",
        this.studentGradStatus.programCompletionDate
      );
      this.$set(
        this.editedGradStatus,
        "studentStatus",
        this.studentGradStatus.studentStatus
      );
      this.$set(
        this.editedGradStatus,
        "studentGrade",
        this.studentGradStatus.studentGrade
      );
      this.$set(
        this.editedGradStatus,
        "schoolOfRecord",
        this.studentGradStatus.schoolOfRecord
      );
      this.$set(
        this.editedGradStatus,
        "schoolAtGrad",
        this.studentGradStatus.schoolAtGrad
      );
      this.$set(
        this.editedGradStatus,
        "consumerEducationRequirementMet",
        this.studentGradStatus.consumerEducationRequirementMet
      );
    },  
    toggleModal() {
      this.$root.$emit('bv::toggle::modal', 'edit-form', '#btnToggle')
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
  },
};
</script>
<style scoped></style>
