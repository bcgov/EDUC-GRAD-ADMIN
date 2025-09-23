<template>
  <div v-if="enableCRUD()" class="col-12 px-3 py-0 width-fit-content">
    <v-alert color="debug" variant="tonal" icon="mdi-progress-wrench" border="start">
      Until student course CRUD is live, student courses will not be kept in
      sync via ongoing updates. Instead there will be a gradual data
      migration.
      <br />
    </v-alert>
  </div>
  <div class="col-12 px-3 py-3">
    <BlendingRules />
    <div class="col-12 px-3 py-3 float-right grad-actions" v-if="hasPermissions('STUDENT', 'updateCourseExam')">
      <v-row no-gutters justify="end">
        <StudentCoursesCreateForm type="examinable" />
      </v-row>
    </div>
    <v-alert info v-if="!studentExamCourses || studentExamCourses.length === 0">
      This student does not have any exams.
    </v-alert>
    <v-data-table v-else :items="studentExamCourses" :headers="courseExamHeaders()" :items-per-page="'-1'">
      <template v-slot:item.data-table-expand="{
        item,
        internalItem,
        toggleExpand,
        isExpanded,
      }">
        <v-btn variant="text" density="comfortable" @click="toggleExpand(internalItem)"
          class="v-data-table__expand-icon" :class="{ 'v-data-table__expand-icon--active': isExpanded }" :icon="isExpanded(internalItem) ? 'mdi-chevron-down' : 'mdi-chevron-right'
            " />
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td></td>
          <td></td>
          <td :colspan="columns.length - 2">
            <v-row no-gutters>
              <v-col>
                <strong>Course Title&nbsp;</strong>
                <span v-if="item.courseDetails.courseName" style="display: inline-block;">
                  <CourseDetails :course="item.courseDetails" />
                </span>
                <span v-else style="display: inline-block;"> <i>null</i> </span>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col><strong>Interim %&nbsp;</strong>
                <span v-if="item.interimPercent">{{ item.interimPercent
                }}</span>
                <span v-else> <i>null</i> </span>
              </v-col>
              <v-col><strong>Interim LG&nbsp;</strong>
                <span v-if="item.interimLetterGrade">{{ item.interimLetterGrade
                }}</span>
                <span v-else> <i>null</i> </span>
              </v-col>
              <v-col><strong>Eq/Ch&nbsp;</strong>
                <span v-if="item.equivOrChallenge">{{ item.equivOrChallenge
                }}</span>
                <span v-else> <i>null</i> </span>
              </v-col>
            </v-row>
          </td>
        </tr>
      </template>
      <template v-slot:item.courseSession="{ item }">
        {{ $filters.formatYYYYMMStringDate(item.courseSession) }}
      </template>
      <template v-slot:item.edit="{ item }" v-if="hasPermissions('STUDENT', 'updateCourseExam')">
        <StudentCoursesExamUpdateForm :course="item">
        </StudentCoursesExamUpdateForm>
      </template>
      <template v-slot:item.delete="{ item }" v-if="hasPermissions('STUDENT', 'updateCourseExam')">
        <StudentCoursesDeleteForm :selectedCoursesToDelete="[item]">
        </StudentCoursesDeleteForm>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { useAccessStore } from "@/store/modules/access";
import { useAppStore } from "@/store/modules/app";
import { useStudentStore } from "@/store/modules/student";
import { mapState, mapActions } from "pinia";
import DisplayTable from "@/components/DisplayTable.vue";
import BlendingRules from "@/components/Common/BlendingRules.vue";
import StudentCoursesExamUpdateForm from "@/components/StudentProfile/Forms/StudentCoursesExamUpdateForm.vue";
import StudentCoursesCreateForm from "@/components/StudentProfile/Forms/StudentCoursesCreateForm.vue";
import StudentCoursesDeleteForm from "@/components/StudentProfile/Forms/StudentCoursesDeleteForm.vue";
import CourseDetails from "@/components/Common/CourseDetails.vue";

export default {
  name: "StudentExams",
  props: {},
  computed: {
    ...mapState(useStudentStore, {
      studentExamCourses: "studentExamCourses",
    }),
    ...mapState(useAppStore, { environment: "appEnvironment" }),
    ...mapState(useAccessStore, ["hasPermissions"])
  },
  components: {
    BlendingRules: BlendingRules,
    DisplayTable: DisplayTable,
    StudentCoursesExamUpdateForm: StudentCoursesExamUpdateForm,
    StudentCoursesCreateForm: StudentCoursesCreateForm,
    StudentCoursesDeleteForm: StudentCoursesDeleteForm,
    CourseDetails: CourseDetails,
  },
  data: function () {
    return {
      studentExamsHeaders: [
        {
          key: "data-table-expand",
          title: "",
        },
        {
          key: "courseDetails.courseCode",
          title: "Code",
        },
        {
          key: "courseDetails.courseLevel",
          title: "Level",
        },
        {
          key: "courseSession",
          title: "Session",
        },
        {
          key: "courseExam.schoolPercentage",
          title: "School %",
        },
        {
          key: "courseExam.bestSchoolPercentage",
          title: "Best School %",
        },
        {
          key: "courseExam.toWriteFlag",
          title: "Opt In",
        },
        {
          key: "courseExam.specialCase",
          title: "Special Case",
        },
        {
          key: "courseExam.wroteFlag",
          title: "Wrote Exam",
        },
        {
          key: "courseExam.examPercentage",
          title: "Exam %",
        },
        {
          key: "courseExam.bestExamPercentage",
          title: "Best Exam %",
        },
        {
          key: "finalPercent",
          title: "Final %",
        },
        {
          key: "finalLetterGrade",
          title: "Final LG",
        },
        {
          key: "credits",
          title: "Credits",
        },
      ],
      studentExamsActionHeaders: [
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
      ]
    };
  },
  methods: {
    ...mapActions(useAppStore, [
      "enableCRUD",
    ]),
    courseExamHeaders() {
      if (this.hasPermissions('STUDENT', 'updateCourseExam')) {
        return this.studentExamsHeaders.concat(this.studentExamsActionHeaders);
      }
      return this.studentExamsHeaders;
    }
  },
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}
</style>
