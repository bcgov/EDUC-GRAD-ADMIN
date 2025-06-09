<template>
  <div>
    <v-alert info v-if="!studentExams">
      This student does not have any exams.
    </v-alert>
    <v-data-table
      :items="studentExams"
      :headers="studentExamsHeaders"
      :items-per-page="'-1'"
    >
      <template v-slot:item.sessionDate="{ item }">
        {{ $filters.formatYYYYMMDate(item.sessionDate) }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { useStudentStore } from "@/store/modules/student";
import { mapState } from "pinia";
import DisplayTable from "@/components/DisplayTable.vue";
export default {
  name: "StudentExamsLegacy",
  props: {},
  computed: {
    ...mapState(useStudentStore, {
      studentExams: "getStudentExamsLegacy",
    }),
  },
  components: {
    DisplayTable: DisplayTable,
  },
  data: function () {
    return {
      studentExamsHeaders: [
        // {
        //   key: "data-table-expand",
        //   title: "",
        //   class: "text-left",
        // },
        {
          key: "courseCode",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "courseLevel",
          title: "Level",
          sortable: true,
          class: "text-md-center",
        },
        {
          key: "sessionDate",
          title: "Session",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "completedSchoolPercentage",
          title: "School %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "bestSchoolPercentage",
          title: "Best School %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "optIn",
          title: "Opt In",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "specialCase",
          title: "Special Case",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "wroteFlag",
          title: "Wrote Exam",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "completedCourseExamPercentage",
          title: "Exam %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "bestExamPercentage",
          title: "Best Exam %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "completedCourseFinalPercentage",
          title: "Final %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "completedCourseLetterGrade",
          title: "Final LG",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
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
