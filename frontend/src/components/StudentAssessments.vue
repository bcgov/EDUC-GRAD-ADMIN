<template>
  <div class="table-responsive">
    <b-spinner v-if="!assessments.length" label="Loading">Loading</b-spinner>
    <v-table
      :data="assessments"
      :filters="filters"
      class="table table-sm table-hover table-striped align-middle"
    >
      <thead slot="head" class="">
        <v-th sortKey="assessmentCode">Code</v-th>
        <v-th sortKey="sessionDate">Session</v-th>
        <v-th sortKey="assessmentName">Name</v-th>
        <v-th sortKey="specialCase">Special case</v-th>
        <v-th sortKey="exceededWriteFlag">Exceeded writes flag</v-th>
        <v-th sortKey="wroteFlag">Wrote flag</v-th>
        <v-th sortKey="rawScore">Raw score</v-th>
        <v-th sortKey="percentComplete">% Complete</v-th>
        <v-th sortKey="irtScore">IRT score</v-th>
        <v-th sortKey="proficiencyScore">Proficiency score</v-th>
        <v-th sortKey="gradReqMet">Req Met</v-th>
        <!-- <v-th sortKey="gradReqMet">Req Met</v-th> -->
      </thead>
      <tbody slot="body" slot-scope="{ displayData }">
        <template v-for="row in displayData">
          <tr
            :key="row.courseAchievementId"
            @click="toggle(row.courseCode + row.courseLevel)"
            :class="{ opened: opened.includes(row.courseCode) }"
          >
            <td>{{ row.assessmentCode }}</td>
            <td>{{ row.sessionDate }}</td>
            <td>{{ row.assessmentName }}</td>
            <td>{{ row.specialCase }}</td>
            <td>{{ row.exceededWriteFlag }}</td>
            <td>{{ row.wroteFlag }}</td>
            <td>{{ row.rawScore }}</td>
            <td>{{ row.percentComplete }} %</td>
            <td>{{ row.irtScore }}</td>
            <td>{{ row.proficiencyScore }}</td>
            <td>{{ row.gradReqMet }}</td>
          </tr>
        </template>
      </tbody>
    </v-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "StudentAssessments",
  props: {},
  computed: {
    ...mapGetters({
      assessments: "getStudentAssessments",
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
      assessmentCode: "",
      assessmentName: "",
      sessionDate: "",
      proficiencyScore: 0,
      gradReqMet: "",
      specialCase: "",
      wroteFlag: "",
      rawScore: 0,
      irtScore: 0,
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

}
</style>
