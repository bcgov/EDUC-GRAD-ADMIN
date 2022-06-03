<template>
  <div>
     <b-spinner v-if="batchLoading" label="Loading">Loading</b-spinner>
     <!-- No results message-->
     <p v-if="rows <  1">There are no results to display.<br>
        Please select another Job Execution ID.
     </p>
      <DisplayTable title="Job/Runs" v-bind:items="batchData"
        v-bind:fields="batchDataFields" 
        id="id" 
        :showFilter=false 
        :pagination=false
      >
        <template #cell(pen)="row">
          <b-btn :id="'pen'+ row.item.pen" 
            variant='link' 
            size="xs" 
            @click="findStudentByPen(row.item.pen)
          ">   
            {{row.item.pen}}           
          </b-btn>
        </template>
        <template #cell(schoolOfRecord)="row">      
          <div v-if="row.item.schoolOfRecord">{{row.item.schoolOfRecord}}</div>           
        </template>
      </DisplayTable>
      <b-pagination
        v-if="rows >  1"
        v-model="userSelectedPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>
  </div>
</template>

<script>

import { mapGetters } from "vuex";
import sharedMethods from '../../sharedMethods';
import BatchProcessingService from "@/services/BatchProcessingService.js";
import StudentService from "@/services/StudentService.js";
import DisplayTable from '@/components/DisplayTable.vue';
export default {
  name: "batchJobSearch",
  components: {
    DisplayTable: DisplayTable,
  },
  props: ['selectedErrorId']
  ,
  data() {
    return {
      batchData: [],
      perPage: 10,
      rows:0,
      currentPage:0,
      userSelectedPage:0,
      batchLoading:false,
      batchDataFields: [
        {
          key: 'pen',
          label: 'Pen',
          sortable: true,
          class: 'text-left',
          editable: true
        },  
        {
          key: 'legalFirstName',
          label: 'First Name',
          sortable: true,
          class: 'text-left',
          editable: true
        }, 
        {
          key: 'legalLastName',
          label: 'Last Name',
          sortable: true,
          class: 'text-left',
          editable: true
        }, 
        {
          key: 'error',
          label: 'Error',
          sortable: true,
          class: 'text-left',
          editable: true
        }, 
      ],  
    };
  },

  computed: {
    ...mapGetters({
      token: "auth/getToken",
    }),
    currentPageChange(){
      return this.userSelectedPage;
    },
  },
  created() {
    this.showNotification = sharedMethods.showNotification;  
    this.loadStudent = sharedMethods.loadStudent;
    this.getAdminDashboardData(this.selectedErrorId,0); 
  },
  watch: { 
    selectedErrorId: function() { 
      this.getAdminDashboardData(this.selectedErrorId,0);
    },
    currentPageChange:function(){  
      if(this.userSelectedPage !== null){
        this.getAdminDashboardData(this.selectedErrorId,this.userSelectedPage);
      }     
    },
  },
  methods: {
    getAdminDashboardData(batchId, page){ 
      this.batchData = []; 
      this.rows = 0;
      this.batchLoading = true;
      if(page){
        if(page > 0){
          page = page - 1;  
        }
      }    
      BatchProcessingService.getBatchErrors(batchId, page, this.token).then(
        (response) => {
            this.batchData = response.data.errorList;
            this.rows = response.data.totalElements;
            this.batchLoading = false
          }
        ).catch((error) => {
          if(error.response.status){
            this.$bvToast.toast("ERROR " + error.response.statusText, {
              title: "ERROR" + error.response.status,
              variant: 'danger',
              noAutoHide: true,
            });
            this.isBatchLoading = false
          }
      });
    },
    findStudentByPen: function(pen) {
      if (pen) {
        StudentService.getStudentByPen(pen, this.token)
        .then((response) => {
          if (response.data) {
            this.loadStudent(response.data);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log('Batch Admin Load: ' + error);
          this.showNotification("danger", "Student cannot be found on the GRAD or PEN database");
        });
      }
    },
  },
}
</script>

<style scoped>

</style>