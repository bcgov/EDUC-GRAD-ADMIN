<template>
  <div>
    <v-alert info v-if="!studentExamCourses || studentExamCourses.length === 0">
      This student does not have any exams.
    </v-alert>
    <v-data-table
      v-else
      :items="studentExamCourses"
      :headers="studentExamsHeaders"
      :items-per-page="'-1'"
    >
      <template
        v-slot:item.data-table-expand="{
          item,
          internalItem,
          toggleExpand,
          isExpanded,
        }"
      >
        <v-btn
          variant="text"
          density="comfortable"
          @click="toggleExpand(internalItem)"
          class="v-data-table__expand-icon"
          :class="{ 'v-data-table__expand-icon--active': isExpanded }"
          :icon="
            isExpanded(internalItem) ? 'mdi-chevron-down' : 'mdi-chevron-right'
          "
        />
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <v-row no-gutters>
              <v-col
                ><strong>Course Title</strong>&nbsp;{{
                  item.courseDetails?.courseName
                }}</v-col
              >
              <v-col
                ><strong>Interim Percent</strong>&nbsp;{{
                  item.interimPercent
                }}%</v-col
              >
              <v-col
                ><strong>Interim LG</strong>&nbsp;{{
                  item.interimLetterGrade
                }}</v-col
              >
              <v-col
                ><strong>Equivalency or Challenge</strong>&nbsp;{{
                  item.interimPercent
                }}% {{ item.equivOrChallenge }}</v-col
              >
            </v-row>
          </td>
        </tr>
      </template>
      <template v-slot:item.courseSession="{ item }">
        {{ $filters.formatYYYYMMStringDate(item.courseSession) }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { useStudentStore } from "@/store/modules/student";
import { mapState } from "pinia";
import DisplayTable from "@/components/DisplayTable.vue";
export default {
  name: "StudentExams",
  props: {},
  computed: {
    ...mapState(useStudentStore, {
      studentExamCourses: "studentExamCourses",
    }),
  },
  components: {
    DisplayTable: DisplayTable,
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
    };
  },
  methods: {},
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}
</style>
