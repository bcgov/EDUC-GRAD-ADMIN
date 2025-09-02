<template>
  <div>
    <v-card>
      <v-alert v-if="enableCRUD()" color="debug" variant="tonal" icon="mdi-progress-wrench" border="start"
        class="mt-6 mb-0 ml-1 py-3 width-fit-content">
        Until student course CRUD is live, student courses will not be kept in
        sync via ongoing updates. Instead there will be a gradual data
        migration.
        <br />
      </v-alert>
      <v-card-text>
        <v-alert v-if="!courses" class="container">
          This student does not have any courses.
        </v-alert>
        <div class="col-12 px-3" v-if="allowUpdateStudentCourseExam">
          <div class="float-left grad-actions">
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn text v-bind="props" :disabled="selected.length === 0" id="actions" right
                  class="float-right admin-actions text-none" prepend-icon="mdi-select-multiple"
                  append-icon="mdi-menu-down" color="error">Bulk Actions</v-btn>
              </template>
              <v-list>
                <v-list-item v-if="hasPermissions('STUDENT', 'courseUpdate')" :disabled="selected.length === 0"
                  @click="showCourseDelete">
                  <v-icon color="error">mdi-delete-forever</v-icon> Delete Selected Courses
                </v-list-item>
                <v-list-item v-if="hasPermissions('STUDENT', 'courseUpdate')" :disabled="selected.length === 0"
                  @click="showCourseTransfer">
                  <v-icon color="error">mdi-transfer</v-icon> Transfer Selected Courses
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
        <v-row no-gutters>
          <StudentCoursesDeleteForm @close="clearSelected" courseBatchDelete :selectedCoursesToDelete="selected"
            ref="courseDeleteFormRef">
          </StudentCoursesDeleteForm>
          <StudentCoursesTransferForm @close="clearSelected" :selectedCoursesToTransfer="selected"
            ref="courseTransferFormRef">
          </StudentCoursesTransferForm>
          <v-spacer />
          <StudentCoursesCreateForm type="all" />
        </v-row>
        <v-data-table
            v-if="courses"
            v-model="selected"
            :items="courses"
            :headers="fields"
            :item-value="(item) => item"
            :items-per-page="'-1'"
            title="studentCourse"
            :show-select="allowUpdateStudentCourseExam">
          <template v-slot:item.data-table-expand="{
            item,
            internalItem,
            toggleExpand,
            isExpanded,
          }">
            <td v-if="hasCourseInfo(item)">
              <v-btn variant="text" density="comfortable" @click="toggleExpand(internalItem)"
                class="v-data-table__expand-icon" :class="{ 'v-data-table__expand-icon--active': isExpanded }" :icon="isExpanded(internalItem)
                  ? 'mdi-chevron-down'
                  : 'mdi-chevron-right'
                  ">
              </v-btn>
            </td>
          </template>
          <template v-slot:item.courseSession="{ item }">
            {{ $filters.formatYYYYMMStringDate(item.courseSession) }}
          </template>
          <template v-slot:item.courseDetails.courseName="{ item }">
            <CourseDetails :course="item.courseDetails" />
          </template>

          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td></td>
              <td></td>
              <td :colspan="columns.length - 2">
                <div v-if="hasCourseInfo(item)">
                  <!-- Customized Course Name -->
                  <div v-if="item.customizedCourseName">
                    <strong>Customized Course&nbsp;</strong>
                    <span v-if="item.customizedCourseName">{{ item.customizedCourseName
                    }}</span>
                    <span v-else> <i>null</i> </span>
                  </div>

                  <!-- Related Course Details -->
                  <div v-if="item.relatedCourseDetails">

                    <strong>Related Course:</strong>
                    <CourseDetails :course="item.relatedCourseDetails" />
                  </div>

                  <!-- Course Exam Details -->
                  <v-row no-gutters v-if="item.courseExam">
                    <v-col><strong>Exam %&nbsp;</strong>
                      <span v-if="item.courseExam.examPercentage">{{ item.courseExam.examPercentage
                      }}</span>
                      <span v-else> <i>null</i> </span>
                    </v-col>
                    <v-col><strong>Best Exam %&nbsp;</strong>
                      <span v-if="item.courseExam.bestExamPercentage">{{ item.courseExam.bestExamPercentage
                      }}</span>
                      <span v-else> <i>null</i> </span>
                    </v-col>
                    <v-col><strong>School %&nbsp;</strong>
                      <span v-if="item.courseExam.schoolPercentage">{{ item.courseExam.schoolPercentage
                      }}</span>
                      <span v-else> <i>null</i> </span>
                    </v-col>
                    <v-col><strong>Best School %&nbsp;</strong>
                      <span v-if="item.courseExam.bestSchoolPercentage">{{ item.courseExam.bestSchoolPercentage
                      }}</span>
                      <span v-else> <i>null</i> </span>
                    </v-col>
                    <v-col><strong>Special Case&nbsp;</strong>
                      <span v-if="item.courseExam.specialCase">{{ item.courseExam.specialCase
                      }}</span>
                      <span v-else> <i>null</i> </span>
                    </v-col>
                  </v-row>
                </div>
              </td>
            </tr>
          </template>
          <template v-slot:item.edit="{ item }">
            <div v-if="!item.courseExam || allowUpdateStudentCourseExam">
              <StudentCoursesUpdateForm :course="item">
              </StudentCoursesUpdateForm>
            </div>
          </template>
          <template v-slot:item.delete="{ item }">
            <div v-if="!item.courseExam || allowUpdateStudentCourseExam">
              <StudentCoursesDeleteForm :selectedCoursesToDelete="[item]">
              </StudentCoursesDeleteForm>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { useStudentStore } from "@/store/modules/student";
import { useAppStore } from "@/store/modules/app";
import { useAccessStore } from "@/store/modules/access";
import { mapState, mapActions } from "pinia";
import CourseDetails from "@/components/Common/CourseDetails.vue";
import StudentCoursesDeleteForm from "@/components/StudentProfile/Forms/StudentCoursesDeleteForm.vue";
import StudentCoursesCreateForm from "@/components/StudentProfile/Forms/StudentCoursesCreateForm.vue";
import StudentCoursesUpdateForm from "@/components/StudentProfile/Forms/StudentCoursesUpdateForm.vue";
import StudentCoursesTransferForm from "@/components/StudentProfile/Forms/StudentCoursesTransferForm.vue";
export default {
  name: "StudentCourses",
  components: {
    StudentCoursesCreateForm: StudentCoursesCreateForm,
    StudentCoursesDeleteForm: StudentCoursesDeleteForm,
    StudentCoursesUpdateForm: StudentCoursesUpdateForm,
    StudentCoursesTransferForm: StudentCoursesTransferForm,
    CourseDetails: CourseDetails,
  },
  computed: {
    ...mapState(useAccessStore, {
      allowUpdateStudentCourseExam: "allowUpdateStudentCourseExam",
    }),
    ...mapState(useStudentStore, {
      courses: "studentCourses",
      gradStatusCourses: "gradStatusCourses",
      studentGradStatus: "getStudentGradStatus",
      hasGradStatus: "studentHasGradStatus",
      hasGradStatusPendingUpdates: "getHasGradStatusPendingUpdates",
    }),
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useAppStore, { environment: "appEnvironment" }),
  },
  data: function () {
    return {
      toFilterItem: [
        "courseCode",
        "courseLevel",
        "courseSession",
        "courseName",
      ],
      fields: [
        {
          key: "data-table-expand",
          title: "",
          sortable: true,
          class: "text-left",
        },
        {
          key: "courseDetails.courseCode",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "courseDetails.courseLevel",
          title: "Level",
          sortable: true,
          class: "text-left",
        },
        {
          key: "courseSession",
          title: "Session",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "interimPercent",
          title: "Interim %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-right",
        },
        {
          key: "interimLetterGrade",
          title: "Interim LG",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-left",
        },
        {
          key: "finalPercent",
          title: "Final %",
          class: "text-md-right ",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "finalLetterGrade",
          title: "Final LG",
          class: "text-md-left",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "equivOrChallenge",
          title: "Eq/Ch",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "credits",
          title: "Credits",
          sortable: true,
          class: "text-center",
        },
        {
          key: "fineArtsAppliedSkills",
          title: "Fa/As",
          sortable: true,
          class: "text-left",
        },
        {
          key: "courseDetails.courseName",
          title: "Course Title",
          sortable: true,
          class: "text-left",
        },
        {
          key: "edit",
          title: "Edit",
          cellProps: {
            style: "vertical-align: baseline;",
            class: "pt-5 pb-5",
          },
        },
        {
          key: "delete",
          title: "Delete",
          cellProps: {
            style: "vertical-align: baseline;",
            class: "pt-5 pb-5",
          },
        },
      ],
      gradStatusPendingUpdates: [],
      show: false,
      opened: [],
      message: "",
      achievements: [],
      InputCourse: "",
      student: [],
      InputPen: "",
      modalState: false,
      filters: {
        name: {
          value: "",
          keys: ["courseCode"],
        },
      },
      selected: [],
      editDialog: {},
      deleteDialog: {},
      multiDeleteDialog: false,
    };
  },
  methods: {
    ...mapActions(useAppStore, [
      "enableCRUD",
    ]),
    ...mapActions(useStudentStore, [
      "setHasGradStatusPendingUpdates",
      "deleteStudentCourses",
    ]),
    showCourseDelete() {
      this.$refs.courseDeleteFormRef.openDeleteStudentCoursesDialog();
    },
    showCourseTransfer() {
      this.$refs.courseTransferFormRef.openTransferStudentCoursesDialog();
    },
    clearSelected() {
      this.selected = []
    },
    hasCourseInfo(item) {
      return !!(
        item.courseExam ||
        item.relatedCourseDetails ||
        item.customizedCourseName
      );
    },
    closeEditModal(modalKey) {
      this.editDialog[modalKey] = false;
    },
    saveStudentCourse(modalKey) {
      console.log("TODO: Submit edits for student course");
      this.closeEditModal(modalKey);
    },
    compareCourses(course1, course2) {
      this.fields.forEach(function (field) {
        if (course1[field] != course2[field]) {
          return false;
        }
      });
      return true;
    },
  },
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}

.table th svg {
  display: none !important;
}

.highlight {
  background: aliceblue !important;
}

.top-row {
  border-bottom-style: hidden;
}

.popover-body div {
  min-width: fit-content;
}

.popover-body>div>div:nth-child(2) {
  text-align: right;
}
</style>
