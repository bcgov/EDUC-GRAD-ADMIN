<template>  
  <v-row no-gutters class="mb-4" v-if="type === 'transfer'">
    <v-col cols="12">     
      <CourseTransfer :sourceStudentData="sourceStudentData" :targetStudentData="targetStudentData" :courseReconciliation="courseReconciliation"/>
    </v-col>
  </v-row>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import CourseTransfer from "@/components/StudentProfile/Forms/wizard/support/CourseTransfer.vue";

  export default {
  name: "CourseReviewAndReconcile",
  components: {
    CourseTransfer,
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
        info: [], // not matched and can be transferred      
        conflicts: [], //matched but different details and cannot be transferred
        errors: [], //rule check (examinable) cannot be transferred
      }
    };
  },
  mounted() {
  },
  validations() {    
  },
  watch: {  
    sourceStudentCourses: {
      immediate: true,
      async handler(newSourceStudentCourses) {
        if(newSourceStudentCourses && newSourceStudentCourses.length > 0) {
            this.compareCourses();
        }        
      }
    },      
  },
  methods: {  
    compareCourses() {
      if (this.sourceStudentCourses?.length > 0) {
        if (this.targetStudentCourses && this.targetStudentCourses?.length > 0) {
          for (const sourceCourse of this.sourceStudentCourses) {
            if (sourceCourse?.courseExam !== null) {
              this.courseReconciliation.errors.push({"source": sourceCourse, "target": null, "message": "Course is examinable"});
            } else {
              const matchedTarget = this.targetStudentCourses.find(targetCourse =>
                this.validateCourse(sourceCourse, targetCourse)
              );
              if (matchedTarget) {
                this.courseReconciliation.conflicts.push({ "source": sourceCourse, "target": matchedTarget, "message": "Course for this session already exists" });
              } else {
                this.courseReconciliation.info.push({ "source": sourceCourse, "target": null, "message": "No validation errors" });
              }
            }
          }
        }
      } else {
        this.courseReconciliation.info = [];
        this.courseReconciliation.conflicts = [];
        this.courseReconciliation.errors = [];
      }
    },    
    validateCourse(sourceCourse, targetCourse) {
      return sourceCourse.courseID === targetCourse.courseID &&
             sourceCourse.courseSession === targetCourse.courseSession;
    }
  },
};
</script>
