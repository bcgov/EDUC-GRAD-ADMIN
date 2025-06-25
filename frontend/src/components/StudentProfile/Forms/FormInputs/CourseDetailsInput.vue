<template>
  <v-row no-gutters class="m-4">
    <!-- Disabled identifying fields -->
    <v-col cols="12">
      <v-col cols="2" v-if="update">
        <v-text-field :model-value="course.courseID" label="Course ID" variant="outlined" density="compact" class="my-2"
          persistent-placeholder persistent-hint />
      </v-col>
      <v-col cols="2" v-if="update">
        <v-text-field :model-value="course.code" label="Course Code" variant="outlined" density="compact" class="my-2"
          persistent-placeholder persistent-hint />
      </v-col>
      <v-col cols="2" v-if="update">
        <v-text-field :model-value="course.level" label="Course Level" variant="outlined" density="compact" class="my-2"
          persistent-placeholder persistent-hint />
      </v-col>
      <v-col cols="2" v-if="update">
        <v-text-field :model-value="course.sessionDate" label="Session Date" variant="outlined" density="compact"
          class="my-2" persistent-placeholder persistent-hint />
      </v-col>
    </v-col>
    <v-col cols="2" class="d-flex flex-column justify-start">
      <strong>{{ course.courseCode }} {{ course.courseLevel }} -
        {{ $filters.formatYYYYMMStringDate(course.courseSession) }}
      </strong>
      {{ course.courseName }}
      <slot name="remove-button"></slot>

    </v-col>
    <v-col cols="10">
      <v-row no-gutters class="my-2">

        <v-col v-if="update">
          <v-text-field :model-value="course.courseID" label="Course ID" variant="outlined" density="compact"
            class="my-2" persistent-placeholder persistent-hint />
        </v-col>
        <v-col v-if="update">
          <v-text-field :model-value="course.code" label="Course Code" variant="outlined" density="compact" class="my-2"
            persistent-placeholder persistent-hint />
        </v-col>
        <v-col v-if="update">
          <v-text-field :model-value="course.level" label="Course Level" variant="outlined" density="compact"
            class="my-2" persistent-placeholder persistent-hint />
        </v-col>
        <v-col v-if="update">
          <v-text-field :model-value="course.sessionDate" label="Session Date" variant="outlined" density="compact"
            class="my-2" persistent-placeholder persistent-hint />
        </v-col>

        <!-- Editable fields bound directly to the course object -->
        <v-col>
          <v-text-field v-model="course.interimPercent" type="number" label="Interim %" variant="outlined"
            density="compact" class="px-1" clearable persistent-placeholder :disabled="course.courseSession < 199409"
            persistent-hint :error="v$.course.interimPercent.$invalid && v$.course.interimPercent.$dirty"
            @blur="v$.course.interimPercent.$touch" />
        </v-col>

        <v-col>
          <v-select v-model="course.interimLetterGrade" :items="filteredInterimLetterGrades" label="Interim LG"
            variant="outlined" density="compact" class="pr-1" clearable persistent-placeholder persistent-hint />
        </v-col>

        <v-col>
          <v-text-field v-model="course.finalPercent" type="number" label="Final %" variant="outlined" density="compact"
            class="pr-1" clearable :disabled="course.courseSession < 199409" persistent-placeholder persistent-hint
            :error="v$.course.finalPercent.$invalid && v$.course.finalPercent.$dirty"
            @blur="v$.course.finalPercent.$touch" />
        </v-col>

        <v-col>
          <v-select v-model="course.finalLetterGrade" :items="filteredFinalLetterGrades" label="Final LG"
            variant="outlined" density="compact" class="pr-1" clearable persistent-placeholder persistent-hint
            :error="v$.course.finalLetterGrade.$invalid && v$.course.finalLetterGrade.$dirty"
            @blur="v$.course.finalLetterGrade.$touch" />
        </v-col>

        <v-col>
          <v-select v-model="course.credits" :items="creditsAvailableForCourseSession" label="Credits"
            variant="outlined" density="compact" class="pr-1" clearable persistent-placeholder persistent-hint />
        </v-col>

        <v-col>
          <v-select v-model="course.fineArtsAppliedSkills" :items="fineArtsAppliedSkillsOptions" item-title="text"
            item-value="value" label="FA/AS" variant="outlined" density="compact" class="pr-1" clearable
            :disabled="isBAAorLocallyDeveloped" persistent-placeholder persistent-hint />
        </v-col>

        <v-col>
          <v-select v-model="course.equivalencyOrChallenge" :items="['Equivalency', 'Challenge', 'None']"
            label="Eq / Ch" variant="outlined" density="compact" class="pr-1" clearable persistent-placeholder
            persistent-hint />
        </v-col>
      </v-row>
      <v-row v-if="course?.genericCourseType == 'G'">
        <v-col cols="12">
          <v-text-field v-model="course.customizedCourseName" label="Customized Course Title" variant="outlined"
            density="compact" class="pr-1" clearable hide-details persistent-placeholder persistent-hint />
        </v-col>
      </v-row>

      <v-row v-if="v$.$errors.length" class="my-2">
        <v-col cols="12">
          <v-row v-for="(error, index) in v$.$errors" :key="index" class="align-center">
            <v-col class="p-0 m-0 text-red-darken-4">
              <v-icon color="red-darken-2">mdi-alert-circle</v-icon>
              {{ error.$message }}
            </v-col>
          </v-row>
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
    },
    computed: {
      ...mapState(useAppStore, {
        allLetterGrades: (state) => state.letterGradeCodes,
        fineArtsAndAppliedSkillsOptions() {
          if (this.course.courseType == "Board Authority Authorized") {
            return [
              { value: 'B', text: 'Both Fine Arts and Applied Skills' }
            ]
          }
        },
        isBAAorLocallyDeveloped() {
          return !(
            this.course.courseType === 'Board Authority Authorized' ||
            this.course.courseType === 'Locally Developed'
          );
        },
        creditsAvailableForCourseSession() {
          if (!this.course.courseSession || !Array.isArray(this.course.courseAllowableCredits)) return [];

          // Convert sessionDate "YYYYMM" to a JS Date like "YYYY-MM-01"
          const sessionYear = this.course.courseSession.slice(0, 4);
          const sessionMonth = this.course.courseSession.slice(4, 6);
          const sessionDate = new Date(`${sessionYear}-${sessionMonth}-01`);

          return this.course.courseAllowableCredits
            .filter(credit => {
              const start = new Date(credit.startDate);
              const end = new Date(credit.endDate);
              return sessionDate >= start && sessionDate <= end;
            })
            .map(credit => credit.value);
        }
      }),

      filteredInterimLetterGrades() {
        return this.getGradesForPercent(this.course.interimPercent);
      },

      filteredFinalLetterGrades() {
        return this.getGradesForPercent(this.course.finalPercent);
      },
    },
    methods: {
      getGradesForPercent(percent) {
        if (this.course.courseSession < 199409) {
          return this.allLetterGrades.map((grade) => grade.grade);
        }

        const numPercent = Number(percent);
        if (!percent || isNaN(numPercent)) return this.allLetterGrades.map((grade) => grade.grade);


        return this.allLetterGrades
          .filter((grade) => {
            const withinRange =
              grade.percentRangeLow <= numPercent && numPercent <= grade.percentRangeHigh;
            //only include RM grade if courseCode is GT/GTF
            const isAllowedGrade = grade.grade !== "RM" || ["GT", "GTF"].includes(this.course?.courseCode);

            return withinRange && isAllowedGrade;
          })
          .map((grade) => grade.grade);
      }
    }
  };
</script>