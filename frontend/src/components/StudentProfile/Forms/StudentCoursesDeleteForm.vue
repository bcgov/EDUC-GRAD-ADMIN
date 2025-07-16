<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="1260">
      <template v-slot:activator="{ props }">
        <slot name="activator" v-bind="props">
          <v-btn
            v-if="
              hasPermissions('STUDENT', 'courseUpdate') && courseBatchDelete
            "
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
        <v-card-title>
          <v-row no-gutters>
            <div class="v-card-title">Delete Student Course</div>
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
          <v-card-subtitle>{{
            studentStore.formattedStudentName
          }}</v-card-subtitle>
        </v-card-title>

        <v-card-text>
          <v-alert
            v-if="selectedCoursesWithWarnings.length > 0"
            type="info"
            class="mb-4"
            border="start"
            elevation="2"
            variant="tonal"
          >
            <div class="mb-2">
              You are about to remove the following student course{{
                selectedCoursesWithWarnings.length > 1 ? "s" : ""
              }}:
            </div>
            <v-row
              no-gutters
              v-for="course in selectedCoursesWithWarnings"
              :key="course.id"
              class="mb-2"
            >
              <v-col cols="12">
                <strong
                  >{{ course.courseDetails.courseCode }}
                  {{ course.courseDetails.courseLevel }} -
                  {{
                    $filters.formatYYYYMMStringDate(course.courseSession)
                  }}</strong
                >
              </v-col>
              <v-col cols="12" class="ml-3">
                {{ course.courseDetails.courseName }}
              </v-col>
              <v-col class="ml-3"
                ><strong>Interim</strong>&nbsp;
                <span v-if="course.interimPercent"
                  >{{ course.interimPercent }}%
                  {{ course.interimLetterGrade }}</span
                >
                <span v-else> <i>null</i> </span>
              </v-col>
              <v-col
                ><strong>Final</strong>&nbsp;
                <span v-if="course.finalPercent">
                  {{ course.finalPercent }}% {{ course.finalLetterGrade }}</span
                ><span v-else><i>null</i></span></v-col
              >
              <!-- I don't think credits can have a null value? - Samara -->
              <v-col><strong>Credits</strong> {{ course.credits }}</v-col>
              <v-col
                ><strong>FA/AS</strong>&nbsp;
                <span v-if="course.fineArtsAppliedSkills">
                  {{ course.fineArtsAppliedSkills }}
                </span>
                <span v-else><i>null</i></span>
              </v-col>
              <v-col
                ><strong>Eq/Ch</strong>&nbsp;
                <span v-if="course.equivOrChallenge">
                  {{ course.equivOrChallenge }}
                </span>
                <span v-else><i>null</i></span>
              </v-col>
              <v-col cols="12" class="ml-3" v-if="course.customizedCourseName"
                ><strong>Custom Course Title</strong>
                {{ course.customizedCourseName }}</v-col
              >
            </v-row>
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
            Delete Course<span v-if="selectedCoursesToDelete.length > 1"
              >s</span
            >
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
        const match =
          this.studentStore.student.gradStatus.studentGradData.studentCourses.studentCourseList.find(
            (c) =>
              c.courseCode === course.courseDetails.courseCode &&
              c.courseLevel === course.courseDetails.courseLevel &&
              c.courseSession === course.courseDetails.courseSession
          );

        const isUsedForGrad = match?.used || false;
        const hasExam =
          match?.bestExamPercent !== null ||
          (match?.specialCase && match.specialCase !== "N") ||
          (match?.completedCoursePercentage !== null &&
            match.completedCoursePercentage !== 0);

        return {
          ...course,
          validationIssues: [
            ...(course.validationIssues || []),
            ...(isUsedForGrad
              ? [
                  {
                    type: "warning",
                    message:
                      "This course is used to meet graduation requirements.",
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
