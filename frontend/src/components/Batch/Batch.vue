<template>
  <div>
    <b-overlay :show='processingBatch'>
      {{tabContent['job-1']}}
      <div class="row">
        <div class="col-12 col-md-3 border-right">
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
                :options="[{ text: 'Choose...', value: null }, { text: 'Blank certificate print', value: 'Blank certificate print' }, { text: 'Reprint certificate – no principal signature block', value: 'RC' },{ text: 'Original certificate – with principal signature block', value: 'OC' },{ text: 'Blank transcript print', value: 'Blank transcript print' },{ text: 'Transcript', value: 'OT' }]"
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
            <label class="font-weight-bold pt-1">Group</label>
            <b-form-select
              id="inline-form-select-audience"
              class="mb-2 mr-sm-2 mb-sm-0"
              :options="[{ text: '', value: null }, 'Student', 'School', 'District', 'Program', 'PSI']"
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
          <div v-if="tabContent[jobId].details['who'] !='Student'" class="p-0 mt-3 ">
            <label class="font-weight-bold p-0 m-0 row">Grad Date</label>
            <b-form-select
              id="inline-form-select-audience"
              class="mb-2 mr-sm-2 mb-sm-0 col-3"
              :options="[{ text: 'Current Students', value: 'Current Students' }, { text: 'Date Range', value: 'Date Range' }]"
              :value="tabContent[jobId].details['gradDate']"     
              @change="editBatchJob(jobId,'gradDate', $event)"    
            ></b-form-select>    
              <div class="date-ranges col-12 row" v-if="tabContent[jobId].details['gradDate']=='Date Range'">            
                <div class="float-left col-3 m-0 p-0" >
                  <strong><label class="pt-1">Grad Start Date</label></strong>
                  <b-input-group class="mb-3">
                    <b-form-input
                      id="gradDateFromInput"
                      v-model="gradDateFrom"
                      type="text"
                      placeholder="YYYY-MM-DD"
                      autocomplete="off"
                      @input="editBatchJob(jobId,'gradDateFrom', $event)"    
                    ></b-form-input>
                    <b-input-group-append>
                      <b-form-datepicker
                        v-model="gradDateFrom"
                        button-only
                        right
                        locale="en-US"
                        @input="editBatchJob(jobId,'gradDateFrom', $event)"    
                      ></b-form-datepicker>
                    </b-input-group-append>
                  </b-input-group>
                </div>

                <div class="float-left col-3">
                  <strong><label class="pt-1">Grad End Date</label></strong>
                  <b-input-group class="mb-3">
                    <b-form-input
                      id="gradDateToInput"
                      v-model="gradDateTo"
                      type="text"
                      placeholder="YYYY-MM-DD"
                      autocomplete="off"
                      @input="editBatchJob(jobId,'gradDateTo', $event)"    
                    ></b-form-input>
                    <b-input-group-append>
                      <b-form-datepicker
                        v-model="gradDateTo"
                        button-only
                        right
                        locale="en-US"
                        aria-controls="example-input"
                        @input="editBatchJob(jobId,'gradDateTo', $event)"    
                      ></b-form-datepicker>
                    </b-input-group-append>
                  </b-input-group>
                </div>
              </div>
           </div>          
                    
          <div class="p-0 mt-3 col-3" v-if="tabContent[jobId].details['who'] == 'District'">
            <label class="font-weight-bold">District Category</label>
            <b-form-select
              id="inline-form-select-type"
              class="col-12 my-2"
              :options="[{ text: 'Choose...', value: null }, { text: '01 Public', value: '01' }, { text: '02 Independent', value: '02' }, { text: '03 Federally Operated Band School', value: '03' }, { text: '04 Yukon School', value: '04' },{ text: '09 Offshore', value: '09' }]"
              :value="tabContent[jobId].districts['categoryCode']"
              @change="editBatchJob(jobId,'categoryCode', $event)"
            ></b-form-select>
          </div>
          <div class="p-0 mt-3 col-1" v-if="tabContent[jobId].details['what'] == 'DISTRUN'">
            <label class="font-weight-bold">Copies</label>
            <b-form-input
                type="number"
                id="inline-form-select-audience"
                class="mb-2 mr-sm-2 mb-sm-0"
                :value="1"     
                @change="editBatchJob(jobId,'copies', $event)"       
              ></b-form-input>
          </div>  
          <div class="mt-1 col-1 p-0" v-if="tabContent[jobId].details['what'] == 'DISTRUN'">
            <label class="font-weight-bold">Where</label>
            <b-form-select
              id="inline-form-select-type"
              class="mb-2 mr-sm-2 mb-sm-0"
              :options="[{ text: 'Download', value: 'localDownload' }, 'BC Mail', 'User']"
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
      <div v-if="tabContent[jobId].details['who']=='PSI'" class="float-left col-12 px-0">
        <b-card class="mt-3 px-0" header="Include Post Secondary Institutions">
            <b-alert dismissible v-if="validationMessage" :show="validationMessage" variant="danger">{{validationMessage}}</b-alert>

        <div class="row col-12">
            <div class="col-2 p-2"><strong>Code</strong></div>
            <div class="col-4 p-2"><strong>Name</strong></div>
            <div class="col-4 p-2"><strong>City</strong></div>

        </div>
        <div v-for="(psi, index) in tabContent[jobId].psi" :key="index" class="row pl-3 mb-1">
          <div v-if="!psi.psiName" class="row col-12">
            <b-form-input type="number" v-model="psi.value" class="col-2"/>
            <b-form-input show=false disabled v-model="psi.psiName" :ref="'psiName' + jobId + index" class="col-4"/>
            <b-form-input show=false disabled v-model="psi.city" :ref="'psiCity' + jobId + index" class="col-4"/>
            <div v-if="index == tabContent[jobId].psi.length-1" class="col-2">
              <b-button  class="btn btn-primary w-100" @click="addValueToTypeInBatchId(jobId,'psi',psi.value,index)">
              <b-spinner small v-if="validating"></b-spinner> Add
              </b-button>   
            </div>
          </div>
          <div class="row col-12">
            <div v-if="psi.value" class="col-2">{{psi.value}}</div>
            <div v-if="psi.psiName" class="col-4">{{psi.psiName}}</div>
            <div v-if="psi.city" class="col-4">{{psi.city}}</div>

            <div v-if="index != tabContent[jobId].psi.length-1" class="col-2" ><b-button  class="btn btn-primary w-100" @click="deleteValueFromTypeInBatchId(jobId, 'psi',psi.value)">
              Remove
            </b-button>
            </div>
          </div>
        </div>
      <pre>TEST PSI: 201</pre>

          
        </b-card> 
      </div>      
      
        <b-card v-if="tabContent[jobId].details['who']=='Student'" class="mt-3 px-0" header="Include Students">
        <b-alert dismissible v-if="validationMessage" :show="validationMessage" variant="danger">{{validationMessage}}</b-alert>
        <div class="row col-12 border-bottom mb-3">
          <div class="col-2"><strong>PEN</strong></div>
          <div class="col-3"><strong>Name</strong></div>
          <div class="col-2"><strong>Birthdate</strong></div>
          <div class="col-1"><strong>Status</strong></div>
          <div class="col-2"><strong>School of Record</strong></div>   
        </div>
        <div v-for="(pen, index) in tabContent[jobId].students" :key="index" class="row pl-3 mb-1">
          <div v-if="!pen.dob" class="row col-12">
            <b-form-input type="number" v-model="pen.value" class="col-2"/>
            <b-form-input show=false disabled v-model="pen.name" :ref="'pen'+ jobId + index" class="col-3"/>
            <b-form-input show=false disabled v-model="pen.dob" :ref="'dob'+ jobId + index" class="col-2"/>
            <b-form-input show=false disabled v-model="pen.studentStatus" :ref="'student-status'+ jobId + index" class="col-1"/>            
            <b-form-input show=false disabled v-model="pen.school" :ref="'school'+ jobId + index" class="col-2"/>
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
            <div v-if="pen.dob" class="col-1">{{pen.studentStatus}}</div>
            <div v-if="pen.dob" class="col-2"> {{pen.school}}</div>   

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
        <b-button v-if="tabContent[jobId].details['where'] == 'BC Mail' || tabContent[jobId].details['where'] == 'User'" v-b-modal.batch-modal size="sm" variant="primary" class="btn btn-primary w-100 float-right col-2 p-2">
          Schedule/Run Batch
        </b-button>
        <b-button v-else @click="runBatch(jobId)" size="sm" variant="primary" class="btn btn-primary w-100 float-right col-2 p-2">
          Download
        </b-button>
        <b-modal id="batch-modal" :title="'RUN ' + jobId " @show="resetModal" @hidden="resetModal" ok-title="Confirm" :ok-disabled="disableConfirm()" @ok="runBatch(jobId)">
          <b-form-group label="Batch Run" v-slot="{ ariaDescribedby }"> 
            <b-form-radio v-model="batchRunTime" :aria-describedby="ariaDescribedby" name="batch-runtime-options" value="Run Now">Run Now</b-form-radio>
            <b-form-radio v-model="batchRunTime" :aria-describedby="ariaDescribedby" name="batch-runtime-options" value="Run Later">Run Later</b-form-radio>
                <b-form-group v-if="batchRunTime == 'Run Later'" label="Schedule" v-slot="{ ariaDescribedby }">
                  <b-form-radio v-model="batchRunSchedule" :aria-describedby="ariaDescribedby" name="schedule-options" value="N">Tonight at 6:30PM</b-form-radio>
                  <b-form-radio v-model="batchRunSchedule" :aria-describedby="ariaDescribedby" name="schedule-options" value="W">Weekend Batch - Saturday 12:00PM</b-form-radio>
                  <b-form-radio v-model="batchRunSchedule" :aria-describedby="ariaDescribedby" name="schedule-options" value="M">Tommorow at 6:30AM</b-form-radio>
                  <b-form-radio v-model="batchRunSchedule" :aria-describedby="ariaDescribedby" name="schedule-options" value="Custom">Custom</b-form-radio>
                    <div class="pl-4" v-if="batchRunSchedule == 'Custom'">
                      <!-- <label for="batch-datepicker">Choose a date:</label> -->

                      <b-form-datepicker id="batch-datepicker" v-model="batchRunCustomDate" class="mb-2"></b-form-datepicker>
                      <b-form-timepicker
                        id="timepicker-buttons"
                        v-model='batchRunCustomTime'
                        now-button
                        reset-button
                        locale="en"
                      ></b-form-timepicker>
                         <!-- <b-form-input
                            id="bforminput"
                            v-model="cronTime"
                          ></b-form-input> -->
                    </div>
                </b-form-group>
          </b-form-group>
        </b-modal>
    </div>
    </b-overlay>
    
  </div>
</template>
<script>
import TRAXService from "@/services/TRAXService.js";
import SchoolService from "@/services/SchoolService.js";
import StudentService from "@/services/StudentService.js";
import GraduationReportService from "@/services/GraduationReportService.js";
import {
  mapGetters
} from "vuex";
export default {
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
      gradDateTo: ""
    }
  },
  created() {

    this.transcriptTypes = this.getTranscriptTypes();
    this.certificateTypes = this.getCertificateTypes();
  },
  methods: {
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
    newBatchJob() {
      let batchDetail = { details: {what: 'what' +this.tabCounter, who: 'who'+this.tabCounter, credential: ""}, students: [{}], schools:[{}], districts: [{}], programs:[{}], psi:[{}],blankTranscriptDetails:[{}],blankCertificateDetails:[{}]};
      let id = "job-" + this.tabCounter;
      
      this.$store.commit("batchprocessing/editBatchDetails",  {batchDetail, id});
      this.$store.commit("batchprocessing/addBatchJob", id);
        requestAnimationFrame(() => {
          this.selectedTab = this.tabs.length;
        })
    },
    editBatchJob(id,type,event){
      this.$nextTick(() => {

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
  },  
  computed: {
    ...mapGetters({  
      tabCounter: "batchprocessing/getBatchCounter",
      tabContent: "batchprocessing/getBatchDetails",
      programOptions: "app/getProgramOptions"      

    }),
  },
};
</script>
<style scoped>
  input{
    border-radius: 0px;
  }
</style>
