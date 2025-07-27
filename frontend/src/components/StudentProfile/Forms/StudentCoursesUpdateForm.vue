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
        <v-stepper show-actions v-model="step">
          <template v-slot:default>
            <v-stepper-header>
              <v-stepper-item title="Update Course Info" value="0" :rules="[() => v$.$invalid]">
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
                        <strong>Update Student Course</strong>
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
                    <CourseDetailsInput v-else :course="selectedCourseToUpdate" update>
                      <template #remove-button>
                        <v-btn variant="outlined" color="bcGovBlue" class="mb-4 text-none p-1" style="max-width: 120px;"
                          @click="showCourseInput = !showCourseInput">Change Course</v-btn>
                      </template>
                    </CourseDetailsInput>
                  </v-card-text>
                </v-stepper-window-item>

                <!-- Step 2 -->
                <v-stepper-window-item value="1">
                  <v-alert v-if="step == 1" type="info" class="mb-4" border="start" elevation="2" variant="tonal">
                    <div class="mb-2">
                      You are about to save the following changes
                    </div>
                    <v-row no-gutters class="mb-2">
                      <v-col cols="12"><strong>{{ selectedCourseToUpdate.courseDetails.courseCode }} {{
                        selectedCourseToUpdate.courseLevel }} -
                          {{
                            $filters.formatYYYYMMStringDate(course.courseSession)
                          }}</strong>
                      </v-col>
                      <v-col cols="12" class="ml-3">
                        {{ selectedCourseToUpdate.courseDetails.courseName }}
                      </v-col>
                      <v-col class="ml-3"><strong>Interim</strong>&nbsp;
                        <span v-if="selectedCourseToUpdate.interimPercent">{{ selectedCourseToUpdate.interimPercent }}%
                          {{ selectedCourseToUpdate.interimLetterGrade }}</span>
                        <span v-else> <i>null</i> </span>
                      </v-col>
                      <v-col><strong>Final</strong>&nbsp;
                        <span v-if="selectedCourseToUpdate.finalPercent">
                          {{ selectedCourseToUpdate.finalPercent }}%
                          {{ selectedCourseToUpdate.finalLetterGrade }}</span><span v-else><i>null</i></span></v-col>
                      <!-- I don't think credits can have a null value? - Samara -->
                      <v-col><strong>Credits</strong> {{ selectedCourseToUpdate.credits }}</v-col>
                      <v-col><strong>FA/AS</strong>&nbsp;
                        <span v-if="selectedCourseToUpdate.fineArtsAppliedSkills">
                          {{ selectedCourseToUpdate.fineArtsAppliedSkills }}
                        </span>
                        <span v-else><i>null</i></span>
                      </v-col>
                      <v-col><strong>Eq/Ch</strong>&nbsp;
                        <span v-if="selectedCourseToUpdate.equivOrChallenge">
                          {{ selectedCourseToUpdate.equivOrChallenge }}
                        </span>
                        <span v-else><i>null</i></span>
                      </v-col>
                      <v-col cols="12" class="ml-3" v-if="selectedCourseToUpdate.customizedCourseName"><strong>Custom
                          Course
                          Title</strong>
                        {{ selectedCourseToUpdate.customizedCourseName }}</v-col>
                    </v-row>
                  </v-alert>
                </v-stepper-window-item>
              </div>
            </v-stepper-window>
          </template>
        </v-stepper>

        <v-card-actions>

          <v-btn color="error" variant="outlined" class="text-none" density="default" @click="close">
            Cancel
          </v-btn>
          <v-btn v-if="step == 1" @click="step--" color="bcGovBlue" variant="outlined" :disabled="step == 0">
            Back
          </v-btn>
          <v-spacer />

          <v-btn v-if="step == 0" @click="step++" color="bcGovBlue" variant="flat">
            Next
          </v-btn>
          <v-btn v-else color="error" variant="flat" class="text-none" density="default" @click="confirmUpdate"
            :disabled="isLoading">

            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core';
import { useSnackbarStore } from "@/store/modules/snackbar";
import { required, helpers } from '@vuelidate/validators';
import CourseDetailsInput from "@/components/StudentProfile/Forms/FormInputs/CourseDetailsInput.vue";
import { useStudentStore } from "@/store/modules/student";
import { mapState, mapActions } from "pinia";
import { validateAndFetchCourse } from '@/components/StudentProfile/Forms/utils/validateCourse.js';

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
    }),
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
        //remove courseDetails from payload
        await this.updateStudentCourse(this.selectedCourseToUpdate);
        this.snackbarStore.showSnackbar(
          "Student course successfully updated.",
          "success",
          10000,
          "Student course"
        );
        this.close();
      } catch (error) {
        this.snackbarStore.showSnackbar(
          "Failed to update student course",
          "danger",
          10000,
          "Student course"
        );
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