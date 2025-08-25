<template>
  <v-row no-gutters class="mb-4" v-if="type === 'transfer'">
    <v-col cols="12">
      <CourseTransfer :sourceStudentData="sourceStudentData" :targetStudentData="targetStudentData" :courseReconciliation="courseReconciliation" />
    </v-col>
  </v-row>
  <v-row no-gutters class="mb-4" v-if="type === 'examinablecoursemerge'">
    <v-col cols="12">
      <ExaminableCourseMerge :sourceStudentData="sourceStudentData" :targetStudentData="targetStudentData" :courseReconciliation="courseReconciliation" />
    </v-col>
  </v-row>
  <v-row no-gutters class="mb-4" v-if="type === 'nonexaminablecoursemerge'">
    <v-col cols="12">
      <NonExaminableCourseMerge :sourceStudentData="sourceStudentData" :targetStudentData="targetStudentData" :courseReconciliation="courseReconciliation" />
    </v-col>
  </v-row>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import CourseTransfer from "./support/course/CourseTransfer.vue";
import ExaminableCourseMerge from "./support/course/ExaminableCourseMerge.vue";
import NonExaminableCourseMerge from "./support/course/NonExaminableCourseMerge.vue";

  export default {
  name: "CourseReviewAndReconcile",
  components: {
    CourseTransfer,
    ExaminableCourseMerge,
    NonExaminableCourseMerge,
  },
  setup() {
    return { v$: useVuelidate() };
  },
  computed: {    
  },
  props: {
    sourceStudentData: {
        type: Object,
        required: true
    },
    targetStudentData: {
        type: Object,
        required: true
    },   
    sourceStudentCourses: {
        type: Array,
        required: true
    },
    targetStudentCourses: {
        type: Array,
        required: true
    }, 
    type: {
      type: String,
      default: '', // 'transfer' or 'merge'
      required: true
    }
  },
  data() {
    return {
      courseReconciliation: {                
        conflicts: [], //matched but different details and cannot be transferred
        info: [], // not matched and can be transferred      
        errors: [], //rule check (examinable) cannot be transferred
      }
    };
  },
  mounted() {
  },
  validations() {    
  },
  watch: {
    type: {
      immediate: true,
      async handler(newVal) {
        if (newVal === "examinablecoursemerge" || newVal === "nonexaminablecoursemerge") {
          this.reconcileForMerge();
        }
        if (newVal === "transfer") {
          this.reconcileForTransfer();
        }
      }
    },
    targetStudentCourses: {
      immediate: true,
      async handler(newVal) {
        if (this.type === "examinablecoursemerge" || this.type === "nonexaminablecoursemerge") {
          this.reconcileForMerge();
        }
        //No reload on transfer flow
      }
    },
  },
  methods: {
    resetCourseReconciliation() {
      this.courseReconciliation.conflicts = [];
      this.courseReconciliation.info = [];
      this.courseReconciliation.errors = [];
    },  
    reconcileForMerge() {
      this.resetCourseReconciliation();
      if (this.sourceStudentCourses.length > 0) {
        //Source not empty & target empty/not empty
        for (const sourceCourse of this.sourceStudentCourses) {
          const matchedTarget = this.getMatchedCourse(sourceCourse, this.targetStudentCourses);
          const isExaminableWithResult = matchedTarget && matchedTarget?.courseExam !== null && matchedTarget.courseExam.examPercentage && matchedTarget.courseExam.examPercentage >= 0;
          if (isExaminableWithResult) {
            this.courseReconciliation.errors.push({ "source": sourceCourse, "target": matchedTarget, "message": "Course is examinable with exam %" });
          } else {
            if (matchedTarget) {
              this.courseReconciliation.conflicts.push({ "source": sourceCourse, "target": matchedTarget, "message": "Course for this session already exists" });
            } else {
              this.courseReconciliation.info.push({ "source": sourceCourse, "target": matchedTarget, "message": "" });
            }
          }
        }
        for (const targetCourse of this.targetStudentCourses) {
          const matchedSource = this.getMatchedCourse(targetCourse, this.sourceStudentCourses);
          if (!matchedSource) {
            this.courseReconciliation.info.push({ "source": matchedSource, "target": targetCourse, "message": "" });
          }
        }
      } else {
        //Source is empty and target is not empty
        for (const targetCourse of this.targetStudentCourses) {
          const isExaminableWithResult = targetCourse?.courseExam !== null && targetCourse.courseExam.examPercentage && targetCourse.courseExam.examPercentage >= 0;
          if (isExaminableWithResult) {
            this.courseReconciliation.errors.push({ "source": null, "target": targetCourse, "message": "Course is examinable with exam %" });
          } else {
            this.courseReconciliation.info.push({ "source": null, "target": targetCourse, "message": "" });
          }
        }
      }
    },
    reconcileForTransfer() {
      this.resetCourseReconciliation();
      if (this.sourceStudentCourses?.length > 0) {
        if (this.targetStudentCourses && this.targetStudentCourses?.length > 0) {
          for (const sourceCourse of this.sourceStudentCourses) {
            if (sourceCourse?.courseExam !== null) {
              this.courseReconciliation.errors.push({ "source": sourceCourse, "target": null, "message": "Course is examinable" });
            } else {
              const matchedTarget = this.getMatchedCourse(sourceCourse, this.targetStudentCourses);
              if (matchedTarget) {
                this.courseReconciliation.conflicts.push({ "source": sourceCourse, "target": matchedTarget, "message": "Course for this session already exists" });
              } else {
                this.courseReconciliation.info.push({ "source": sourceCourse, "target": null, "message": "No validation errors" });
              }
            }
          }
        }
      } else if (this.sourceStudentCourses.length === 0 && this.targetStudentCourses.length > 0) {
        for (const course of this.targetStudentCourses) {
          if (course.courseExam !== null && course.courseExam.examPercentage !== null) {
            this.courseReconciliation.errors.push({ "source": null, "target": course, "message": "" });
          } else {
            this.courseReconciliation.info.push({ "source": null, "target": course, "message": "" });
          }
        }
      }
    },    
    getMatchedCourse(course, studentCourses) {
      if (course && studentCourses && studentCourses.length > 0) {
        return studentCourses.find(item => this.validateCourse(course, item));
      }
      return null;
    },
    validateCourse(sourceCourse, targetCourse) {
      return sourceCourse.courseID === targetCourse.courseID &&
        sourceCourse.courseSession === targetCourse.courseSession;
    }
  },
};
</script>
