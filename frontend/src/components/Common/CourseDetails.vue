<template>
  <div v-if="course">
    <v-dialog v-model="courseDialog" max-width="600px">
      <template v-slot:activator="{ props }">
        <v-btn variant="plain" v-bind="props" class="m-1 p-1 text-left v-btn-link">
          {{ course.courseName }}</v-btn>
      </template>
      <v-card>
        <v-card-title><v-row no-gutters>
            <div class="v-card-title">{{ course.courseName }}</div>
            <v-spacer />
            <v-btn icon="mdi-close" density="compact" rounded="sm" variant="outlined" color="error" class="mt-2"
              @click="this.courseDialog = false" />
          </v-row></v-card-title>
        <v-card-text>
          <div class="my-1">
            <strong>Course Code: </strong> {{ course.courseCode }} <br />
            <strong>Course Level: </strong> {{ course.courseLevel }} <br />
            <strong>Instruction Language: </strong> {{ course.language }} <br />
            <strong>Start Date: </strong> {{ course.startDate }} <br />
            <strong>Completion End Date: </strong>
            {{ course.completionEndDate }}
            <br />
            <strong>Credits: </strong> {{ sortedCreditValues
            }} <br />
            <strong>Generic Course Type: </strong>
            {{ course.genericCourseType }} <br />
          
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "CourseDetails",
  props: {
    course: Object,
  },
  computed: {
    sortedCreditValues() {
      return (this.course?.courseAllowableCredit || [])
        .map(c => Number(c.creditValue))
        .sort((a, b) => a - b)
        .join(', ');
    }
  },
  methods: {
    dialogTitle() {
      if (!!this.title) {
        return this.title;
      } else {
        return this.course.courseTitle;
      }
    },
  },
  data() {
    return {
      courseDialog: false,
    };
  },
};
</script>
