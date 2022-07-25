<template>
  <div class="container">
    <h2>Batch Processing</h2>
    <div>
  <div class="mt-2 row">
  <div class="col-12 float-left p-0">
    <div ref="top">
      <b-card no-body>
        <b-tabs v-model="selectedTab" active card>
          <b-tab title="Job/Runs">
          <div>
            <b-card no-body class="border-0">
              <b-tabs pills class="border-0">
                <b-tab title="Completed" active>
                  <b-card-text class="row">
                    <div :class="isBatchShowing || isErrorShowing ? 'col-12 col-md-7':'col-12'">
                      <DisplayTable title="Job/Runs" :items="batchInfoListData"
                        v-bind:fields="jobRunFields" id="id" :showFilter=false pagination="true"
                      >
                        <template #cell(jobExecutionId)="row">
                          <b-btn v-if="row.item.status == 'COMPLETED'" :id="'batch-job-id-btn'+ row.item.jobExecutionId" variant='link' size="xs">   
                            {{row.item.jobExecutionId}}   
                          </b-btn>
                          <b-btn v-else disabled variant='link' size="xs">  
                            {{row.item.jobExecutionId}}   
                          </b-btn>                  
                          <b-popover :target="'batch-job-id-btn'+ row.item.jobExecutionId" triggers="focus" :ref="'popover'+row.item.jobExecutionId">
                            <template #title>Search batch job</template>
                            <b-btn :id="'batch-job-id-btn'+ row.item.jobExecutionId" variant='link' size="xs" @click="setBatchId(row.item.jobExecutionId, 'batch')">   
                              All results           
                            </b-btn>
                          </b-popover>
                        </template>
                        <template #cell(failedStudentsProcessed)="row">
                          <b-btn v-if="row.item.failedStudentsProcessed != 0" variant='link' size="xs" @click="setBatchId(row.item.jobExecutionId, 'error')">  
                            {{row.item.failedStudentsProcessed}}   
                          </b-btn>  
                          <div v-if="row.item.failedStudentsProcessed == 0">{{row.item.failedStudentsProcessed}}</div>       
                        </template>
                      </DisplayTable>
                    </div>
                    <!-- All batch results -->
                    <div v-if="isBatchShowing"  class="col-12 col-md-5 float-right pl-2 pr-0">
                      <b-card bg-variant="light" :header="'Batch Job '+ this.adminSelectedBatchId" class="text-left mb-2">
                        <b-card-text>                
                          <BatchJobSearchResults :selectedBatchId="adminSelectedBatchId"></BatchJobSearchResults>
                          <b-btn variant="danger" size="xs" class="float-right" @click="isBatchShowing ^= true">  
                            Close 
                          </b-btn> 
                        </b-card-text>
                      </b-card>
                    </div>
                    <!-- All error results -->
                    <div v-if="isErrorShowing"  class="col-12 col-md-5 float-right pl-2 pr-0">
                      <b-card bg-variant="light" :header="'Batch Job Error '+ this.adminSelectedErrorId" class="text-left mb-2">
                        <b-card-text>                   
                          <BatchJobErrorResults :selectedErrorId="adminSelectedErrorId"></BatchJobErrorResults>
                          <b-btn variant="danger" size="xs" class="float-right" @click="isErrorShowing ^= true">  
                            Close 
                          </b-btn> 
                        </b-card-text>
                      </b-card>
                    </div>
                  </b-card-text>
                </b-tab>
                <b-tab class="btn-sm" :title="'User Scheduled (' + scheduledJobs.length + ')'">
                  <b-card-text>
                      <div v-if="!scheduledJobs.length">
                        No Scheduled Jobs
                      </div>
                     <DisplayTable title="Job/Runs" :items="scheduledJobs"
                        v-bind:fields="scheduledJobFields" id="rowId" :showFilter=false pagination="true" deleteLabel="Cancel" delete="batchprocessing/removeScheduledJobs"
                      >
                        <template #cell(jobExecutionId)="row">
                          <b-btn v-if="row.item.status == 'COMPLETED'" :id="'batch-job-id-btn'+ row.item.jobExecutionId" variant='link' size="xs">   
                            {{row.item.jobExecutionId}}   
                          </b-btn>
                          <b-btn v-else disabled variant='link' size="xs">  
                            {{row.item.jobExecutionId}}   
                          </b-btn>                  
                          <b-popover :target="'batch-job-id-btn'+ row.item.jobExecutionId" triggers="focus" :ref="'popover'+row.item.jobExecutionId">
                            <template #title>Search batch job</template>
                            <b-btn :id="'batch-job-id-btn'+ row.item.jobExecutionId" variant='link' size="xs" @click="setBatchId(row.item.jobExecutionId, 'batch')">   
                              All results           
                            </b-btn>
                          </b-popover>
                        </template>
                        <template #cell(failedStudentsProcessed)="row">
                          <b-btn v-if="row.item.failedStudentsProcessed != 0" variant='link' size="xs" @click="setBatchId(row.item.jobExecutionId, 'error')">  
                            {{row.item.failedStudentsProcessed}}   
                          </b-btn>  
                          <div v-if="row.item.failedStudentsProcessed == 0">{{row.item.failedStudentsProcessed}}</div>       
                        </template>
                        <template #cell(job-state)="row">
                          <b-form-checkbox switch size="lg">Large</b-form-checkbox>
                        </template>
                      </DisplayTable>
                  </b-card-text>
                </b-tab>
                <b-tab class="btn-sm" :title="'Routines'">
                  <b-card-text>
                      <BatchRoutines/>
                  </b-card-text>
                </b-tab>                
              </b-tabs>
            </b-card>
          </div>
        </b-tab>
         <b-tab v-for="i in tabs" :key="'dyn-tab-' + i" :title="'Request ' + i" >
           
             <template #title>
              <b-spinner v-show="spinners[i]" type="border" small></b-spinner> Request {{i|jobIdLabel}}
              </template>
            <b-alert v-if="validationMessage" show>{{validationMessage}}</b-alert>
            <b-overlay :show="spinners[i]">
              <BatchJobForm :jobId="i" @runbatch="runbatch" @cancelBatchJob="cancelBatchJob"></BatchJobForm>
            </b-overlay>
        </b-tab>

        <!-- New Tab Button (Using tabs-end slot) -->
        <template #tabs-end>
          <b-nav-item role="presentation" @click.prevent="newBatchJob" href="#">+ New Request</b-nav-item>
        </template>

        <!-- Render this if no tabs -->
        <template #empty>
          <div class="text-center text-muted">
            There are no open tabs<br>
            Open a new tab using the <strong>+</strong> button above.
          </div>
        </template>
        </b-tabs>
      </b-card>
    </div>    
  </div>
   </div>  
  </div>

</div>
 
</template>

<script>
// @ is an alias to /src
import BatchProcessingService from "@/services/BatchProcessingService.js";
import DistributionService from "@/services/DistributionService.js";
import DisplayTable from '@/components/DisplayTable.vue';
import BatchJobSearchResults from "@/components/Batch/BatchJobSearchResults.vue";
import BatchJobErrorResults from "@/components/Batch/BatchJobErrorResults.vue";
import BatchJobForm from "@/components/Batch/Batch.vue";
import BatchRoutines from "@/components/Batch/Routines.vue";
import sharedMethods from '../sharedMethods';

import {
  mapGetters, mapActions
} from "vuex";
export default {
  name: "test",
  computed:{
    results(){
      return this.searchResults;
    },
    batchInfoListDataChange(){
      return this.batchInfoListData;
    },
    ...mapGetters({
      tabCounter: "batchprocessing/getBatchCounter",
      tabContent: "batchprocessing/getBatchDetails",
      tabs: "batchprocessing/getBatchProcessingTabs",
      spinners: "batchprocessing/getBatchTabsLoading",
      scheduledJobs: "batchprocessing/getScheduledBatchJobs",
      courses: "getStudentCourses",
      gradStatusCourses: "gradStatusCourses",
      studentGradStatus: "getStudentGradStatus",
      hasGradStatus: "studentHasGradStatus",
      gradStatusPendingUpdates: "getHasGradStatusPendingUpdates"
    }),
  },
  props: [
    //'adminSelectedBatchId',
  ],
  components: {
      DisplayTable: DisplayTable,
      BatchJobSearchResults: BatchJobSearchResults,
      BatchJobErrorResults: BatchJobErrorResults,
      BatchJobForm: BatchJobForm,
      BatchRoutines: BatchRoutines
  },
  data() {
    return {
      validationMessage: "",
      validating: false,
      adminSelectedBatchId:"",
      adminSelectedErrorId:"",
      errorOn: false,
      displayMessage: null,
      dashboardData:"",
      processed: "",
      lastRunStatus:"",
      lastExpectedStudentsProcessed:"",
      processedLastRun: "",
      errors: "32",
      expected: "56",
      processingTime: "",
      lastJobstartTime:"",
      lastJobendTime:"",
      processedLastJobstartTime:"",
      processedLastJobendTime:"",
      timespan: "6:00pm to 7:12pm",
      timePerRecord: "18s",
      isErrorShowing: false,
      isBatchShowing: false,
      batchInfoListData:[],
      certificateTypes:[],
      transcriptTypes:[],
      scheduledJobFields: [
        {
          key: 'rowId',
          label: 'ID',
          sortable: true,
          class: 'text-left',
        }, 
        {
          key: 'jobId',
          label: 'Job ID',
          sortable: true,
          class: 'text-left',
        }, 
        {
          key: 'jobName',
          label: 'Job Name',
          sortable: true,
          class: 'text-left',
        },         
        {
          key: 'schedule/removedBy',
          label: 'Scheduled By',
          sortable: true,
          class: 'text-left',
        }, 
        {
          key: 'status',
          label: 'Status',
          sortable: true,
          class: 'text-left',
        },    
        {
          key: 'delete',
          label: 'Delete',
          sortable: true,
          class: 'text-left',
        },                                             
      ], 
      jobRunFields: [
         {
            key: 'jobExecutionId',
            label: 'Job Execution ID',
            sortable: true,
            class: 'text-left',
            editable: true
          },  
          {
            key: 'jobType',
            label: 'Batch Job Type Code',
            sortable: true,
            class: 'text-left',
            editable: true,
           
          },     
          {
            key: 'triggerBy',
            label: 'Batch Job Trigger',
            sortable: true,
            class: 'text-left',
            editable: true
          },       
          {
            key: 'updateDate',
            label: 'Update date',
            sortable: true,
            class: 'text-left',
            editable: true,
            sortDirection: 'desc',
            formatter: (value) => {
              let newValue = new Date(value);           
              value = newValue.toLocaleString('en-CA', { timeZone: 'PST' })
              return value
            }
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
            class: 'text-left',
            editable: true
          },
        
          {
            key: 'expectedStudentsProcessed',
            label: 'Expected',
            sortable: true,
            class: 'text-left',
            editable: true
          },
          {
            key: 'actualStudentsProcessed',
            label: 'Actual',
            sortable: true,
            class: 'text-left',
            editable: true
          },
          {
            key: 'failedStudentsProcessed',
            label: 'Error',
            sortable: true,
            class: 'text-center',
            editable: true
          }

      ],
      fields: ['date','program', 'success', 'view'],
      jobFields: ['date','user', 'success', 'status'],
      items: [],
      jobs: [],   
      selectedTab: 0,     
      searchResults: [], 
      batchValid: false,
    };
  },
  created() {
    this.getAdminDashboardData()
    this.getScheduledJobs()
  },
  methods: { 
    ...mapActions('batchprocessing', ['setScheduledBatchJobs']),

    getZipLink: function (data, mimeType) {
      return sharedMethods.base64ToFileTypeData(data,mimeType)
    },
    cancelBatchJob(id) {
  
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i] == id) {
          this.tabs.splice(i, 1);
          this.spinners.splice(i,1)
          this.$store.commit("batchprocessing/clearBatchDetails",id);
          return;
        }
      }
      
    },      
    
    newBatchJob() {
      let batchDetail = { details: {what: "", who: "", credential: ""}, students: [{}], schools:[{}], districts: [{}], programs:[{}],blankTranscriptDetails:[{}],blankCertificateDetails:[{}]};
      
      let id = "job-" + this.tabCounter;
      this.$set(this.spinners, id, false)
      this.$store.commit("batchprocessing/editBatchDetails",  {batchDetail, id});
      this.$store.commit("batchprocessing/addBatchJob", "job-"+this.tabCounter);
        requestAnimationFrame(() => {
          this.selectedTab = this.tabs.length;
        })
    },
    formatDate(value) {    
      return  value.toLocaleString('en-CA', { timeZone: 'PST' });
    },
    getAdminDashboardData(){
      BatchProcessingService.getDashboardInfo().then(
        (response) => {
            this.dashboardData = response.data;
            this.batchInfoListData = response.data.batchInfoList;
            //Processed
            this.processed = this.dashboardData.lastActualStudentsProcessed;
            this.lastExpectedStudentsProcessed = this.dashboardData.lastExpectedStudentsProcessed;
            this.lastRunStatus = this.dashboardData.lastStatus
            //Errors
            this.errors = this.dashboardData.lastFailedStudentsProcessed
            if(this.errors > 0){
              this.errorOn = true;
            }else{
              this.errorOn = false;
            }
            //Processing time bucket
            this.lastJobendTime = new Date(this.dashboardData.lastJobendTime);
            this.lastJobstartTime = new Date(this.dashboardData.lastJobstartTime)
            var lastJobProcessTimeInMilli = this.lastJobendTime.getTime() - this.lastJobstartTime.getTime();
            this.processingTime = (lastJobProcessTimeInMilli / (1000 * 60 * 60)).toFixed(1);
            this.processedLastJobstartTime = this.lastJobstartTime.toLocaleString('en-CA', { timeZone: 'PST' })
            this.processedLastJobendTime = this.lastJobendTime.toLocaleString('en-CA', { timeZone: 'PST' })
            this.processedLastRun = this.lastJobendTime.toLocaleString('en-CA', { timeZone: 'PST' })
            //Expected
            this.expected = this.dashboardData.lastExpectedStudentsProcessed
          }
        ).catch((error) => {
          
          if(error.response.status){
            this.$bvToast.toast("ERROR " + error.response.statusText, {
              title: "ERROR" + error.response.status,
              variant: 'danger',
              noAutoHide: true,
            });
          }
      });
    },
    batchHasErrors(batch){
      batch.validationMessage = "";
      //check for what
      if(!batch.details['what']){
        batch.validationMessage = "Type of batch Not Specified";
        return true;
      }
      //check for who
      if(!batch.details['who']){
        batch.validationMessage = "Group not specified"
        return true;
      }  
      return false;
    },
    getBatchData(item){
      if(item.value){
        return item.value;
      }else{
        return item;
      }
    },
    runDISTRUN(request, id, credentialType){
      let requestId = id.replace("job-",""); 
      this.$set(this.spinners, id, true)
      let index= id.replace("job-","")-1;
      let value = true
      this.$store.commit("batchprocessing/setTabLoading",{index, value});
        BatchProcessingService.runDISTRUN(request, credentialType).then(
        (response) => {
           //update the admin dashboard
          this.getAdminDashboardData();
          // eslint-disable-next-line
          console.log(response)
          this.cancelBatchJob(id);
          this.selectedTab = 0;
     
          if(request.localDownload == 'Y'){
            
            let bid = response.data.batchId;
            DistributionService.downloadDISTRUN(bid).then((res) => {
              this.$bvToast.toast('Download (.zip)' , {
                title: "BATCH PROCESSING COMPLETED",
                href: "data:application/zip;base64," + res.data,
                variant: 'success',
                noAutoHide: true,
              })
            });
                        
          }else{
            this.$bvToast.toast("Batch run has completed for request " + requestId , {
              title: "BATCH PROCESSING COMPLETED",
              variant: 'success',
              noAutoHide: true,
            })
          }
        })
        .catch((error) => {
          if(error){
            this.cancelBatchJob(id);
            this.$bvToast.toast("Batch run is still in progress for request" + requestId + " and will run in the background" , {
              title: "BATCH PROCESSING UPDATE",
              variant: 'success',
              noAutoHide: true,
            })
          }
        })  
        setTimeout(this.getBatchProgress(requestId), 5000);
    },
    runTVRRUN(request, id){
     let requestId = id.replace("job-",""); 
      this.$set(this.spinners, id, true)
      let index= id.replace("job-","")-1;
      let value = true
      this.$store.commit("batchprocessing/setTabLoading",{index, value});
        BatchProcessingService.runTVRRUN(request).then(
        (response) => {
           //update the admin dashboard
          this.getAdminDashboardData();
          // eslint-disable-next-line
          console.log(response)
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          this.$bvToast.toast("Batch run has completed for request " + requestId , {
            title: "BATCH PROCESSING COMPLETED",
            variant: 'success',
            noAutoHide: true,
          })
        })
        .catch((error) => {
          if(error){
            this.cancelBatchJob(id);
            this.$bvToast.toast("Batch run is still in progress for request" + requestId + " and will run in the background" , {
              title: "BATCH PROCESSING UPDATE",
              variant: 'success',
              noAutoHide: true,
            })
          }
        })  
        setTimeout(this.getBatchProgress(requestId), 5000);
    },
    runREGALG(request, id){
      let requestId = id.replace("job-",""); 
      this.$set(this.spinners, id, true)
      let index= id.replace("job-","")-1;
      let value = true
      this.$store.commit("batchprocessing/setTabLoading",{index, value});
        BatchProcessingService.runREGALG(request).then(
        (response) => {
           //update the admin dashboard
          this.getAdminDashboardData();
          // eslint-disable-next-line
          console.log(response)
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          this.$bvToast.toast("Batch run has completed for request " + requestId , {
            title: "BATCH PROCESSING COMPLETED",
            variant: 'success',
            noAutoHide: true,
          })
        })
        .catch((error) => {
          if(error){
            this.cancelBatchJob(id);
            this.$bvToast.toast("Batch run is still in progress for request" + requestId + " and will run in the background" , {
              title: "BATCH PROCESSING UPDATE",
              variant: 'success',
              noAutoHide: true,
            })
          }
        })
        setTimeout(this.getBatchProgress(requestId), 5000);
    },
    addScheduledJob(request, id){
      let requestId = id.replace("job-",""); 
      this.$set(this.spinners, id, true)
      let index= id.replace("job-","")-1;
      let value = true
      this.$store.commit("batchprocessing/setTabLoading",{index, value});
        BatchProcessingService.addScheduledJob(request).then(
        (response) => {
           //update the admin dashboard
          this.getScheduledJobs();
          // eslint-disable-next-line
          console.log(response)
          this.cancelBatchJob(id);
          this.selectedTab = 0;
          this.$bvToast.toast("Request " + requestId + " has successfully been scheduled", {
            title: "SCHEDULING USER REQUEST",
            variant: 'success',
            noAutoHide: true,
          })
        })
        .catch((error) => {
          if(error){
            this.$bvToast.toast("There was an error scheduling your request", {
              title: "SCHEDULING ERROR",
              variant: 'success',
              noAutoHide: true,
            })
          }
        })
        setTimeout(this.getBatchProgress(requestId), 5000);
    },    
    getScheduledJobs(){

      BatchProcessingService.getScheduledBatchJobs().then((response) => {
        this.setScheduledBatchJobs(response.data);
      })
    },
    getBatchProgress(requestId){
      BatchProcessingService.getBatchSummary().then((response) => {

            let jobDetails = response.data.batchJobList[0];
            let date = new Date();
            let job = { "createUser": "?", "createDate": "?", "updateUser": "?", "updateDate": date.toString(), "id": "?", "jobExecutionId": "Request " + requestId, "startTime": date.toString(), "endTime": "", "expectedStudentsProcessed": "?", "actualStudentsProcessed": "?", "failedStudentsProcessed": "?", "status": "STARTED", "triggerBy": "MANUAL", "jobType": this.tabContent["job-"+requestId].details['what'] }

            if(jobDetails.status == 'STARTED'){
              job = { "createUser": "?", "createDate": jobDetails.createTime, "updateUser": "?", "updateDate": jobDetails.startTime, "id": "?", "jobExecutionId": jobDetails.jobExecutionId + " (request" + requestId + ")", "startTime": jobDetails.startTime, "endTime": jobDetails.endTime, "expectedStudentsProcessed": "?", "actualStudentsProcessed": "?", "failedStudentsProcessed": "?", "status": jobDetails.status, "triggerBy": "MANUAL", "jobType": this.tabContent["job-"+requestId].details['what'] }  
            }
            this.$bvToast.toast("Batch for request " + requestId + " has started" , {
              title: "BATCH PROCESSING STARTED",
              variant: 'success',
              noAutoHide: true,
            })                        
            this.batchInfoListData.splice(0,1,job)
        }
      );  
    },    
    validateBatch(id){
      let pens = [], schools = [], districts = [], programs = [], districtCategoryCode="";
      if(this.tabContent[id].details['who'] == 'School'){
        schools = this.tabContent[id].schools.map(this.getBatchData);  
        schools.pop();
        if(!schools.length){
          this.validationMessage = "Please select a school."
          this.batchValid = false;
          return
        }
      }else if(this.tabContent[id].details['who'] == 'Student'){
        pens = this.tabContent[id].students.map(this.getBatchData);  
        pens.pop();
        if(!pens.length){
          this.validationMessage = "Please select a student."
          this.batchValid = false;
          return
        }
      }else if(this.tabContent[id].details['who'] == 'District'){
        districts = this.tabContent[id].districts.map(this.getBatchData);  
        districtCategoryCode = this.tabContent[id]['details'].categoryCode;
        districts.pop();
        if(!districtCategoryCode){
          this.validationMessage = "Please select a district category"
          this.batchValid = false;
        }
        if(!districts.length){
          this.validationMessage = "Please select a district."
          this.batchValid = false;
          return
        }
      }else if(this.tabContent[id].details['who'] == 'Program'){
        programs = this.tabContent[id].programs.map(this.getBatchData);  
        programs.pop();
        if(!programs.length){
          this.validationMessage = "Please select a program."
          this.batchValid = false;
          return
        }
      }
      this.batchValid = true;
    },
    runbatch(id, cronTime){    
      let pens = [], schools = [], districts = [], programs = [], psi = [], districtCategoryCode="";
      
      if(this.tabContent[id].details['who'] == 'School'){
        schools = this.tabContent[id].schools.map(this.getBatchData);  
        schools.pop();
        if(!schools.length){
          this.validationMessage = "Please select a school."
          return
        }
      }else if(this.tabContent[id].details['who'] == 'Student'){
        pens = this.tabContent[id].students.map(this.getBatchData);  
        pens.pop();
        if(!pens.length){
          this.validationMessage = "Please select a student."
          return
        }
      }else if(this.tabContent[id].details['who'] == 'District'){
        districts = this.tabContent[id].districts.map(this.getBatchData);  
        districtCategoryCode = this.tabContent[id]['details'].categoryCode;
        if( this.tabContent[id]['details'].categoryCode == ""){
          districtCategoryCode =  []
        }
        districts.pop();
        if(!districtCategoryCode){
          this.validationMessage = "Please select a district category"
        }
        if(!districts.length){
          this.validationMessage = "Please select a district."
          return
        }
      }else if(this.tabContent[id].details['who'] == 'PSI'){
        psi = this.tabContent[id].psi.map(this.getBatchData);  
        psi.pop();
        if(!psi.length){
          this.validationMessage = "Please select a Post Secondary Institution."
          return
        }        
        
      }else if(this.tabContent[id].details['who'] == 'Program'){
        programs = this.tabContent[id].programs.map(this.getBatchData);  
        programs.pop();
        if(!programs.length){
          this.validationMessage = "Please select a program."
          return
        }
      }
      let gradDateFrom = this.tabContent[id].details['gradDateFrom']
      let gradDateTo = this.tabContent[id].details['gradDateTo']
      let localDownload = this.tabContent[id].details['where']=='localDownload'?'Y':'N'
      let request = {"pens": pens, "schoolOfRecords":schools,"districts":districts, "schoolCategoryCodes": [], "programs":programs, "psi": psi, "gradDateFrom":gradDateFrom, "gradDateTo":gradDateTo,"validateInput": false, "localDownload": localDownload }
      if(this.batchHasErrors(this.tabContent[id])){
        return;
      }
      if(this.tabContent[id].details['what'] == 'REGALG'){     
        if(cronTime){
          let scheduledRequest = {};
          scheduledRequest.cronExpression = cronTime
          scheduledRequest.jobName = 'SGBJ'
          scheduledRequest.blankPayLoad = null;
          scheduledRequest.payload = request;
          this.addScheduledJob(scheduledRequest, id)
        }else{
          this.runREGALG(request, id);  
        }
      }else if(this.tabContent[id].details['what'] == 'TVRRUN'){    
        if(cronTime){
          let scheduledRequest = {};
          scheduledRequest.cronExpression = cronTime
          scheduledRequest.jobName = 'STBJ'
          scheduledRequest.blankPayLoad = null;
          scheduledRequest.payload = request;
          this.addScheduledJob(scheduledRequest, id)
        }else{
          this.runTVRRUN(request, id);
        }
        
      }
      else if(this.tabContent[id].details['what'] == 'DISTRUN'){     
        if(cronTime){
          let scheduledRequest = {};
          scheduledRequest.cronExpression = cronTime
          scheduledRequest.jobName = 'URDBJ'
          scheduledRequest.blankPayLoad = null;
          scheduledRequest.payload = request;
          
          this.addScheduledJob(scheduledRequest, id)
        }else{
          this.runDISTRUN(request, id, this.tabContent[id].details['credential']);
        }
        
      }        
    },
    displaySearchResults(value){ 
      this.searchResults = value
    },
    setBatchId(id, type){
      if(type == 'batch'){
        this.isBatchShowing = true;
        this.isErrorShowing = false;
        this.adminSelectedBatchId = id.toString();
        this.$refs['popover' + id].$emit('close');
      }
      if (type == 'error'){
        this.isBatchShowing = false;
        this.isErrorShowing = true;
        this.adminSelectedErrorId = id.toString(); 
      }
      var element = this.$refs['top'];
      var top = element.offsetTop;
      window.scrollTo(0, top);  
    }, 
  },
  
};
</script>
<style scoped>
.alert,
.card,
.btn.btn-primary {
  position: inherit;
}
h6 {
  font-size: 1.5rem;
}
.find {
  padding-bottom: 1rem;
}
.delete-button{
  border-radius: 0px;
}
</style>
