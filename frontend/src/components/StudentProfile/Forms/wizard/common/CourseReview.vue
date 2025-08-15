<template>
  <v-row no-gutters :key="course.courseID + course.sessionDate" class="mb-2" style="font-size: 1rem">
    <v-col cols="12"><strong>{{ course.courseDetails.courseCode }} {{ course.courseLevel }} -
        {{
          $filters.formatYYYYMMStringDate(course.courseSession)
        }}</strong>
      {{ course.courseDetails.courseName }}
    </v-col>
    <v-row v-if="course.courseExam !== null" class="px-0 py-1" style="font-size: 0.875rem;" no-gutters>
      <v-col class="pa-0 mr-2" cols="auto">
        <strong>School %</strong>&nbsp;
        <span v-if="course.courseExam.schoolPercentage">{{ course.courseExam.schoolPercentage }}</span>
        <span v-else><i>null</i></span>
      </v-col>

      <v-col class="pa-0 mr-2" cols="auto">
        <strong>Best School %</strong>&nbsp;
        <span v-if="course.courseExam.bestSchoolPercentage">{{ course.courseExam.bestSchoolPercentage }}</span>
        <span v-else><i>null</i></span>
      </v-col>

      <v-col class="pa-0  mr-2" cols="auto">
        <strong>Special Case </strong>
        <span v-if="course.courseExam.specialCase">
            {{ course.courseExam.specialCase }}
        </span>
        <span v-else><i>null</i></span>
      </v-col>

      <v-col class="pa-0 mr-2" cols="auto">
        <strong>Exam Best %</strong>&nbsp;
        <span v-if="course.courseExam.bestExamPercentage">{{ course.courseExam.bestExamPercentage }}</span>
        <span v-else><i>null</i></span>
      </v-col>

      <v-col class="pa-0  mr-2" cols="auto">
        <strong>Final</strong>&nbsp;
        <span v-if="course.finalPercent">
          {{ course.finalPercent }}% {{ course.finalLetterGrade }}
        </span>
        <span v-else><i>null</i></span>
      </v-col>

      <v-col class="pa-0" cols="auto">
        <strong>Credits </strong>
        <span v-if="course.credits">
            {{ course.credits }}
        </span>
        <span v-else><i>null</i></span>
      </v-col>
    </v-row>
    <v-row v-else class="px-0 py-1" style="font-size: 0.875rem;" no-gutters>
      <v-col class="pa-0  mr-2" cols="auto">
        <strong>Interim</strong>&nbsp;
        <span v-if="course.interimPercent">
          {{ course.interimPercent }}% {{ course.interimLetterGrade }}
        </span>
        <span v-else><i>null</i></span>
      </v-col>

      <v-col class="pa-0  mr-2" cols="auto">
        <strong>Final</strong>&nbsp;
        <span v-if="course.finalPercent">
          {{ course.finalPercent }}% {{ course.finalLetterGrade }}
        </span>
        <span v-else><i>null</i></span>
      </v-col>

      <v-col class="pa-0  mr-2" cols="auto">
        <strong>Credits</strong> {{ course.credits }}
      </v-col>

      <v-col class="pa-0  mr-2" cols="auto">
        <strong>FA/AS</strong>&nbsp;
        <span v-if="course.fineArtsAppliedSkills">
          {{ course.fineArtsAppliedSkills }}
        </span>
        <span v-else><i>null</i></span>
      </v-col>

      <v-col class="pa-0  mr-2" cols="auto">
        <strong>Eq/Ch</strong>&nbsp;
        <span v-if="course.equivOrChallenge">
          {{ course.equivOrChallenge }}
        </span>
        <span v-else><i>null</i></span>
      </v-col>

      <v-col class="pa-0" cols="12" v-if="course.customizedCourseName">
        <strong>Custom Course Title</strong> {{ course.customizedCourseName }}
      </v-col>
    </v-row>
  </v-row>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";

export default {
  name: "CourseReview",
  setup() {
    return { v$: useVuelidate() };
  },
  computed: {

  },
  props: {
    course: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  validations() {
  },
  watch: {
  },
  methods: {
  },
};
</script>
