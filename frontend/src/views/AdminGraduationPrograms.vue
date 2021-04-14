<template>
  <div>
  <h1>Program Management</h1>
  <p> Manage graduation settings (Admin Access Required)</p>
    <b-card no-body>
      <b-tabs pills card vertical>
        <b-tab title="Programs" active>
          <b-card-text>
            <GraduationPrograms></GraduationPrograms>
          </b-card-text>
        </b-tab>
        <b-tab title="Special Programs">
          <b-card-text>
            <GraduationSpecialProgram></GraduationSpecialProgram>
          </b-card-text>
        </b-tab>
        <b-tab title="LetterGrades"><b-card-text>
          <LetterGrades></LetterGrades>
        </b-card-text></b-tab>
        <b-tab title="Special Cases"><b-card-text><SpecialCases></SpecialCases></b-card-text></b-tab>
      </b-tabs>
    </b-card>
  </div>

</template>

<script>
import GraduationPrograms from '@/components/GraduationPrograms';
import GraduationSpecialProgram from '@/components/GraduationSpecialProgram';
import LetterGrades from '@/components/Admin/LetterGrades';
import SpecialCases from '@/components/Admin/SpecialCases';
export default {
  name: "graduationPrograms",
  components: {
   'GraduationPrograms': GraduationPrograms,
   'GraduationSpecialProgram':GraduationSpecialProgram,
   'LetterGrades': LetterGrades,
   'SpecialCases': SpecialCases

  },
  data() {
    return {
      show: false,
      opened: [],
      displayMessage: null,
    };
  },
  computed: {

  },
  created() {
    //Load student Data into studentInfo:
  },
  methods: {
  
  },
};
</script>

<style scoped>
.close-record {
  float: right;
}
.tab-loading {
  color: green !important;
}
.profile-name{
  padding-bottom: 10px;
}
</style>
