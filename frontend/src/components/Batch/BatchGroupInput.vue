<template>
  <div>
      <b-card class="mt-3 px-0" :header="'Include ' + label ">
        <b-alert dismissible v-if="validationMessage" :show="validationMessage" variant="danger">{{validationMessage}}</b-alert>
        <div class="row col-12 border-bottom mb-3">
          <div v-for="(field) in fields" :key="field.key" class="col-2">
              <strong> {{field.label}}</strong>
          </div>
        </div>
        
        <div v-for="(school, index) in batch[group]" :key="index" class="">
          <div v-if="!school[fields[1].key]" class="mb-3">


            <ValidationObserver v-slot="{passes, invalid}">
            <form @submit.prevent="passes(addValueToTypeInBatchId(jobId,group,school.value,index))" class="row col-12">
              <div v-for="(field) in fields" :key="field + index">
                <ValidationProvider :name="label" :rules="'mincodelength|validateschool:' + jobId + ',' + index + ',' + batch.details['credential']" v-slot="{ errors }">                
                    <span class="position-absolute w-100 form-validation-message text-danger">{{ errors[0] }}</span>
                    <b-form-input v-if="field.isInput" type="number" v-model="school.value"/>    
                    <b-form-input v-else show="false" :disabled=true v-model="school[field.key]" :ref="field.key + jobId + index" class="col-12"/>
                </ValidationProvider>
                
                            
                
              </div>
                <div v-if="index == batch[group].length-1" class="col-2">
                  <button :disabled="invalid" class="btn btn-primary w-100">
                  
                  <b-spinner small v-if="validating"></b-spinner> Add
                  </button>   
                </div>
              </form>
            </ValidationObserver>
          </div>
          <div class="row col-12 mb-2" >

              <div v-for="(field) in fields" :key="field" class="col-2">
                <span v-if="field.isInput">{{batch[group][index]['value']}}</span>
                <span v-else>{{batch[group][index][field.key]}}</span>
              </div>

              <div v-if="index != batch.schools.length-1" class="col-2" >
                <b-button  class="btn btn-primary w-100" @click="deleteValueFromTypeInBatchId(jobId, 'schools',school.value)">
                  Remove
                </b-button>
              </div>
          </div>
        </div>
      <pre class="mt-5">TEST Schools: 04343000 04399143 02222022 06161064 06161049 03596573</pre>

      </b-card>            
      
  </div>
</template>
<script>
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import TRAXService from "@/services/TRAXService.js";
import SchoolService from "@/services/SchoolService.js";
import StudentService from "@/services/StudentService.js";
import GraduationReportService from "@/services/GraduationReportService.js";

import {
  mapGetters
} from "vuex";


extend('minmax', {
  validate(value, { min, max }) {
    return value.length >= min && value.length <= max;
  },
  params: ['min', 'max'],
  message: 'The {_field_} field must have at least {min} characters and {max} characters at most'
})
extend('mincodelength', {
  validate(value) {
    return value.length == 8
  },
  message: 'Minimum 8 characters'
})
extend('lessthangraddateto', {
  validate(value, { gradDateTo }) {
    const date1 = new Date(value);
    const date2 = new Date(gradDateTo);
    if(gradDateTo){
      return date1 < date2
    }else return true;
  },
  params: ['gradDateTo'],
  message: 'The Grad Start Date field must be less than {gradDateTo}'
})
extend('greaterthangraddateFrom', {
  validate(value, { gradDateFrom }) {
    const date1 = new Date(gradDateFrom);
    const date2 = new Date(value);
    if(gradDateFrom){
      return date1 < date2
    }else return true;
  },
  params: ['gradDateFrom'],
  message: 'The Grad End Date field must be less than {gradDateFrom}'
})
extend('adultdogwoodpublicrestrictedtoministryofadvancededgroup', {
  
  validate(value, args) {
    // eslint-disable-next-line

    if(value == "Ministry of Advanced Education" && args[0] == 'Blank certificate print'){
      return "You can only print for public Adult Dogwood for Ministry of Advanced Education";
    }else return true;
  },
})

export default {
  components: {
    ValidationProvider: ValidationProvider,
    ValidationObserver: ValidationObserver
  },  
  data: function () {
    return {
      batchRunDetails: "",
      cronTime: "",
      batchRunTime: "Run Now",
      batchRunCustomDate: "",
      batchRunCustomTime: "",
      batchRunSchedule: "",
      processingBatch: false,
      validationMessage: "",
      validating: false,
      certificateTypes:[],
      transcriptTypes:[],
      gradDateFrom:"",
      gradDateTo: "",
      formElements: {
       'PSIRUN':
          {
            'group': [{ text: '', value: null }, {text:'Student - N/A',value:'Student', disabled:true},{text:'School - N/A',value:'School', disabled:true},{text:'District - N/A',value:'District', disabled:true},{text:'Program - N/A',value:'Program', disabled:true},{text:'PSI',value:'PSI'}],
            'psiYear': true,
            'psiTransmissionMode': true,
          }
        ,
        'DISTRUN':{
          'group': [{ text: '', value: null }, 'Student', 'School', 'District', 'Program', 'PSI'],
          'copies': true,
          'where': true
          }
        ,
        'TVRRUN': {
          'group': [{ text: '', value: null }, 'Student', 'School', 'District', 'Program', 'PSI']
          },    
        'REGALG': {
          'group': [{ text: '', value: null }, 'Student', 'School', 'District', 'Program', 'PSI']
      }, 
        'DISTRUNYEAREND': {
          'message': "You are running a year end distribution run. Click the run button and confirm."
        }                 
      }
    }
  },
  mounted(){
    
    extend('validateschool', (value, refValues) => {
        return SchoolService.getSchoolInfo(value).then(
          (response) => {
            
            let credential = refValues[2]
            if((credential == "Blank certificate print" || credential == 'OT') && response.data.transcriptEligibility == 'N'){ 
                 return "This school is not eligible for trasncripts."
            }
            if((credential == "Blank certificate print" || credential == 'OC' || credential =='RC' ) && response.data.certificateEligibility == 'N'){ 
                 return "This school is not eligible for certificates."
            }

            if(response.data.minCode){              
              for(let field of this.fields){
                if(this.$refs[field.key + refValues[0] + refValues[1]]){
                  this.$refs[field.key + refValues[0] + refValues[1]][0].placeholder = response.data[field.key]; 
                }
              }
              return { valid: true };
            }else{
              return {
                valid: false,
              };
            }
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error) 
               
          this.validating = false;
          this.$forceUpdate();
        });
    }, {
     immediate: false
   })

  },
  created() {

    this.formElements = Object.assign({}, this.formElements)
    this.transcriptTypes = this.getTranscriptTypes();
    this.certificateTypes = this.getCertificateTypes();
  },

  methods: {
    groupFormValues(runType){
      if(runType == ""){
        return
      }
      if(this.batch.details['credential'] != 'Blank certificate print' && this.batch.details['credential'] != 'Blank transcript print'){
        return this.formElements[runType].group
      }else if(this.batch.details['credential'] == 'Blank certificate print' && this.batch.details['blankCertificateDetails'] && this.batch.details['blankCertificateDetails'].length == 1 && this.batch.details['blankCertificateDetails'][0] == 'A'){
          return [{ text: '', value: null },{ text: 'School', value: 'School' },{text: 'Ministry of Advanced Education', value: 'Ministry of Advanced Education'}]
      }
      if(this.batch.details['credential'] == 'Blank certificate print' || this.batch.details['credential'] == 'Blank transcript print'){
        return [{ text: '', value: null },{ text: 'School', value: 'School' },{text: 'Ministry of Advanced Education - Select only Adult Dogwood (Public)',disabled:true}]
        
      }
    },
    hasFormElement(runType, inputName){
      if(runType in this.formElements && inputName in this.formElements[runType]){
        return this.formElements[runType][inputName]
      }else{
        return false;
      }
    },
    onSubmit(values) {
      alert(JSON.stringify(values, null, 2));
    },  
    disableConfirm(){
      if(this.batchRunTime == 'Run Now'){
        return false
      }else{
        if(this.batchRunSchedule && this.batchRunSchedule == 'Custom'){
          if(this.batchRunTime && this.batchRunCustomDate){
            return false;
          }else{
            return true;
          }
        }
        
      }
    },
    resetModal(){
      this.batchRunSchedule = ""
      this.cronTime = ""
      this.batchRunTime = ""
      this.batchRunCustomDate = ""
      this.batchRunCustomTime = ""
    },
    runBatch(id){
      if(this.batchRunTime == 'Run Later'){
        this.cronTime = this.getCronTime()
        this.$emit("runbatch",id, this.cronTime);
      }else{
        this.$emit("runbatch",id);
      }
    },
    getCronTime(){

      if(this.batchRunSchedule == 'N'){
        let today = new Date();
        return "0 30 18 " + today.getDate()  + " " +  (today.getMonth()+1)   + " *";
      }else if(this.batchRunSchedule == 'W'){      
        
        const today = new Date();
        const first = today.getDate() - today.getDay() + 1;
        const sixth = first + 5;
        const saturday = new Date(today.setDate(sixth));
        return "0 30 18 " + saturday.getDate()  + " " +  (saturday.getMonth()+1)   + " *";

      }else if(this.batchRunSchedule == 'M'){
          const today = new Date()
          let tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)
          return "0 30 18 " + tomorrow.getDate()  + " " +  (tomorrow.getMonth()+1)   + " *";
      }else if(this.batchRunSchedule == 'Custom'){
        let dateTime = new Date(this.batchRunCustomDate + "T" + this.batchRunCustomTime)
        return dateTime.getSeconds() + " "  + dateTime.getMinutes()  + " " + dateTime.getHours()  + " " + dateTime.getDate()   + " " +  (dateTime.getMonth()+1)   + " *"
      }else{
        return null
      }
    },
    cancelBatchJob(id){
      //Use the parents method to close and clear a batch job by ID
      this.$emit("cancelBatchJob",id)
    },
    addValueToTypeInBatchId(id, type, value, valueIndex){
      this.validationMessage = "";
      if(type == "schools"){
          this.validating = true;
          SchoolService.getSchoolInfo(value).then(
          (response) => {
            if(response.data.minCode){
              this.$store.commit("batchprocessing/addValueToTypeInBatchId", {id,type, value});
              
              this.$refs['schoolName' + id + valueIndex][0].updateValue(response.data.schoolName);        
              this.$refs['districtName' + id + valueIndex][0].updateValue(response.data.districtName);        
              this.$refs['address1' + id + valueIndex][0].updateValue(response.data.address1);        
            }else{
              this.validationMessage = value + " is not a valid School."             
              this.deleteValueFromTypeInBatchId(id, type, value);
              this.addTypeToBatchId(id, type);
            }
            this.$forceUpdate();
            this.validating = false;  
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error) 
               
          this.validating = false;
          this.$forceUpdate();
        });
      }
      if(type == "students"){
        //remove duplicates
        this.validating = true;
        StudentService.getStudentByPen(value).then(
        (response) => {
            if(response.data.length == 0){
              this.validationMessage = value + " is not a valid PEN"
              this.deleteValueFromTypeInBatchId(id, type, value);
              this.addTypeToBatchId(id, type);
            }else if(response.data[0].studentStatus == 'MER'){
              this.validationMessage = value + " is a merged student and not permitted"
            }else{
              //valid student
              this.$store.commit("batchprocessing/addValueToTypeInBatchId", {id,type, value});
              this.$refs['pen' + id + valueIndex][0].updateValue(response.data[0].usualFirstName + " " + (response.data[0].usualMiddleNames?response.data[0].usualMiddleNames+ " ":"") + response.data[0].usualLastName);        
              this.$refs['dob' + id + valueIndex][0].updateValue(response.data[0].dob);        
              this.$refs['school' + id + valueIndex][0].updateValue(response.data[0].schoolOfRecordName);   
              this.$refs['student-status' + id + valueIndex][0].updateValue(response.data[0].studentStatus);   
            }
          this.$forceUpdate();
          this.validating = false;  
          
        }).catch((error) => {
          // eslint-disable-next-line
          console.log(error)      
          this.validating = false;
        });
      }
      if(type == "districts"){
        
        //remove duplicates
          this.validating = true;
          TRAXService.getDistrict(value).then(
          (response) => {
            if(response.data){
              this.$store.commit("batchprocessing/addValueToTypeInBatchId", {id,type, value});
              this.$refs['districtName' + id + valueIndex][0].updateValue(response.data.districtName);        
              this.$refs['districtCity' + id + valueIndex][0].updateValue(response.data.city);        
            }else{
               this.validationMessage = value + " is not a valid District"
               this.deleteValueFromTypeInBatchId(id, type, value);
               this.addTypeToBatchId(id, type);
            }
            this.$forceUpdate();
            this.validating = false;  
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error)      
          this.validating = false;
        });
      }   
      if(type == "psi"){
        //remove duplicates
          this.validating = true;
          TRAXService.getPSIByAdvanceSearch('psiCode=' + value).then(
          (response) => {
            if(response.data){
              this.$store.commit("batchprocessing/addValueToTypeInBatchId", {id,type, value});
              this.$refs['psiName' + id + valueIndex][0].updateValue(response.data[0].psiName);        
              this.$refs['psiCity' + id + valueIndex][0].updateValue(response.data[0].city);        
            }else{
               this.validationMessage = value + " is not a valid District"
               this.deleteValueFromTypeInBatchId(id, type, value);
               this.addTypeToBatchId(id, type);
            }
            this.$forceUpdate();
            this.validating = false;  
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error)      
          this.validating = false;
        });
      }         
      if(type == "programs"){
        this.validating = true;
        
        if(value){
          this.$store.commit("batchprocessing/addValueToTypeInBatchId", {id,type, value});
        }else{
          this.validationMessage = "Select a program";
        }
        this.$forceUpdate();
        this.validating = false;   
      }
    },
    addTypeToBatchId(id, type){
      this.$store.commit("batchprocessing/addTypeToBatchId", {type, id});
      this.$forceUpdate();
    },
    
    deleteValueFromTypeInBatchId(id, type, value){
      this.$store.commit("batchprocessing/deleteValueFromTypeInBatchId", {id,type, value});
      this.$forceUpdate();
    },
    deleteBatch(id){
      this.$store.commit("deleteStudentBatch", id);
    },
    clearBatchDetails: function (id) {
      this.$store.commit("batchprocessing/clearBatchDetails", id);
    },
    clearBatchGroupDetails: function (id) {
      this.$store.commit("batchprocessing/clearBatchGroupDetails", id);
    },    
    // newBatchJob() {
    //   let batchDetail = { details: {what: 'what' +this.tabCounter, who: 'who'+this.tabCounter, credential: "", psiYear: this.getCurrentPSIYear()}, students: [{}], schools:[{}], districts: [{}], programs:[{}], psi:[{}],blankTranscriptDetails:[{}],blankCertificateDetails:[{}]};
    //   let id = "job-" + this.tabCounter;
    //   this.$store.commit("batchprocessing/editBatchDetails",  {batchDetail, id});
    //   this.$store.commit("batchprocessing/addBatchJob", id);
    //     requestAnimationFrame(() => {
    //       this.selectedTab = this.tabs.length;
    //     })
    //     console.log("new batch")
    // },
    editBatchJob(type,event){
      this.$nextTick(() => {
          let id =this.jobId;
          let batchDetail = this.batch;
          //change the value     
          if(type == "what" && batchDetail.details[type] != event){
            this.clearBatchDetails(id)
            if(event == 'PSIRUN'){
              batchDetail.details['who'] = 'PSI';
            }
          }
          if(type == "who" && batchDetail.details[type] != event){
            this.clearBatchGroupDetails(id)
           
        
          }   
          if(type == "credential" && batchDetail.details[type] != event){
              batchDetail.details['blankCertificateDetails'] = []
              batchDetail.details['blankTranscriptDetails'] = []
          }
          if(type == 'allPsi' && event){
            batchDetail.psi = [{"value": 'all', "psiName":"ALL", "city": "ALL"}]
            this.$store.commit("batchprocessing/editBatchDetails", {batchDetail, id});
          }
          else if(type == 'allPsi' && !event){
            batchDetail.psi = [{}]
            this.$store.commit("batchprocessing/editBatchDetails", {batchDetail, id});
          }          
          batchDetail.details[type] = event; 
          this.$store.commit("batchprocessing/editBatchDetails", {batchDetail, id});

          this.$forceUpdate();
      })
    },
    getCertificateTypes() {
      GraduationReportService.getCertificateTypes()
        .then((response) => {
          this.certificateTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.makeToast("ERROR " + error.response.statusText, "danger")
        });
    },
    getTranscriptTypes() {
      GraduationReportService.getTranscriptTypes()
        .then((response) => {
          this.transcriptTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
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
    label: String,
    group: String,
    fields: Array,
    items: Array
  },  
  computed: {
    ...mapGetters({  
      tabContent: "batchprocessing/getBatchDetails",
      programOptions: "app/getProgramOptions",      
      userFullName: "auth/userFullName",
    }),
    batch() {
      return this.tabContent[this.jobId]
    },
    inputfields: function(){
 
      return "hello world";

    }
  },
};
</script>
<style scoped>
  input{
    border-radius: 0px;
  }
</style>
