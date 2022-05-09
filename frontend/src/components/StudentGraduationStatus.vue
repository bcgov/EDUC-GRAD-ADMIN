<template>
  <div>
    <div class="row">
      <div class="col-12 m-0 p-2">
        <b-card  header="Graduation Information" class="col-12 p-0" no-body v-if="studentGradStatus != 'not loaded' && !hasGradStatus">
          <b-card-body>
            <b-card-text>
              <div v-if="!hasGradStatus">
                {{studentFullName.legalFirstName }} found on the PEN database <strong>but does not have a GRAD system record</strong>
              </div>
            </b-card-text>
          </b-card-body>
        </b-card>
      </div>
    </div>
    <!-- GRAD Status -->
    <div class="row px-2">
      <div class="col-12 px-2 col-xl-4 col-lg-7">
          <div class="graduation-status">
          <b-card
            no-body
            header="GRAD status"
          >
            <b-card-text class="p-3">         
                <b-button-group v-if="this.role =='administrator'" class="gradstatus-actions float-right">
                  <div v-if="!showEdit">
                    <b-link href="#" class="edit" v-on:click="editGradStatus" size="sm" variant="primary">
                        Edit 
                    </b-link>
                  </div>
                  <div v-if="showEdit">
                    <b-button-group>
                      <b-button  :disabled="disableSaveButton" v-on:click="saveGraduationStatus(studentId)" size="sm" variant="primary">Save</b-button>

                      <b-button v-on:click="cancelGradStatus"  size="sm" variant="outline-primary">Cancel</b-button>
                    </b-button-group>
          
                  </div>
                </b-button-group>
                <div v-if="studentGradStatus && studentGradStatus.studentStatus == 'N' && showEdit">
                  <b-alert show variant="warning" class="p-3 mb-1">
                    <h4 class="alert-heading">Student status: Not active</h4>
                    <p class="locked-message">
                      This student's status is set to 'Not active'. Re-activate their record by setting their 'Student status' to 'Active' if they are enrolled in a school.
                    </p>
                  </b-alert>
                </div>    
                <div v-else-if="studentGradStatus && studentGradStatus.studentStatus == 'TER' && showEdit">
                  <b-alert show variant="warning" class="p-3 mb-1">
                    <h4 class="alert-heading">Student status: Terminated</h4>
                    <p class="locked-message">
                      This student's status is set to 'Terminated'. Re-activate their record by setting their 'Student status' to 'Active' if they are enrolled in a school.
                    </p>
                  </b-alert>
                </div>    
                <div v-else-if="studentGradStatus && studentGradStatus.studentStatus == 'DEC' && showEdit">
                  <b-alert show variant="info" class="p-3 mb-1">
                    <h4 class="alert-heading">Student status: Deceased</h4>
                    <p class="locked-message">
                      This student's status is set to 'Deceased'. Their data cannot be changed.
                    </p>
                  </b-alert>
                </div>          
                <div v-else-if="studentGradStatus && studentGradStatus.studentStatus == 'MER' && showEdit">
                  <b-alert show variant="info" class="p-3 mb-1">
                    <h4 class="alert-heading">Student status: Merged</h4>
                    <p class="locked-message">
                      This student's status is set to 'Merged'. Their data cannot be changed.
                    </p>
                  </b-alert>
                </div>          
                <div v-else-if="studentGradStatus && recalculateFlag">
                  <b-alert show variant="info" class="p-3 mb-1">
                    <h4 class="alert-heading">Grad Status has been updated</h4>
                    <p class="locked-message">
                      Run the graduation algorithm - graduate student to update grad status OR reports only to update student credentials.
                    </p>
                  </b-alert>
                </div>                                                                              
                <table  role="presentation" aria-label="edit grad status" class="table  table-hover table-sm" >
                  <tbody>
                  <tr v-if="!showEdit">
                    <td class="w-50"><strong>Program: </strong></td>
                    <td class="w-50"><span v-b-tooltip.hover title="Program">{{ studentGradStatus.program }}</span></td>
                  </tr>
                  <tr v-if="showEdit">
                    <td class="w-50"><strong>Program: </strong>
                      <div v-if="editedGradStatus.program == '1950'">
                        <div class="form-validation-message text-danger" v-if="!(editedGradStatus.studentGrade == 'AD' || editedGradStatus.studentGrade == 'AN')">Student grade should be one of <strong>AD or AN</strong> if the student program is 1950</div>
                      </div> 
                      <div v-if="editedGradStatus.program != studentGradStatus.program">
                        <div v-if="programChangeWarning" class="form-validation-message text-danger">Warning, any optional programs associated with the original program will be <strong>deleted</strong>. You must add back in any pertinent optional programs once you have saved the changes to Program.</div>
                      </div>   
                    </td>
                    <td class="w-50"><b-form-select :disabled="disableInput" size="sm" v-model="editedGradStatus.program" :options="programOptions" value-field="programCode" text-field="programCode"></b-form-select></td>                   
                  </tr>
                  <tr v-if="!showEdit">
                    <td><strong>Program completion date: </strong></td>
                    <td>{{ studentGradStatus.programCompletionDate }}</td>
                  </tr>          
                  <tr v-if="showEdit">
                    <td v-if="editedGradStatus.program != 'SCCP'">
                      <strong>Program completion date: (YYYY/MM)</strong><br>
                      <div v-if="programCompletionDateRangeError" class="form-validation-message text-danger" >The program completion date is out of date range&nbsp;&nbsp;<i class="fas fa-exclamation-triangle" aria-hidden="true"></i></div>
                    </td>
                    <td v-if="editedGradStatus.program == 'SCCP'">
                      <strong>Program completion date: (YYYY/MM/DD)</strong><br>
                      <!-- <div v-if="programCompletionDateRangeError" class="form-validation-message text-danger" >The program completion date is out of date range&nbsp;&nbsp;<i class="fas fa-exclamation-triangle" aria-hidden="true"></i></div> -->
                    </td>
                    <td v-if="editedGradStatus.program != 'SCCP'"><b-input :disabled="studentGradStatus.programCompletionDate == null" size="sm" type="text" maxLength="7" @keyup="dateFormatYYYYMM()" v-model='editedGradStatus.programCompletionDate'></b-input></td>
                    <td v-if="editedGradStatus.program == 'SCCP'"><b-input  size="sm" type="text" maxLength="10" @keyup="dateFormatYYYYMMDD()" v-model='editedGradStatus.programCompletionDate'></b-input></td>
                  </tr>
                  
                  <tr v-if="!showEdit">
                    <td><strong>Student status: </strong></td>
                    <td><span v-if="studentGradStatus.studentStatus">{{ studentGradStatus.studentStatusName}}</span></td>
                  </tr>                     
                  <tr v-if="showEdit">
                    <td><strong>Student status: </strong></td>
                    <td class="p-1 "><b-form-select 
                        size="sm"
                        v-model="editedGradStatus.studentStatus"
                        :options="studentStatusOptions"
                        value-field="code"
                        text-field="label"
                        :disabled="disableStudentStatus"
                      ></b-form-select>
                    </td>
                  </tr>        
                  <tr v-if="!showEdit">
                    <td><strong>Student grade: </strong></td>
                    <td><span v-if="studentGradStatus.studentGrade">{{ studentGradStatus.studentGrade }}</span></td>
                  </tr>
                  <tr v-if="showEdit">
                      <td><strong>Student grade: </strong>
                        <div v-if="editedGradStatus.program != '1950'">
                          <div class="form-validation-message text-danger" v-if="editedGradStatus.studentGrade == 'AD' || editedGradStatus.studentGrade == 'AN'">Student grade should not be AD or AN for this program</div>
                        </div> 
                         
                      </td>
                      <td><b-form-select 
                        size="sm"
                        v-model="editedGradStatus.studentGrade"
                        :options="gradeOptions"
                        :disabled="disableInput || studentGradStatus.programCompletionDate !== null"
                      ></b-form-select>
                      </td>
                  </tr>            
                  <tr v-if="!showEdit">
                    <td><strong>School of record: </strong></td>
                    <td><b-button v-if="studentGradStatus.schoolOfRecord" 
                      class="p-0 text-left"
                      id="school-of-record-popover" 
                      variant="link" 
                      @click="getSchoolInfo(studentGradStatus.schoolOfRecord, 'schoolOfRecord')"> 
                      {{studentGradStatus.schoolName}}<br>
                      {{studentGradStatus.schoolOfRecord}}
                    </b-button>
                    <b-popover   
                      :boundary-padding="50" 
                      delay=800
                      target="school-of-record-popover"  
                      title="School Information"
                      triggers="focus"
                      v-if="studentGradStatus.schoolOfRecord" >
                      <table role="presentation" aria-label="grad status">
                        <tbody>
                          <tr>
                            <td><strong>District:</strong> {{schoolOfRecord.districtName}}</td>
                          </tr>
                          <tr>
                            <td><strong>School name:</strong> <br> {{schoolOfRecord.schoolName}}</td>
                          </tr> 
                            <tr>                        
                            <td><strong>Status: </strong> {{ schoolOfRecord.openFlag == 'Y' ? 'Open': 'Closed' }}</td>
                          </tr>
                            <tr>                        
                            <td><strong>Independent type:</strong> {{schoolOfRecord.independentDesignation}}</td>
                          </tr>
                            <tr>                        
                            <td><strong>Independent affiliation:</strong> {{schoolOfRecord.independentAffiliation}}</td>
                          </tr>
                            <tr>                        
                            <td><strong>Transcript eligible:</strong> {{schoolOfRecord.transcriptEligibility}}</td>
                          </tr>
                          <tr>                        
                            <td><strong>Dogwood eligibility:</strong> {{schoolOfRecord.certificateEligibility}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </b-popover>                       
                    </td>
                  </tr>
                  <tr v-if="showEdit">
                      <td><strong>School of record:</strong><br>
                        <div v-if="schoolOfRecordMissing" class="form-validation-message text-warning" >This School is closed, changes should be to historical activity only&nbsp;&nbsp;<i class="fas fa-exclamation-triangle" aria-hidden="true"></i></div>
                        <div v-if="schoolOfRecordWarning" class="form-validation-message text-warning" >This School is closed, changes should be to historical activity only&nbsp;&nbsp;<i class="fas fa-exclamation-triangle" aria-hidden="true"></i></div>
                        <div v-if="schoolNotFoundWarning" class="form-validation-message text-danger" >Invalid school entered, school does not exist on the school table&nbsp;&nbsp;<i class="fas fa-exclamation-triangle" aria-hidden="true"></i></div>
                        <div v-if="schoolOfRecordInputWarning" class="form-validation-message text-danger" >Please enter at least 8 digits&nbsp;&nbsp;<i class="fas fa-exclamation-triangle" aria-hidden="true"></i></div>
                        <div v-if="schoolFound" class="form-validation-message text-success" >{{editedGradStatus.schoolName}} found.</div>                      
                      </td>
                      <td><b-input :disabled="disableInput" size="sm" type="text" maxlength="8" minength="8" v-model='editedGradStatus.schoolOfRecord'></b-input></td>                  
                  </tr>
                  <tr v-if="!showEdit">
                    <td><strong>School at graduation: </strong></td>
                    <td><b-button v-if="studentGradStatus && studentGradStatus.schoolAtGrad" 
                      class="p-0 text-left"
                      id="school-at-graduation-popover"
                      variant="link" 
                      @click="getSchoolInfo(studentGradStatus.schoolAtGrad, 'schoolAtGrad')"> 
                      {{studentGradStatus.schoolAtGradName}}<br>
                      {{studentGradStatus.schoolAtGrad}}
                    </b-button>
                    <b-popover
                    v-if="studentGradStatus && studentGradStatus.schoolAtGrad" 
                      :boundary-padding="50"
                      delay=800
                      target="school-at-graduation-popover"
                      title="School Information"
                      triggers="focus">
                      <table role="presentation" aria-label="edit graduation status">
                        <tr>
                          <td><strong>District:</strong> {{schoolAtGraduation.districtName}}</td>
                        </tr>
                        <tr>
                          <td><strong>School name:</strong> <br> {{schoolAtGraduation.schoolName}}</td>
                        </tr> 
                          <tr>                        
                          <td><strong>Status:</strong> {{schoolAtGraduation.openFlag == 'Y' ? 'Open': 'Closed'}}</td>
                        </tr>
                          <tr>                        
                          <td><strong>Independent type:</strong> {{schoolAtGraduation.independentDesignation}}</td>
                        </tr>
                          <tr>                        
                          <td><strong>Independent affiliation:</strong> {{schoolAtGraduation.independentAffiliation}}</td>
                        </tr>
                          <tr>                        
                          <td><strong>Transcript eligible:</strong> {{schoolAtGraduation.transcriptEligibility}}</td>
                        </tr>
                        <tr>                        
                          <td><strong>Dogwood eligibility:</strong> {{schoolAtGraduation.certificateEligibility}}</td>
                        </tr>               
                      </table>
                    </b-popover> </td>
                    </tr>    
                    <tr v-if="showEdit">
                      <td><strong>School at graduation:</strong><br>
                      <div v-if="schoolAtGraduationWarning" class="form-validation-message text-warning" >Warning: This School is closed, changes should be to historical activity only&nbsp;&nbsp;<i class="fas fa-exclamation-triangle" aria-hidden="true"></i></div>
                      <div v-if="schoolAtGradProgramCompletionDateMessage" class="form-validation-message text-danger" >If program completion date is not blank, school at graduation cannot be blank&nbsp;&nbsp;<i class="fas fa-exclamation-triangle" aria-hidden="true"></i></div>
                      <div v-if="schoolAtGraduationNotFoundWarning" class="form-validation-message text-warning" >Invalid school entered, school does not exist on the school table&nbsp;&nbsp;<i class="fas fa-exclamation-triangle" aria-hidden="true"></i></div>
                      <div v-if="schoolAtGraduationInputWarning" class="form-validation-message text-danger" >Please enter at least 8 digits&nbsp;&nbsp;<i class="fas fa-exclamation-triangle" aria-hidden="true"></i></div>
                      <div v-if="schoolAtGraduationFound" class="form-validation-message text-success" >{{editedGradStatus.schoolAtGradName}} found.</div> 
                        </td>
                      <td><b-input :disabled="disableSchoolAtGrad" size="sm" type="text" maxlength="8" v-model='editedGradStatus.schoolAtGrad'></b-input></td>        
                    </tr>  
                    <tr>
                      <td><strong>Consumer education requirement met:</strong></td>
                      <td><span v-if="studentGradStatus.consumerEducationRequirementMet"> {{ studentGradStatus.consumerEducationRequirementMet }}</span></td>
                    </tr>      
                    <tr>
                      <td><strong>Honours standing:</strong></td>
                      <td><span v-if="studentGradStatus.honoursStanding"> {{ studentGradStatus.honoursStanding }}</span></td>
                    </tr>
                    <tr>
                      <td><strong>GPA:</strong></td><td><span v-if="studentGradStatus.gpa && studentGradStatus.gpa > 0 ">{{ studentGradStatus.gpa }}</span></td>
                    </tr>
                    <tr>
                      <td><strong>Optional Programs</strong></td>
                      <td>                      
                          <ul class="p-0" v-if="optionalPrograms[0] && optionalPrograms[0].studentOptionalProgramData" id="optional-programs">
                            <li v-for="item in optionalPrograms" :key="item.optionalProgramCode">
                              {{ item.optionalProgramName }}
                            </li>
                          </ul>
                      </td>
                    </tr>               
                    </tbody>
                  </table> 
              </b-card-text>
            </b-card>       
          </div> 
      </div>
      <!-- Mid Column -->
      <div class="col-12 px-2 col-xl-4 col-lg-5">
        <NoncompletionReasons></NoncompletionReasons>
      </div>
      <!-- Right Column -->
      <div class="col-12 px-2 col-xl-4 col-lg-12">
        <GraduationReports></GraduationReports>         
        <CertificationDogwoods></CertificationDogwoods>
      </div>
    </div>

    <div v-if="role == 'administrator'">
      <b-button v-b-toggle.collapse-1 variant="primary">DEBUG</b-button>
      <b-collapse id="collapse-1" class="mt-2">
        <b-card>
          <pre>{{ JSON.stringify(studentGradStatus, null, '\t') }}</pre>
        </b-card>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import GraduationService from "@/services/GraduationService.js";
import SchoolService from "@/services/SchoolService.js";
import StudentService from "@/services/StudentService.js";
import sharedMethods from '../sharedMethods';
import NoncompletionReasons from "@/components/NoncompletionReasons";
import GraduationReports from "@/components/GraduationReports";
import CertificationDogwoods from "@/components/CertificationDogwoods";

export default {
  name: "StudentGraduationStatus",
  components: {
    NoncompletionReasons: NoncompletionReasons,
    GraduationReports: GraduationReports,
    CertificationDogwoods: CertificationDogwoods
  },
  computed: {
    studentGradeChange(){
      return this.editedGradStatus.studentGrade;
    },
    programCompletionDateChange(){
      return this.editedGradStatus.programCompletionDate;
    },
    schoolOfRecordChange(){
      return this.editedGradStatus.schoolOfRecord;
    },
    schoolAtGradChange(){
      return this.editedGradStatus.schoolAtGrad;
    },
    programChange(){
      return this.editedGradStatus.program;
    },
    recalculateFlag(){
      return this.studentGradStatus.recalculateGradStatus; 
    },
    disableSaveButton(){
      return this.studentGradStatus.studentStatus == "DEC" || this.disableButton
    },
    ...mapGetters({
      studentGradStatus: "getStudentGradStatus",
      hasGradStatus: "studentHasGradStatus",
      studentGradRequirementCourses: "gradStatusCourses",   
      studentPen: "getStudentPen",
      studentFullName: "getStudentFullName",
      token: "getToken",
      role: "getRoles",
      optionalPrograms: "getStudentOptionalPrograms",
      programOptions: "getProgramOptions",
      studentStatusOptions: "getStudentStatusOptions",
      studentId: "getStudentId",
      username: "getUsername",
      certificates: "getStudentCertificates",  
      reports: "getStudentReports",
      transcripts: "getStudentTranscripts"
    }),
  },
  data() {
    return {
      programCompletionEffectiveDateList:[],
      programCompletionDateRangeError:false,
      programChangeWarning:false,
      programEffectiveDate: "",
      programExpiryDate: "", 
      errorMessage:"",
      dismissSecs: 3,
      dismissCountDown: 0,
      showModal: false,
      showTop: false,
      showEdit: false,
      show: false,
      projectedStudentGradStatus: [],
      updateStatus: [],
      schoolOfRecord: "",
      schoolOfRecordStatus:"",
      schoolOfRecordMissing: false,
      schoolOfRecordWarning: false,
      schoolNotFoundWarning: false,
      schoolOfRecordInputWarning: false,
      schoolFound: false,
      schoolAtGradProgramCompletionDateMessage: false,
      schoolAtGraduation: "",
      schoolAtGraduationStatus:"",
      schoolAtGraduationWarning: false,
      schoolAtGraduationNotFoundWarning:false,
      schoolAtGraduationInputWarning:false,
      schoolAtGraduationFound: false,
      programDropdownList: [],
      editedGradStatus: {},
      studentUngradReason: "",
      disableButton:false,
      disableSchoolAtGrad:false,
      disableInput:false,
      disableStudentStatus:false,
      gradeOptions: [
        { text: "08", value: "8" },
        { text: "09", value: "9" },
        { text: "10", value: "10" },
        { text: "11", value: "11" },
        { text: "12", value: "12" },
        { text: "HS - Homeschool", value: "HS" },
        { text: "OT - Other", value: "OT" },
        { text: "AD - Adult expected to graduate", value: "AD" },
        { text: "AN - Adult not expected to graduate", value: "AN" },     
      ],
    };
  },
  created() {
    this.programDropdownList = this.$store.dispatch("getGraduationPrograms");
    this.disableButton = false;
    this.showNotification = sharedMethods.showNotification;
  },
  mounted(){
  },
  watch:{
    studentGradeChange:function(){
      if(this.editedGradStatus.studentGrade == 'AD' || this.editedGradStatus.studentGrade == 'AN'){
        if(this.editedGradStatus.program == '1950'){
          if (this.editedGradStatus.schoolOfRecord == ""){
            this.schoolOfRecordMissing = true;
            this.disableButton = true;
          } else {
            this.schoolOfRecordMissing = false;
            this.disableButton = false;
          }      
        }
        if(this.editedGradStatus.program != '1950'){
          this.disableButton = true;
        }
      }
      if(this.editedGradStatus.studentGrade != 'AD' && this.editedGradStatus.studentGrade != 'AN'){

        if(this.editedGradStatus.program == '1950'){
          this.disableButton = true;
        } else {
          if(this.editedGradStatus.schoolOfRecord == "") {
            this.schoolOfRecordMissing = true;
            this.disableButton = true;
          } else {
            this.schoolOfRecordMissing = false;
            this.disableButton = false;
          }        
        }
        if(this.editedGradStatus.schoolOfRecord == ""){
          this.schoolOfRecordMissing = true;
          this.disableButton = true;
        } else {
          this.schoolOfRecordMissing = false;
          this.disableButton = false;
        }
      }
    },
    programChange:function(){
       if(this.editedGradStatus.program == '1950'){
        if(this.editedGradStatus.studentGrade == 'AD' || this.editedGradStatus.studentGrade == 'AN'){
          this.disableButton = false;
        }else{
          this.disableButton = true;
        }
      }
  
      if(this.editedGradStatus.program != '1950'){
        if(this.editedGradStatus.studentGrade == 'AD' || this.editedGradStatus.studentGrade == 'AN'){
          this.disableButton = true;
        }else{
          this.disableButton = false;
        }
      }
      this.programChangeWarning = true;
    },
    programCompletionDateChange:function(){
      var programNameSearch = this.editedGradStatus.program;
      for (var i=0 ; i < this.programOptions.length ; i++)
      {
          if (this.programOptions[i].programCode == programNameSearch) {
              this.programCompletionEffectiveDateList.push(this.programOptions[i]);
          }
          
      }
      this.programEffectiveDate = this.programCompletionEffectiveDateList[0].effectiveDate
      this.programExpiryDate = this.programCompletionEffectiveDateList[0].expiryDate

      if(this.editedGradStatus.programCompletionDate == ""){
        if(this.editedGradStatus.program == 'SCCP'){
          this.disableButton = false;
        } else {
          this.disableSchoolAtGrad = true;
          this.disableButton = true;
        }
        
      } else {
        if(this.editedGradStatus.programCompletionDate > this.programExpiryDate || this.editedGradStatus.programCompletionDate < this.programEffectiveDate)
        {
          this.disableButton = true;
          this.programCompletionDateRangeError = true;
        } else {
          this.programCompletionDateRangeError = false;
          this.disableButton = false;
        }
      }
    },
    schoolOfRecordChange:function(){
      if (this.editedGradStatus.schoolOfRecord.length == ""){
        this.disableButton = true;
      }else {
        this.schoolOfRecordMissing = false;
        this.disableButton = false;
      }
      if (this.editedGradStatus.schoolOfRecord.length < 8){
          this.schoolOfRecordWarning = false;
          this.schoolNotFoundWarning = false;
          this.schoolOfRecordInputWarning = true;
          return;
      }
      if(this.editedGradStatus.schoolOfRecord == this.studentGradStatus.schoolOfRecord){  
      this.schoolOfRecordWarning = false;
      this.schoolNotFoundWarning = false;
      this.schoolOfRecordInputWarning = false;
      this.schoolFound = false;
      } else {
        if(this.editedGradStatus.schoolOfRecord.length == 8) {
          this.schoolNotFoundWarning = false;
          this.schoolOfRecordWarning = false;
          this.schoolOfRecordInputWarning = false;
          this.schoolFound = false;
          SchoolService.getSchoolInfo(this.editedGradStatus.schoolOfRecord, this.token)
          .then((response) => {
            this.schoolOfRecordStatus = response.data.openFlag
            if(response.statusText == "No Content"){
              this.schoolNotFoundWarning = true;
            }else {
              this.schoolNotFoundWarning = false; 
              if(this.schoolOfRecordStatus == "N"){
                this.schoolOfRecordWarning = true;
              }
              this.schoolFound = true;
              this.editedGradStatus.schoolName = response.data.schoolName;
            }    
          })
          .catch((error) => {
            this.showNotification("danger", error.response);
          });
        } else {
            this.schoolNotFoundWarning = true;
        }
      }
    },
    schoolAtGradChange:function(){

      if(this.editedGradStatus.schoolAtGrad == ""){
        if(this.editedGradStatus.programCompletionDate != ""){  
          this.disableButton = true;
          this.schoolAtGradProgramCompletionDateMessage = true;      
        }else{
          this.disableButton = false;
          this.schoolAtGradProgramCompletionDateMessage = false;    
        }
      }else{
        this.disableButton = false;
        this.schoolAtGradProgramCompletionDateMessage = false;
      }
     
      if(this.editedGradStatus.schoolAtGrad && this.editedGradStatus.schoolAtGrad.length < 8){
        this.schoolAtGraduationWarning = false;
        this.schoolAtGraduationNotFoundWarning = false;
        this.schoolAtGraduationInputWarning = true;
        this.schoolAtGraduationFound= false;
        return;
      }else{
        this.schoolAtGraduationInputWarning = false;
      }      
      if(this.editedGradStatus.schoolAtGrad == this.studentGradStatus.schoolAtGrad){  
        this.schoolAtGraduationWarning = false;
        this.schoolAtGraduationNotFoundWarning = false;
        this.schoolAtGraduationInputWarning = false;
        this.schoolAtGraduationFound= false;
      }else{
         if(this.editedGradStatus.schoolAtGrad.length == 8) {
          this.schoolAtGraduationNotFoundWarning = false;  
          this.schoolAtGraduationWarning = false;
          this.schoolAtGraduationInputWarning = false;
          this.schoolAtGraduationFound= false;
          SchoolService.getSchoolInfo(this.editedGradStatus.schoolAtGrad, this.token)
          .then((response) => {         
            this.schoolAtGraduationStatus = response.data.openFlag
            if(response.statusText == "No Content"){
              this.schoolAtGraduationNotFoundWarning = true;
            }else{
              this.schoolAtGraduationNotFoundWarning = false;
              if(this.schoolAtGraduationStatus == "N"){
                this.schoolAtGraduationWarning = true;
              }
              this.schoolAtGraduationFound= true;
              this.editedGradStatus.schoolAtGradName = response.data.schoolName;
            }
          })
          .catch((error) => {
            this.showNotification("danger", error.response);        
          });
        } else {
          this.schoolAtGraduationInputWarning = true;
        }
      } 
    }  
  },
  methods: {
    dateFormatYYYYMM(){
      var value = this.editedGradStatus.programCompletionDate;    
      this.editedGradStatus.programCompletionDate = value.replace(/^([\d]{4})([\d]{2})$/,"$1/$2");        
    },
    dateFormatYYYYMMDD(){
      var value = this.editedGradStatus.programCompletionDate;    
      this.editedGradStatus.programCompletionDate = value.replace(/^([\d]{4})([\d]{2})([\d]{2})$/,"$1/$2/$3");     
    },
    getStudentStatus(code) {
      for (var i = 0; i <= this.studentStatusOptions.length; i++) {
        if (this.studentStatusOptions[i].code == code) {
          return this.studentStatusOptions[i].label;
        }
      }
      return "";
    },
    reactivateStudentRecord(){
        this.editedGradStatus.studentStatus = "A";
        this.saveGraduationStatus(this.studentId);
        this.showNotification("success", "Student Record re-activated.");
    },
    editGradStatus() {
      //If the student has a programCompletionDate disable input fields
      this.schoolOfRecordWarning = false;
      this.schoolNotFoundWarning = false;
      if(this.studentGradStatus.programCompletionDate != null){
        if(this.studentGradStatus.program == 'SCCP'){
          this.disableInput = false;
        } else {
          this.disableInput = true;
        }
        
        this.disableSchoolAtGrad = false;
        this.disableStudentStatus = false;
      }else{
        this.disableStudentStatus = false;
        this.disableSchoolAtGrad = true;
      }

      if(this.studentGradStatus.studentStatus == 'MER' || this.studentGradStatus.studentStatus == 'DEC'){
        this.disableInput = true;
        this.disableStudentStatus = true;
      }
      else if(this.studentGradStatus.studentStatus == 'TER' || this.studentGradStatus.studentStatus == 'N'){
        this.disableInput = false;
        this.disableStudentStatus = false;
      }
      this.showEdit = true;  
      if(this.studentGradStatus.programCompletionDate){
        this.$set(this.editedGradStatus, 'programCompletionDate', this.studentGradStatus.programCompletionDate);
      }else{
        this.$set(this.editedGradStatus, 'programCompletionDate', null);
      }
      this.$set(this.editedGradStatus, 'pen', this.studentGradStatus.pen);
      this.$set(this.editedGradStatus, 'program', this.studentGradStatus.program);
      this.$set(this.editedGradStatus, 'studentGrade', this.studentGradStatus.studentGrade);
      this.$set(this.editedGradStatus, 'schoolName', this.studentGradStatus.schoolName);
      this.$set(this.editedGradStatus, 'schoolOfRecord', this.studentGradStatus.schoolOfRecord);
      this.$set(this.editedGradStatus, 'schoolAtGrad', this.studentGradStatus.schoolAtGrad);
      this.$set(this.editedGradStatus, 'schoolAtGradName', this.studentGradStatus.schoolAtGradName);
      this.$set(this.editedGradStatus, 'studentStatus', this.studentGradStatus.studentStatus);
      this.$set(this.editedGradStatus, 'studentID', this.studentGradStatus.studentID);
      this.$set(this.editedGradStatus, 'gpa', this.studentGradStatus.gpa);
      this.$set(this.editedGradStatus, 'honoursStanding', this.studentGradStatus.honoursStanding);
    },
    cancelGradStatus() {
      this.showEdit = false;
      this.studentUngradReason = "";   
    },
    ungradStudent(){
      StudentService.ungradStudent(
        this.studentId,
        this.studentUngradReason,
        
        this.token,this.editedGradStatus
      )
      .then((response) => {
        this.updateStatus = response.data;
        this.studentGradStatus.pen = response.data.pen;
        this.studentGradStatus.program = response.data.program;
        this.studentGradStatus.programCompletionDate = response.data.programCompletionDate;
        this.studentGradStatus.honoursStanding = response.data.honoursStanding;
        this.studentGradStatus.gpa = response.data.gpa;
        this.studentGradStatus.studentGrade = response.data.studentGrade;
        this.studentGradStatus.schoolOfRecord = response.data.schoolOfRecord;
        this.studentGradStatus.studentStatus = response.data.studentStatus;
        this.studentGradStatus.studentStatusName = this.getStudentStatus(
          response.data.studentStatus
        );
        this.studentGradStatus.schoolAtGrad = response.data.schoolAtGrad;

        this.showTop = !this.showTop;
        this.showEdit = false;

        this.showNotification("success", "GRAD Status Saved");      
      })
      .catch((error) => {
        this.showNotification(
          "danger",
          "There was an error: " + error.response.data.messages[0].message
        );
      });
    },
    saveGraduationStatus(id) {
      //add the user info
      this.editedGradStatus.updatedBy = this.username;
      this.editedGradStatus.studentID = id;
      this.editedGradStatus.pen = this.studentPen;
      //process the program completion date
      if(this.editedGradStatus.programCompletionDate == ''){
        this.editedGradStatus.programCompletionDate = null;
      }
      if(this.editedGradStatus.programCompletionDate != null){
        this.editedGradStatus.programCompletionDate = this.editedGradStatus.programCompletionDate.replace("/", "-");
        var date;
        try{
          date = new Date(this.editedGradStatus.programCompletionDate);
          this.editedGradStatus.programCompletionDate = date.toISOString().split('T')[0];
        }catch(error){
          // eslint-disable-next-line
          console.log(error);
        }
      }
      if(this.editedGradStatus.schoolOfRecord == ''){
        this.editedGradStatus.schoolOfRecord = null;
      }
      if(this.editedGradStatus.schoolAtGrad == ''){
        this.editedGradStatus.schoolAtGrad = null;
      }

      StudentService.editGraduationStatus(
        id,
        this.token,
        this.editedGradStatus
      )
      .then((response) => {
        this.updateStatus = response.data;
        this.studentGradStatus.pen = response.data.pen;
        this.studentGradStatus.program = response.data.program;
        this.studentGradStatus.programCompletionDate = response.data.programCompletionDate;
        this.studentGradStatus.honoursStanding = response.data.honoursStanding;
        this.studentGradStatus.gpa = response.data.gpa;
        this.studentGradStatus.studentGrade = response.data.studentGrade;
        this.studentGradStatus.schoolName = this.editedGradStatus.schoolName;
        this.studentGradStatus.schoolOfRecord = response.data.schoolOfRecord;
        this.studentGradStatus.schoolAtGradName = this.editedGradStatus.schoolAtGradName;
        this.studentGradStatus.schoolAtGrad = response.data.schoolAtGrad;
        this.studentGradStatus.studentStatus = response.data.studentStatus;
        this.studentGradStatus.recalculateGradStatus = response.data.recalculateGradStatus;
        this.studentGradStatus.updatedTimestamp = response.data.updatedTimestamp;
        this.studentGradStatus.studentStatusName = this.getStudentStatus(
          response.data.studentStatus
        );         
        this.showTop = !this.showTop;
        this.showEdit = false;
        //Update the student audit history
        this.$store.dispatch("updateStudentAuditHistory");
        this.showNotification("success", "GRAD Status Saved");
      })
      .catch((error) => {
        if(this.editedGradStatus.programCompletionDate != null){
          this.editedGradStatus.programCompletionDate = this.editedGradStatus.programCompletionDate.replace("-", "/").substring(0, 7);
        }         
        if(error.response.data){
          if(error.response.data.messages){
            this.errorMessage = error.response.data.messages[0].message;
          }
        }
        this.showNotification(
          "danger",
          this.errorMessage
        );
      });
    },
    popClose() {
      this.show = false;
    },
    getSchoolInfo(mincode, type) {
      SchoolService.getSchoolInfo(mincode, this.token)
      .then((response) => {
        if(type == 'schoolOfRecord'){
          this.schoolOfRecord = response.data;
        }
        if(type == 'schoolAtGrad'){
          this.schoolAtGraduation = response.data;
        }          
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log("There was an error:" + error.response);
      });
    },
    projectGraduationStatus(id) {
      StudentService.getGraduationStatus(id, this.token)
      .then((response) => {
        this.projectedStudentGradStatus = response.data;
        this.projectedStudentGradStatus.studentGradData = JSON.parse(
          this.projectedStudentGradStatus.studentGradData
        );
        this.$bvModal.show("modal-1");
        this.showModal = true;
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log("There was an error:" + error.response);
      });
    },
    updateGraduationStatus: function (pen) {
      // eslint-disable-next-line no-use-before-define
      GraduationService.graduateStudent(pen, this.token)
      .then((response) => {
        this.$store.dispatch("setStudentGradStatus", response.data);
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log("There was an error:" + error.response);
      });
    },
  },
};
</script>

<style scoped>
.pdf-link::before{
   font-family: "Font Awesome 5 Free", sans-serif; 
   font-weight: 900;
   content: "\f15b";
   padding-right:10px
}
.graduation-status table tr td{
  vertical-align:top;
  height:42px !important
}

ul.requirements-met,
ul.non-grad-reasons {
  list-style: none;
}

ul.requirements-met li,
ul.non-grad-reasons li {
  border-bottom: 1px solid #ccc;
}

.card-body {
  border-bottom: 1px solid #ccc;
}
.card {
  margin-bottom: 10px;
}

.card-header {
  font-weight: 700;
}


span.link {
  color: #1a5a96;
  text-decoration: underline;
  background-color: transparent;
}

span.link:hover {
  color: #0000f3;
  text-decoration: underline;
  cursor: pointer;
}
h5.modal-title {
  font-size: 30px !important;
}
.gradstatus-actions {
  position: absolute;
  top: 10px;
  right: 10px;
}
.edit {
  padding: 10px;
}
.form-validation-message{
  font-size: 11px;
}
.form-control:disabled{
    color: #6c757d;
    background-color: #e9ecef;
}

#actions{
  position: absolute;
  z-index: 20;
  right: 10px;
  top: -55px;
  text-decoration: none !important;  
  color: #666;
}

</style>

