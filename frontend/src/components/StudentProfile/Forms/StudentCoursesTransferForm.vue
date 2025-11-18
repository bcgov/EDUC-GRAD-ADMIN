<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="80%">
      <v-card>
        <v-card-title
          ><v-row no-gutters>
            <div class="v-card-title">Transfer Student Courses</div>
            <v-spacer />
            <v-btn
              icon="mdi-close"
              density="compact"
              rounded="sm"
              @click="close"
            />
          </v-row>
          <v-card-subtitle>
            {{ sourceStudentData.pen }} - {{ sourceStudentData.legalLastName }},
            {{ sourceStudentData.legalFirstName }}
            {{ sourceStudentData.legalMiddleNames }}
            <span v-if="targetStudentData?.pen">
              <v-icon>mdi-arrow-right</v-icon>
              {{ targetStudentData.pen }} -
              {{ targetStudentData.legalLastName }},
              {{ targetStudentData.legalFirstName }}
              {{ targetStudentData.legalMiddleNames }}
            </span>
          </v-card-subtitle>
          <v-alert
            v-if="alertAlreadyGraduated"
            density="compact"
            style="font-size: smaller"
            type="warning"
            variant="tonal"
            border="start"
          >
            <p><strong>WARNING</strong></p>
            <p>
              Graduated Student - please ensure these courses can be transferred
              without any impacts to the student's graduation or optional
              program requirements.
            </p>
          </v-alert>
        </v-card-title>
        <div class="progress-container" v-if="validationStep">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <v-stepper alt-labels show-actions v-model="step">
          <template v-slot:default>
            <v-stepper-header>
              <v-stepper-item
                title="Select&nbsp;Student"
                value="1"
                no-wrap
              ></v-stepper-item>
              <v-stepper-item title="Review" value="2"></v-stepper-item>
              <v-stepper-item title="Confirmation" value="3"></v-stepper-item>
            </v-stepper-header>
            <v-stepper-window>
              <v-stepper-window-item value="1">
                <StudentLookupByPen v-model:studentData="targetStudentData" />
                <v-row
                  v-if="sourceStudentData.pen === targetStudentData.pen"
                  no-gutters
                >
                  <v-col cols="12" class="mt-2">
                    <v-alert type="error" dense text>
                      <div class="mb-2">
                        Transferring courses to the same student is not allowed.
                      </div>
                    </v-alert>
                  </v-col>
                </v-row>
              </v-stepper-window-item>
              <v-stepper-window-item value="2">
                <div
                  style="
                    max-height: 60vh;
                    overflow-y: auto;
                    padding-right: 0.5rem;
                  "
                >
                  <CourseReviewAndReconcile
                    :sourceStudentData="sourceStudentData"
                    :targetStudentData="targetStudentData"
                    :sourceStudentCourses="selectedCoursesToTransfer"
                    :targetStudentCourses="targetStudentCourses"
                    type="transfer"
                  />
                </div>
              </v-stepper-window-item>
              <!-- Step 2 -->
              <v-stepper-window-item value="3">
                <div style="max-height: 60vh; overflow-y: auto; padding-right: 0.5rem;">
                <v-expansion-panels multiple>

                  <v-expansion-panel v-for="(message, index) in transferStudentCourseResultsMessages" :key="index"
                    elevation="0" rounded="0" style="background-color: transparent; border:none">
                    <v-alert
                        type="error"
                        border="start"
                        variant="tonal"
                        density="compact"
                        class="my-1"
                    >
                      <span>Error transferring </span>
                      <span class="font-weight-bold">{{ getCourseDisplay(message.id) }}: </span>
                      <span>{{ message.validationIssues[0]?.validationIssueMessage }}</span>
                    </v-alert>
                  </v-expansion-panel>

                </v-expansion-panels>
                <v-alert v-if="coursesToTransfer.length > 0" type="info" class="mb-4" border="start" elevation="2"
                  variant="tonal">
                  <div class="mb-2">
                    You are about to transfer the following courses to student
                    <strong>{{ targetStudentData.pen }} - {{ targetStudentData.legalLastName }}, {{
                      targetStudentData.legalFirstName }}</strong>:
                  </div>
                  <v-row no-gutters v-for="course in coursesToTransfer" :key="course.courseID + course.sessionDate"
                    class="mb-2">
                    <v-col cols="12"><strong>{{ course.courseDetails.courseCode }} {{ course.courseLevel }} -
                        {{
                          $filters.formatYYYYMMStringDate(course.courseSession)
                        }}</strong>
                    </v-col>
                    <v-col cols="12" class="ml-3">
                      {{ course.courseDetails.courseName }}
                    </v-col>
                    <v-row>
                      <v-col class="ml-3"><strong>Interim</strong>&nbsp;
                        <span v-if="course.interimPercent">{{ course.interimPercent }}%
                          {{ course.interimLetterGrade }}</span>
                        <span v-else> <i>null</i> </span>
                      </v-col>
                      <v-col><strong>Final</strong>&nbsp;
                        <span v-if="course.finalPercent">
                          {{ course.finalPercent }}%
                          {{ course.finalLetterGrade }}</span>
                        <span v-else><i>null</i></span></v-col>
                      <!-- I don't think credits can have a null value? - Samara -->
                      <v-col><strong>Credits</strong> {{ course.credits }}</v-col>
                      <v-col><strong>FA/AS</strong>&nbsp;
                        <span v-if="course.fineArtsAppliedSkills">
                          {{ course.fineArtsAppliedSkills }}
                        </span>
                        <span v-else><i>null</i></span>
                      </v-col>
                      <v-col><strong>Eq/Ch</strong>&nbsp;
                        <span v-if="course.equivOrChallenge">
                          {{ course.equivOrChallenge }}
                        </span>
                        <span v-else><i>null</i></span>
                      </v-col>
                      <v-col cols="12" class="ml-3" v-if="course.customizedCourseName"><strong>Custom Course
                          Title</strong>
                        {{ course.customizedCourseName }}</v-col>
                    </v-row>
                  </v-row>
                </v-alert>
                </div>
              </v-stepper-window-item>
            </v-stepper-window>
          </template>
        </v-stepper>
        <v-card-actions>
          <v-btn
            v-if="step == 0"
            color="error"
            variant="outlined"
            class="text-none"
            @click="close"
            >Cancel</v-btn
          >
          <v-btn
            v-else-if="step <= 2"
            @click="step--"
            color="bcGovBlue"
            variant="outlined"
            :disabled="
              validationStep ||
              (transferStudentCourseResultsMessages &&
                transferStudentCourseResultsMessages.length > 0)
            "
            >Back</v-btn
          >
          <v-spacer />
          <v-btn
            v-if="step === 0 || (step === 1 && coursesToTransfer.length > 0)"
            @click="step++"
            color="bcGovBlue"
            variant="outlined"
            :disabled="
              validationStep ||
              (step === 1 && coursesToTransfer.length === 0) ||
              (step === 0 && v$.$invalid) ||
              sourceStudentData.pen === targetStudentData.pen
            "
            >Next</v-btn
          >
          <v-btn
            v-else-if="step == 2 && coursesToTransfer.length > 0"
            :disabled="validationStep"
            :loading="loadingTransfer"
            color="error"
            variant="flat"
            class="text-none"
            @click="submitForm"
          >
            Transfer Student Courses
          </v-btn>
          <v-btn
            v-else-if="!validationStep"
            color="bcGovBlue"
            variant="flat"
            class="text-none"
            @click="close"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import { useStudentStore } from "@/store/modules/student";
import StudentLookupByPen from "@/components/StudentProfile/Forms/FormInputs/StudentLookupByPen.vue";
import CourseReviewAndReconcile from "@/components/StudentProfile/Forms/wizard/CourseReviewAndReconcile.vue";
import StudentService from "@/services/StudentService.js";
import { mapState, mapActions } from "pinia";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "StudentCoursesTransferForm",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  components: {
    StudentLookupByPen,
    CourseReviewAndReconcile,
  },
  props: {
    selectedCoursesToTransfer: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      snackbarStore: useSnackbarStore(),
      step: 0,
      sourceStudentData: this.sourceStudent || {},
      targetStudentData: {},
      sourceStudentCourses: this.selectedCoursesToTransfer || [],
      targetStudentCourses: [],
      alertAlreadyGraduated: false,
      transferStudentCourseResultsMessages: [],
      validationStep: false,
      loadingTransfer: false
    };
  },
  computed: {
    studentStore() {
      return useStudentStore();
    },
    sourceStudent() {
      return this.studentStore.student.profile;
    },
    ...mapState(useStudentStore, {
      coursesToTransfer: (state) => state.transfer.courses,
    }),
  },
  watch: {
    targetStudentData: {
      immediate: true,
      async handler(newTargetStudentData) {
        if (newTargetStudentData && newTargetStudentData.studentID) {
          this.validationStep = true;
          let response = await StudentService.getStudentCourses(
            newTargetStudentData.studentID
          );
          this.targetStudentCourses = response.data || [];
          this.validationStep = false;
        }
      },
    },
    sourceStudent: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.sourceStudentData = newVal;
        }
      },
    },
  },
  validations: {
    targetStudentData: {
      studentID: { required },
      pen: { required },
    },
    sourceStudentData: {
      studentID: { required },
      pen: { required },
    },
  },
  methods: {
    ...mapActions(useStudentStore, [
      "addCoursesToTransfer",
      "removeCourseFromTransfer",
      "clearCoursesToTransfer",
      "transferStudentCourses",
      "loadStudentCourseHistory",
    ]),
    close() {
      this.dialog = false;
      this.clearForm();
      this.$emit("close");
    },
    clearForm() {
      this.step = 0;
      this.targetStudentData = {};
      this.sourceStudentCourses = [];
      this.targetStudentCourses = [];
      this.transferStudentCourseResultsMessages = [];
      this.validationStep = false;
    },
    openTransferStudentCoursesDialog() {
      this.alertAlreadyGraduated =
        this.studentStore.student.gradStatus?.program !== "SCCP" &&
        this.studentStore.student.gradStatus?.programCompletionDate;

      this.transferStudentCourseResultsMessages = [];
      this.clearCoursesToTransfer();
      this.clearForm();
      this.dialog = true;
    },
    async submitForm() {
      this.transferStudentCourseResultsMessages = [];
      const studentCourseIDs = this.coursesToTransfer.map(x => x.id);
      this.loadingTransfer = true
      try {
        await this.transferStudentCourses(this.sourceStudentData.studentID, this.targetStudentData.studentID, studentCourseIDs).then((response) => {
          if(!response?.length) {
            this.snackbarStore.showSnackbar(
                "Successfully transferred courses",
                "success",
                5000);
            this.loadStudentCourseHistory(this.sourceStudentData.studentID);
            this.loadStudentCourseHistory(this.targetStudentData.studentID);
            this.close();
          } else {
            this.transferStudentCourseResultsMessages = response;
          }
          this.loadingTransfer = false;
        });
      } catch (error) {
        this.loadingTransfer = false;
        console.error("Error transferring student courses:", error);
        this.snackbarStore.showSnackbar(
          "Failed to transfer student courses",
          "error",
          10000
        );
      }
    },
    getCourseDisplay(studentCourseID) {
      const course = this.coursesToTransfer.find(x => x.id === studentCourseID);
      if(!course) {
        return null;
      }
      return course?.courseDetails?.courseName + " - " + course?.courseSession;
    }
  },
};
</script>
<style scoped>
.progress-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999999999 !important;
}
</style>
