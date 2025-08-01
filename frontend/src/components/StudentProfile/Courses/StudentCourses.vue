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
        <v-row no-gutters>
          <StudentCoursesDeleteForm @close="clearDeleteSelected" courseBatchDelete :selectedCoursesToDelete="selected">
          </StudentCoursesDeleteForm>
          <v-spacer />
          <StudentCoursesCreateForm />
        </v-row>
        <v-data-table v-if="courses" v-model="selected" :items="courses" :headers="fields" :item-value="(item) => item"
          :items-per-page="'-1'" title="studentCourse" show-select>
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
                    <strong>Customized Course:</strong>
                    {{ item.customizedCourseName }}
                  </div>

                  <!-- Related Course Details -->
                  <div v-if="item.relatedCourseDetails">

                    <strong>Related Course:</strong>
                    <CourseDetails :course="item.relatedCourseDetails" />
                  </div>

                  <!-- Course Exam Details -->
                  <v-row no-gutters v-if="item.courseExam">
                    <v-col><strong>Exam Percent</strong>&nbsp;{{
                      item.courseExam.examPercentage
                    }}%</v-col>
                    <v-col><strong>Best Exam Percent</strong>&nbsp;{{
                      item.courseExam.bestExamPercentage
                    }}%</v-col>
                    <v-col><strong>School Percent</strong>&nbsp;{{
                      item.courseExam.schoolPercentage
                    }}%</v-col>
                    <v-col><strong>Best School Percent</strong>&nbsp;{{
                      item.courseExam.bestSchoolPercentage
                    }}%</v-col>
                    <v-col><strong>Special Case</strong>&nbsp;{{
                      item.courseExam.specialCase
                    }}</v-col>
                  </v-row>
                </div>
              </td>
            </tr>
          </template>

          <template v-slot:item.edit="{ item }">
            <StudentCoursesUpdateForm :course="item">
            </StudentCoursesUpdateForm>
          </template>
          <template v-slot:item.delete="{ item }">
            <StudentCoursesDeleteForm :selectedCoursesToDelete="[item]">
            </StudentCoursesDeleteForm>
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
export default {
  name: "StudentCourses",
  components: {
    StudentCoursesCreateForm: StudentCoursesCreateForm,
    StudentCoursesDeleteForm: StudentCoursesDeleteForm,
    StudentCoursesUpdateForm: StudentCoursesUpdateForm,
    CourseDetails: CourseDetails,
  },
  computed: {
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
    clearDeleteSelected() {
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
