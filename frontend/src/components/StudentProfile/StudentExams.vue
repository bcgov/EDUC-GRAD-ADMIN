<template>
  <div>
    <div v-if="!exams" class="container">
      This student does not have any exams.
    </div>
    <DisplayTable
      :items="exams"
      :fields="fields"
      showFilter="true"
      title="Assessments"
    >
      <template #cell(sessionDate)="row">
        {{ $filters.formatYYYYMMDate(row.value) }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import { useStudentStore } from "../../store/modules/student";
import { mapState } from "pinia";
import DisplayTable from "@/components/DisplayTable.vue";
export default {
  name: "StudentExams",
  props: {},
  computed: {
    ...mapState(useStudentStore, {
      exams: "getStudentExams",
    }),
  },
  components: {
    DisplayTable: DisplayTable,
  },
  data: function () {
    return {
      fields: [
        { key: "more", label: "" },
        {
          key: "courseCode",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "courseLevel",
          label: "Level",
          sortable: true,
          class: "text-md-center",
        },
        {
          key: "sessionDate",
          label: "Session",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "completedSchoolPercentage",
          label: "School %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "bestSchoolPercentage",
          label: "Best School %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "optIn",
          label: "Opt In",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "specialCase",
          label: "Special Case",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "wroteFlag",
          label: "Wrote Exam",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "completedCourseExamPercentage",
          label: "Exam %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "bestExamPercentage",
          label: "Best Exam %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "completedCourseFinalPercentage",
          label: "Final %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "completedCourseLetterGrade",
          label: "Final LG",
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
