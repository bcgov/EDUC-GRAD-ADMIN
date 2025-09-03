<template>
  <p class="px-1">
    Search by Personal Education Number(PEN)
  </p>
  <v-row no-gutters class="mb-4" style="overflow-x: hidden;">
    <v-col cols="6">
      <v-text-field id="header-pen-search" density="compact" variant="outlined" size="9" type="search"
        v-model="penInput" maxlength="9" minlength="9" placeholder="Search by PEN" v-on:keyup="keyHandler"
        append-inner-icon="mdi-magnify" @click:appendInner="findStudentByPen" :loading="searchLoading"
        :disabled="searchLoading" color="primary" persistent-placeholder persistent-hint
        :rules="[v => !!v || 'Student PEN is required']"></v-text-field>
    </v-col>
  </v-row>
  <v-row v-if="studentGradStatus.studentStatusName" no-gutters class="mb-4" style="overflow-x: hidden;">
    <v-col cols="6">
      <v-table density="comfortable" aria-label="edit grad status">
        <tbody>
          <!-- Legal Last Name -->
          <tr>
            <td><strong>Legal Surname: </strong></td>
            <td>
              <span>{{ localStudentData.legalLastName }}</span>
            </td>
          </tr>
          <!-- Legal First Name -->
          <tr>
            <td><strong>Legal Given: </strong></td>
            <td>
              <span>{{ localStudentData.legalFirstName }}</span>
            </td>
          </tr>
          <!-- Legal Middle Name -->
          <tr>
            <td><strong>Legal Middle: </strong></td>
            <td>
              <span>{{ localStudentData.legalMiddleNames }}</span>
            </td>
          </tr>
          <!-- DOB -->
          <tr>
            <td><strong>DOB: </strong></td>
            <td>
              <span>{{ localStudentData.dob }}</span>
            </td>
          </tr>
          <!--Gender -->
          <tr>
            <td><strong>Gender Code: </strong></td>
            <td>
              <span>{{ localStudentData.sexCode }}</span>
            </td>
          </tr>
           <!-- Local ID -->
          <tr>
            <td><strong>Local ID: </strong></td>
            <td>
              <span>{{ localStudentData.localID }}</span>
            </td>
          </tr>
          <!-- Postal Code -->
          <tr>
            <td><strong>Postal Code: </strong></td>
            <td>
              <span>{{ localStudentData.postalCode }}</span>
            </td>
          </tr>
          <!-- Student Grade -->
          <tr>
            <td class="w-50"><strong>Grade: </strong></td>
            <td class="w-50">
              <span>{{ localStudentData.studentGrade }}</span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
    <v-col cols="6">
      <v-table density="comfortable" aria-label="edit grad status">
        <tbody>          
          <!-- Program -->
          <tr>
            <td class="w-50"><strong>Program: </strong></td>
            <td class="w-50">
              <span>{{ studentGradStatus?.program }}</span>
            </td>
          </tr>
          <!-- Program completion date -->
          <tr>
            <td><strong>Program completion date: </strong></td>
            <td>
              <span>{{ studentGradStatus?.programCompletionDate ?
                studentGradStatus.programCompletionDate.replace('/', '-') : '' }}</span>
            </td>
          </tr>
          <!-- Student status -->
          <tr>
            <td><strong>Student status: </strong></td>
            <td>
              <span>{{ studentGradStatus?.studentStatusName }}</span>
            </td>
          </tr>
          <!-- School of record -->
          <tr>
            <td><strong>School of record: </strong></td>
            <td>
              <span>{{ studentGradStatus?.schoolAtGradName }}</span>
            </td>
          </tr>
          <!--School at graduation -->
          <tr>
            <td><strong>School at graduation: </strong></td>
            <td>
              <span>{{ studentGradStatus?.schoolAtGradName }}</span>
            </td>
          </tr>
          <!--Honours standing -->
          <tr>
            <td><strong>Honours standing: </strong></td>
            <td>
              <span>{{ studentGradStatus?.honoursStanding }}</span>
            </td>
          </tr>
          <!--Optional Programs -->
          <tr>
              <td><strong>Optional Programs:</strong></td>
              <td>
                <ul
                  class="p-0"
                  v-if="
                    studentOptionalPrograms[0] &&
                    studentOptionalPrograms[0].studentOptionalProgramData
                  "
                  id="optional-programs"
                >
                  <li
                    v-for="item in studentOptionalPrograms"
                    :key="item.optionalProgramCode"
                  >
                    {{ item.optionalProgramName }}
                  </li>
                </ul>
              </td>
            </tr>
          <!-- Adult start date -->
            <tr>
              <td><strong>Adult start date: </strong></td>
              <td>
                <span v-if="studentGradStatus.adultStartDate">{{
                  $filters.formatSimpleDate(studentGradStatus.adultStartDate)
                }}</span>
              </td>
            </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>  
</template>

<script>
import { mapState } from "pinia";
import { useVuelidate } from "@vuelidate/core";
import { isEnvLocalHost } from "../../../../utils/common.js";
import StudentService from "@/services/StudentService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { useAccessStore } from "../../../../store/modules/access.js";

export default {
  name: "StudentLookupByPen",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  props: {    
    studentID: {
      type: String,
      default: '',
    },
    studentData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      localStudentData: {},
      studentGradStatus: {},
      studentOptionalPrograms: [],
      snackbarStore: useSnackbarStore(),
      isEnvLocalHost: isEnvLocalHost(),
      penInput: "",
      searchLoading: false,
      showMore: false,
    };
  },
  created() {},
  components: {
  },
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
  },
  methods: {
    closeRecord: function () {
      this.unsetStudent();
    },
    keyHandler: function (e) {
      if (e.keyCode === 13) {
        //enter key pressed
        if (this.penInput) {
          this.findStudentByPen();
        } 
      }
    },
    findStudentByPen: function () {
      if (this.penInput) {
        this.searchLoading = true;
        this.studentSearchResults = [];
        this.localStudentData = {};
        this.studentGradStatus = {};
        StudentService.getStudentByPen(this.penInput)
          .then((response) => {
            this.searchLoading = false;
            if (response.data.length != 0) {
              this.localStudentData = response.data[0];         
              this.getStudentGradStatus(this.localStudentData.studentID); 
              this.loadStudentOptionalPrograms(this.localStudentData.studentID);
              this.$emit("update:studentData", this.localStudentData);
            } else {
              console.error("No student found with the provided PEN");              
              this.$emit("update:studentData", this.localStudentData);
            }
          })
          .catch((err) => {
            this.searchLoading = false;
            this.snackbarStore.showSnackbar(
              "There was an error: " + err?.response?.status,
              "error",
              5000
            );
          });
        //pen input check
      }
    },
    getStudentGradStatus: function (studentID) {
      StudentService.getGraduationStatus(studentID)
        .then((response) => {
          this.studentGradStatus = response.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(
            "There was an error loading student grad status",
            error
          );
        });
    },
    loadStudentOptionalPrograms: function (studentID) {
      StudentService.getGraduationStatusOptionalPrograms(studentID)
        .then((response) => {
          this.studentOptionalPrograms= response.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(
            "There was an error loading student optional programs",
            error
          );
        });
    },
  },
};
</script>