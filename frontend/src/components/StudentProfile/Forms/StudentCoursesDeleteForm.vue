<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="80%">
      <template v-slot:activator="{ props }">
        <slot name="activator" v-bind="props">
          <v-btn v-if="!courseBatchDelete && hasPermissions('STUDENT', 'courseUpdate') &&
            (!hasExam || hasPermissions('STUDENT', 'updateExaminableCourse'))"
            :disabled="!hasPermissions('STUDENT', 'courseUpdate') || studentStatus == 'MER'" v-bind="props"
            color="error" icon="mdi-delete-forever" density="compact" variant="text" />
        </slot>
      </template>

      <v-card>
        <v-card-title>
          <v-row no-gutters>
            <div class="v-card-title">Delete Student Course</div>
            <v-spacer />
            <v-btn icon="mdi-close" density="compact" rounded="sm" variant="outlined" color="error" class="mt-2"
              @click="close" />
          </v-row>
          <v-card-subtitle>{{
            studentStore.formattedStudentName
          }}</v-card-subtitle>

        </v-card-title>
        <v-card-text>
          <StudentCourseAlert :studentStatus="studentStatus" />
          <!-- Warnings & Info: These will be deleted -->
          <div v-if="selectedCoursesWithValidations.warning.length || selectedCoursesWithValidations.info.length">
            <h4 class="font-weight-bold my-2">The following courses will be deleted</h4>

            <div
              v-for="(course, index) in [...selectedCoursesWithValidations.warning, ...selectedCoursesWithValidations.info]"
              :key="'deletable-' + index" class="mb-3">
              <v-alert :type="course.validationType" border="start" variant="tonal" density="compact"
                icon="mdi-alert-circle">
                <v-row no-gutters compact>
                  <v-col cols="12" v-if="course.validationMessage">
                    <div class="d-flex align-center mb-1">
                      <span>{{ course.validationMessage }}</span>
                    </div>
                  </v-col>
                </v-row>
                <v-row class="px-3 py-3" no-gutters>
                  <v-col cols="12">
                    <div style="font-size: 1rem;">
                      <CourseReview :shouldRemoveGutters="false" :course="course" />
                    </div>
                  </v-col>
                </v-row>

              </v-alert>
            </div>
          </div>

          <!-- Errors: These will NOT be deleted -->
          <div v-if="selectedCoursesWithValidations.error.length">
            <h4 class="font-weight-bold my-2">The following courses will NOT be deleted</h4>
            <div v-for="(course, index) in selectedCoursesWithValidations.error" :key="'error-' + index" class="mb-3">
              <v-alert type="error" border="start" variant="tonal" density="compact" icon="mdi-alert-circle">
                <v-row no-gutters compact>
                  <v-col cols="12">
                    <div class="d-flex align-center mb-1">
                      <span>{{ course.validationMessage }}</span>
                    </div>
                  </v-col>
                </v-row>
                <v-row class="px-3 py-3" no-gutters>
                  <v-col cols="12">
                    <div style="font-size: 1rem;">
                      <CourseReview :shouldRemoveGutters="false" :course="course" />
                    </div>
                  </v-col>
                </v-row>
              </v-alert>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" variant="outlined" class="text-none" density="default" @click="close">
            {{ hasCoursesToDelete ? 'Cancel' : 'Close' }}
          </v-btn>
          <v-spacer />
          <v-btn v-if="hasCoursesToDelete" color="error" variant="flat" class="text-none" density="default"
            :disabled="validationStep" @click="confirmDelete">
            Delete Course<span v-if="selectedCoursesToDelete.length > 1">s</span>
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import { useStudentStore } from "@/store/modules/student";
import { useAccessStore } from "@/store/modules/access";
import StudentCourseAlert from "@/components/StudentProfile/Forms/StudentCourseAlert.vue";
import CourseReview from "@/components/StudentProfile/Forms/wizard/common/CourseReview.vue";

export default {
  name: "StudentCoursesDeleteForm",
  components: {
    StudentCourseAlert,
    CourseReview
  },
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
  created() {
    if (!this.courseBatchDelete) {
      this.hasExam = this.selectedCoursesToDelete[0].courseExam ? true : false
    }
  },
  data() {
    return {
      dialog: false,
      snackbarStore: useSnackbarStore(),
      hasExam: false,
      validationStep: false,
    };
  },
  computed: {
    studentStore() {
      return useStudentStore();
    },

    accessStore() {
      return useAccessStore();
    },
    studentPen() {
      return this.studentStore.pen;
    },
    studentStatus() {
      return this.studentStore.student.profile.studentStatus;
    },
    requirementsMet() {
      return this.studentStore.student.gradStatus.studentGradData;
    },

    selectedCoursesWithWarnings() {
      return this.selectedCoursesWithValidations.filter(course =>
        (!course.validationIssues || course.validationIssues.length === 0) ||
        (
          course.validationIssues.some(issue => issue.type === 'warning') &&
          !course.validationIssues.some(issue => issue.type === 'error')
        )
      );
    },

    coursesWithNoErrorsOrWarnings() {
      return this.selectedCoursesWithValidations.filter(course =>
        !course.validationIssues || course.validationIssues.length === 0
      );
    },

    hasCoursesToDelete() {
      const { info, warning } = this.selectedCoursesWithValidations;
      return info.length > 0 || warning.length > 0;
    },
    hasCourseExam() {
      return this.selectedCoursesToDelete[0]?.courseExam || false
    },
    selectedCoursesWithValidations() {
      const grouped = {
        error: [],
        warning: [],
        info: []
      };

      this.selectedCoursesToDelete.forEach((course) => {
        const hasExam =
          course?.courseExam &&
          (
            course.courseExam.examPercentage != null ||
            (course.courseExam.specialCase != null && course.courseExam.specialCase !== "N")
          );
        const studentIsGraduatedAndNotOnSCCP = this.studentStore.student.gradStatus?.program != "SCCP" && this.studentStore.student.gradStatus?.programCompletionDate

        let validationType = "info";
        let validationMessage = "";

        if (hasExam) {
          validationType = "error";
          validationMessage = "Associated Exam Record - This course has an exam result and cannot be deleted";
        } else if (studentIsGraduatedAndNotOnSCCP) {
          validationType = "warning";
          validationMessage = "Graduated Student - ensure this course can be deleted without removing any graduation or optional program requirements.";
        }

        grouped[validationType].push({
          ...course,
          validationType,
          validationMessage
        });
      });

      return grouped;
    }


  },
  methods: {
    close() {
      this.dialog = false;
      this.validationStep = false;
      this.$emit('close');
    },
    async confirmDelete() {
      try {
        this.validationStep = true;
        const request = this.selectedCoursesToDelete.map((item) => item.id);
        const response = await this.studentStore.deleteStudentCourses(request);
        console.log(response.data)

        const notDeleted = response.data
          .filter(course =>
            course.validationIssues?.some(issue => issue.validationIssueSeverityCode === "ERROR")
          )
          .map(course => {
            const errorMessages = course.validationIssues
              .filter(issue => issue.validationIssueSeverityCode === "ERROR")
              .map(issue => issue.validationIssueMessage)
              .join("; ");

            return `${course.courseCode} ${course.courseLevel} (${course.courseSession}): ${errorMessages}`;
          })
          .join("\n");

        const deleted = response.data
          .filter(course =>
            !course.validationIssues?.some(issue => issue.validationIssueSeverityCode === "ERROR")
          )
          .map(course => `${course.courseCode} ${course.courseLevel} (${course.courseSession})`)
          .join(", ");

        // Format snackbar message
        let message = "";
        if (deleted) {
          message += `Deleted: ${deleted}`;
        }
        if (notDeleted) {
          if (deleted) message += "\n\n"; // spacing between groups
          message += `Not Deleted:\n${notDeleted}`;
        }

        this.snackbarStore.showSnackbar(
          message,
          "success",
          10000,
          "Student course"
        );

        this.close();
      } catch (error) {
        console.error("Failed to delete student courses:", error);
      } finally {
        this.validationStep = false;
      }
    },
    hasPermissions(group, permission) {
      return this.accessStore.hasPermissions(group, permission)
    },
    openDeleteStudentCoursesDialog() {
      this.step = 0;
      this.dialog = true;
    },
  },
};
</script>
