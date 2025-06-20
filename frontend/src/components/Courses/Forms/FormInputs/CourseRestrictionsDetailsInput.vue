<template>
  <v-row no-gutters class="mb-4">
    <v-col cols="11">
      <v-row no-gutters>
        <v-col cols="12">
          <strong>Enter Main Course</strong>
          <CourseInput v-model:courseFound="localCourseRestriction.mainCourse"></CourseInput>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row no-gutters class="mb-4">
    <v-col cols="11">
      <v-row no-gutters>
        <v-col cols="12">
          <strong>Enter Restricted Course</strong>
          <CourseInput v-model:courseFound="localCourseRestriction.restrictedCourse"></CourseInput>
        </v-col>
      </v-row>
    </v-col>
    <v-row v-if="v$.localCourseRestriction.restrictedCourse.$invalid" class="mt-2">
      <v-col cols="11">
        <v-alert type="error" dense text>
          {{ v$.localCourseRestriction.restrictedCourse.validateCourseRestriction.$response.$message }}
        </v-alert>
      </v-col>
    </v-row>
  </v-row>
  <v-spacer></v-spacer>
  <v-row no-gutters class="mb-4">
    <v-col cols="11">
      <v-row no-gutters>
        <v-col cols="12">
          <strong>Enter Restriction Start and End Dates</strong>
          <v-row>
            <v-col>
              <v-text-field v-model.trim="localCourseRestriction.restrictionStartDate" label="Restriction Start Date"
                variant="outlined" density="compact" class="mt-2"
                :error="v$.localCourseRestriction.restrictionStartDate.$error"
                :error-messages="v$.localCourseRestriction.restrictionStartDate.$errors.map(e => e.$response.$message)"
                @input="v$.localCourseRestriction.restrictionStartDate.$touch()"
                @blur="v$.localCourseRestriction.restrictionStartDate.$touch()" />
            </v-col>
            <v-col>
              <v-text-field v-model.trim="localCourseRestriction.restrictionEndDate" label="Restriction End Date"
                variant="outlined" density="compact" class="mt-2"
                :error="v$.localCourseRestriction.restrictionEndDate.$error"
                :error-messages="v$.localCourseRestriction.restrictionEndDate.$errors.map(e => e.$response.$message)"
                @input="v$.localCourseRestriction.restrictionEndDate.$touch()" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import { useCourseStore } from "@/store/modules/course.js";
import { mapState } from "pinia";
import CourseInput from "@/components/Common/CourseInput.vue";
import { useVuelidate } from "@vuelidate/core";

export default {
  name: "CourseRestrictionsDetailsInput",
  components: { CourseInput },
  setup() {
    return { v$: useVuelidate() };
  },
  computed: {
    ...mapState(useCourseStore, {
      snackbarStore: (state) => state.snackbarStore,
      courseRestrictions: (state) => state.courseRestrictions,
    }),
  },
  props: {
    courseRestriction: {
      type: Object,
      required: true
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
      localCourseRestriction: {
        mainCourse: {},
        restrictedCourse: {},
        restrictionStartDate: "",
        restrictionEndDate: ""
      },
      debouncedLookup: null,
    };
  },
  validations() {
    return {
      localCourseRestriction: {
        restrictionStartDate: {
          validateStartDateFormat: this.validateRestrictionStartDate,
        },
        restrictionEndDate: {
          validateEndDateFormat: this.validateRestrictionEndDate,
        },
        restrictedCourse: {
          validateCourseRestriction: this.validateDuplicateCourseRestriction
        }
      }
    }
  },
  watch: {
    courseRestriction: {
      immediate: true,
      handler(newCourseRestriction) {
        if (newCourseRestriction) {
          this.localCourseRestriction = { ...newCourseRestriction };
        }
      },
    },
    localCourseRestriction: {
      immediate: true,
      handler(newVal) {
        this.courseRestriction.mainCourse = newVal?.mainCourse;
        this.courseRestriction.restrictedCourse = newVal?.restrictedCourse;
        this.courseRestriction.restrictionStartDate = newVal?.restrictionStartDate;
        this.courseRestriction.restrictionEndDate = newVal?.restrictionEndDate;
      },
      deep: true,
    }
  },
  methods: {
    validateDuplicateCourseRestriction() {
      let errorMessage = null;
      if (this.localCourseRestriction.mainCourse.courseCode && this.localCourseRestriction.restrictedCourse.courseCode) {
        if (this.localCourseRestriction.mainCourse.courseCode === this.localCourseRestriction.restrictedCourse.courseCode &&
          this.localCourseRestriction.mainCourse.courseLevel === this.localCourseRestriction.restrictedCourse.courseLevel) {
          errorMessage = "Main Course and Restricted Course cannot be the same";
        }
        const exist = this.courseRestrictions.filter(item => (item.mainCourse === this.localCourseRestriction.mainCourse.courseCode
          && item.mainCourseLevel === this.localCourseRestriction.mainCourse.courseLevel
          && item.restrictedCourse === this.localCourseRestriction.restrictedCourse.courseCode
          && item.restrictedCourseLevel === this.localCourseRestriction.restrictedCourse.courseLevel));
        if (errorMessage == null && this.create && exist.length > 0 || this.update && (exist.length > 1 || (exist.length === 1 && this.courseRestriction.courseRestrictionId !== exist[0].courseRestrictionId))) {
          errorMessage = "Course restriction already exists";
        }
        this.courseRestriction.hasValidationError = !this.validateCourseRestriction() || !!errorMessage;
      }
      return {
        $valid: !errorMessage,
        $message: errorMessage
      };
    },
    validateRestrictionStartDate(value) {
      let errorMessage = null;
      if (!!value) {
        if (!this.validateMonthFormat(value)) {
          errorMessage = "Restriction Start Date must be in YYYY-MM format";
        }
        const restrictionStartDate = this.validateMonthFormat(value) ? this.$filters.formatTime(value) : null;
        const mainCourseStartDate = this.localCourseRestriction.mainCourse.startDate ? this.$filters.formatTime(this.localCourseRestriction.mainCourse.startDate) : null;
        const restrictedCourseStartDate = this.localCourseRestriction.restrictedCourse.startDate ? this.$filters.formatTime(this.localCourseRestriction.restrictedCourse.startDate) : null;

        if (errorMessage == null && (mainCourseStartDate && restrictionStartDate < mainCourseStartDate) || (restrictedCourseStartDate && restrictionStartDate < restrictedCourseStartDate)) {
          errorMessage = "Restriction Start Date is earlier than the latest start date of the two courses";
        }
        this.courseRestriction.hasValidationError = !this.validateCourseRestriction() || !!errorMessage;
      } else {
        errorMessage = "Restriction Start Date is required";
      }
      return {
        $valid: !errorMessage,
        $message: errorMessage
      };
    },
    validateRestrictionEndDate(value) {
      let errorMessage = null;
      if (!!value) {
        if (!this.validateMonthFormat(this.localCourseRestriction.restrictionEndDate)) {
          errorMessage = "Restriction End Date must be in YYYY-MM format";
        }
        const restrictionEndDate = this.validateMonthFormat(value) ? this.$filters.formatTime(value) : null;
        const restrictionStartDate = this.validateMonthFormat(this.localCourseRestriction.restrictionStartDate) ? this.$filters.formatTime(this.localCourseRestriction.restrictionStartDate) : null;
        const mainCourseCompletionDate = this.localCourseRestriction.mainCourse.completionEndDate ? this.$filters.formatTime(this.localCourseRestriction.mainCourse.completionEndDate) : null;
        const restrictedCourseCompletionDate = this.localCourseRestriction.restrictedCourse.completionEndDate ? this.$filters.formatTime(this.localCourseRestriction.restrictedCourse.completionEndDate) : null;
        if (errorMessage == null && restrictionStartDate && restrictionEndDate && restrictionEndDate < restrictionStartDate) {
          errorMessage = "Restriction End Date is before Restriction Start Date";

        }
        if (errorMessage == null && (mainCourseCompletionDate && restrictionEndDate > mainCourseCompletionDate) || (restrictedCourseCompletionDate && restrictionEndDate > restrictedCourseCompletionDate)) {
          errorMessage = "Restriction Start Date is later than the latest completion date of the two courses";
        }
        this.courseRestriction.hasValidationError = !this.validateCourseRestriction() || !!errorMessage;
      }
      return {
        $valid: !errorMessage,
        $message: errorMessage
      };
    },
    validateCourseRestriction() {
      return !!(this.localCourseRestriction.mainCourse.courseCode && this.localCourseRestriction.restrictedCourse.courseCode && this.validateMonthFormat(this.localCourseRestriction.restrictionStartDate));
    },
    validateMonthFormat(value) {
      const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
      return regex.test(value);
    },
  },
};
</script>
