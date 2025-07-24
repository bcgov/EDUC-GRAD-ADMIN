<template>
  <v-dialog v-model="dialog" persistent max-width="80%">
    <template v-slot:activator="{ props }">
      <v-btn v-if="hasPermissions('STUDENT', 'courseUpdate')" color="bcGovBlue" prepend-icon="mdi-plus"
        class="text-none" @click="openCreateStudentCoursesDialog" text="Add Student Courses" />
    </template>

    <v-card>
      <v-card-title>
        <v-row no-gutters>
          <div class="v-card-title">Add Student Courses</div>
          <v-spacer />
          <v-btn icon="mdi-close" density="compact" rounded="sm" variant="outlined" color="error" class="mt-2"
            @click="closeCreateStudentCourseDialog" />
        </v-row>
        <v-card-subtitle>{{ studentPenAndName }}</v-card-subtitle>
      </v-card-title>

      <v-stepper alt-labels show-actions v-model="step">
        <template v-slot:default>
          <v-stepper-header>
            <v-stepper-item title="Enter Courses" value="0" :rules="[() => v$.$invalid]">
              <template #icon>
                1
              </template>
            </v-stepper-item>

            <v-stepper-item title="Confirmation" value="1">
              <template #icon> 2 </template></v-stepper-item>
          </v-stepper-header>


          <v-stepper-window>
            <div style="max-height: 60vh; overflow-y: auto; padding-right: 8px;">

              <!-- Step 1 -->
              <v-stepper-window-item value="0">
                <!-- TODO- change this to match the text for validations in the validation ticket -->
                <div v-if="coursesToCreate.length > 0">
                  <div>
                    <template v-for="(course, index) in coursesToCreate" :key="course.courseID || index">

                      <CourseDetailsInput :course="course" create>
                        <template #remove-button>
                          <v-btn variant="outlined" color="bcGovBlue" class="mb-4 text-none"
                            style="min-width: auto; width: 80px"
                            @click="removeCourse(course.courseID, course.courseSession)">Remove</v-btn>
                        </template>
                      </CourseDetailsInput>
                      <v-divider v-if="index < coursesToCreate.length - 1" class="my-4" color="grey-darken-3" />

                    </template>
                  </div>
                </div>

              </v-stepper-window-item>

              <!-- Step 2 -->
              <v-stepper-window-item value="1">
                <v-expansion-panels multiple>
                  <v-expansion-panel v-for="(course, index) in createStudentResultsMessages" :key="index">
                    <v-expansion-panel-title class="d-flex align-center justify-space-between">
                      <div class="d-flex align-center flex-grow-1">
                        <v-icon :color="course.validationIssues.some(
                          (i) => i.validationIssueSeverityCode === 'ERROR'
                        )
                          ? 'error'
                          : 'success'
                          " class="mr-2">
                          {{
                            course.validationIssues.some(
                              (i) => i.validationIssueSeverityCode === "ERROR"
                            )
                              ? "mdi-close-circle"
                              : "mdi-check-circle"
                          }}
                        </v-icon>

                        <span>
                          {{ course.originalCourse.courseDetails.courseCode }}
                          {{ course.originalCourse.courseDetails.courseLevel }} –
                          {{ course.originalCourse.courseDetails.courseSession }}
                          {{
                            course.validationIssues.some(
                              (i) => i.validationIssueSeverityCode === "ERROR"
                            )
                              ? " failed to add course"
                              : ` added to student ${studentPen}`
                          }}
                        </span>

                        <v-spacer />

                        <span class="text-caption text-grey-darken-1">
                          {{
                            (() => {
                              const errors = course.validationIssues.filter(
                                (i) => i.validationIssueSeverityCode === "ERROR"
                              ).length;
                              const warnings = course.validationIssues.filter(
                                (i) => i.validationIssueSeverityCode === "WARNING"
                              ).length;

                              const parts = [];
                              if (errors > 0) parts.push(`${errors} error(s)`);
                              if (warnings > 0)
                                parts.push(`${warnings} warning(s)`);
                              return parts.join(", ");
                            })()
                          }}
                        </span>
                      </div>

                      <template #actions>
                        <v-icon>mdi-chevron-down</v-icon>
                      </template>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                      <div v-if="course.validationIssues.length">
                        <div v-for="(issue, i) in course.validationIssues" :key="i"
                          class="pl-3 d-flex align-center mb-2">
                          <v-icon :color="issue.validationIssueSeverityCode === 'ERROR' ? 'error' : 'warning'"
                            class="me-2" size="18">
                            {{ issue.validationIssueSeverityCode === 'ERROR' ? 'mdi-alert-circle' : 'mdi-alert' }}
                          </v-icon>
                          {{ issue.validationIssueMessage }}
                        </div>
                      </div>
                      <div v-else>
                        <v-alert type="success" dense outlined>
                          No validation issues.
                        </v-alert>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <v-alert v-if="coursesToCreate.length > 0" type="info" class="mb-4" border="start" elevation="2"
                  variant="tonal">
                  <div class="mb-2">
                    You are about to add the following courses to student
                    <strong>{{ studentPenAndName }}</strong>:
                  </div>
                  <v-row no-gutters v-for="course in coursesToCreate" :key="course.courseID + course.sessionDate"
                    class="mb-2">
                    <v-col cols="12"><strong>{{ course.courseDetails.courseCode }} {{ course.courseLevel }} -
                        {{
                          $filters.formatYYYYMMStringDate(course.courseSession)
                        }}</strong>
                    </v-col>
                    <v-col cols="12" class="ml-3">
                      {{ course.courseDetails.courseName }}
                    </v-col>
                    <v-col class="ml-3"><strong>Interim</strong>&nbsp;
                      <span v-if="course.interimPercent">{{ course.interimPercent }}%
                        {{ course.interimLetterGrade }}</span>
                      <span v-else> <i>null</i> </span>
                    </v-col>
                    <v-col><strong>Final</strong>&nbsp;
                      <span v-if="course.finalPercent">
                        {{ course.finalPercent }}%
                        {{ course.finalLetterGrade }}</span>
                      <span v-else><i>null</i></span></v-col>
                    <!-- I don't think credits can have a null value? - Samara -->
                    <v-col><strong>Credits</strong> {{ course.credits }}</v-col>
                    <v-col><strong>FA/AS</strong>&nbsp;
                      <span v-if="course.fineArtsAppliedSkills">
                        {{ course.fineArtsAppliedSkills }}
                      </span>
                      <span v-else><i>null</i></span>
                    </v-col>
                    <v-col><strong>Eq/Ch</strong>&nbsp;
                      <span v-if="course.equivOrChallenge">
                        {{ course.equivOrChallenge }}
                      </span>
                      <span v-else><i>null</i></span>
                    </v-col>
                    <v-col cols="12" class="ml-3" v-if="course.customizedCourseName"><strong>Custom Course
                        Title</strong>
                      {{ course.customizedCourseName }}</v-col>
                  </v-row>
                </v-alert>
              </v-stepper-window-item>
            </div>
          </v-stepper-window>
        </template>
      </v-stepper>
      <v-card-actions>

        <v-row v-if="showCourseInputs" no-gutters class="p-3">
          <v-col cols="1" class="pr-1">
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
            <v-text-field v-model="courseAdd.courseSession" label="Session Date (YYYYMM)"
              :error="v$.courseAdd.courseSession.$error"
              :error-messages="v$.courseAdd.courseSession.$errors.map(e => e.$message)"
              @blur="v$.courseAdd.courseSession.$touch()" variant="outlined" density="compact" clearable
              persistent-placeholder persistent-hint :disabled="isLoading" />
          </v-col>

          <v-col>
            <v-btn :disabled="v$?.courseAdd?.$invalid || isLoading" variant="flat" color="bcGovBlue" class="text-none"
              @click="addCourse">
              <v-progress-circular v-if="isLoading" indeterminate color="white" size="20" class="mr-2" />
              <span v-if="!isLoading">Get Course</span>
            </v-btn>
            <v-btn :disabled="coursesToCreate.length == 0" color="error" @click="closeCourseInput">
              <v-icon size="28">mdi-trash-can</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-row class="pb-2"> <v-alert v-if="courseValidationMessage" type="error" variant="tonal" border="start"
          class="width-fit-content">{{ courseValidationMessage }}</v-alert></v-row>
      <v-row justify="center">
        <v-btn variant="outlined" color="bcGovBlue" class="mb-4 text-none" v-if="!showCourseInputs && step === 0"
          @click="showCourseInputs = !showCourseInputs">
          + Enter Course
        </v-btn>
      </v-row>
      <v-card-actions>
        <v-btn v-if="step === 0" @click="closeCreateStudentCourseDialog" color="error" variant="outlined"
          class="text-none">
          Cancel
        </v-btn>

        <v-btn v-else @click="step--" color="bcGovBlue" variant="outlined" :disabled="step == 0 || validationStep">
          Back
        </v-btn>

        <v-spacer />

        <v-btn v-if="step < 1" @click="step++" color="bcGovBlue" variant="outlined"
          :disabled="coursesToCreate.length == 0 || v$.$invalid">
          Next
        </v-btn>

        <v-btn v-else-if="step == 1 && !validationStep" @click="submitForm" color="error" variant="flat"
          class="text-none">
          Add Student Courses
        </v-btn>
        <v-btn v-else-if="step == 1 && validationStep" @click="closeCreateStudentCourseDialog" color="error"
          variant="flat" class="text-none">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CourseDetailsInput from "@/components/StudentProfile/Forms/FormInputs/CourseDetailsInput.vue";
import CourseService from "@/services/CourseService.js";
import { toRaw } from "vue";
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useAccessStore } from "@/store/modules/access";
import { useStudentStore } from "@/store/modules/student";
import { mapState, mapActions } from "pinia";
import { validateAndFetchCourse } from '@/components/StudentProfile/Forms/utils/validateCourse.js';

export default {
  name: "StudentCoursesCreateForm",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  components: {
    CourseDetailsInput,
  },
  validations() {
    return {
      courseAdd: {
        code: {},
        level: {

        },
        courseSession: {
          validCourseSessionMonth: helpers.withMessage(
            'Course session must be in YYYYMM format with a valid month (01–12)',
            (value) => {
              if (!value && !this.showCourseInputs) return true
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
      showCourseInputs: true,
      createStudentResultsMessages: [],
      dialog: false,
      step: 0,
      validationStep: false,

      courseAdd: {
        code: null,
        level: null,
        courseSession: null,
      },
      courseValidationMessage: null,
      formattedCourseSession: null, // Find a better way to handle this? Masked values were removed in later versions of vuetify
      headers: [
        { title: "Code", key: "courseCode" },
        { title: "level", key: "courseLevel" },
        { title: "Session Date", key: "courseSession" },
        { title: "Title", key: "courseName" },
        { title: "Start Date", key: "startDate" },
        { title: "End Date", key: "endDate" },
        { title: "", key: "remove" },
      ],
    };
  },
  computed: {
    ...mapState(useAccessStore, ["hasPermissions", "getRoles"]),
    ...mapState(useStudentStore, {
      coursesToCreate: (state) => state.create.courses,
      studentPen: "getStudentPen",
      studentCourses: "studentCourses",
      studentPenAndName: "formattedStudentName",
    }),
  },
  methods: {

    ...mapActions(useStudentStore, [
      "addCoursesToCreate",
      "removeCourseFromCreate",
      "clearCoursesToCreate",
      "createStudentCourses",
    ]),

    openCreateStudentCoursesDialog() {
      this.step = 0;
      this.dialog = true;
      this.createStudentResultsMessages = [];
      this.validationStep = false;
      this.clearCoursesToCreate();
      this.clearForm();
    },

    closeCreateStudentCourseDialog() {
      this.clearCoursesToCreate();
      this.showCourseInputs = true;
      this.dialog = false;
    },
    removeCourse(courseId, courseSession) {
      this.removeCourseFromCreate(courseId, courseSession)
      //show course inputs if the courese to create is empty
      if (this.coursesToCreate.length == 0) {
        this.showCourseInputs = true
      }
    },
    async addCourse() {
      this.isLoading = true;
      this.courseValidationMessage = null;

      const { code, level, courseSession } = this.courseAdd;

      //Check if course already added
      const isCourseDuplicate = this.coursesToCreate.some(course =>
        course.courseDetails.courseCode?.toUpperCase() === code?.toUpperCase() &&
        course.courseDetails.courseLevel?.toUpperCase() === level?.toUpperCase() &&
        course.courseSession === courseSession
      );

      if (isCourseDuplicate) {
        this.courseValidationMessage = "This course has already been added";
        this.isLoading = false;
        return;
      }

      //Validate the new course
      const result = await validateAndFetchCourse({
        code,
        level,
        courseSession,
        existingCourses: this.studentCourses,
        checkExaminable: true,
        canAddExaminable: () => this.hasPermissions('STUDENT', 'updateExaminableCourse'),
      });

      this.isLoading = false;

      if (result.error) {
        this.courseValidationMessage = result.error;
        return;
      }


      this.addCoursesToCreate({
        courseID: result.courseID,
        courseSession: result.courseSession,
        courseDetails: result.courseData,
        isExaminable: result.isExaminable,
      });

      this.closeCourseInput();
      this.courseValidationMessage = null;
    },
    closeCourseInput() {
      this.clearForm();
      this.showCourseInputs = false;
    },
    clearForm() {
      this.courseAdd = {
        code: null,
        level: null,
        courseSession: null,
        courseStartDate: null,
        courseEndDate: null,
      };
      this.courseValidationMessage = "";

    },

    async submitForm() {
      this.createStudentResultsMessages = [];

      const courseWithoutCourseDetails = this.coursesToCreate.map(({ courseDetails, ...rest }) => ({ ...rest }));
      const createStudentCoursesRequestBody = toRaw(courseWithoutCourseDetails);

      // Call API and get response
      const response = await this.createStudentCourses(
        createStudentCoursesRequestBody
      );

      // Enrich response with entire original course object
      const enrichedResults = response.map((result) => {
        const original = this.coursesToCreate.find(
          (course) => course.courseID === result.courseID
        );
        return {
          ...result,
          originalCourse: original || {},
        };
      });

      this.createStudentResultsMessages = enrichedResults;
      this.clearCoursesToCreate(); // optional
      this.validationStep = true;
    },
  },
};
</script>
<style scoped>
.sticky-row {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  /* Or the background of your app */
}
</style>
