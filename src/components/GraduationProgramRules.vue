<template>
  <div class="">
    <b-spinner v-if="!graduationProgramRules.length" label="Loading"
      >Loading</b-spinner
    >
    <div v-if="!graduationProgramRules.length"><h2>Loading</h2></div>
    <v-table
      :data="graduationProgramRules"
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
  name: "GraduationProgramRules",
  props: {
    selectedProgramCode: String,
    selectedProgramSet: String
  },
  computed: {...mapGetters({
      token: "getToken"
  })},
  data: function () {
    return {
      opened: [],
      graduationProgramRules:[],
      parentSelectedProgramCode:'',
    };
  },
  created() {
    this.parentSelectedProgramCode = this.$parent.selectedProgramCode
    ProgramManagementService.getProgramRule(this.parentSelectedProgramCode, this.token)
      .then((response) => {
        this.graduationProgramRules = response.data;
      })
      .catch((error) => {
         //eslint-disable-next-line no-unused-vars
        console.log('There was an error:' + error.response);
      });
  },
  methods: {},
};
</script>

<style>
.table th {
  border-bottom: 2px solid #38598a !important;
}
</style>
