<template>
  <div>
    <b-card title="Include Student(s)">
      <b-card-text>
        <label class="col-12 px-0">Personal Education Number</label>
        <b-input
          type="number"
          v-model="pen"
          @input="validateStudent"
          class="col-2 float-left mr-2"
        />
        <div
          class="input-errors"
          v-for="error of v$.pen.$errors"
          :key="error.$uid"
        >
          <div class="error-msg">{{ error.$message }}</div>
        </div>
        <div v-if="penStudentInfo">
          <b-card>
            <b-card-text>
              <b-alert
                dismissible
                v-if="validationMessage"
                show
                variant="danger"
                >{{ validationMessage }}</b-alert
              >
              <b-overlay :show="penValidating">
                <div v-if="!penStudentInfo">NOT VALID</div>
                <div v-else>
                  <strong>First Name:</strong> {{ penStudentInfo.firstName
                  }}<br />
                  <strong>Last Name:</strong> {{ penStudentInfo.lastName
                  }}<br />
                  <strong>Birthdate:</strong> {{ penStudentInfo.dob }}<br />
                  <strong>Status:</strong> {{ penStudentInfo.status }}<br />
                  <strong>Program:</strong> {{ penStudentInfo.program }}<br />
                  <strong>School of Record</strong>
                  {{ penStudentInfo.schoolOfRecord }}<br />
                  <strong>School at Graduation</strong>
                  {{ penStudentInfo.schoolAtGrad }}
                </div>
              </b-overlay>
            </b-card-text>
            <b-button
              @click="addStudent()"
              :disabled="validationMessage != ''"
              class="float-right"
              >Add Student</b-button
            >
            <b-button @click="clearPen()" class="float-right" variant="link"
              >Clear</b-button
            >
          </b-card>
        </div>
        <b-table
          v-if="students.length"
          :items="getStudents"
          :fields="studentInputFields"
          striped="true"
        >
          <template #cell(remove)="row">
            <b-button
              class="btn btn-primary w-100"
              @click="removeStudent(row.item.pen)"
            >
              Remove
            </b-button>
          </template>
          <template #cell(info)="row">
            <div>
              <strong>Name:</strong> {{ row.item.info.firstName }}
              {{ row.item.info.lastName }}
            </div>
            <div><strong>Birthdate:</strong> {{ row.item.info.dob }}</div>
            <div><strong>Status:</strong> {{ row.item.info.status }}</div>
            <div><strong>Program:</strong> {{ row.item.info.program }}</div>
            <div>
              <strong>School of Record:</strong>
              {{ row.item.info.schoolOfRecord }}
            </div>
            <div>
              <strong>School At Graduation:</strong>
              {{ row.item.info.schoolAtGrad }}
            </div>
          </template>
        </b-table>
      </b-card-text>
    </b-card>
  </div>
</template>
<script>
import TRAXService from "@/services/TRAXService.js";
import SchoolService from "@/services/SchoolService.js";
import StudentService from "@/services/StudentService.js";
import GraduationReportService from "@/services/GraduationReportService.js";
import { useVuelidate } from "@vuelidate/core";
import { mapActions, mapState } from "pinia";
import { useBatchProcessingStore } from "../../../../store/modules/batchprocessing";
import { required, minLength, helpers } from "@vuelidate/validators";
import { isProxy, toRaw } from "vue";

export default {
  components: {},
  setup(props) {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      pen: {
        minLength: minLength(9),
        async isValid(value) {
          this.validationMessage = "";
          if (value === "") return true;
          if (value.length == 9) {
            let student = await StudentService.getStudentByPen(value);
            let studentID = student.data[0].studentID;
            let studentGRADStatus = await StudentService.getGraduationStatus(
              studentID
            );
            //check is student is status = MER

            if (studentGRADStatus.data) {
              //display student

              this.penStudentInfo = {
                firstName: student.data[0].legalFirstName,
                lastName: student.data[0].legalLastName,
                dob: student.data[0].dob,
                status: studentGRADStatus.data.studentStatusName,
                schoolOfRecord: studentGRADStatus.data.schoolOfRecord,
                schoolAtGrad: studentGRADStatus.data.schoolAtGrad,
                program: studentGRADStatus.data.program,
              };
              if (studentGRADStatus.data.studentStatusName == "Merged") {
                this.validationMessage =
                  value + " is a merged student and not permitted";
                return false;
              }
              //check if what credentialType was selected
              if (
                this.runType == "DISTRUNUSER" &&
                (this.credentialType == "RC" || this.credentialType == "OC")
              ) {
                let certificate =
                  await GraduationReportService.getStudentCertificates(
                    studentID
                  );
                if (certificate.data.length) {
                  //check that certificate has does nto have a null distribution date

                  if (
                    !certificate.data.distributionDate &&
                    this.credentialType == "RC"
                  ) {
                    this.validationMessage =
                      "Cannot reprint certificate for this student. Distribution date is null";
                  }
                } else {
                  if (this.credentialType == "RC") {
                    this.validationMessage =
                      "Cannot reprint certificate for this student.";
                  }
                  if (this.credentialType == "OC") {
                    console.log(
                      "Cannot print certificate for this student,this student does not have a certificate."
                    );
                  }
                }
              }
            }
          }
          return false;
        },
      }, // Matches this.firstName
    };
  },
  data() {
    return {
      pen: "",
      penStudentInfo: "",
      penValidating: false,
      validationMessage: "",
      students: [],
      studentInputFields: [
        {
          key: "pen",
          label: "pen",
          sortable: true,
          class: "text-left col-2",
        },
        {
          key: "info",
          label: "info",
          sortable: true,
          class: "text-left",
        },
        {
          key: "remove",
          label: "remove",
          sortable: true,
          class: "text-left",
        },
      ],
    };
  },
  mounted() {},
  created() {},
  methods: {
    ...mapActions(useBatchProcessingStore, ["setStudents"]),
    async validateStudent() {
      this.penValidating = true;
      this.clearPenStudentInfo();
      const result = await this.v$.$validate();
      if (!result) {
        return;
      }
      this.penValidating = false;
    },
    clearPenStudentInfo() {
      this.penStudentInfo = "";
    },
    clearPen() {
      this.pen = "";
      this.clearPenStudentInfo();
    },
    addStudent() {
      this.students.splice(0, 0, {
        pen: this.pen,
        info: this.penStudentInfo,
      });
      this.setStudents(this.students);
      this.clearPen();
    },
    removeStudent(pen) {
      const studentList = toRaw(this.students);
      for (const [index, student] in studentList) {
        if (studentList[index].pen == pen) {
          console.log(pen);
          this.students.splice(index, 1);
        }
      }
      this.setStudents(studentList);
    },
  },
  props: {
    credentialType: String,
    runType: String,
  },

  computed: {
    ...mapState(useBatchProcessingStore, ["getStudents"]),
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
