<template>
  <v-row no-gutters>
    <v-number-input
      v-model="course.interimPercent"
      label="Interim %"
      variant="outlined"
      density="compact"
    />
    <v-select
      v-model="course.interimLetterGrade"
      label="Interim LG"
      variant="outlined"
      density="compact"
    />
    <v-number-input
      v-model="course.finalPercent"
      label="Final %"
      variant="outlined"
      density="compact"
    />
    <v-select
      v-model="course.finalLetterGrade"
      label="Final LG"
      variant="outlined"
      density="compact"
    />
    <!-- below is populated from course object -->
    <v-select
      v-model="course.credits"
      label="Credits"
      variant="outlined"
      density="compact"
    />
    <v-select
      v-model="course.fineArtsAppliedSkills"
      label="FA/AS"
      variant="outlined"
      density="compact"
    />
    <v-select
      v-model="course.equivalencyOrChallenge"
      label="Eq / Ch"
      variant="outlined"
      density="compact"
    />
  </v-row>
  <!-- Other components for conditionally rendered fields like related course and customized course title here -->
</template>

<script>
import { useStudentStore } from "@/store/modules/student";
import { mapState } from "pinia";

export default {
  name: "CourseDetailsInput",
  props: { courseId: String, sessionDate: String },
  computed: {
    ...mapState(useStudentStore, { courseToAdd: "studentCourseToCreateById" }),
    course() {
      return this.courseToAdd(props.courseId, props.sessionDate);
    },
  },
};
</script>
