<template>
  <div class="">
    <b-spinner v-if="!graduationSpecialProgramRules.length" label="Loading"
      >Loading</b-spinner
    >
    <div v-if="!graduationSpecialProgramRules.length"><h2>Loading</h2></div>
    <v-table
      :data="graduationSpecialProgramRules"
      class="table table-sm table-hover table-striped align-middle"
    >
      <thead slot="head" class="">
        <v-th sortKey="ruleCode">Rule #</v-th>
        <v-th sortKey="requirementName">Requirement Name</v-th>
        <v-th sortKey="requiredCredits">Required Credits</v-th>
        <v-th sortKey="notMetDesc">Not Met Description</v-th>
        <v-th sortKey="requirementType">Requirement Type</v-th>
        <v-th sortKey="requiredLevel">Required Level</v-th>
        <v-th sortKey="languageOfInstruction">Language of Instruction</v-th>
        <v-th sortKey="requirementDesc">Description</v-th>
      </thead>
      <tbody slot="body" slot-scope="{ displayData }">
        <template v-for="row in displayData">
          <tr
            :key="row.ruleCode"
            @click="toggle(row.ruleCode + row.requirementName)"
            :class="{ opened: opened.includes(row.ruleCode) }"
          >
            <td>{{ row.ruleCode }}</td>
            <td>{{ row.requirementName }}</td>
            <td>{{ row.requiredCredits }}</td>
            <td>{{ row.notMetDesc }}</td>
            <td>{{ row.requirementType }}</td>
            <td>{{ row.requiredLevel }}</td>
            <td>{{ row.languageOfInstruction }}</td>
            <td>{{ row.requirementDesc }}</td>
          </tr>
        </template>
      </tbody>
    </v-table>
  </div>
</template>

<script>
import ProgramManagementService from "@/services/ProgramManagementService.js";
import {
    mapGetters
} from "vuex";
export default {
  name: "GraduationSpecialProgramRules",
  props: {},
  computed: {...mapGetters({
      token: "getToken"
  })},
  data: function () {
    return {
      opened: [],
      graduationSpecialProgramRules:[],
      parentSelectedProgramCode:'',
    };
  },
  created() {
    this.parentSelectedProgramCode = this.$parent.selectedProgramId
    ProgramManagementService.getSpecialProgramRule(this.parentSelectedProgramCode, this.token)
      .then((response) => {
        this.graduationSpecialProgramRules = response.data;
        //('Graduation Special Program Rules: ' + this.graduationSpecialProgramRules);
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log('There was an error:' + error.response);
    });
  },
  methods: {
  },
};
</script>

<style>
.table th {
  border-bottom: 2px solid #38598a !important;
}
</style>