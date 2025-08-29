<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="80%">
      <v-card>
        <v-card-title><v-row no-gutters>
            <div class="v-card-title">Student Merge</div>
            <v-spacer /> <v-btn icon="mdi-close" density="compact" rounded="sm" @click="close" />
          </v-row>
          <v-card-subtitle>
            {{ step }}
            {{ sourceStudentData.pen }} - {{ sourceStudentData.legalLastName }}, {{ sourceStudentData.legalFirstName }}
            {{ sourceStudentData.legalMiddleNames }}
            <span v-if="targetStudentData?.pen">
              <v-icon>mdi-arrow-right</v-icon>
              {{ targetStudentData.pen }} - {{ targetStudentData.legalLastName }}, {{ targetStudentData.legalFirstName
              }}
              {{ targetStudentData.legalMiddleNames }}
            </span>
          </v-card-subtitle>
        </v-card-title>
        <div class="progress-container" v-if="validationStep">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <v-stepper alt-labels show-actions v-model="step">
          <template v-slot:default>
            <v-stepper-header>
              <v-stepper-item title="Examinable&nbsp;Courses" value="1"></v-stepper-item>
              <v-stepper-item value="2">
                <template #title>
                  <span class="text-no-wrap">Non-Examinable&nbsp;Courses</span>
                </template>
              </v-stepper-item>
              <v-stepper-item title="Assessment&nbsp;Data" value="3"></v-stepper-item>
              <v-stepper-item title="Grad&nbsp;Status" value="4" no-wrap></v-stepper-item>
              <v-stepper-item title="Confirmation" value="5"></v-stepper-item>
            </v-stepper-header>
            <v-stepper-window>
              <!-- Step 1 -->
              <v-stepper-window-item value="1">
                <div style="max-height: 60vh; overflow-y: auto; padding-right: 0.5rem;">
                  <CourseReviewAndReconcile :sourceStudentData="sourceStudentData"
                    :targetStudentData="targetStudentData"
                    :sourceStudentCourses="sourceStudentReconcileData.examinableCourses"
                    :targetStudentCourses="targetStudentReconcileData.examinableCourses" type="examinablecoursemerge" />
                </div>
              </v-stepper-window-item>
              <!-- Step 2 -->
              <v-stepper-window-item value="2">
                <div style="max-height: 60vh; overflow-y: auto; padding-right: 0.5rem;">
                  <CourseReviewAndReconcile :sourceStudentData="sourceStudentData"
                    :targetStudentData="targetStudentData"
                    :sourceStudentCourses="sourceStudentReconcileData.nonExaminableCourses"
                    :targetStudentCourses="targetStudentReconcileData.nonExaminableCourses"
                    type="nonexaminablecoursemerge" />
                </div>
              </v-stepper-window-item>


              <!-- Step 3 -->
              <v-stepper-window-item value="3">
                <div style="max-height: 60vh; overflow-y: auto; padding-right: 0.5rem;">

                  <AssessmentReviewAndReconcile :sourceStudentData="sourceStudentData"
                    :targetStudentData="targetStudentData"
                    :sourceStudentAssessments="sourceStudentReconcileData.assessments"
                    :targetStudentAssessments="targetStudentReconcileData.assessments" type="assessmentMerge" />

                </div>
              </v-stepper-window-item>
              <!-- Step 4 -->
              <!-- Step 5 -->
            </v-stepper-window>
          </template>
        </v-stepper>
        <v-card-actions>
          <v-btn v-if="step == 0" color="error" variant="outlined" class="text-none" @click="close">Cancel</v-btn>
          <v-btn v-else-if="step >= 1 && step <= 4" @click="step--" color="bcGovBlue" variant="outlined"
            :disabled="validationStep">Back</v-btn>
          <v-spacer />
          <v-btn v-if="step === 0" color="error" variant="flat" class="text-none" @click="saveExaminableStudentCourses"
            :disabled="validationStep || !(studentDataToMerge.examinableCourses.info.length > 0 || studentDataToMerge.examinableCourses.conflicts.length > 0)">Save
            Examinable Courses</v-btn>
          <v-btn v-if="step === 1" color="error" variant="flat" class="text-none"
            @click="saveNonExaminableStudentCourses"
            :disabled="validationStep || !(studentDataToMerge.nonExaminableCourses.info.length > 0 || studentDataToMerge.nonExaminableCourses.conflicts.length > 0)">Save
            Non-Examinable Courses</v-btn>
          <v-btn v-if="step === 2" @click="saveAssessments" color="error" variant="flat" class="text-none">Save
            Assessments</v-btn>
          <v-btn v-if="step === 2" @click="step++" color="error" variant="flat" class="text-none">Save</v-btn>



          <v-btn v-if="step === 3" @click="step++" color="error" variant="flat" class="text-none">Save</v-btn>
          <v-btn v-if="step < 4" color="bcGovBlue" variant="flat" class="text-none" @click="step++">Next</v-btn>
          <v-btn v-if="step === 4" @click="step++" color="error" variant="flat" class="text-none">Complete
            Reconciliation</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import { useStudentStore } from "@/store/modules/student";
import StudentService from "@/services/StudentService.js";
import StudentAssessmentService from "@/services/StudentAssessmentService.js";
import { mapState, mapActions } from "pinia";
import { toRaw } from "vue";
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import CourseReviewAndReconcile from "@/components/StudentProfile/Forms/wizard/CourseReviewAndReconcile.vue";
import AssessmentReviewAndReconcile from "@/components/StudentProfile/Forms/wizard/AssessmentReviewAndReconcile.vue";

export default {
  name: "StudentDataMergeForm",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  components: {
    CourseReviewAndReconcile,
    AssessmentReviewAndReconcile,
  },
  props: {
  },
  data() {
    return {
      dialog: false,
      snackbarStore: useSnackbarStore(),
      step: 0,
      sourceStudentData: this.sourceStudent || {},
      targetStudentData: {},
      sourceStudentReconcileData: {
        examinableCourses: [],
        nonExaminableCourses: [],
        assessments: [],
        gradStatus: {},
        notes: [],
      },
      targetStudentReconcileData: {
        examinableCourses: [],
        nonExaminableCourses: [],
        assessments: [],
        gradStatus: {},
        notes: [],
      },
      validationStep: false,
    };
  },
  computed: {
    ...mapState(useStudentStore, {
      studentDataToMerge: (state) => state.merge
    }),
    studentStore() {
      return useStudentStore();
    },
    sourceStudent() {
      return this.studentStore.student.profile;
    },
    trueStudentPen() {
      return this.studentStore.student.profile.trueStudentPen;
    },
  },
  watch: {
    sourceStudent: {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          this.sourceStudentData = newVal;
          if (this.sourceStudentData.studentID) {
            let studentCourses = await this.fetchStudentCourses(this.sourceStudentData.studentID);
            this.sourceStudentReconcileData.examinableCourses = studentCourses.filter(course => course.courseExam !== null);
            this.sourceStudentReconcileData.nonExaminableCourses = studentCourses.filter(course => course.courseExam === null);
            let studentAssessments = await this.fetchStudentAssessments(this.sourceStudentData.studentID);
            this.sourceStudentReconcileData.assessments = studentAssessments;
          }
        }
      }
    },
    trueStudentPen: {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          await this.populateTargetStudentData(newVal);
          if (this.targetStudentData.studentID) {
            await this.refreshTargetStudentData(this.targetStudentData.studentID)
          }
        }
      }
    }
  },
  validations: {
    targetStudentData: {
      studentID: { required },
      pen: { required }
    },
    sourceStudentData: {
      studentID: { required },
      pen: { required }
    }
  },
  methods: {
    ...mapActions(useStudentStore, [
      "clearExaminableCoursesToMerge",
      "clearNonExaminableCoursesToMerge",
      "clearAssessmentsToMerge",
      "clearGradStatusToMerge",
      "clearNotesToMerge",
      "clearStudentMerge",
      "mergeStudentCourses",
      "getStudentCourses",
      "mergeStudentAssessments",
      "loadStudentGradStatus"
    ]),
    close() {
      this.dialog = false;
      this.clearForm();
      this.refreshTargetStudentData(this.targetStudentData.studentID);
      this.$emit('close');
    },
    clearForm() {
      this.step = 0;
      this.clearStudentMerge();
      this.validationStep = false;
    },
    openStudentDataMergeDialog() {
      this.clearForm();
      this.dialog = true;
    },
    async populateTargetStudentData(truePen) {
      if (truePen) {
        await StudentService.getStudentByPen(truePen)
          .then((response) => {
            if (response.data.length != 0) {
              this.targetStudentData = response.data[0];
            } else {
              console.error("No student found with the provided PEN");
            }
          })
          .catch((err) => {
            this.snackbarStore.showSnackbar(
              "There was an error: " + err?.response?.status,
              "error",
              5000
            );
          });
      }
    },
    async fetchStudentAssessments(studentID) {

      if (!studentID) return [];
      try {
        let sort = {
          "assessmentEntity.assessmentTypeCode": "ASC",
        };
        let searchParams = {
          studentId: studentID,
        };
        const response = await StudentAssessmentService.getStudentAssessmentsBySearchCriteria(
          searchParams,
          sort,
          1,
          1000
        );
        console.log(response)
        if (response.data !== null) {
          return response.data.content;
        } else {
          console.error("No student assessments found with the provided ID", studentID);
          return [];
        }
      } catch (err) {
        this.snackbarStore.showSnackbar(
          "There was an error fetching assessments: " + (err?.response?.status || "Unknown"),
          "error",
          5000
        );
        return [];
      }



    },
    async fetchStudentCourses(studentID) {
      if (!studentID) return [];
      try {
        const response = await StudentService.getStudentCourses(studentID);
        if (response.data !== null) {
          return response.data;
        } else {
          console.error("No student courses found with the provided ID", studentID);
          return [];
        }
      } catch (err) {
        this.snackbarStore.showSnackbar(
          "There was an error fetching courses: " + (err?.response?.status || "Unknown"),
          "error",
          5000
        );
        return [];
      }
    },
    async saveAssessments() {
      this.validationStep = true;
      const response = await this.persistStudentAssessments(this.studentDataToMerge.assessments);
      if (response.status === 200) {
        this.clearAssessmentsToMerge();
        let studentAssessments = await this.fetchStudentCourses(this.targetStudentData.studentID);
        this.targetStudentReconcileData.assessments = studentAssessments
        this.snackbarStore.showSnackbar("Successfully merged examinable courses", "success", 10000, "Student course");
        this.validationStep = false;
        //this.step++; Enable this option if needed to save and continue to next tab.
      } else {
        this.snackbarStore.showSnackbar("Failed to merge examinable courses", "error", 10000, "Student course");
        this.validationStep = false;
      }
    },
    async saveExaminableStudentCourses() {
      this.validationStep = true;
      const response = await this.persistStudentCourses(true, this.studentDataToMerge.examinableCourses);
      if (response.status === 200) {
        this.clearExaminableCoursesToMerge();
        let studentCourses = await this.fetchStudentCourses(this.targetStudentData.studentID);
        this.targetStudentReconcileData.examinableCourses = studentCourses.filter(course => course.courseExam !== null);
        this.snackbarStore.showSnackbar("Successfully merged examinable courses", "success", 10000, "Student course");
        this.validationStep = false;
        //this.step++; Enable this option if needed to save and continue to next tab.
      } else {
        this.snackbarStore.showSnackbar("Failed to merge examinable courses", "error", 10000, "Student course");
        this.validationStep = false;
      }
    },
    async saveNonExaminableStudentCourses() {
      this.validationStep = true;
      const response = await this.persistStudentCourses(false, this.studentDataToMerge.nonExaminableCourses);
      if (response.status === 200) {
        this.clearNonExaminableCoursesToMerge();
        let studentCourses = await this.fetchStudentCourses(this.targetStudentData.studentID);
        this.targetStudentReconcileData.nonExaminableCourses = studentCourses.filter(course => course.courseExam === null);
        this.snackbarStore.showSnackbar("Successfully merged non-examinable courses", "success", 10000, "Student course");
        this.validationStep = false;
        //this.step++; Enable this option if needed to save and continue to next tab.
      } else {
        this.snackbarStore.showSnackbar("Failed to merge non-examinable courses", "error", 10000, "Student course");
        this.validationStep = false;
      }
    },
    async persistStudentAssessments(studentAssessments) {
      this.mergeStudentAssessmentsResultsMessages = [];
      let localStudentAssessments = { ...studentAssessments };
      localStudentAssessments.info = localStudentAssessments.info.length > 0 ? this.normalizedAssessmentMergeData(localStudentAssessments.info) : [];
      localStudentAssessments.conflicts = localStudentAssessments.conflicts.length > 0 ? this.normalizedAssessmentMergeData(localStudentAssessments.conflicts) : [];
      const { errors, ...mergeStudentAssessments } = localStudentAssessments;
      const mergeStudentAssessmentsRequestBody = toRaw(mergeStudentAssessments);
      try {
        return await this.mergeStudentAssessments(this.sourceStudentData.studentID, this.targetStudentData.studentID, mergeStudentAssessmentsRequestBody);
      } catch (error) {
        console.error("Error merging student assessments:", error);
        this.snackbarStore.showSnackbar("Failed to merge student assessments", "error", 10000, "Student course");
      }
    },
    async persistStudentCourses(isExaminable, studentCourses) {
      this.mergeStudentCourseResultsMessages = [];
      let localStudentCourses = { ...studentCourses };
      localStudentCourses.info = localStudentCourses.info.length > 0 ? this.normalizedCourseMergeData(localStudentCourses.info, isExaminable) : [];
      localStudentCourses.conflicts = localStudentCourses.conflicts.length > 0 ? this.normalizedCourseMergeData(localStudentCourses.conflicts, isExaminable) : [];
      const { errors, ...mergeStudentCourses } = localStudentCourses;
      const mergeStudentCoursesRequestBody = toRaw(mergeStudentCourses);
      try {
        return await this.mergeStudentCourses(this.sourceStudentData.studentID, this.targetStudentData.studentID, mergeStudentCoursesRequestBody);
      } catch (error) {
        console.error("Error merging student courses:", error);
        this.snackbarStore.showSnackbar("Failed to merge student courses", "error", 10000, "Student course");
      }
    },
    normalizedCourseMergeData(studentCoursesData, isExaminable) {
      const studentCoursesDataWithoutMessage = studentCoursesData.map(({ message, ...rest }) => rest)
      const normalizedCourseData = studentCoursesDataWithoutMessage.map(item => {
        const { courseDetails: _sCourseDetails, relatedCourseDetails: _sRelated, createUser: _sCreateUser, createDate: _sCreateDate, updateUser: _sUpdateUser, updateDate: _sUpdateDate, isExaminable: isExaminable, ...normalizedSource } = item.source;
        if (item.source.courseExam !== null) {
          const { createUser, createDate, updateUser, updateDate, id, ...restCourseExam } = item.source.courseExam;
          normalizedSource.courseExam = restCourseExam;
        }

        let normalizedTarget = {};
        if (item.target) {
          const { courseDetails: _tCourseDetails, relatedCourseDetails: _tRelated, createUser: _tCreateUser, createDate: _tCreateDate, updateUser: _tUpdateUser, updateDate: _tUpdateDate, isExaminable: isExaminable, ...restTarget } = item.target;
          normalizedTarget = restTarget;
          if (item.target.courseExam !== null) {
            const { createUser, createDate, updateUser, updateDate, id, ...restCourseExam } = item.target.courseExam;
            normalizedTarget.courseExam = restCourseExam;
          }
        }
        return {
          ...item,
          source: normalizedSource,
          target: normalizedTarget
        };
      });
      return normalizedCourseData;
    },
    async refreshTargetStudentData(studentID) {
      await this.refreshTargetStudentCourses(studentID);
      await this.refreshTargetStudentAssessments(studentID);
    },
    async refreshTargetStudentAssessments(studentID) {
      let studentAssessments = await this.fetchStudentAssessments(studentID);
      this.targetStudentReconcileData.assessments = studentAssessments
    },
    async refreshTargetStudentCourses(studentID) {
      let studentCourses = await this.fetchStudentCourses(studentID);
      this.targetStudentReconcileData.examinableCourses = studentCourses.filter(course => course.courseExam !== null);
      this.targetStudentReconcileData.nonExaminableCourses = studentCourses.filter(course => course.courseExam === null);
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