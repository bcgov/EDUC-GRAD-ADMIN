<template>
  <div>
  <DisplayTable v-bind:items="algorithmRules" title="Program" v-bind:filterOn="toFilterItem" v-bind:fields="algorithmRulesFields" id="specialCase" showFilter="true">
        <template #cell(ruleName)="row">
          {{row.item.algorithmRuleCode.label}}
        </template>
        <template #cell(ruleDescription)="row">
          {{row.item.algorithmRuleCode.description}}
        </template>
        <template #cell(isActive)="row">
          {{row.item.algorithmRuleCode.isActiveRule}}
        </template>
    </DisplayTable>
  </div>
</template>

<script>
import DisplayTable from "@/components/DisplayTable";
import ProgramManagementService from "@/services/ProgramManagementService.js";
import sharedMethods from '../../sharedMethods';

export default {
  name: 'AlgorithmRules',
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    this.showNotification = sharedMethods.showNotification;  
    ProgramManagementService.getAlgorithmRules()
    .then((response) => {
      this.algorithmRules = response.data;
    })
    .catch((error) => {
      this.showNotification("danger", "There was an error: " + error);
    });
  },
  data: function() {
    return {
      algorithmRules: [],
      toFilterItem:['graduationProgramCode','isActive'],
      algorithmRulesFields: [
        {
          key: 'graduationProgramCode',
          label: 'Program code',
          sortable: true,
          sortDirection: 'desc',
          
        },
        {
          key: 'ruleName',
          label: 'Rule name',
          sortable: true,
        },
        {
          key: 'ruleDescription',
          label: 'Rule description',
          sortable: true,
        },
        {
          key: 'sortOrder',
          label: 'Sort order',
          sortable: true,
        },  
        {
          key: 'isActive',
          label: 'Active flag',
          sortable: true,
        }            
      ],
    };
  },
  methods: {
  },
};
</script>

<style>
.table th, .table td{
  border-top: none !important;

}</style>
