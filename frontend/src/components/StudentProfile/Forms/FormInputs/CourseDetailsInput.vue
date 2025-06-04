<template>
  <v-row no-gutters class="mb-4">
    <!-- Disabled identifying fields -->
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
    <v-col cols="2" class="d-flex flex-column justify-start">
      {{ course.courseName }} {{ course.courseCode }} {{ course.courseLevel }}
      {{ course.sessionDate }}
    </v-col>
    <v-col cols="10">
      <v-row>
        <v-col v-if="update">
          <v-text-field
            :model-value="course.courseID"
            label="Course ID"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col v-if="update">
          <v-text-field
            :model-value="course.code"
            label="Course Code"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col v-if="update">
          <v-text-field
            :model-value="course.level"
            label="Course Level"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col v-if="update">
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
      <v-row v-if="course?.genericCourseType=='G'">
        <v-col cols="12">
          <v-text-field
            v-model="course.customizedCourseTitle"
            label="Customized Course Title"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>
      </v-row>

      <v-row no-gutters v-if="course?.courseCode == 'IDS'">
        <v-col cols="12">
          <strong>Select Related Course</strong>
          <CourseInput v-model:courseFoundID="course.relatedCourseId"></CourseInput>

        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState} from "pinia";
import CourseInput from "@/components/Common/CourseInput.vue";
import { useAppStore } from "@/store/modules/app"
export default {
  name: "CourseDetailsInput",
  components: { CourseInput },
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
    ...mapState(useAppStore, {
      letterGrades: (state) =>
        state.letterGradeCodes.map((letterGrade) => letterGrade.grade),
    }),

    credits() {
      // These will also eventually come from a code table
      return [2, 3, 4];
    },
  },
};
</script>
