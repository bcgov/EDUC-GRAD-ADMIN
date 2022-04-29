<template>
  <div>
    <b-overlay :show='processingBatch'>
      <div class="row">
        <div class="col-12 col-md-3">
          <div class="m-0">
            <label class="font-weight-bold">Run Type</label>
            <b-form-select
              id="inline-form-select-type"
              class="mb-2 mr-sm-2 mb-sm-0"
              :options="[{ text: 'Choose...', value: null },{ text: 'TVRRUN', value: 'TVRRUN' },{ text: 'REGALG', value: 'REGALG' },{ text: 'DISTRUN', value: 'DISTRUN' }]"
              :value="tabContent[jobId].details['what']"     
              @change="editBatchJob(jobId,'what', $event)"       
            ></b-form-select>
          </div>
          <div class="mt-2" v-if="tabContent[jobId].details['what'] == 'DISTRUN'">
            <label class="font-weight-bold">Credential Type</label>
            <b-form-select
                id="inline-form-select-audience"
                class="mb-2 mr-sm-2 mb-sm-0"
                :options="[{ text: 'Choose...', value: null }, { text: 'Blank certificate print', value: 'Blank certificate print' }, { text: 'Reprint certificate – no principal signature block', value: 'Reprint certificate – no principal signature block' },{ text: 'Original certificate – with principal signature block', value: 'OC' },{ text: 'Blank transcript print', value: 'Blank transcript print' },{ text: 'Transcript', value: 'OT' }]"
                :value="tabContent[jobId].details['credential']"     
                @change="editBatchJob(jobId,'credential', $event)"       
              ></b-form-select>
          <b-card v-if="tabContent[jobId].details['credential']=='Blank transcript print'" class="mt-3 px-0" header="Blank Transcript Details">
            <b-form-checkbox-group
              multiple
              stacked
              :select-size="10"
              id="inline-form-select-audience"
              class="mb-2 mr-sm-2 mb-sm-0"
              :options="transcriptTypes"
              value-field="code"
              text-field="description"
              :value="tabContent[jobId].details['credentialDetails']"     
              @change="editBatchJob(jobId,'blankTranscriptDetails', $event)"      
            ></b-form-checkbox-group>
          </b-card>  
          <b-card v-if="tabContent[jobId].details['credential']=='Blank certificate print'" class="mt-3 px-0" header="Blank Certificate Details">
            <b-form-checkbox-group
                multiple
                stacked
                :select-size="10"
                id="inline-form-select-audience"
                class="mb-2 mr-sm-2 mb-sm-0"
                :options="certificateTypes"
                value-field="code"
                text-field="label"
                :value="tabContent[jobId].details['credentialDetails']"     
                @change="editBatchJob(jobId,'blankCertificateDetails', $event)"      
              ></b-form-checkbox-group>
            </b-card>                       
          </div>                                                      
        </div>
        <div class="col-9">

          <div class="m-0 p-0 col-2">
            <label class="font-weight-bold">Group</label>
            <b-form-select
                id="inline-form-select-audience"
                class="mb-2 mr-sm-2 mb-sm-0"
                :options="[{ text: '', value: null }, 'Student', 'School', 'District', 'Program']"
                :value="tabContent[jobId].details['who']"     
                @change="editBatchJob(jobId,'who', $event)"  
                v-if="tabContent[jobId].details['credential'] != 'Blank certificate print' && tabContent[jobId].details['credential'] != 'Blank transcript print' "     
              ></b-form-select>
              <b-form-select
                id="inline-form-select-audience"
                class="mb-2 mr-sm-2 mb-sm-0"
                :options="[{ text: '', value: null }, 'School', 'Ministry of Advanced Education']"
                :value="tabContent[jobId].details['who']"     
                @change="editBatchJob(jobId,'who', $event)"       
                v-else
              ></b-form-select>                    
          </div>
                    
          <div class="p-0 mt-3 col-3" v-if="tabContent[jobId].details['who'] == 'District'">
            <label class="font-weight-bold">District Category</label>
            <b-form-select
              id="inline-form-select-type"
              class="col-12 my-2"
              :options="[{ text: 'Choose...', value: null }, { text: '01 Public', value: '01' }, { text: '02 Independent', value: '02' }, { text: '03 Federally Operated Band School', value: '03' }, { text: '04 Yukon School', value: '04' },{ text: '05 Offshore', value: '05' }]"
              :value="tabContent[jobId].districts['categoryCode']"
              @change="editBatchJob(jobId,'categoryCode', $event)"
            ></b-form-select>
          </div>
          <div class="mt-1" v-if="tabContent[jobId].details['what'] == 'DISTRUN'">
            <label class="font-weight-bold">Copies</label>
            <b-form-input
                type="number"
                id="inline-form-select-audience"
                class="mb-2 mr-sm-2 mb-sm-0"
                :value="1"     
                @change="editBatchJob(jobId,'copies', $event)"       
              ></b-form-input>
          </div>  
          <div class="mt-1" v-if="tabContent[jobId].details['what'] == 'DISTRUN'">
            <label class="font-weight-bold">Where</label>
            <b-form-select
              id="inline-form-select-type"
              class="col-12 my-2"
              :options="[{ text: 'Choose...', value: null }, 'Download', 'BC Mail']"
              @change="editBatchJob(jobId,'where', $event)"
            ></b-form-select>
          </div>          

      <div v-if="tabContent[jobId].details['who']=='District'" class="float-left col-12 px-0">


        <b-card class="mt-3 px-0" header="Include Districts">
            <b-alert dismissible v-if="validationMessage" :show="validationMessage" variant="danger">{{validationMessage}}</b-alert>

        <div class="row col-12">
            <div class="col-2 p-2"><strong>Code</strong></div>
            <div class="col-4 p-2"><strong>District</strong></div>
            <div class="col-4 p-2"><strong>City</strong></div>

        </div>
        <div v-for="(district, index) in tabContent[jobId].districts" :key="index" class="row pl-3 mb-1">
          <div v-if="!district.districtName" class="row col-12">
            <b-form-input type="number" v-model="district.value" class="col-2"/>
            <b-form-input show=false disabled v-model="district.districtName" :ref="'districtName' + jobId + index" class="col-4"/>
            <b-form-input show=false disabled v-model="district.city" :ref="'districtCity' + jobId + index" class="col-4"/>
            <div v-if="index == tabContent[jobId].districts.length-1" class="col-2">
              <b-button  class="btn btn-primary w-100" @click="addValueToTypeInBatchId(jobId,'districts',district.value,index)">
              <b-spinner small v-if="validating"></b-spinner> Add
              </b-button>   
            </div>
          </div>
          <div class="row col-12">
            <div v-if="district.districtName" class="col-2">{{district.value}}</div>
            <div v-if="district.districtName" class="col-4">{{district.districtName}}</div>
            <div v-if="district.districtName" class="col-4">{{district.city}}</div>

            <div v-if="index != tabContent[jobId].districts.length-1" class="col-2" ><b-button  class="btn btn-primary w-100" @click="deleteValueFromTypeInBatchId(jobId, 'districts',district.value)">
              Remove
            </b-button>
            </div>
          </div>
        </div>
      <pre>TEST districts: 061 062 063</pre>

          
        </b-card> 
      </div>
        <b-card v-if="tabContent[jobId].details['who']=='Student'" class="mt-3 px-0" header="Include Students">
        <b-alert dismissible v-if="validationMessage" :show="validationMessage" variant="danger">{{validationMessage}}</b-alert>
        <div class="row col-12 border-bottom mb-3">
          <div class="col-2"><strong>PEN</strong></div>
          <div class="col-3"><strong>Name</strong></div>
          <div class="col-2"><strong>Birthdate</strong></div>
          <div class="col-3"><strong>School of Record</strong></div>   
        </div>
        <div v-for="(pen, index) in tabContent[jobId].students" :key="index" class="row pl-3 mb-1">
          <div v-if="!pen.dob" class="row col-12">
            <b-form-input type="number" v-model="pen.value" class="col-2"/>
            <b-form-input show=false disabled v-model="pen.name" :ref="'pen'+ jobId + index" class="col-3"/>
            <b-form-input show=false disabled v-model="pen.dob" :ref="'dob'+ jobId + index" class="col-2"/>
            <b-form-input show=false disabled v-model="pen.school" :ref="'school'+ jobId + index" class="col-3"/>
            <div v-if="index == tabContent[jobId].students.length-1" class="col-2">
              <b-button  class="btn btn-primary w-100" @click="addValueToTypeInBatchId(jobId,'students',pen.value,index)">
              <b-spinner small v-if="validating"></b-spinner> Add
              </b-button>   
            </div>
          </div>
          <div class="row col-12">
            <div v-if="pen.dob" class="col-2">{{pen.value}}</div>
            <div v-if="pen.dob" class="col-3">{{pen.name}}</div>
            <div v-if="pen.dob" class="col-2">{{pen.dob}}</div>
            <div v-if="pen.dob" class="col-3"> {{pen.school}}</div>   

            <div v-if="index != tabContent[jobId].students.length-1" class="col-2" ><b-button  class="btn btn-primary w-100" @click="deleteValueFromTypeInBatchId(jobId, 'students',pen.value)">
              Remove
            </b-button>
            </div>
          </div>
        </div>
      <pre>Test PENS: 106900004     124304700      126604461       101005700</pre>
      </b-card>            
      <b-card v-if="tabContent[jobId].details['who']=='School'" class="mt-3 px-0" header="Include Schools">
        <b-alert dismissible v-if="validationMessage" :show="validationMessage" variant="danger">{{validationMessage}}</b-alert>
        <div class="row col-12 border-bottom mb-3">
            <div class="col-2"><strong>Mincode</strong></div>
            <div class="col-3"><strong>School Name</strong></div>
            <div class="col-2"><strong>District Name</strong></div>
            <div class="col-3"><strong>Address</strong></div>   
        </div>
        <div v-for="(school, index) in tabContent[jobId].schools" :key="index" class="row pl-3 mb-1">
          <div v-if="!school.schoolName" class="row col-12">
            <b-form-input type="number" v-model="school.value" class="col-2"/>
            <b-form-input show=false disabled v-model="school.schoolName" :ref="'schoolName' + jobId + index" class="col-3"/>
            <b-form-input show=false disabled v-model="school.districtName" :ref="'districtName'+ jobId + index" class="col-2"/>
            <b-form-input show=false disabled v-model="school.address" :ref="'address'+ jobId + index" class="col-3"/>
            <div v-if="index == tabContent[jobId].schools.length-1" class="col-2">
              <b-button  class="btn btn-primary w-100" @click="addValueToTypeInBatchId(jobId,'schools',school.value,index)">
              <b-spinner small v-if="validating"></b-spinner> Add
              </b-button>   
            </div>
          </div>
          <div class="row col-12">
            <div v-if="school.schoolName" class="col-2">{{school.value}}</div>
            <div v-if="school.schoolName" class="col-3">{{school.schoolName}}</div>
            <div v-if="school.districtName" class="col-2">{{school.districtName}}</div>
            <div v-if="school.address" class="col-3"> {{school.address}}</div>   

            <div v-if="index != tabContent[jobId].schools.length-1" class="col-2" ><b-button  class="btn btn-primary w-100 w-100" @click="deleteValueFromTypeInBatchId(jobId, 'schools',school.value)">
              Remove
            </b-button>
            </div>
          </div>
        </div>
      <pre>TEST Schools: 04343000 04399143 02222022 06161064 06161049</pre>

      </b-card>            
      <b-card v-if="tabContent[jobId].details['who']=='Program'" class="mt-3 px-0" header="Include Programs">
      <b-alert v-if="validationMessage" show variant="danger">{{validationMessage}}</b-alert>

      <b-alert dismissible v-if="validationMessage" :show="validationMessage" variant="danger">{{validationMessage}}</b-alert>
        <div class="row col-12 border-bottom mb-3">
            <div class="col-2"><strong>Program</strong></div>
        </div>
        <div v-for="(program, index) in tabContent[jobId].programs" :key="index" class="row pl-3 mb-1">
          <div v-if="!program.value" class="row col-12">

            <b-form-select
              id="inline-form-select-type"
              class="col-2"
              :options="programOptions"
              value-field="programCode"
              text-field="programCode"
              v-model="program.value"
            ></b-form-select>
            <div v-if="index == tabContent[jobId].programs.length-1" class="col-2">
              <b-button :disabled='validating' class="btn btn-primary w-100" @click="addValueToTypeInBatchId(jobId,'programs',program.value,index)">
              <b-spinner small v-if="validating"></b-spinner> Add
              </b-button>   
            </div>
          </div>
          <div class="row col-12">
            <div v-if="program.value" class="col-2">{{program.value}}</div>
            <div v-if="program.programName" class="col-3">{{program.programName}}</div>
            <div v-if="program.districtName" class="col-2">{{program.districtName}}</div>
            <div v-if="program.address" class="col-3"> {{program.address}}</div>   

            <div v-if="index != tabContent[jobId].programs.length-1" class="col-2" ><b-button  class="btn btn-primary w-100 w-100" @click="deleteValueFromTypeInBatchId(jobId, 'programs',program.value)">
              Remove
            </b-button>
            </div>
          </div>
        </div>

      </b-card>
      </div>       
      </div>
      <div class="my-3">
        <b-button size="sm" variant="danger" class="btn btn-danger float-right col-2 p-2" @click="cancelBatchJob(jobId)">
          Cancel
        </b-button>
        <b-button size="sm" variant="primary" class="btn btn-primary w-100 float-right col-2 p-2" @click="runBatch(jobId)">
          Run Batch
        </b-button>
    </div>
    </b-overlay>
  </div>
</template>
<script>
import TRAXService from "@/services/TRAXService.js";
import SchoolService from "@/services/SchoolService.js";
import StudentService from "@/services/StudentService.js";
import GraduationCommonService from "@/services/GraduationCommonService.js";
import {
  mapGetters
} from "vuex";
export default {
  data: function () {
    return {
      processingBatch: false,
      validationMessage: "",
      validating: false,
      certificateTypes:[],
      transcriptTypes:[],
    }
  },
  created() {

    this.transcriptTypes = this.getTranscriptTypes();
    this.certificateTypes = this.getCertificateTypes();
  },
  methods: {
    runBatch(id){
      this.$emit("runbatch",id)
    },
    cancelBatchJob(id){
      //Use the parents method to close and clear a batch job by ID
      this.$emit("cancelBatchJob",id)
    },
    addValueToTypeInBatchId(id, type, value, valueIndex){
      this.validationMessage = "";
      if(type == "schools"){
          this.validating = true;
          SchoolService.getSchoolInfo(value,this.token).then(
          (response) => {
            if(response.data.minCode){
              this.$store.commit("addValueToTypeInBatchId", {id,type, value});
              this.$refs['schoolName' + id + valueIndex][0].updateValue(response.data.schoolName);        
              this.$refs['districtName' + id + valueIndex][0].updateValue(response.data.districtName);        
              this.$refs['address' + id + valueIndex][0].updateValue(response.data.address1);        
            }else{
               this.validationMessage = value + " is not a valid School"
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
        StudentService.getStudentByPen(value,this.token).then(
        (response) => {
          if(response.data.length > 0){
            this.$store.commit("addValueToTypeInBatchId", {id,type, value});
            this.$refs['pen' + id + valueIndex][0].updateValue(response.data[0].usualFirstName + " " + (response.data[0].usualMiddleNames?response.data[0].usualMiddleNames+ " ":"") + response.data[0].usualLastName);        
            this.$refs['dob' + id + valueIndex][0].updateValue(response.data[0].dob);        
            this.$refs['school' + id + valueIndex][0].updateValue(response.data[0].schoolOfRecordName);        
          }else{
              this.validationMessage = value + " is not a valid PEN"
              this.deleteValueFromTypeInBatchId(id, type, value);
              this.addTypeToBatchId(id, type);
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
          TRAXService.getDistrict(value,this.token).then(
          (response) => {
            if(response.data){
              this.$store.commit("addValueToTypeInBatchId", {id,type, value});
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
      if(type == "programs"){
        this.validating = true;
        
        if(value){
          this.$store.commit("addValueToTypeInBatchId", {id,type, value});
        }else{
          this.validationMessage = "Select a program";
        }
        this.$forceUpdate();
        this.validating = false;   
      }
    },
    addTypeToBatchId(id, type){
      this.$store.commit("addTypeToBatchId", {type, id});
      this.$forceUpdate();
    },
    
    deleteValueFromTypeInBatchId(id, type, value){
      this.$store.commit("deleteValueFromTypeInBatchId", {id,type, value});
      this.$forceUpdate();
    },
    deleteBatch(id){
      this.$store.commit("deleteStudentBatch", id);
    },
    clearBatchDetails: function (id) {
      this.$store.commit("clearBatchDetails", id);
    },
    clearBatchGroupDetails: function (id) {
      this.$store.commit("clearBatchGroupDetails", id);
    },    
    newBatchJob() {
      let batchDetail = { details: {what: 'what' +this.tabCounter, who: 'who'+this.tabCounter, credential: ""}, students: [{}], schools:[{}], districts: [{}], programs:[{}],blankTranscriptDetails:[{}],blankCertificateDetails:[{}]};
      let id = "job-" + this.tabCounter;
      
      this.$store.commit("editBatchDetails",  {batchDetail, id});
      this.$store.commit("addBatchJob", id);
        requestAnimationFrame(() => {
          this.selectedTab = this.tabs.length;
        })
    },
    editBatchJob(id,type,event){
      let batchDetail = this.tabContent[id];
      //change the value
      if(type == "what" && batchDetail.details[type] != event){
        this.clearBatchDetails(id)
      }
      if(type == "who" && batchDetail.details[type] != event){
        
        this.clearBatchGroupDetails(id)
       
      }   
      batchDetail.details[type] = event;   
      if(type == "credential" && event == 'Blank certificate print'){
        if(batchDetail.details[type] != event){
          this.clearBatchCredentialDetails(id);
        }
        batchDetail.details['who'] = '';
        
      }
      this.$store.commit("editBatchDetails", {batchDetail, id});
      this.$forceUpdate();
    },
    getCertificateTypes() {
      GraduationCommonService.getCertificateTypes(this.token)
        .then((response) => {
          this.certificateTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.makeToast("ERROR " + error.response.statusText, "danger")
        });
    },
    getTranscriptTypes() {
      GraduationCommonService.getTranscriptTypes(this.token)
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
  },  
  computed: {
    ...mapGetters({  
      tabCounter: "getBatchCounter",
      tabContent: "getBatchDetails",
      token: "getToken",
      programOptions: "getProgramOptions"      

    }),
  },
};
</script>
<style scoped>
  input{
    border-radius: 0px;
  }
</style>
