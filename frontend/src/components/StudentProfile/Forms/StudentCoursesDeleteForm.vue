<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ props }">
        <slot name="activator" v-bind="props">
          <v-btn
            v-if="hasPermissions('STUDENT', 'courseUpdate') && courseBatchDelete"
            v-bind="props"
            :disabled="selectedCoursesToDelete.length === 0"
            color="error"
            class="text-none"
            prepend-icon="mdi-delete-forever"
          >
            Delete Selected Courses
          </v-btn>

          <v-btn
            v-else-if="hasPermissions('STUDENT', 'courseUpdate')"
            v-bind="props"
            color="error"
            icon="mdi-delete-forever"
            density="compact"
            variant="text"
          />
        </slot>
      </template>

      <v-card>
        <template v-slot:title>
          <v-row no-gutters>
            <div class="v-card-title">
              Delete Student Course
            </div>
            <v-spacer />
            <v-btn
              icon="mdi-close"
              density="compact"
              rounded="sm"
              variant="outlined"
              color="error"
              class="mt-2"
              @click="close"
            />
          </v-row>
        </template>

        <v-card-text>
          <v-alert
          v-if="selectedCoursesWithWarnings.length > 0"
          type="warning"
          border="start"
          prominent
          class="pl-4"
          elevation="2"
          variant="tonal"
        >
          You are about to remove the following courses from student:
          {{ studentPen }}
          <ul>
            <li v-for="course in selectedCoursesWithWarnings" :key="course.id">
              <strong>
                {{ course.courseDetails.courseName }}
                {{ course.courseLevel }}
                {{ course.courseSession }}
              </strong>
              <ul style="padding-left: 1.5em;">
                <li
                  v-for="(issue, i) in course.validationIssues"
                  :key="i"
                >
                  <div class="d-flex flex-column align-start">
          
                    {{ issue.message }}
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="error"
            variant="outlined"
            class="text-none"
            density="default"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            color="error"
            variant="flat"
            class="text-none"
            density="default"
            @click="confirmDelete"
          >
            Delete Course<span v-if="selectedCoursesToDelete.length > 1">s</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useStudentStore } from "@/store/modules/student";

export default {
  name: "StudentCoursesDeleteForm",
  props: {
    selectedCoursesToDelete: {
      type: Array,
      required: true,
    },
    courseBatchDelete: {
      type: Boolean,
      default: false,
    },
    studentId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    studentStore() {
      return useStudentStore();
    },
    studentPen() {
      return this.studentStore.pen;
    },
    
    requirementsMet() {
      return this.studentStore.student.gradStatus.studentGradData;
    },
    selectedCoursesWithWarnings() {
      return this.selectedCoursesToDelete.map((course) => {
        const match = this.studentStore.student.gradStatus.studentGradData.studentCourses.studentCourseList.find(
          (c) =>
            c.courseCode === course.courseDetails.courseCode &&
            c.courseLevel === course.courseDetails.courseLevel &&
            c.courseSession === course.courseDetails.courseSession
        );

        const isUsedForGrad = match?.used || false;
        const hasExam =
  match?.bestExamPercent !== null ||
  (match?.specialCase && match.specialCase !== 'N') ||
  (match?.completedCoursePercentage !== null && match.completedCoursePercentage !== 0);

        return {
          ...course,
          validationIssues: [
            ...(course.validationIssues || []),
            ...(isUsedForGrad
              ? [
                  {
                    type: "warning",
                    message: "This course is used to meet graduation requirements.",
                  },
                ]
              : []),
            ...(hasExam
              ? [
                  {
                    type: "info",
                    message: "This course has an associated exam record.",
                  },
                ]
              : []),
          ],
        };
      });
    },
  },
  methods: {
    close() {
      this.dialog = false;
    },
    async confirmDelete() {
      try {
        const request = this.selectedCoursesToDelete.map((item) => item.id);
        await this.studentStore.deleteStudentCourses(request);
        this.close();
      } catch (error) {
        console.error("Failed to delete student courses:", error);
      }
    },
    hasPermissions(module, permission) {
      return true; // Replace with real permission check
    },
  },
};
</script>
