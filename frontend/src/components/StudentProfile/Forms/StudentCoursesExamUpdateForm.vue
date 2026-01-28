<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="80%">
      <template v-slot:activator="{ props }">
        <slot name="activator" v-bind="props">
          <v-btn :disabled="studentStatus === 'MER'" @click="openDialog" v-bind="props" color="success"
            icon="mdi-pencil" density="compact" variant="text" />
        </slot>
      </template>
      <v-card>
        <v-card-title>

          <v-row no-gutters>
            <div class="v-card-title">Edit Student Course Exam</div>
            <v-spacer />
            <v-btn icon="mdi-close" density="compact" rounded="sm" variant="outlined" color="error" class="mt-2"
              @click="close" />
          </v-row>
          <v-card-subtitle>{{
            studentStore.formattedStudentName
          }}</v-card-subtitle>
        </v-card-title>
        <v-col>
          <StudentStatusAlert :studentStatus="studentStatus" />
        </v-col>
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
              <div style="padding-right: 8px;">

                <!-- Step 1 -->
                <v-stepper-window-item value="0">
                  <v-card-text>
                    <v-row no-gutters class="p-2" v-if="showCourseInput">
                      <v-col class="pr-1">
                        Select Course
                      </v-col>

                      <v-col class="pr-1">
                        <v-text-field v-model="courseUpdate.code" label="Course Code" :error="!!courseValidationMessage"
                          variant="outlined" density="compact" clearable persistent-placeholder persistent-hint
                          :disabled="isLoading" />
                      </v-col>

                      <v-col class="pr-1">
                        <v-text-field v-model="courseUpdate.level" label="Course Level"
                          :error="!!courseValidationMessage" variant="outlined" density="compact" clearable
                          persistent-placeholder persistent-hint :disabled="isLoading" />
                      </v-col>
                      <v-col class="pr-1">
                        <v-text-field v-model="courseUpdate.courseSession" label="Session Date (YYYYMM)"
                          variant="outlined" density="compact" clearable persistent-placeholder persistent-hint />
                      </v-col>

                      <v-col>

                        <v-btn :disabled="v$?.courseUpdate?.$invalid || isLoading" variant="flat" color="bcGovBlue"
                          class="text-none" @click="updateCourse">
                          <v-progress-circular v-if="isLoading" indeterminate color="white" size="20" class="mr-2" />
                          <span v-if="!isLoading">Get Course</span>
                        </v-btn>
                        <v-btn :disabled="isLoading" class="pl-1" icon="mdi-delete-forever" density="compact"
                          variant="text" color="error" @click="closeCourseInput">
                          <v-icon size="28">mdi-trash-can</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="12"> <v-alert v-if="courseValidationMessage" type="error" variant="tonal"
                          border="start" class="width-fit-content">{{ courseValidationMessage }}</v-alert></v-col>
                    </v-row>

                    <CourseExamDetailsInput :course="selectedCourseToUpdate" update>
                      <template #remove-button>
                        <v-btn v-if="!selectedCourseToUpdate.isExaminable" variant="outlined" color="bcGovBlue"
                          class="mb-4 text-none p-1" style="max-width: 7.5rem;"
                          @click="showCourseInput = !showCourseInput">Change Course</v-btn>
                      </template>
                    </CourseExamDetailsInput>

                    <!-- Validation Issues Display -->
                    <v-alert
                      v-if="validationIssues.length > 0"
                      type="error"
                      class="mt-4"
                      border="start"
                      elevation="2"
                      variant="tonal"
                    >
                      <div class="mb-2">
                        <strong>Validation Errors - Please fix the following issues:</strong>
                      </div>
                      <div
                        v-for="(issue, i) in validationIssues"
                        :key="i"
                        class="pl-3 d-flex align-center mb-2"
                      >
                        <v-icon
                          :color="issue.validationIssueSeverityCode === 'ERROR' ? 'error' : 'warning'"
                          class="me-2"
                          size="18"
                        >
                          {{ issue.validationIssueSeverityCode === "ERROR" ? "mdi-alert-circle" : "mdi-alert" }}
                        </v-icon>
                        <strong>{{ issue.validationFieldName }}:</strong>&nbsp;{{ issue.validationIssueMessage }}
                      </div>
                    </v-alert>

                  </v-card-text>
                </v-stepper-window-item>

                <!-- Step 2 -->
                <v-stepper-window-item value="1">
                  <v-alert v-if="step == 1" type="info" class="mb-4" border="start" elevation="2" variant="tonal">
                    <div class="mb-2">
                      You are about to update the following courses to student
                      <strong>{{ studentPenAndName }}</strong>:
                    </div>
                    <v-row no-gutters class="mb-2">
                      <v-col cols="12"><strong>{{ selectedCourseToUpdate.courseDetails.courseCode }} {{
                        selectedCourseToUpdate.courseLevel }} -
                          {{
                            $filters.formatYYYYMMStringDate(selectedCourseToUpdate.courseSession)
                          }}</strong>
                      </v-col>
                      <v-col cols="12" class="ml-3">
                        {{ selectedCourseToUpdate.courseDetails.courseName }}
                      </v-col>
                      <v-col class="ml-2">
                        <strong class="mr-1">School %</strong>
                        <span v-if="selectedCourseToUpdate.courseExam.schoolPercentage">{{
                          selectedCourseToUpdate.courseExam.schoolPercentage
                        }}</span>
                        <span v-else><i>null</i></span>
                      </v-col>
                      <v-col class="ml-2">
                        <strong class="mr-1">Best School %</strong>
                        <span v-if="selectedCourseToUpdate.courseExam.bestSchoolPercentage">{{
                          selectedCourseToUpdate.courseExam.bestSchoolPercentage
                        }}</span>
                        <span v-else><i>null</i></span>
                      </v-col>
                      <v-col class="ml-2">
                        <strong class="mr-1">Special Case</strong>
                        <span v-if="selectedCourseToUpdate.courseExam.specialCase">{{
                          selectedCourseToUpdate.courseExam.specialCase
                        }}</span>
                        <span v-else><i>null</i></span>
                      </v-col>
                      <v-col class="ml-2">
                        <strong class="mr-1">Exam Best %</strong>
                        <span v-if="selectedCourseToUpdate.courseExam.bestExamPercentage">{{
                          selectedCourseToUpdate.courseExam.bestExamPercentage
                        }}</span>
                        <span v-else><i>null</i></span>
                      </v-col>
                      <v-col class="ml-2">
                        <strong class="mr-1">Final %</strong>
                        <span v-if="selectedCourseToUpdate.finalPercent">{{
                          selectedCourseToUpdate.finalPercent
                        }}</span>
                        <span v-else><i>null</i></span>
                      </v-col>
                      <v-col class="ml-2">
                        <strong class="mr-1">Final LG</strong>
                        <span v-if="selectedCourseToUpdate.finalLetterGrade">{{
                          selectedCourseToUpdate.finalLetterGrade
                        }}</span>
                        <span v-else><i>null</i></span>
                      </v-col>
                      <v-col>
                        <strong class="mr-1">Credits</strong>
                        <span v-if="selectedCourseToUpdate.credits">{{
                          selectedCourseToUpdate.credits
                        }}</span>
                        <span v-else><i>null</i></span>
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-stepper-window-item>
              </div>
            </v-stepper-window>
          </template>
        </v-stepper>

        <v-card-actions>
          <v-btn v-if="step === 0" color="error" variant="outlined" class="text-none" density="default" @click="close">
            Cancel
          </v-btn>
          <v-btn v-else @click="step--" color="bcGovBlue" variant="outlined" :disabled="step == 0">
            Back
          </v-btn>
          <v-spacer />
          <v-btn v-if="step == 0" @click="step++" color="bcGovBlue" variant="flat" :disabled="v$.$invalid">
            Next
          </v-btn>
          <v-btn v-else color="bcGovBlue" variant="flat" class="text-none" density="default" @click="confirmUpdate"
            :disabled="isLoading">
            <v-progress-circular v-if="isLoading" indeterminate color="white" size="20" class="mr-2" />
            Save Student Course(s)
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { useSnackbarStore } from "@/store/modules/snackbar";
import { helpers } from '@vuelidate/validators';
import CourseExamDetailsInput from "@/components/StudentProfile/Forms/FormInputs/CourseExamDetailsInput.vue";
import { useStudentStore } from "@/store/modules/student";
import { mapState, mapActions } from "pinia";
import { validateAndFetchCourse } from '@/components/StudentProfile/Forms/utils/validateCourse.js';
import StudentStatusAlert from "@/components/StudentProfile/Forms/StudentStatusAlert.vue";

export default {
  name: "StudentCoursesExamUpdateForm",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  components: { CourseExamDetailsInput, StudentStatusAlert },

  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  validations() {
    return {
      selectedCourseToUpdate: {
        isDifferentFromOriginal: helpers.withMessage(
          'No changes detected in the course details',
          function (value) {
            const normalize = (obj) => {
              return JSON.parse(JSON.stringify(obj), (key, val) => {
                // Convert numeric strings to numbers
                if (typeof val === 'string' && !isNaN(val)) {
                  return Number(val);
                }
                return val;
              });
            };

            const normalizedValue = normalize(value);
            const normalizedOriginal = normalize(this.course);

            return JSON.stringify(normalizedValue) !== JSON.stringify(normalizedOriginal);
          }
        )
      },
      courseUpdate: {
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
          validCourseSessionYear: helpers.withMessage(
              "Course session year must be 1984 or later",
              (value) => {
                if (!value) return true;
                const stringValue = String(value);

                // Only check year if format is valid (6 digits)
                if (!/^\d{6}$/.test(stringValue)) return true;

                const year = parseInt(stringValue.slice(0, 4), 10);
                return year >= 1984;
              }
          ),
        }
      }
    }
  },
  data() {
    return {
      step: 0,
      isLoading: false,
      dialog: false,
      showCourseInput: false,
      courseValidationMessage: null,
      validationIssues: [],
      selectedCourseToUpdate: {},
      courseUpdate: {
        code: null,
        level: null,
        courseSession: null,
      },
      snackbarStore: useSnackbarStore(),
    };
  },
  computed: {
    ...mapState(useStudentStore, {
      studentPenAndName: "formattedStudentName"
    }),
    ...mapState(useStudentStore, {
      studentCourses: "studentCourses",
      studentProgram: (state) => state.student.profile.program,
      studentStatus: (state) => state.student.profile.studentStatus,
    }),
    studentStore() {
      return useStudentStore();
    },
  },

  methods: {
    ...mapActions(useStudentStore, [
      "updateStudentCourse"
    ]),

    async updateCourse() {
      this.isLoading = true;
      this.courseValidationMessage = null;

      const { code, level, courseSession } = this.courseUpdate;

      const result = await validateAndFetchCourse({
        code,
        level,
        courseSession,
        studentProgram: this.studentProgram,
        existingCourses: this.studentCourses,
        checkExaminable: false,
      });

      this.isLoading = false;

      if (result.error) {
        this.courseValidationMessage = result.error;
        return;
      }

      this.selectedCourseToUpdate.courseID = result.courseID;
      this.selectedCourseToUpdate.courseSession = result.courseSession;
      this.selectedCourseToUpdate.courseDetails = result.courseData;
      this.selectedCourseToUpdate.courseDetails = result.courseData;
      this.courseValidationMessage = null;
      this.showCourseInput = false;
      this.clearForm();
    },
    openDialog() {
      this.showCourseInput = false;
      this.dialog = true;
      this.selectedCourseToUpdate = JSON.parse(JSON.stringify(this.course));
      //add if course is examinable
      this.selectedCourseToUpdate.isExaminable = this.selectedCourseToUpdate.courseExam != null
      this.courseValidationMessage = "";
      this.validationIssues = [];
      this.step = 0;
    },
    close() {
      this.clearForm();
      this.showCourseInput = false;
      this.dialog = false;
      this.courseValidationMessage = "";
      this.step = 0;
    },
    clearForm() {
      this.courseUpdate = {
        code: null,
        level: null,
        courseSession: null,
      }
      this.courseValidationMessage = "";
    },
    closeCourseInput() {
      this.clearForm();
      this.showCourseInput = false;
      this.step = 0;
    },
    async confirmUpdate() {
      try {
        this.validationIssues = [];

        //remove courseDetails from payload
        const { courseDetails, relatedCourseDetails, ...courseWithoutCourseDetails } = this.selectedCourseToUpdate;
        const response = await this.updateStudentCourse(courseWithoutCourseDetails);

        // Check for validation issues in response data (backend returns 200 even with validation errors)
        const responseData = response.data;
        if (response.status == 200 && responseData.hasPersisted === false && responseData.validationIssues && responseData.validationIssues.length > 0) {
          this.validationIssues = responseData.validationIssues;

          this.step = 0;

          this.snackbarStore.showSnackbar(
            "Please fix the validation errors shown below",
            "danger",
            5000,
            "Validation Error"
          );

          return;
        }

        if (response.status == 200) {
          this.snackbarStore.showSnackbar(
            `${courseDetails.courseCode} ${courseDetails.courseLevel} - ${courseWithoutCourseDetails.courseSession} successfully updated.`,
            "success",
            10000,
            "Student course"
          );
        } else {
          this.snackbarStore.showSnackbar(
            "Failed to update student course \n" + response.data,
            "danger",
            10000,
            "Student course"
          );
        }
        this.close();
      } catch (error) {
        this.snackbarStore.showSnackbar(
          "Failed to update student course exam",
          "danger",
          10000,
          "Student course"
        );
      }
    },
  },

};
</script>