<template>
  <v-dialog v-model="dialog" persistent max-width="1024">
    <template v-slot:activator="{ props }">
      <v-btn
        v-if="hasPermissions('STUDENT', 'courseUpdate')"
        color="bcGovBlue"
        prepend-icon="mdi-plus"
        class="text-none"
        @click="openCreateStudentCoursesDialog"
        text="Add Student Courses"
      />
    </template>

    <v-card>
      {{ coursesToCreate }}
      <v-card-title>
        <v-row no-gutters>
          <div class="v-card-title">Add Student Courses</div>
          <v-spacer />
          <v-btn
            icon="mdi-close"
            density="compact"
            rounded="sm"
            variant="outlined"
            color="error"
            class="mt-2"
            @click="closeCreateStudentCourseDialog"
          />
        </v-row>
      </v-card-title>

      <v-stepper alt-labels show-actions v-model="step">
        <template v-slot:default>
          <v-stepper-header>
            <v-stepper-item title="Select Courses" value="0" />
            <v-stepper-item title="Enter Details" value="1" />
            <v-stepper-item title="Confirmation" value="2" />
          </v-stepper-header>

          <v-stepper-window>
            <!-- Step 1 -->
            <v-stepper-window-item value="0">
              <strong>Add Student Courses</strong>
              <v-row no-gutters class="mt-2">
                <v-text-field
                  v-model="courseAdd.code"
                  label="Course Code"
                  variant="outlined"
                  density="compact"
                />
                <v-text-field
                  v-model="courseAdd.level"
                  label="Course Level"
                  variant="outlined"
                  density="compact"
                />
                <v-text-field
                  v-model="courseAdd.courseSession"
                  label="Course Session"
                  variant="outlined"
                  density="compact"
                />
                <v-btn
                  variant="flat"
                  color="bcGovBlue"
                  class="text-none"
                  @click="addCourse"
                  >Add Course</v-btn
                >
              </v-row>

              <v-data-table
                :items="coursesToCreate"
                :headers="headers"
                item-value="id"
                class="mt-4"
                hide-default-footer
              >
                <template #item.remove="{ item }">
                  <v-btn @click="removeCourseFromCreate(item.courseID)">
                    Remove
                  </v-btn>
                </template>
              </v-data-table>
            </v-stepper-window-item>

            <!-- Step 2 -->
            <v-stepper-window-item value="1">
              <div v-if="coursesToCreate.length === 0">
                No courses added yet.
              </div>
              <div v-else>
                <template
                  v-for="(course, index) in coursesToCreate"
                  :key="course.courseID || index"
                >
                  <CourseDetailsInput :course="course" create />
                  <v-divider
                    v-if="index < coursesToCreate.length - 1"
                    class="my-4"
                    color="grey-darken-3"
                  />
                </template>
              </div>
            </v-stepper-window-item>

            <!-- Step 3 -->
            <v-stepper-window-item value="2">
              <pre>{{
                JSON.stringify(createStudentResultsMessages, null, 2)
              }}</pre>
              <v-data-table
                v-if="coursesToCreate"
                :headers="tableHeaders"
                :items="coursesToCreate"
                item-value="courseID"
                class="elevation-1"
              >
              </v-data-table>
            </v-stepper-window-item>
          </v-stepper-window>
        </template>
      </v-stepper>

      <!-- Actions -->
      <v-card-actions>
        <v-btn
          v-if="step === 0"
          @click="closeCreateStudentCourseDialog"
          color="error"
          variant="outlined"
          class="text-none"
        >
          Cancel
        </v-btn>

        <v-btn
          v-else
          @click="step--"
          color="bcGovBlue"
          variant="outlined"
          :disabled="disableBackButton"
        >
          Back
        </v-btn>

        <v-spacer />

        <v-btn
          v-if="step < 2"
          @click="step++"
          color="bcGovBlue"
          variant="outlined"
        >
          Next
        </v-btn>

        <v-btn
          v-else
          @click="submitForm"
          color="error"
          variant="flat"
          class="text-none"
        >
          Add Student Courses
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CourseDetailsInput from "@/components/StudentProfile/Forms/FormInputs/CourseDetailsInput.vue";
import CourseService from "@/services/CourseService.js";
import { toRaw } from "vue";
import { useAccessStore } from "@/store/modules/access";
import { useStudentStore } from "@/store/modules/student";
import { mapState, mapActions } from "pinia";

export default {
  name: "StudentCoursesCreateForm",
  components: {
    CourseDetailsInput,
  },
  data() {
    return {
      createStudentResultsMessages: [],
      dialog: false,
      step: 0,

      courseAdd: {
        code: null,
        level: null,
        courseSession: null,
      },
      headers: [
        { title: "Course Name", key: "courseName" },
        { title: "Course Level", key: "courseLevel" },
        { title: "Course Session", key: "courseSession" },
        { title: "Remove", key: "remove" },
      ],
    };
  },
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useStudentStore, {
      coursesToCreate: (state) => state.create.courses,
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
    },

    closeCreateStudentCourseDialog() {
      this.dialog = false;
    },
    async addCourse() {
      const { code, level, courseSession } = this.courseAdd;

      if (!code || !level || !courseSession) {
        this.$toast?.error?.("Please fill out all course fields.");
        return;
      }

      try {
        const response = await CourseService.getCourseByCodeAndLevel(
          code,
          level
        );
        const courseID = response?.data?.courseID;
        const courseName = response?.data?.courseName;
        const courseCode = response?.data?.courseCode;
        const courseLevel = response?.data?.courseLevel;
        const genericCourseType = response?.data?.genericCourseType;

        if (courseID) {
          this.addCoursesToCreate({
            courseID,
            courseCode,
            courseLevel,
            courseSession,
            courseName,
            genericCourseType,
          });
          this.clearForm();
        } else {
          this.$toast?.error?.("Course not found.");
        }
      } catch (error) {
        this.$toast?.error?.("Error fetching course data.");
      }
    },

    clearForm() {
      this.courseAdd = { code: null, level: null, courseSession: null };
    },

    async submitForm() {
      const createStudentCoursesRequestBody = toRaw(this.coursesToCreate);

      // Call API and get response
      const response = await this.createStudentCourses(
        createStudentCoursesRequestBody
      );

      this.createStudentResultsMessages = response; // still store full response if needed
      console.log(this.createStudentResultsMessages);
      this.clearCoursesToCreate(); // optional depending on if you still need to show messages
    },

    disableBackButton() {
      return false;
    },
  },
};
</script>
