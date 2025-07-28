<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="760">
      <template v-slot:activator="{ props }">
        <slot name="activator" v-bind="props">

          <v-btn v-if="
            hasPermissions('STUDENT', 'courseUpdate') && courseBatchDelete
          " v-bind="props" :disabled="selectedCoursesToDelete.length === 0" color="error" class="text-none"
            prepend-icon="mdi-delete-forever">
            Delete Selected Courses
          </v-btn>

          <v-btn v-else-if="!courseBatchDelete"
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
                <v-row class="mb-2">
                  <v-col cols="12" v-if="course.validationMessage">
                    <div class="d-flex align-center mb-1">
                      <span>{{ course.validationMessage }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <strong>{{ course.courseDetails.courseCode }} {{ course.courseDetails.courseLevel }} -
                      {{ $filters.formatYYYYMMStringDate(course.courseSession) }}</strong>
                    <v-spacer /> ({{ course.courseDetails.courseName }})
                  </v-col>
                  <v-col class="ml-3"><strong>Interim</strong>&nbsp;
                    <span v-if="course.interimPercent">{{ course.interimPercent }}% {{ course.interimLetterGrade
                    }}</span>
                    <span v-else><i>null</i></span>
                  </v-col>
                  <v-col><strong>Final</strong>&nbsp;
                    <span v-if="course.finalPercent">{{ course.finalPercent }}% {{ course.finalLetterGrade }}</span>
                    <span v-else><i>null</i></span>
                  </v-col>
                  <v-col><strong>Credits</strong> {{ course.credits }}</v-col>
                  <v-col><strong>FA/AS</strong>&nbsp;
                    <span v-if="course.fineArtsAppliedSkills">{{ course.fineArtsAppliedSkills }}</span>
                    <span v-else><i>null</i></span>
                  </v-col>
                  <v-col><strong>Eq/Ch</strong>&nbsp;
                    <span v-if="course.equivOrChallenge">{{ course.equivOrChallenge }}</span>
                    <span v-else><i>null</i></span>
                  </v-col>
                  <v-col cols="12" class="ml-3" v-if="course.customizedCourseName">
                    <strong>Custom Course Title</strong> {{ course.customizedCourseName }}
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
                <v-row class="mb-2">
                  <v-col cols="12">
                    <div class="d-flex align-center mb-1">
                      <span>{{ course.validationMessage }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <strong>{{ course.courseDetails.courseCode }} {{ course.courseDetails.courseLevel }} -
                      {{ $filters.formatYYYYMMStringDate(course.courseSession) }}</strong>
                    ({{ course.courseDetails.courseName }})
                  </v-col>
                  <v-col class="ml-3"><strong>Interim</strong>&nbsp;
                    <span v-if="course.interimPercent">{{ course.interimPercent }}% {{ course.interimLetterGrade
                    }}</span>
                    <span v-else><i>null</i></span>
                  </v-col>
                  <v-col><strong>Final</strong>&nbsp;
                    <span v-if="course.finalPercent">{{ course.finalPercent }}% {{ course.finalLetterGrade }}</span>
                    <span v-else><i>null</i></span>
                  </v-col>
                  <v-col><strong>Credits</strong> {{ course.credits }}</v-col>
                  <v-col><strong>FA/AS</strong>&nbsp;
                    <span v-if="course.fineArtsAppliedSkills">{{ course.fineArtsAppliedSkills }}</span>
                    <span v-else><i>null</i></span>
                  </v-col>
                  <v-col><strong>Eq/Ch</strong>&nbsp;
                    <span v-if="course.equivOrChallenge">{{ course.equivOrChallenge }}</span>
                    <span v-else><i>null</i></span>
                  </v-col>
                  <v-col cols="12" class="ml-3" v-if="course.customizedCourseName">
                    <strong>Custom Course Title</strong> {{ course.customizedCourseName }}
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
            @click="confirmDelete">
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



export default {
  name: "StudentCoursesDeleteForm",
  components: {
    StudentCourseAlert,
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
  data() {
    return {
      dialog: false,
      snackbarStore: useSnackbarStore(),
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
            (course.courseExam.specialCase != null && course.courseExam.specialCase !== "N") ||
            course.finalPercent != null
          );

        const studentIsGraduatedAndNotOnSCCP = this.studentStore.student.gradStatus?.program != "SCCP" && this.studentStore.student.gradStatus?.programCompletionDate

        let validationType = "info";
        let validationMessage = "";

        if (hasExam) {
          validationType = "error";
          validationMessage = "Associated Exam Record - This course has an associated exam record and cannot be deleted";
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
      this.$emit('close');
    },
    async confirmDelete() {
      try {
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
      }
    },
    hasPermissions(group, permission) {
      return this.accessStore.hasPermissions("STUDENT", "courseUpdate")
    },
  },
};
</script>
