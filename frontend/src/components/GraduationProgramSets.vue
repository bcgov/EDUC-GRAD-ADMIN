<template>
<div>
  <div class="card mb-2">
    <div class="card-body">
    <b-spinner v-if="!graduationProgramSets.length" label="Loading"
      >Loading</b-spinner
    >
    <div v-if="!graduationProgramSets.length"> <h2>No data please select another Program Code</h2></div>
    <v-table
      :data="graduationProgramSets"
      class="table table-sm table-hover table-striped align-middle"
    >
      <thead slot="head" class="">
        <v-th sortKey="programSet">Program Set</v-th>
        <v-th sortKey="programSetName">Program Set Name</v-th>
        <v-th sortKey="programSetName">Id</v-th>
      </thead>
      <tbody slot="body" slot-scope="{ displayData }">
        <template v-for="row in displayData">
          <tr
            :key="row.programSet"
            v-on:click="onClickButton(row.id)"
            v-bind:class="{'table-primary': (selectedId == row.id)}"
          >
            <td>{{ row.specialProgramCode }}</td>
            <td>{{ row.specialProgramName }}</td>
            <td>{{ row.id }}</td>
          </tr>
        </template>
      </tbody>
    </v-table>
    <!-- <GraduationProgramRules :prop="selectedchoices" v-if="selectedchoices"></GraduationProgramRules> -->
   
  </div>
  </div>

   <GraduationProgramRules :key="selectedProgramSet" :selectedProgramCode="selectedProgramCode" :selectedProgramSet="selectedProgramSet" v-if="selectedProgramSet"></GraduationProgramRules>

</div>
</template>

<script>
//import GradeService from "@/services/GradeService.js";
import ProgramManagementService from "@/services/ProgramManagementService.js";
import GraduationProgramRules from '@/components/GraduationProgramRules';
export default {
  name: "GraduationProgramSets",
  components: {
   'GraduationProgramRules': GraduationProgramRules
  },
  props: {},
  computed: {},
  data: function () {
    return {
      opened: [],
      graduationProgramSets:[],
      parentSelectedProgramCode:'',
      selectedProgramCode: '',
      selectedProgramSet: '',
      selectedId:''
    };
  },
  created() {
    this.parentSelectedProgramCode = this.$parent.selectedProgramCode
    
    ProgramManagementService.getGraduationProgramSets(this.$parent.selectedProgramCode, localStorage.getItem('jwt'))
      .then((response) => {
        this.graduationProgramSets = response.data;
        //console.log('Graduation Program Sets: ' + this.graduationProgramSets);
      })
     
      .catch((error) => {
         // eslint-disable-next-line no-unused-vars
        //console.log('There was an error:' + error.response);
      });

      //  GradeService.getGrades(localStorage.getItem('jwt'))
      // .then((response) => {
      //   console.log(response.data);
      //   this.graduationProgramSets = response.data.gradProgramSetList;
      // })
      // 
      // .catch((error) => {
      // // eslint-disable-next-line no-unused-vars
        //console.log('There was an error:' + error.response);
      // });

  },
  methods: {
    onClickButton (id) {
      this.$emit('clicked', id)
    },
    selectProgramRules(programCode, programSet){
      this.selectedProgramCode = programCode;
      this.selectedProgramSet = programSet
    },
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
    // getCourseName: function (cid) {
    //   let result = "";
    //   this.courses.filter(function (n) {
    //     if (n.id === cid) {
    //       result = n.name;
    //       return result;
    //     }
    //   });
    //   return result;
    // },
  },
};
</script>

<style>
.table th {
  border-bottom: 2px solid #38598a !important;
}
</style>
