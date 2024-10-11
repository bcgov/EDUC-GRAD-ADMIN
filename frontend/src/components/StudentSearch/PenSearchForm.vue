<template>
  <div>
    <v-form @submit.prevent>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Search by PEN:"
            :disabled="searchLoading"
            :loading="searchLoading"
            id="search-by-pen"
            type="search"
            maxlength="9"
            minlength="9"
            v-model="penInput"
            placeholder=""
            ref="penSearch"
            v-on:keyup="keyHandler"
            tabindex="1"
            class="w-50 float-left"
            lazy
            trim
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-btn
        id="search-submit"
        v-on:click="findStudentByPen"
        variant="flat"
        color="primary"
      >
        Search
        <v-progress-circular v-if="searchLoading" indeterminate color="green">
        </v-progress-circular>
      </v-btn>
    </v-form>
    <v-alert
      v-if="searchMessage"
      type="error"
      variant="tonal"
      border="start"
      class="mt-4 mb-0 py-3 width-fit-content"
      :text="searchMessage"
    ></v-alert>
  </div>
</template>
<script>
import { mapActions } from "pinia";
import { useVuelidate } from "@vuelidate/core";
import { isEnvLocalHost } from "../../utils/common.js";
import { useStudentStore } from "@/store/modules/student";
import StudentService from "@/services/StudentService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";

export default {
  name: "penSearchForm",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      isEnvLocalHost: isEnvLocalHost(),
      penInput: "",
      searchLoading: false,
      searchMessage: "", //TODO?
    };
  },
  created() {},
  components: {},
  computed: {},
  methods: {
    ...mapActions(useStudentStore, ["unsetStudent"]),
    closeRecord: function () {
      this.unsetStudent();
    },
    keyHandler: function (e) {
      if (e.keyCode === 13) {
        //enter key pressed
        this.studentSearchResults = [];
        if (this.penInput) {
          this.findStudentByPen();
        } else if (this.surnameInput) {
          this.findStudentBySurname();
        }
      }
    },
    findStudentByStudentIdSample: function (studentId) {
      StudentService.getStudentPen(studentId)
        .then((response) => {
          this.penInput = response.data.pen;
          this.findStudentByPen();
        })
        .catch((error) => {
          if (error.response.status) {
            this.snackbarStore.showSnackbar(
              "There was an error: " + error.response.status,
              "error",
              5000
            );
          }
        });
    },
    findStudentByPen: function () {
      if (this.penInput) {
        this.closeRecord();
        this.searchMessage = "";
        this.searchLoading = true;
        this.studentSearchResults = [];
        StudentService.getStudentByPen(this.penInput)
          .then((response) => {
            if (response.data.length != 0) {
              var studentLastName = response.data[0].legalLastName;
              if (response.data[0].program == null || "") {
                this.studentHasProgram = false;
                this.searchMessage =
                  "Student " +
                  studentLastName +
                  " has a PEN but does not have a GRAD system record. Use TRAX to conduct a PEN student inquiry.";
                this.searchLoading = false;
              } else {
                this.studentHasProgram = true;
                this.selectStudent(response.data);
              }
            } else {
              this.searchMessage =
                "Student cannot be found on the GRAD or PEN database";
              this.searchLoading = false;
              //hides the Pen inqury message
              this.studentHasProgram = true;
            }
          })
          .catch((err) => {
            this.searchLoading = false;
            this.searchMessage = "";
            this.snackbarStore.showSnackbar(
              "There was an error: " + err.response.status,
              "error",
              5000
            );
          });
        //pen input check
      }
    },
    selectStudent: function (student) {
      this.selectedPen = student[0].pen;
      this.selectedId = student[0].studentID;
      this.$router.push({
        path: `/student-profile/${this.selectedId}`,
      });
    },
  },
};
</script>
