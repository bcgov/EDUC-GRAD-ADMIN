<template>
  <v-row no-gutters class="mb-4" style="overflow-x: hidden;">
    <!-- Disabled identifying fields -->
    <v-col cols="2" class="d-flex flex-column justify-start">
      <strong>{{ course.courseCode }} {{ course.courseLevel }} -
        {{ $filters.formatYYYYMMStringDate(course.courseSession) }}
      </strong>
      {{ course.courseName }}
      <slot name="remove-button"></slot>

    </v-col>
    <v-col cols="10">
      <v-row no-gutters class="my-2">

        <!-- Editable fields bound directly to the course object -->
        <v-col>
          <v-text-field v-model="course.interimPercent" type="number" label="Interim %" variant="outlined"
            density="compact" class="pa-1" clearable persistent-placeholder :disabled="course.courseSession < 199409"
            persistent-hint :error="v$.course.interimPercent.$invalid && v$.course.interimPercent.$dirty"
            @blur="v$.course.interimPercent.$touch" />
        </v-col>

        <v-col>
          <v-select v-model="course.interimLetterGrade" :items="filteredInterimLetterGrades" label="Interim LG"
            variant="outlined" density="compact" class="pa-1" clearable persistent-placeholder persistent-hint />
        </v-col>

        <v-col>
          <v-text-field v-model="course.finalPercent" type="number" label="Final %" variant="outlined" density="compact"
            class="pa-1" clearable :disabled="course.courseSession < 199409" persistent-placeholder persistent-hint
            :error="v$.course.finalPercent.$invalid && v$.course.finalPercent.$dirty"
            @blur="v$.course.finalPercent.$touch" />
        </v-col>

        <v-col>
          <v-select v-model="course.finalLetterGrade" :items="filteredFinalLetterGrades" label="Final LG"
            variant="outlined" density="compact" class="pa-1" clearable persistent-placeholder persistent-hint
            :error="v$.course.finalLetterGrade.$invalid && v$.course.finalLetterGrade.$dirty"
            @blur="v$.course.finalLetterGrade.$touch" />
        </v-col>

        <v-col>
          <v-select v-model="course.credits" :items="creditsAvailableForCourseSession" item-title="creditValue"
            item-value="creditValue" label="Credits" variant="outlined" density="compact" class="pa-1" clearable
            persistent-placeholder persistent-hint />
        </v-col>

        <v-col>
          <v-select v-model="course.fineArtsAppliedSkills" :items="fineArtsAndAppliedSkillsOptions" item-title="text"
            item-value="value" label="FA/AS" variant="outlined" density="compact" class="pa-1" clearable
            :disabled="isBAAorLocallyDevelopedOrCP" persistent-placeholder persistent-hint />
        </v-col>

        <v-col>
          <v-select v-model="course.equivalencyOrChallenge" :items="['Equivalency', 'Challenge', 'None']"
            label="Eq / Ch" variant="outlined" density="compact" class="pa-1" clearable persistent-placeholder
            persistent-hint />
        </v-col>
      </v-row>
      <v-row v-if="course?.genericCourseType == 'G'">
        <v-col cols="12">
          <v-text-field v-model="course.customizedCourseName" label="Customized Course Title" variant="outlined"
            density="compact" class="pa-1" clearable hide-details persistent-placeholder persistent-hint />
        </v-col>
      </v-row>

      <v-row no-gutters v-if="v$.$errors.length" class="my-2 ">
        <v-col cols="12">
          <v-row v-for="(error, index) in v$.$errors" :key="index" class="align-center">
            <v-col class="p-0 m-0 text-red-darken-4">
              <v-icon color="red-darken-2">mdi-alert-circle</v-icon>
              {{ error.$message }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <!-- Display courseWarnings -->
      <div v-if="warnings.length" class="mb-3">
        <v-row v-for="(warning, index) in warnings" :key="index" class="align-center">
          <v-col class="p-0 m-0" style="color: orange;">
            <v-icon color="orange" small>mdi-alert</v-icon>
            {{ warning }}
          </v-col>
        </v-row>
      </div>

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
import { mapState } from "pinia";
import { useAppStore } from "@/store/modules/app";
import { useStudentStore } from "@/store/modules/student";
import useVuelidate from '@vuelidate/core';
import { required, helpers, numeric } from '@vuelidate/validators';
import CourseInput from "@/components/Common/CourseInput.vue";

import sharedMethods from "@/sharedMethods";

export default {
  name: "CourseDetailsInput",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  mounted() {
    //set the initial credits
    if (!this.course?.credits && this.creditsAvailableForCourseSession.length > 0) {
      this.course.credits = this.course.numCredits;
    }

    this.v$.$touch(); // <-- triggers validation on load
  },
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
  data() {
    return {
      warnings: [],  // array of warnings
    }
  },
  validations() {
    return {
      course: {
        interimPercent: {
          isValidPercent: helpers.withMessage(
            'Interim % must be a valid number between 0 and 100',
            (value) => {
              if (value === '' || value === null || value === undefined) return true; // allow empty if needed

              const strVal = String(value).trim();

              // Reject if contains any minus sign or invalid characters:
              if (strVal.includes('-')) return false;

              // Regex: only digits and optional decimal point
              if (!/^\d*\.?\d+$/.test(strVal)) return false;

              const numberValue = Number(strVal);
              return numberValue >= 0 && numberValue <= 100;
            }
          ),
        },
        finalPercent: {
          isValidPercent: helpers.withMessage(
            'Final % must be a valid number between 0 and 100',
            (value) => {
              if (value === '' || value === null || value === undefined) return true; // allow empty if needed

              const strVal = String(value).trim();

              // Reject if contains any minus sign or invalid characters:
              if (strVal.includes('-')) return false;

              // Regex: only digits and optional decimal point
              if (!/^\d*\.?\d+$/.test(strVal)) return false;

              const numberValue = Number(strVal);
              return numberValue >= 0 && numberValue <= 100;
            }
          ),
        },
        interimLetterGrade: {

        },
        finalLetterGrade: {
          requiredIfSessionDatePassed: helpers.withMessage(
            'Course session is in the past. Enter a final letter grade.',
            function (value, vm) {
              const finalLG = value;
              if (finalLG !== null && finalLG !== '' && finalLG !== undefined) {
                return true; // valid if already has a final letter grade
              }

              const sessionDateStr = vm.course.sessionDate;
              if (!sessionDateStr || sessionDateStr.length !== 6) return true;

              const year = sessionDateStr.slice(0, 4);
              const month = sessionDateStr.slice(4, 6);
              const sessionDate = new Date(`${year}-${month}-01`);
              const currentDate = new Date();

              if (sessionDate < currentDate) {
                return !!value; // enforce required if course is in the past
              }
              return true; // still valid if session is in future
            }
          ),
          isValidLetterGrade: helpers.withMessage(
            'Invalid letter grade',
            (value) => {
              return (
                value === '' ||
                value === null ||
                value === undefined ||
                /^[A-F][+-]?$/.test(value)
              );
            }
          ),
        },
        credits: {
          isCreditValue: helpers.withMessage(
            'Credits must be 0, 1, 2, 3, or 4',
            (value) => {
              return (
                value === '' ||
                value === null ||
                value === undefined ||
                [0, 1, 2, 3, 4].includes(Number(value))
              );
            }
          ),
        },
        fineArtsAppliedSkills: {

        },
        equivalencyOrChallenge: {
          isEqChValue: helpers.withMessage(
            'Must be Equivalency, Challenge, or None',
            (value) => {
              return ['Equivalency', 'Challenge', 'None', '', null, undefined].includes(value);
            }
          ),
        },
        customizedCourseName: {
          validString: helpers.withMessage(
            'Must be a valid title',
            (value) =>
              value === '' ||
              value === null ||
              value === undefined ||
              typeof value === 'string'
          ),
        },
        relatedCourseId: {
          validID: helpers.withMessage(
            'Must be a valid related course ID',
            (value) =>
              value === '' ||
              value === null ||
              value === undefined ||
              typeof value === 'string' ||
              typeof value === 'number'
          ),
        },

      },
    }
  },
  watch: {
    'course.interimPercent'(newVal) {
      if (newVal && newVal != 0) {
        this.course.interimLetterGrade = this.filteredInterimLetterGrades[0] ?? '';
      } else {
        this.course.interimLetterGrade = ""
      }
    },
    'course.finalPercent'(newVal) {
      if (newVal && newVal != 0) {
        this.course.finalLetterGrade = this.filteredFinalLetterGrades[0] ?? '';
      } else {
        this.course.finalLetterGrade = ""
      }
    },
    'course.fineArtsAppliedSkills'(newVal) {
      this.updateWarnings();
    },
  },
  computed: {
    ...mapState(useAppStore, {
      allLetterGrades: (state) => state.letterGradeCodes,
    }),
    ...mapState(useStudentStore, {
      studentProgram: (state) => state.getStudentProgram,
    }),

    fineArtsAndAppliedSkillsOptions() {
      return [
        { value: 'B', text: 'Both Fine Arts and Applied Skills' },
        { value: 'A', text: 'A' },
        { value: 'F', text: 'F' }
      ];
    },

    isBAAorLocallyDevelopedOrCP() {
      return !(
        this.course.courseCategory.description === 'Board Authority Authorized' ||
        this.course.courseCategory.description === 'Locally Developed' ||
        this.course.courseCategory.description === 'Career Program'
      );
    },

    creditsAvailableForCourseSession() {
      if (!this.course.courseSession || !Array.isArray(this.course.courseAllowableCredit)) return [];

      const sessionYear = this.course.courseSession.slice(0, 4);
      const sessionMonth = this.course.courseSession.slice(4, 6);
      const sessionDate = new Date(`${sessionYear}-${sessionMonth}-01`);

      return this.course.courseAllowableCredit
        .filter(credit => {
          const start = new Date(credit.startDate);
          const end = new Date(credit.endDate);
          return sessionDate >= start && sessionDate <= end;
        })
        .map(credit => Number(credit.creditValue))
        .sort((a, b) => b - a)
        .map(value => value.toString());
    },

    filteredInterimLetterGrades() {
      return this.getGradesForPercent(this.course.interimPercent);
    },

    filteredFinalLetterGrades() {
      return this.getGradesForPercent(this.course.finalPercent);
    },
  },
  methods: {
    updateWarnings() {
      const courseType = this.course.courseCategory?.description || '';
      const trimmedProgram = this.studentProgram?.trim();

      const warnings = [];

      if (
        (courseType === "Locally Developed" || courseType === "Career Program") &&
        (trimmedProgram === "1996-EN" || trimmedProgram === "1996-PF" || trimmedProgram === "2018-EN")
      ) {
        warnings.push('Flag is only applicable for this course type if student is on the 1995 program.');
      }

      // Add more warnings here as needed

      this.warnings = warnings;
    },

    getGradesForPercent(percent) {
      const allAllowableLetterGradesForCourse = this.allLetterGrades.filter((grade) => {
        if (this.course.courseCode !== 'GT' && this.course.courseCode !== 'GTF') {
          return grade.grade !== 'RM';
        }
        return true;
      });

      if (this.course.courseSession < 199409) {
        return allAllowableLetterGradesForCourse.map((grade) => grade.grade);
      }

      const numPercent = Number(percent);
      if (!percent || isNaN(numPercent)) {
        return allAllowableLetterGradesForCourse.map((grade) => grade.grade);
      }

      return allAllowableLetterGradesForCourse
        .filter((grade) =>
          grade.percentRangeLow <= numPercent && numPercent <= grade.percentRangeHigh
        )
        .map((grade) => grade.grade);
    },
  },
};
</script>