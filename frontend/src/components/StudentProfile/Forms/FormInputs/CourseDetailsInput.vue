<template>
  <v-row no-gutters class="mb-4" align="center">
    <!-- Disabled identifying fields -->
    {{ course }}
    <v-col cols="12">
      <v-col cols="2" v-if="update">
        <v-text-field
          :model-value="course.courseID"
          label="Course ID"
          variant="outlined"
          density="compact"
        />
      </v-col>
      <v-col cols="2" v-if="update">
        <v-text-field
          :model-value="course.code"
          label="Course Code"
          variant="outlined"
          density="compact"
        />
      </v-col>
      <v-col cols="2" v-if="update">
        <v-text-field
          :model-value="course.level"
          label="Course Level"
          variant="outlined"
          density="compact"
        />
      </v-col>
      <v-col cols="2" v-if="update">
        <v-text-field
          :model-value="course.sessionDate"
          label="Session Date"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-col>
    <v-col col="2">
      {{ course.courseName }} {{ course.courseCode }} {{ course.courseLevel }}
      {{ course.sessionDate }}
    </v-col>
    <v-col cols="10">
      <v-row>
        <v-col v-if="edit">
          <v-text-field
            :model-value="course.courseID"
            label="Course ID"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col v-if="edit">
          <v-text-field
            :model-value="course.code"
            label="Course Code"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col v-if="edit">
          <v-text-field
            :model-value="course.level"
            label="Course Level"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col v-if="edit">
          <v-text-field
            :model-value="course.sessionDate"
            label="Session Date"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <!-- Editable fields bound directly to the course object -->
        <v-col>
          <v-text-field
            v-model="course.interimPercent"
            type="number"
            label="Interim %"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="2">
          <v-select
            v-model="course.interimLetterGrade"
            :items="letterGrades"
            label="Interim LG"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="2">
          <v-text-field
            v-model="course.finalPercent"
            type="number"
            label="Final %"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="2">
          <v-select
            v-model="course.finalLetterGrade"
            :items="letterGrades"
            label="Final LG"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col cols="2">
          <v-select
            v-model="course.credits"
            :items="credits"
            label="Credits"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col>
          <v-select
            v-model="course.fineArtsAppliedSkills"
            :items="['FA', 'AS', 'None']"
            label="FA/AS"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <v-col>
          <v-select
            v-model="course.equivalencyOrChallenge"
            :items="['Equivalency', 'Challenge', 'None']"
            label="Eq / Ch"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-row>
      <v-row v-if="course?.genericCourseType == 'I'">
        <v-col cols="12"></v-col>
        <strong>Select Related Course</strong>

        <v-col cols="12">
          <v-text-field
            v-model="course.customizedCourseTitle"
            label="Customized Course Title"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="course.customCourseCode"
            label="Course Code"
            variant="outlined"
            density="compact"
        /></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="course.customCourseLevel"
            label="Course Level"
            variant="outlined"
            density="compact"
        /></v-col>
        <v-col cols="3"> <v-btn>Add Course</v-btn></v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "CourseDetailsInput",
  props: {
    course: {
      type: Object,
      required: true,
    },
    create: {
      type: Boolean,
      default: false,
    },
    update: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    letterGrades() {
      // These will eventually be loaded from a code table
      return ["A", "B", "C+", "C", "C-", "F", "P", "I"];
    },
    credits() {
      // These will also eventually come from a code table
      return [2, 3, 4];
    },
  },
};
</script>
