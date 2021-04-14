<template>
  <div>
    <!-- <div v-if="!isHidden"> -->
    <div class="card mb-2">
      <div class="card-body">
        <b-spinner v-if="!graduationPrograms.length" label="Loading"
          >Loading</b-spinner
        >
        <div class="card-body" v-if="!selectedProgramCode">
          <v-table
            :data="graduationPrograms"
            class="table table-sm table-hover table-striped align-middle"
          >
            <thead slot="head" class="">
              <v-th sortKey="programCode">Program Code</v-th>
              <v-th sortKey="programName">Program Name</v-th>
            </thead>
            <tbody slot="body" slot-scope="{ displayData }">
              <template v-for="row in displayData">
                <tr
                  :key="row.programCode"
                  v-on:click="selectGradRule(row.programCode)"
                  v-bind:class="{
                    'table-primary': selectedProgramCode == row.programCode,
                  }"
                >
                  <td>
                    {{ row.programCode }}
                  </td>
                  <td>{{ row.programName }}</td>
                </tr>
              </template>
            </tbody>
          </v-table>
        </div>
        <div class="card-body" v-if="selectedProgramCode">
          <b-button v-on:click="resetProgramCode()" type="button" class="btn btn-primary">Select another program</b-button>
          <GraduationProgramRules
            :key="selectedProgramCode"
            :prop="selectedProgramCode"
            v-if="selectedProgramCode"
          ></GraduationProgramRules>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
import ProgramManagementService from "@/services/ProgramManagementService.js";
import GraduationProgramRules from "@/components/GraduationProgramRules";
import {
    mapGetters
} from "vuex";

export default {
  name: "GraduationPrograms",
  components: {
    GraduationProgramRules: GraduationProgramRules,
  },
  props: {},
  computed: {...mapGetters({
      token: "getToken"
  })},
  data: function () {
    return {
      show: false,
      isHidden: false,
      opened: [],
      graduationPrograms: [],
      selectedProgramCode: "",
      selectedProgramId: "",
    };
  },
  created() {
    ProgramManagementService.getGraduationPrograms(this.token)
      .then((response) => {
        this.graduationPrograms = response.data;
      })
      .catch(() => {});
  },
  methods: {
    onClickChild(value) {
      this.selectedProgramId = value;
      //console.log("Program Id: " + value); // someValue
    },
    selectGradRule(programCode) {
      this.selectedProgramCode = programCode;
    },
    resetProgramCode(){
      this.selectedProgramCode = '';
    },
    getCourseName: function (cid) {
      let result = "";
      this.courses.filter(function (n) {
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
.table th {
  border-bottom: 2px solid #38598a !important;
}
</style>
