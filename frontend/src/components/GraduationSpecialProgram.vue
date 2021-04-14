<template>
  <div>
    <div class="card mb-2">
      <div class="card-body">
        <b-spinner v-if="!GraduationSpecialPrograms.length" label="Loading"
          >Loading</b-spinner
        >
        <div class="card-body" v-if="!selectedProgramId">
          <v-table
            :data="GraduationSpecialPrograms"
            class="table table-sm table-hover table-striped align-middle"
          >
            <thead slot="head" class="">
              <v-th sortKey="specialProgramCode">Special Program Code</v-th>
              <v-th sortKey="specialProgramName">Special Program Name</v-th>
            </thead>
            <tbody slot="body" slot-scope="{ displayData }">
              <template v-for="row in displayData">
                <tr
                  :key="row.specialprogramCode"
                  v-on:click="selectSpecialGradRule(row.id)"
                  v-bind:class="{
                    'table-primary': selectedProgramId == row.specialprogramCode,
                  }"
                >
                  <td>{{ row.specialProgramCode }}</td>
                  <td>{{ row.specialProgramName }}</td>
                </tr>
              </template>
            </tbody>
          </v-table>
        </div>
        <div class="card-body" v-if="selectedProgramId">
          <button v-on:click="resetProgramId()" type="button" class="btn btn-light">Select another program</button>
          <GraduationSpecialProgramRules
            :key="selectedProgramId"
            :prop="selectedProgramId"
            v-if="selectedProgramId"
          >
          </GraduationSpecialProgramRules>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>

import ProgramManagementService from "@/services/ProgramManagementService.js";
import GraduationSpecialProgramRules from "@/components/GraduationSpecialProgramRules";
import {
    mapGetters
} from "vuex";

export default {
  name: "GraduationSpecialProgram",
  props: {},
  computed: {
    ...mapGetters({
      token: "getToken"
  })},
  components: {
   'GraduationSpecialProgramRules': GraduationSpecialProgramRules,
  },
  data: function () {
    return {
      opened: [],
      GraduationSpecialPrograms:[],
      //selectedProgramCode: "",
      selectedProgramId: "",
      selectedId:''
    };
  },
  created() {
     ProgramManagementService.getSpecialProgram(this.token)
      .then((response) => {
        this.GraduationSpecialPrograms = response.data;
      })
      .catch(() => {});
  },
  methods: {
    onClickButton (id) {
      this.$emit('clicked', id)
    },
    selectSpecialGradRule(id) {
      this.selectedProgramId = id;
    },
    resetProgramId(){
      this.selectedProgramId = '';
    },
  },
};
</script>

<style>
.table th {
  border-bottom: 2px solid #38598a !important;
}
</style>
