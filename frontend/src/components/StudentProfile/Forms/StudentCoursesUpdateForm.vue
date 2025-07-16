<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="1260px">
      <template v-slot:activator="{ props }">
        <slot name="activator" v-bind="props">
          <v-btn v-if="hasPermissions('STUDENT', 'courseUpdate')" @click="openDialog" v-bind="props" color="success"
            icon="mdi-pencil" density="compact" variant="text" />
        </slot>
      </template>

      <v-card>
        <v-card-title>

          <v-row no-gutters>
            <div class="v-card-title">Edit Student Courses</div>
            <v-spacer />
            <v-btn icon="mdi-close" density="compact" rounded="sm" variant="outlined" color="error" class="mt-2"
              @click="close" />
          </v-row>
          <v-card-subtitle>{{ studentPenAndName }}</v-card-subtitle>
        </v-card-title>

        <v-card-text>
          <v-row no-gutters class="p-2" v-if="showCourseInput">
            <v-col class="pr-1">
              Select Course
            </v-col>

            <v-col class="pr-1">
              <v-text-field v-model="courseAdd.code" label="Course Code" :error="!!courseValidationMessage"
                variant="outlined" density="compact" clearable persistent-placeholder persistent-hint
                :disabled="isLoading" />
            </v-col>

            <v-col class="pr-1">
              <v-text-field v-model="courseAdd.level" label="Course Level" :error="!!courseValidationMessage"
                variant="outlined" density="compact" clearable persistent-placeholder persistent-hint
                :disabled="isLoading" />
            </v-col>
            <v-col class="pr-1">
              <v-text-field v-model="courseAdd.courseSession" label="Session Date (YYYYMM)" variant="outlined"
                density="compact" clearable persistent-placeholder persistent-hint />
            </v-col>

            <v-col>

              <v-btn :disabled="v$?.courseAdd?.$invalid || isLoading" variant="flat" color="bcGovBlue" class="text-none"
                @click="updateCourse">
                <v-progress-circular v-if="isLoading" indeterminate color="white" size="20" class="mr-2" />
                <span v-if="!isLoading">Get Course</span>
              </v-btn>
              <v-btn :disabled="v$?.courseAdd?.$invalid || isLoading" variant="flat" color="bcGovBlue" class="text-none"
                @click="closeCourseInput">

                <span v-if="!isLoading"><v-icon size="28">mdi-trash-can</v-icon></span>
              </v-btn>
            </v-col>
            <v-col cols="12"> <v-alert v-if="courseValidationMessage" type="error" variant="tonal" border="start"
                class="width-fit-content">{{ courseValidationMessage }}</v-alert></v-col>
          </v-row>
          <CourseDetailsInput v-else :course="selectedCourseToUpdate" update>
            <template #remove-button>
              <v-btn variant="outlined" color="bcGovBlue" class="mb-4 text-none" style="min-width: auto;"
                @click="showCourseInput = !showCourseInput">Change Course</v-btn>
            </template>
          </CourseDetailsInput>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" variant="outlined" class="text-none" density="default" @click="close">
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn color="bcGovBlue" variant="flat" class="text-none" density="default" @click="confirmUpdate">
            Save Student Course(s)
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import CourseService from "@/services/CourseService.js";
import { required, helpers } from '@vuelidate/validators';
import CourseDetailsInput from "@/components/StudentProfile/Forms/FormInputs/CourseDetailsInput.vue";
import { useStudentStore } from "@/store/modules/student";
import { mapState, mapActions } from "pinia";

export default {
  name: "StudentCoursesUpdateForm",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  components: { CourseDetailsInput },

  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  validations() {
    return {
      courseValidationMessage: null,
      courseAdd: {
        code: {},
        level: {

        },
        courseSession: {
          validCourseSessionMonth: helpers.withMessage(
            'Course session must be in YYYYMM format with a valid month (01–12)',
            (value) => {
              if (!value) return true
              const stringValue = String(value)

              // Must be exactly 6 numeric characters
              if (!/^\d{6}$/.test(stringValue)) return false

              const month = parseInt(stringValue.slice(4, 6), 10)

              // Check month range
              return month >= 1 && month <= 12
            }
          ),
        }
      }
    }
  },
  data() {
    return {
      isLoading: false,
      dialog: false,
      showCourseInput: false,
      courseValidationMessage: null,
      selectedCourseToUpdate: {},
      courseAdd: {
        code: null,
        level: null,
        courseSession: null,
      },
    };
  },
  computed: {
    ...mapState(useStudentStore, {
      studentPenAndName: "formattedStudentName"
    }),
    ...mapState(useStudentStore, {
      studentCourses: "studentCourses",
    }),
  },

  methods: {
    ...mapActions(useStudentStore, [
      "updateStudentCourse"
    ]),

    async updateCourse() {
      this.isLoading = true;
      this.courseValidationMessage = null; // reset validation message

      // TODO - improve the handling of course code | level | session date with validation ticket
      // removes hyphen before adding to store
      const courseSession = this.courseAdd.courseSession.replace(
        /[&\/\\#,+()$~%.'":*?<>{}-]/g,
        ""
      );
      const code = this.courseAdd.code.toUpperCase();

      const level = this.courseAdd.level ? this.courseAdd.level.toUpperCase() : '';
      console.log(code)
      console.log(level)

      try {

        const response = await CourseService.getCourseByCodeAndLevel(code, level);
        console.log(response)
        const courseData = response?.data;
        console.log(courseData)
        this.isLoading = false;
        if (courseData?.courseID) {
          // Clear previous validation message
          this.courseValidationMessage = null;

          // Check for duplicate
          const isDuplicate = this.studentCourses.some(course =>
            course.courseID === courseData.courseID &&
            course.courseSession === this.courseAdd.courseSession
          );

          if (isDuplicate) {
            this.courseValidationMessage = `${this.courseAdd.code} ${this.courseAdd.level} ${this.courseAdd.courseSession} is a duplicate course.`;
            return;
          }
        }
        // Parse session date safely
        const sessionDateStr = String(this.courseAdd.courseSession); // e.g. "199801"
        const year = sessionDateStr.slice(0, 4);
        const month = sessionDateStr.slice(4, 6);
        const day = '01';

        // Construct date string YYYY-MM-DD
        const sessionDateISO = `${year}-${month}-${day}`;
        const sessionDate = new Date(sessionDateISO);

        // Parse course start/end dates

        const startDate = new Date(courseData.startDate);
        const endDate = courseData.completionEndDate ? new Date(courseData.completionEndDate) : new Date(9999, 11, 31);

        if (isNaN(startDate)) {
          this.courseValidationMessage = 'Course start date is invalid.';
          return;
        }
        if (endDate && isNaN(endDate)) {
          this.courseValidationMessage = 'Course completion date is invalid.';
          return;
        }

        // 3. Date range validations
        if (sessionDate < startDate) {
          this.courseValidationMessage = `Course session date is before the course start date (${courseData.startDate})`;
          return;
        }

        if (endDate && sessionDate > endDate) {
          this.courseValidationMessage = `Course session date is after the course completion date (${courseData.completionEndDate})`;
          return;
        }

        // 4. Passed all validations — add course
        this.selectedCourseToUpdate.courseID = courseData.courseID
        this.selectedCourseToUpdate.courseSession = this.courseAdd.courseSession
        this.selectedCourseToUpdate.courseDetails = courseData
        this.courseValidationMessage = null;
        this.showCourseInput = false;
        this.clearForm();


      } catch (error) {
        //ADD VALIDATION ("Error fetching course data.");
        this.isLoading = false;
        this.courseValidationMessage = "Invalid Course code/level - course code/level does not exist in the ministry course registry"; //need this here because course not found is a 404 error; TODO expand on this via error code
      }
    },
    openDialog() {
      this.showCourseInput = false;
      this.dialog = true;
      this.selectedCourseToUpdate = JSON.parse(JSON.stringify(this.course));
      this.courseValidationMessage = "";
    },
    close() {
      this.clearForm();
      this.showCourseInput = false;
      this.dialog = false;
      this.courseValidationMessage = "";
    },
    clearForm() {
      this.courseAdd = {
        code: null,
        level: null,
        courseSession: null,
      }
      this.courseValidationMessage = "";
    },
    closeCourseInput() {
      this.clearForm();
      this.showCourseInput = false;
    },
    async confirmUpdate() {

      try {
        console.log(this.selectedCourseToUpdate)
        await this.updateStudentCourse(this.selectedCourseToUpdate);
        this.close();
      } catch (error) {
        console.error("Failed to update student courses:", error);
      }
    },

    hasPermissions(module, permission) {
      return true; // Replace with actual logic
    },
  },

  validations() {
    return {
      selectedCourseToUpdate: {
        // example rule: at least one field required
        courseCode: { required: helpers.withMessage('Course code is required', required) },
        // Add more validations depending on the course object structure
      },
    };
  },

};
</script>