<template>
  <v-row no-gutters class="mb-4" style="overflow-x: hidden;">
    <v-col v-if="create" cols="2" class="d-flex flex-column justify-start">
      <strong>{{ course.courseDetails.courseCode }} {{ course.courseDetails.courseLevel }} -
        {{ $filters.formatYYYYMMStringDate(course.courseSession) }}
      </strong>
      {{ course.courseDetails.courseName }}
      <slot name="remove-button"></slot>

    </v-col>

    <v-col v-if="update" cols="2" class="d-flex flex-column justify-start">
      <strong>{{ course.courseDetails.courseCode }} {{ course.courseDetails.courseLevel }} -
        {{ $filters.formatYYYYMMStringDate(course.courseSession) }}
      </strong>
      {{ course.courseDetails.courseName }}
      <slot name="remove-button"></slot>

    </v-col>
    <v-col cols="10">
      <v-row no-gutters class="my-2">
        <!-- Editable fields bound directly to the course object -->
        <v-col>
          <v-text-field v-model="course.interimPercent" type="number" min="0" max="100" label="Interim %"
            variant="outlined" density="compact" class="pa-1" clearable persistent-placeholder
            :disabled="course.courseSession < 199409 || courseSessionLessThanReportingPeriod" persistent-hint
            :error="v$.course.interimPercent.$invalid && v$.course.interimPercent.$dirty"
            @blur="v$.course.interimPercent.$touch" />
        </v-col>

        <v-col>
          <v-select v-model="course.interimLetterGrade" :items="filteredInterimLetterGrades"
            :disabled="courseSessionLessThanReportingPeriod" label="Interim LG" variant="outlined" density="compact"
            class="pa-1" clearable persistent-placeholder persistent-hint />
        </v-col>

        <v-col>
          <v-text-field v-model="course.finalPercent" type="number" min="0" max="100" label="Final %" variant="outlined"
            density="compact" class="pa-1" clearable
            :disabled="course.courseSession < 199409 || courseSessionGreaterThanReportingPeriod" persistent-placeholder
            persistent-hint :error="v$.course.finalPercent.$invalid && v$.course.finalPercent.$dirty"
            @blur="v$.course.finalPercent.$touch" />
        </v-col>

        <v-col>
          <v-select v-model="course.finalLetterGrade" :items="filteredFinalLetterGrades" label="Final LG"
            variant="outlined" density="compact" class="pa-1" clearable persistent-placeholder persistent-hint
            :error="v$.course.finalLetterGrade.$invalid && v$.course.finalLetterGrade.$dirty"
            @blur="v$.course.finalLetterGrade.$touch" :disabled="courseSessionGreaterThanReportingPeriod" />
        </v-col>

        <v-col>
          <v-select v-model="course.credits" :items="creditsAvailableForCourseSession" item-title="creditValue"
            item-value="creditValue" label="Credits" variant="outlined" density="compact" class="pa-1"
            persistent-placeholder persistent-hint />
        </v-col>

        <v-col>
          <v-select v-model="course.fineArtsAppliedSkills" :items="fineArtsAndAppliedSkillsOptions" item-title="text"
            item-value="value" label="FA/AS" variant="outlined" density="compact" class="pa-1" clearable
            :disabled="isBAAorLocallyDevelopedOrCP" persistent-placeholder persistent-hint />
        </v-col>

        <v-col>
          <v-select v-model="course.equivOrChallenge" :items="['Equivalency', 'Challenge', 'None']" label="Eq / Ch"
            variant="outlined" density="compact" class="pa-1" clearable persistent-placeholder persistent-hint />
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

      <v-row v-for="(warning, index) in warnings" :key="index" class="align-center">
        <v-col class="pb-3 m-0" style="color: orange;">
          <v-icon color="orange" small>mdi-alert</v-icon>
          {{ warning }}
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
import { mapState } from "pinia";
import { useAppStore } from "@/store/modules/app";
import { useStudentStore } from "@/store/modules/student";
import { useAccessStore } from "@/store/modules/access";
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
      this.course.credits = this.creditsAvailableForCourseSession[0];
    }
    // Check for Q course
    if ((this.course.courseCode || '').startsWith("Q")) {
      this.warnings.push("Only use Q code if student was on Adult program at time of course completion or if course is marked as Equivalency.");
    }
    if (this.course.isExaminable) {
      this.warnings.push("This course required an exam at the time of the course session date")
    }
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JS months are 0-based

    // Reporting period: Oct (10) to Sep (09)
    let startYear, endYear;

    if (currentMonth >= 10) {
      startYear = currentYear;
      endYear = currentYear + 1;
    } else {
      startYear = currentYear - 1;
      endYear = currentYear;
    }

    const minSession = `${startYear}09`;
    const maxSession = `${endYear}09`;

    if (this.course.courseSession < 198401 || (this.course.courseSession < minSession || this.course.courseSession > maxSession)) {
      this.warnings.push("Course session cannot be beyond the current reporting period or prior to 198401")

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
        },
        credits: {
          isCreditValue: helpers.withMessage(
            'Credits must be 0, 1, 2, 3, or 4',
            function (value) {
              return (
                value === '' ||
                value === null ||
                value === undefined ||
                [0, 1, 2, 3, 4].includes(Number(value))
              )
            }
          ),

          creditsMustBe4ifStudentIsOnProgram1995AndCourseisB: helpers.withMessage(
            'Number of Credits must be 4 if B has been selected for the Board Authority Authorized or Locally Developed course Fine Arts/Applied Skills flag',
            function (value) {
              const is1996Program = this.studentProgram === "1996-EN" || this.studentProgram === "1996-FR"
              const isB = this.course.fineArtsAppliedSkills === "B"

              if (is1996Program && isB) {
                return Number(value) === 4
              }
              return true // don't enforce if condition doesn't apply
            }
          ),

          creditsMustBeAtLeast2ifStudentIsOnProgram1995AndCourseisForA: helpers.withMessage(
            'Number of Credits must be at least 2 if A or F has been selected for the Board Authority Authorized or Locally Developed course Fine Arts/Applied Skills flag',
            function (value) {
              const is1996Program = this.studentProgram === "1996-EN" || this.studentProgram === "1996-FR"
              const isAorF = this.course.fineArtsAppliedSkills === "A" || this.course.fineArtsAppliedSkills === "F"

              if (is1996Program && isAorF) {
                return Number(value) >= 2
              }

              return true
            }
          )
        },

        fineArtsAppliedSkills: {

        },
        equivOrChallenge: {
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
    ...mapState(useAccessStore, ["getRoles"]),
    courseSessionLessThanReportingPeriod() {
      const session = this.course.courseSession;
      if (!session || session.length !== 6) return false;

      const year = session.slice(0, 4);
      const month = session.slice(4, 6);
      const sessionDate = new Date(`${year}-${month}-01`);

      const today = new Date();
      today.setDate(1); // Set to first of month to match format
      return sessionDate < today;
    },

    courseSessionGreaterThanReportingPeriod() {
      const session = this.course.courseSession;
      if (!session || session.length !== 6) return false;

      const year = session.slice(0, 4);
      const month = session.slice(4, 6);
      const sessionDate = new Date(`${year}-${month}-01`);

      const today = new Date();
      today.setDate(1); // Set to first of month to match format
      return sessionDate > today;
    },
    fineArtsAndAppliedSkillsOptions() {
      return [
        { value: 'B', text: 'Both Fine Arts and Applied Skills' },
        { value: 'A', text: 'Fine Arts' },
        { value: 'F', text: 'Applied Skills' }
      ];
    },

    isBAAorLocallyDevelopedOrCP() {
      return !(
        this.course.courseDetails.courseCategory.description === 'Board Authority Authorized' ||
        this.course.courseDetails.courseCategory.description === 'Locally Developed' ||
        this.course.courseDetails.courseCategory.description === 'Career Program'
      );
    },

    creditsAvailableForCourseSession() {
      if (!this.course.courseSession || !Array.isArray(this.course.courseDetails.courseAllowableCredit)) return [];

      const sessionYear = this.course.courseSession.slice(0, 4);
      const sessionMonth = this.course.courseSession.slice(4, 6);
      const sessionDate = new Date(`${sessionYear}-${sessionMonth}-01`);

      return this.course.courseDetails.courseAllowableCredit
        .filter(credit => {
          const start = new Date(credit.startDate);
          const end = credit.endDate ? new Date(credit.endDate) : new Date('9999-12-31');
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
      const courseType = this.course.courseDetails.courseCategory?.description || '';
      const trimmedProgram = this.studentProgram?.trim();

      const warnings = [];

      if (
        (courseType === "Locally Developed" || courseType === "Career Program") &&
        (trimmedProgram === "1996-EN" || trimmedProgram === "1996-PF" || trimmedProgram === "2018-EN")
      ) {
        warnings.push('Flag is only applicable for this course type if student is on the 1995 program.');
      }
      this.warnings = warnings;
    },

    getGradesForPercent(percent) {
      const isGTorGTF = this.course.courseDetails.courseCode === 'GT' || this.course.courseDetails.courseCode === 'GTF';

      const sessionDateStr = String(this.course.courseSession); // e.g., "199409"
      const sessionYear = sessionDateStr.slice(0, 4);
      const sessionMonth = sessionDateStr.slice(4, 6);
      const sessionDate = new Date(`${sessionYear}-${sessionMonth}-01`);

      const allAllowableLetterGradesForCourse = this.allLetterGrades.filter(grade => {
        // Exclude 'RM' if not GT or GTF
        if (!isGTorGTF && grade.grade === 'RM') return false;

        const effectiveDate = new Date(grade.effectiveDate);
        const expiryDate = grade.expiryDate ? new Date(grade.expiryDate) : new Date(9999, 11, 31);

        return sessionDate >= effectiveDate && sessionDate <= expiryDate;
      });

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