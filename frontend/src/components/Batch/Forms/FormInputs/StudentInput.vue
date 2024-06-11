<template>
  <v-container>
    <v-card>
      <v-card-title>Include Student(s)</v-card-title>
      <v-card-text>
        <v-row>
          {{ getStudents }}
          <v-col cols="12">
            <v-label>Personal Education Number</v-label>
            <v-text-field
              v-model="pen"
              @input="validateStudent"
              type="number"
              class="mr-2"
            ></v-text-field>
            <v-row v-for="error in v$.pen.$errors" :key="error.$uid">
              <v-col>
                <v-alert type="error">{{ error.$message }}</v-alert>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row v-if="penStudentInfo">
          <v-card>
            <v-card-text>
              <v-alert v-if="validationMessage" dismissible type="error">
                {{ validationMessage }}
              </v-alert>

              <div v-if="!penStudentInfo">NOT VALID</div>
              <div v-else>
                <strong>First Name:</strong> {{ penStudentInfo.firstName
                }}<br />
                <strong>Last Name:</strong> {{ penStudentInfo.lastName }}<br />
                <strong>Birthdate:</strong> {{ penStudentInfo.dob }}<br />
                <strong>Status:</strong> {{ penStudentInfo.status }}<br />
                <strong>Program:</strong> {{ penStudentInfo.program }}<br />
                <strong>School of Record</strong>
                {{ penStudentInfo.schoolOfRecord }}<br />
                <strong>School at Graduation</strong>
                {{ penStudentInfo.schoolAtGrad }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="addStudent()" :disabled="validationMessage !== ''">
                Add Student
              </v-btn>
              <v-btn @click="clearPen" text> Clear </v-btn>
            </v-card-actions>
          </v-card>
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
                <v-btn @click="removeStudent(item.columns.pen)" color="primary">
                  Remove
                </v-btn>
              </template>
              <template v-slot:item.info="{ item }">
                <div>
                  <strong>Name:</strong> {{ item.columns.info.firstName }}
                  {{ item.columns.info.lastName }}
                </div>
                <div>
                  <strong>Birthdate:</strong> {{ item.columns.info.dob }}
                </div>
                <div>
                  <strong>Status:</strong> {{ item.columns.info.status }}
                </div>
                <div>
                  <strong>Program:</strong> {{ item.columns.info.program }}
                </div>
                <div>
                  <strong>School of Record:</strong>
                  {{ item.columns.info.schoolOfRecord }}
                </div>
                <div>
                  <strong>School At Graduation:</strong>
                  {{ item.columns.info.schoolAtGrad }}
                </div>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
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
import { required, minLength, helpers } from "@vuelidate/validators";

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
        async isValid(value) {
          console.log("CAIDATIING");
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
      studentInputFields: [
        {
          key: "pen",
          title: "pen",
          sortable: true,
          class: "text-left col-2",
        },
        {
          key: "info",
          title: "info",
          sortable: true,
          class: "text-left",
        },
        {
          key: "remove",
          title: "remove",
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
      this.clearPen();
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
    credentialType: String,
    runType: String,
  },

  computed: {
    computed: {
      ...mapState(useBatchRequestFormStore, [
        "getBatchRequest",
        "getBatchRunTime",
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
