<template>
  <div class="table-responsive">
    <b-spinner v-if="!exams.length" label="Loading">Loading</b-spinner>
    <v-table
      :data="exams"
      :filters="filters"
      class="table table-sm table-hover table-striped align-middle"
    >
      <thead slot="head" class="">
        <v-th sortKey="courseCode">Code</v-th>
        <v-th sortKey="courseLevel">Level</v-th>
        <v-th sortKey="sessionDate">Session</v-th>
        <v-th sortKey="courseName">Name</v-th>
        <v-th sortKey="courseEquivChal">Equiv, Chal</v-th>
        <v-th sortKey="credits">Credits</v-th>
        <v-th sortKey="completedCourseSchoolPercentage">School %</v-th>
        <v-th sortKey="wroteFlag">Wrote exam</v-th>
        <v-th sortKey="specialCase">Special case</v-th>
        <v-th sortKey="completedCourseExamPercentage">Exam %</v-th>
        <v-th sortKey="completedCourseFinalPercentage">Final %</v-th>
        <v-th sortKey="completedCourseLetterGrade">Final LG</v-th>
      </thead>
      <tbody slot="body" slot-scope="{ displayData }">
        <template v-for="row in displayData">
          <tr
            :key="row.courseAchievementId"
            @click="toggle(row.courseCode + row.courseLevel)"
            :class="{ opened: opened.includes(row.courseCode) }"
          >
            <td>{{ row.courseCode }}</td>
            <td>{{ row.courseLevel }}</td>
            <td>{{ row.sessionDate }}</td>
            <td>{{ row.courseName }}</td>
            <td>{{ row.courseEquivChal }}</td>
            <td>{{ row.credits }}</td>
            <td>{{ row.completedCourseSchoolPercentage }} %</td>
            <td>{{ row.wroteFlag }}</td>
            <td>{{ row.specialCase }}</td>
            <td>{{ row.completedCourseExamPercentage }}</td>
            <td>{{ row.completedCourseFinalPercentage }}</td>
            <td>{{ row.completedCourseLetterGrade }}</td>
          </tr>
        </template>
      </tbody>
    </v-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "StudentExams",
  props: {},
  computed: {
    ...mapGetters({
      exams: "getStudentExams",
    }),
  },
  data: function() {
    return {
      show: false,
      opened: [],
      student: [],
      examsList: [],
      filters: {
        name: { value: "", keys: ["courseCode"] },
      },
      pen: "",
      courseCode: "",
      courseName: "",
      courseLevel: "",
      sessionDate: "",
      gradReqMet: "",
      courseType: "",
      completedCourseSchoolPercentage: null,
      completedCourseExamPercentage: null,
      completedCourseFinalPercentage: null,
      completedCourseLetterGrade: "",
      interimPercent: null,
      interimLetterGrade: "",
      credits: null,
      creditsUsedForGrad: null,
      reqMetLiteracyNumeracy: "",
      wroteFlag: "",
      specialCase: " ",
      currentPage: 1,
      totalPages: 0,
      displayMessage: null,
      modalVisible: null,
      inputPenMissing: false,
    };
  },
  methods: {
    toggle(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.push(id);
      }
    },
    showMsgBoxOne(message) {
      this.$bvModal.msgBoxOk(message);
    },
    getCourseName: function(cid) {
      let result = "";
      this.courses.filter(function(n) {
        if (n.id === cid) {
          result = n.name;
          return result;
        }
      });
      return result;
    },
  },
};
</script>

<style>
.table th, .table td{
  border-top: none !important;

}</style>
