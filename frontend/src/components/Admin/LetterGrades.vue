<template>
  <div>
  <p>Letter grade values used for graduation</p>
  <table class="table table-striped table-bordered">
      <thead>
          <tr>
              <th>Letter Grade</th>
              <th>GPA Mark</th>
              <th>PASS FLAG</th>
          </tr>
      </thead>
      <tbody>
          <tr v-for="letterGrade in letterGrades.gradLetterGradeList" :key="letterGrade.letterGrade">
              <td>{{letterGrade.letterGrade}}</td>
              <td>{{letterGrade.gpaMarkValue}}</td>
              <td>{{letterGrade.passFlag}}</td>
          </tr>
      </tbody>
  </table>
  </div>
</template>

<script>
import {
  mapGetters
} from "vuex";
import ProgramManagementService from "@/services/ProgramManagementService.js";
export default {
  name: 'Letter Grades',
  created() {
     ProgramManagementService.getLetterGrades(this.token)
      .then((response) => {
        this.letterGrades = response.data;
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        //console.log('There was an error:' + error.response);
      });
  },
  data: function() {
    return {
      letterGrades: [],
    };
  },
  computed: {
    ...mapGetters({  
      token: "getToken",
    }),
  },
  methods: {
  },
};
</script>

<style>
.table th, .table td{
  border-top: none !important;

}</style>
