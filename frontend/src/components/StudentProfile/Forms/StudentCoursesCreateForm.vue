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
            <v-stepper-item title="Select Courses" value="0">
              <template #icon> 1 </template></v-stepper-item
            >
            <v-stepper-item title="Enter Details" value="1">
              <template #icon> 2 </template></v-stepper-item
            >

            <v-stepper-item title="Confirmation" value="2">
              <template #icon> 3 </template></v-stepper-item
            >
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
                  class="pr-1"
                />
                <v-text-field
                  v-model="courseAdd.level"
                  label="Course Level"
                  variant="outlined"
                  density="compact"
                  class="pr-1"
                />
                <v-text-field
                  v-model="courseAdd.courseSession"
                  label="Session Date"
                  variant="outlined"
                  density="compact"
                  class="pr-1"
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
                v-if="coursesToCreate.length"
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
              <v-expansion-panels multiple>
                <v-expansion-panel
                  v-for="(course, index) in createStudentResultsMessages"
                  :key="index"
                >
                  <v-expansion-panel-title
                    class="d-flex align-center justify-space-between"
                  >
                    <div class="d-flex align-center flex-grow-1">
                      <v-icon
                        :color="
                          course.validationIssues.some(
                            (i) => i.validationIssueSeverityCode === 'ERROR'
                          )
                            ? 'error'
                            : 'success'
                        "
                        class="mr-2"
                      >
                        {{
                          course.validationIssues.some(
                            (i) => i.validationIssueSeverityCode === "ERROR"
                          )
                            ? "mdi-close-circle"
                            : "mdi-check-circle"
                        }}
                      </v-icon>

                      <span>
                        {{ course.originalCourse.courseCode }}
                        {{ course.originalCourse.courseLevel }} –
                        {{ course.originalCourse.courseSession }}
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
                      <v-alert
                        v-for="(issue, i) in course.validationIssues"
                        :key="i"
                        :type="
                          issue.validationIssueSeverityCode === 'ERROR'
                            ? 'error'
                            : 'warning'
                        "
                        dense
                        outlined
                        class="mb-2"
                      >
                        {{ issue.validationIssueMessage }}
                      </v-alert>
                    </div>
                    <div v-else>
                      <v-alert type="success" dense outlined>
                        No validation issues.
                      </v-alert>
                    </div>
                    <pre>{{ course.originalCourse }}</pre>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-alert
                v-if="coursesToCreate.length > 0"
                type="info"
                class="mb-4"
                border="start"
                elevation="2"
                variant="tonal"
              >
                <div class="mb-2">
                  You are about to add the following courses to student
                  <strong>{{ studentPen }}</strong
                  >:
                </div>
                <ul class="pl-4">
                  <li v-for="course in coursesToCreate" :key="course.courseID">
                    <strong
                      >{{ course.courseCode }} {{ course.courseLevel }} –
                      {{ course.courseSession }}
                    </strong>
                    {{ course.courseName }}
                  </li>
                </ul>
              </v-alert>
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
          :disabled="step == 0 || validationStep"
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
          v-else-if="step == 2 && !validationStep"
          @click="submitForm"
          color="error"
          variant="flat"
          class="text-none"
        >
          Add Student Courses
        </v-btn>
        <v-btn
          v-else-if="step == 2 && validationStep"
          @click="closeCreateStudentCourseDialog"
          color="error"
          variant="flat"
          class="text-none"
        >
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
      validationStep: false,

      courseAdd: {
        code: null,
        level: null,
        courseSession: null,
      },
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
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useStudentStore, {
      coursesToCreate: (state) => state.create.courses,
      studentPen: "getStudentPen",
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
      this.clearForm();
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
        const startDate = response?.data?.startDate;
        const endDate = response?.data?.endDate;
        const genericCourseType = response?.data?.genericCourseType;

        if (courseID) {
          this.addCoursesToCreate({
            courseID,
            courseCode,
            courseLevel,
            courseSession,
            courseName,
            startDate,
            endDate,
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
      this.courseAdd = {
        code: null,
        level: null,
        courseSession: null,
        courseStartDate: null,
        courseEndDate: null,
      };
      this.validationStep = false;
    },

    async submitForm() {
      this.createStudentResultsMessages = [];
      const createStudentCoursesRequestBody = toRaw(this.coursesToCreate);

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
