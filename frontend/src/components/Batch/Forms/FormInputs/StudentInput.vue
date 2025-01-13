<template>
  <v-container>
    <v-row>
      <v-col sm="2"><strong>Personal Education Number</strong></v-col>
      <v-col cols="7">
        <v-text-field
          label="Personal Education Number"
          v-model="pen"
          @input="validateStudent"
          type="number"
          variant="outlined"
          class="mr-2 mt-2"
        ></v-text-field>
      </v-col>
      <v-col md="3">
        <v-btn
          color="bcGovBlue"
          @click="addStudent()"
          :disabled="v$.pen.$invalid || pen == ''"
          :loading="penLoading"
        >
          Add Student
        </v-btn>
        <!-- <v-btn @click="clearPen" text> Clear </v-btn> -->
      </v-col>
    </v-row>
    <v-row v-if="validationMessage">
      <v-alert dismissible type="error">
        {{ validationMessage }}
      </v-alert>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          v-if="students.length"
          :items="students"
          :headers="studentInputFields"
          striped
        >
          <template v-slot:item.remove="{ item }">
            <v-btn @click="removeStudent(item.pen)" color="primary">
              Remove
            </v-btn>
          </template>
          <template v-slot:item.info="{ item }">
            <div>
              <strong>Name:</strong> {{ item.info.firstName }}
              {{ item.info.lastName }}
            </div>
            <div><strong>Birthdate:</strong> {{ item.info.dob }}</div>
            <div><strong>Status:</strong> {{ item.info.status }}</div>
            <div><strong>Program:</strong> {{ item.info.program }}</div>
            <div>
              <strong>School of Record:</strong>
              {{ item.info.schoolOfRecord }}
            </div>
            <div>
              <strong>School At Graduation:</strong>
              {{ item.info.schoolAtGrad }}
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { isProxy, toRaw, ref, watch } from "vue";
import TRAXService from "@/services/TRAXService.js";
import SchoolService from "@/services/SchoolService.js";
import StudentService from "@/services/StudentService.js";
import GraduationReportService from "@/services/GraduationReportService.js";
import { useVuelidate } from "@vuelidate/core";
import { mapActions, mapState } from "pinia";
import { useBatchRequestFormStore } from "../../../../store/modules/batchRequestFormStore";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";

export default {
  components: {},
  setup(props) {
    const batchRequestFormStore = useBatchRequestFormStore();
    const gradDateFrom = ref(batchRequestFormStore.gradDateFrom);
    const gradDateTo = ref(batchRequestFormStore.gradDateTo);
    const students = ref(batchRequestFormStore.students);

    watch(gradDateFrom, (newValue) => {
      batchRequestFormStore.gradDateFrom = newValue;
    });
    watch(gradDateTo, (newValue) => {
      batchRequestFormStore.gradDateTo = newValue;
    });

    return {
      gradDateTo,
      gradDateFrom,
      students,
      v$: useVuelidate(),
    };
  },
  validations() {
    return {
      pen: {
        minLength: minLength(9),
      }, // Matches this.firstName
    };
  },
  data() {
    return {
      pen: "",
      penLoading: false,
      penStudentInfo: "",
      penValidating: false,
      validationMessage: "",
      studentInputFields: [
        {
          key: "pen",
          title: "Pen",
          sortable: true,
          class: "text-left col-2",
        },
        {
          key: "info",
          title: "Info",
          sortable: true,
          class: "text-left",
        },
        {
          key: "remove",
          title: "",
          sortable: true,
          class: "text-left",
        },
      ],
    };
  },
  mounted() {},
  created() {},
  methods: {
    ...mapActions(useBatchRequestFormStore, [
      "clearBatchDetails",
      "clearBatchGroupData",
    ]),
    async validateStudent() {
      this.penValidating = true;
      this.clearPenStudentInfo();
      const result = await this.v$.$validate();
      if (!result) {
        this.penLoading = false;
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
    async addStudent() {
      this.penLoading = true;
      this.validationMessage = "";
      if (this.pen.length == 9) {
        let student = await StudentService.getStudentByPen(this.pen);
        if (student.data && student.data.length === 0) {
          this.validationMessage = "Student not found";
          this.penLoading = false;
          return false;
        }
        let studentID = student.data[0].studentID;

        let studentGRADStatus = await StudentService.getGraduationStatus(
          student.data[0].studentID
        );

        //check is student is status = MER

        if (studentGRADStatus.data) {
          //display student
          this.penStudentInfo = {
            firstName: student.data[0].legalFirstName,
            lastName: student.data[0].legalLastName,
            dob: student.data[0].dob,
            status: studentGRADStatus.data.studentStatusName,
            schoolOfRecord: studentGRADStatus.data.schoolName,
            schoolAtGrad: studentGRADStatus.data.schoolAtGradName,
            program: studentGRADStatus.data.program,
          };
          if (studentGRADStatus.data.studentStatusName == "Merged") {
            this.validationMessage =
              this.pen + " is a merged student and not permitted";
            this.penLoading = false;
            return;
          }
          if (this.runType == "CERT_REGEN") {
            //when User is entereing PENs for the REGEN process, error if the student has a null PROGRAM COMPLETION DATE
            if (!studentGRADStatus.data.programCompletionDate) {
              this.validationMessage =
                "Error: Cannot regenerate a certificate for this student - this student has not completed their program";
              this.penLoading = false;
              return;
            }
          }

          //check if what credentialType was selected
          if (
            this.runType == "DISTRUNUSER" &&
            (this.credentialType == "RC" || this.credentialType == "OC")
          ) {
            let certificate =
              await GraduationReportService.getStudentCertificates(studentID);

            if (!certificate?.data.length) {
              if (this.credentialType == "RC") {
                this.validationMessage =
                  "Cannot reprint certificate for this student. This student does not have a certificate.";
                this.penLoading = false;
                return;
              }
              if (this.credentialType == "OC") {
                this.validationMessage =
                  "Cannot print certificate for this student. This student does not have a certificate.";
                this.penLoading = false;
                return;
              }
            }
          }
        }
        this.students.splice(0, 0, {
          pen: this.pen,
          info: this.penStudentInfo,
        });
        this.clearPen();
        this.penLoading = false;
      }
    },
    removeStudent(pen) {
      for (const [index, student] in this.students) {
        if (this.students[index].pen == pen) {
          this.students.splice(index, 1);
        }
      }
    },
  },
  props: {
    runType: String,
    credentialType: String,
  },

  computed: {
    computed: {
      ...mapState(useBatchRequestFormStore, [
        "getBatchRequest",
        "getBatchRunTime",
        "getCredential",
      ]),
    },
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
