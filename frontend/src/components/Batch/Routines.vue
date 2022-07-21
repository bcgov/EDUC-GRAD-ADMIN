<template>
  <div>
    <DisplayTable title="Routines" :items="scheduledRoutines"
      v-bind:fields="scheduledRoutinesFields" id="id" :showFilter=false pagination="true"
    >
      <template #cell(enabled)="row">
          <b-form-checkbox @change="toggleRoutine(row.item.jobType, !row.item.enabled)" :checked="row.item.enabled=='Y'?true:false" name="check-button" switch >
          </b-form-checkbox>
      </template>
    </DisplayTable>
  </div>
</template>
<script>
import DisplayTable from "@/components/DisplayTable.vue";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import {
  mapGetters
} from "vuex";
export default {
  components: {
      DisplayTable: DisplayTable,
  },  
  data: function () {
    return {
      scheduledRoutines: [],
      scheduledRoutinesFields: [
        {
          key: 'jobType',
          label: 'Type',
          sortable: true,
          class: 'text-left',
        },    
        {
          key: 'cronExpression',
          label: 'Cron Expression',
          sortable: true,
          class: 'text-left',
        },          
        {
          key: 'scheduleOccurrence',
          label: 'Scheduled Occurence',
          sortable: true,
          class: 'text-left',
        },            
        {
          key: 'createUser',
          label: 'Created Byr',
          sortable: true,
          class: 'text-left',
        },        
        {
          key: 'updateUser',
          label: 'Update By',
          sortable: true,
          class: 'text-left',
        },   
        {
          key: 'updateDate',
          label: 'Update By',
          sortable: true,
          class: 'text-left',
        },                                    
        {
          key: 'enabled',
          label: 'Enabled',
          sortable: true,
          class: 'text-left',
        },                                                        
      ]
    }
  },
  created() {
    BatchProcessingService.batchProcessingRoutines().then(
    (response) => {
      this.scheduledRoutines = response.data;
    }).catch((error) => {
      this.makeToast("ERROR " + error.response.statusText, "danger")
    });


  },
  methods: {
    toggleRoutine(jobType){
      BatchProcessingService.batchProcessingToggleRoutine(jobType).then(
      () => {
        this.makeToast("Job Updated", "success")
      }).catch((error) => {
        this.makeToast("ERROR " + error.response.statusText, "danger")
      });        
    },
    makeToast(message, variant){
      this.$bvToast.toast(message, {
        title: message,
        variant: variant,
        noAutoHide: true,
      });
    }
  },
  props: {
    jobId: String,
  },  
  computed: {
    ...mapGetters({  

    }),
  },
};
</script>
<style scoped>
  input{
    border-radius: 0px;
  }
</style>
