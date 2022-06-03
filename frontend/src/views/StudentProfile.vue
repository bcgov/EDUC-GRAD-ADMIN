<template>
  <div class="student-profile">
    <div class="row m-0 py-3">    
      <div class="px-0">   
          <table v-if="!smallScreen" class="profile-name" aria-label="student information">
            <tr>
              <th class="align-top profile-name-header" scope="col"></th>
              <th class="align-top profile-name-header" scope="col"><label>PEN</label></th>
              <th class="align-top profile-name-header" scope="col"><label>Legal surname</label></th>
              <th class="align-top profile-name-header" scope="col"><label>Legal given</label></th>
              <th class="align-top profile-name-header" scope="col"><label>Legal middle</label></th>
              <th class="align-top profile-name-header" scope="col"><label>Birthdate (yyyy-mm-dd)</label></th>
            </tr>
            <tr>
              <td>
                <b-button  v-b-toggle.student-accordion variant="link" v-on:click="moreStudentInfo = !moreStudentInfo">
                  <img v-show="!moreStudentInfo" src="../assets/images/icon-right.svg" width="14px" aria-hidden="true" alt=""/>
                  <img v-show="moreStudentInfo" src="../assets/images/icon-down.svg" height="8px" aria-hidden="true" alt=""/>
                </b-button>
              </td>
              <td class="align-top profile-name-data px-0" v-if="studentFullName.pen"><strong><p class="profile-info">{{ studentFullName.pen }}</p></strong></td>
              <td class="align-top profile-name-data" v-if="studentFullName.legalLastName"><p class="profile-info">{{ studentFullName.legalLastName }}</p></td>
              <td class="align-top profile-name-data" v-if="studentFullName.legalFirstName"><p class="profile-info">{{ studentFullName.legalFirstName }}</p></td>
              <td class="align-top profile-name-data" v-if="studentFullName.legalMiddleNames"><p class="profile-info">{{ studentFullName.legalMiddleNames }}</p></td>
              <td class="align-top profile-name-data" v-if="!studentFullName.legalMiddleNames"><p class="profile-info"> </p></td>
              <td class="align-top profile-name-data" v-if="studentInfo.dob"><p class="profile-info">{{ studentInfo.dob }}</p></td>
            </tr>
          </table>
          <div v-if="smallScreen" class="profile-name">
            <div v-if="studentFullName.pen" class="p-0 profile-name-data">
              <label>PEN</label>
              <h2 class="px-0">{{ studentFullName.pen }}</h2>
            </div>
            <div v-if="studentFullName.legalLastName" class="p-0 profile-name-data">
              <label>Legal surname</label>
              <h2 class="px-0">{{ studentFullName.legalLastName }}</h2>
            </div>
            <div v-if="studentFullName.legalFirstName" class="p-0 profile-name-data">
              <label>Legal given</label>
              <h2 class="px-0">{{ studentFullName.legalFirstName }}</h2>
              
            </div>
            <div v-if="studentFullName.legalMiddleNames" class="p-0 profile-name-data">
              <label>Legal middle</label>
              <h2 class="px-0">{{ studentFullName.legalMiddleNames }}</h2>
            </div>
            <div v-if="studentInfo.dob" class="p-0 profile-name-data">
              <label>Birthdate(yyyy-mm-dd)</label>
              <h2 class="px-0">{{ studentInfo.dob }}</h2>
            </div>
            <b-button class="text-decoration-none" v-b-toggle.student-accordion variant="link" v-on:click="moreStudentInfo = !moreStudentInfo">
              <img v-show="!moreStudentInfo" src="../assets/images/icon-right.svg" height="14px" aria-hidden="true" alt=""/>
              <img v-show="moreStudentInfo" src="../assets/images/icon-down.svg" height="8px" aria-hidden="true" alt=""/>
              &nbsp;{{moreStudentInfo? 'Hide ' : 'Show '}}Student Details
            </b-button>
          </div>
      </div>

      <div class="col-12 px-3">
        <b-collapse id="student-accordion" class="">
          <b-card no-body class="border-0">
            <b-table-simple striped hover small stacked="lg" role="presentation" aria-label="student details">
              <b-tbody>
                <b-tr>
                  <b-td class="px-2"><strong>Usual surname:</strong> {{studentInfo.usualLastName}}</b-td>
                  <b-td class="px-2"><strong>Usual given:</strong> {{studentInfo.usualFirstName}} </b-td>
                  <b-td class="px-2"><strong>Usual middle:</strong> {{studentInfo.usualMiddleNames}} </b-td>
                </b-tr>
                <b-tr>
                  <b-td class="px-2"><strong>Gender:</strong> {{studentInfo.genderCode}}</b-td>
                  <b-td class="px-2"><strong>True student ID:</strong> {{studentInfo.trueStudentID}}</b-td>
                  <b-td class="px-2"><strong>Local ID:</strong> {{studentInfo.localID}}</b-td>
                </b-tr>
                <b-tr>     
                  <b-td class="px-2"><strong>PEN Status Code:</strong> {{studentInfo.statusCode}}</b-td>
                  <b-td class="px-2"><strong>Postal code:</strong> {{studentInfo.postalCode}}</b-td>
                  <b-td class="px-2" v-if="studentInfo.studentStatus == 'D'"><strong>Deceased date:</strong> {{studentInfo.deceasedDate}}</b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </b-card>
        </b-collapse>
          <div class="float-right grad-actions">
            <b-spinner v-if="tabLoading" class="px-1 my-2" ></b-spinner> 
            <b-dropdown :disabled="tabLoading || !hasGradStatus" v-b-tooltip.hover.left id="actions" right :text="smallScreen?'':'Run Graduation Algorithm'" class="m-md-2 float-right admin-gear-w-text">
              <b-dropdown-item v-on:click="graduateStudent" v-if="!studentGradStatus.programCompletionDate">Graduate Student</b-dropdown-item>
              <b-dropdown-item v-on:click="graduateStudent" v-if="studentGradStatus.programCompletionDate && studentGradStatus.program == ('SCCP'||'NOPROG')">Graduate Student</b-dropdown-item>
              <b-dropdown-item v-if="studentGradStatus.programCompletionDate" v-b-modal.ungraduate-student-modal>Undo Completion</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item v-on:click="projectedGradStatusWithFinalMarks" >Projected final marks</b-dropdown-item>
              <b-dropdown-item v-on:click="projectedGradStatusWithFinalAndReg">Projected final marks and registrations</b-dropdown-item>
                <b-dropdown-item v-on:click="updateStudentReports">Update Student Reports</b-dropdown-item>
            </b-dropdown>
          </div>
      </div>
    </div>
    <div class="row m-0">
      <div class="col-12 px-0">
        <div>
          <b-card no-body class="p-0" >
            <b-tabs :pills="smallScreen" v-model="selectedTab" card>
                <b-tab title="GRAD" class="grad-tab gradstatus-tabs py-4">
                  <div class="mb-2 mx-1 row">
                    <div class="col-12 col-lg-4 col-md-5 m-0 p-0">
                      <b-button class="mr-2 my-1" v-on:click="gradTab ='gradStatus'" size="sm" :variant="gradTab == 'gradStatus'? 'primary':'outline-secondary'">GRAD Status</b-button>
                      <b-button class="mx-0 my-1" :disabled="!gradCourses" v-on:click="gradTab ='gradCourses'" size="sm" :variant="gradTab == 'gradCourses' ? 'primary':'outline-secondary'">Requirement Details</b-button>
                    </div>
                    <div class="pr-0 col-12 col-lg-8 col-md-7 text-right"><strong>Updated:</strong> {{ studentGradStatus.updateDate|formatTime }} by {{ studentGradStatus.updateUser }}</div>
                  </div>
                  <b-card-text>              
                    <StudentGraduationStatus v-if="gradTab=='gradStatus'"></StudentGraduationStatus>
                    <GRADRequirementDetails v-if="gradTab=='gradCourses'">
                      <b-alert variant="info" :show="!studentGradStatus.recalculateGradStatus">{{studentGradStatus.studentGradData.gradMessage}}</b-alert>
                    </GRADRequirementDetails>
                    <b-overlay :show="tabLoading" rounded="sm" no-wrap></b-overlay>
                  </b-card-text>
                </b-tab>
                <b-tab v-if="courses != 'not loaded'" :title="'Courses ('  + courses.length + ')'"  class="py-3 px-0 m-1">
                  <b-card-text>
                    
                    <StudentCourses></StudentCourses>
                    <b-overlay :show="tabLoading" rounded="sm" no-wrap>
                    </b-overlay>
                  </b-card-text>
                </b-tab>

                <b-tab v-if="assessments != 'not loaded'"  :title="'Assessments ('  + assessments.length + ')'"  class="py-3 px-0 m-1">
                  <b-card-text>             
                    <StudentAssessments />
                    <b-overlay :show="tabLoading" rounded="sm" no-wrap></b-overlay>
                  </b-card-text>
                </b-tab>

                <b-tab v-if="exams != 'not loaded'"  :title="'Exams details ('  + exams.length + ')'"  class="py-3 px-0 m-1">
                  <b-card-text>               
                    <StudentExams />
                    <b-overlay :show="tabLoading" rounded="sm" no-wrap></b-overlay>
                  </b-card-text>
                </b-tab>

                <b-tab v-if="optionalPrograms != 'not loaded'" :title="'Optional Programs ('  + optionalPrograms.length + ')'"  class="py-3 px-0 m-1">
                  <b-card-text>
                    <StudentOptionalPrograms></StudentOptionalPrograms>
                    <b-overlay :show="tabLoading" rounded="sm" no-wrap></b-overlay>
                  </b-card-text>
                </b-tab>                                   
               
                <b-tab v-if="this.courses == 'not loaded' || this.assessments == 'not loaded'" title="Loading ..." class="tab-loading py-3 px-0 m-1">
                  <b-card-text class="text-center">Loading Student Courses and Assesments</b-card-text>
                </b-tab>

                <b-tab :title="'Audit History'" class="py-3 px-0 m-1">
                  <b-card-text>
                    <StudentAuditHistory></StudentAuditHistory>
                    <b-overlay :show="tabLoading" rounded="sm" no-wrap></b-overlay>
                  </b-card-text>
                </b-tab>
            </b-tabs>
          </b-card>
        </div>
      </div>
    </div> 
    <div>
      <!-- Projected Grad Status Modal -->
      <b-modal no-close-on-backdrop size="xl" ref="projectedGradStatusWithFinalMarks" title="Projected Grad Status with Final Marks" centered>
            <b-alert variant="info" show v-if="this.projectedGradStatus && this.projectedGradStatus.gradStatus">{{projectedGradStatus.gradMessage}}</b-alert>
            <b-card-group deck v-if="this.projectedGradStatus && this.projectedGradStatus.gradStatus">
            <b-card
              header="Requirements met"
            >
              <b-card-text>
                <b-table small :items="this.projectedGradStatus.requirementsMet" :fields='[{ key: "rule",label: "Rule",class:"px-0 py-2"},{key: "description",label: "Description",class:"px-0 py-2"}]'>
                    
                </b-table>
              </b-card-text>
            </b-card>
            <b-card
              header="Noncompletion reasons"
            >
              <div v-if="projectedGradStatus && projectedGradStatus.nonGradReasons">
                <b-card-text><b-table small :items="this.projectedGradStatus.nonGradReasons" ></b-table></b-card-text>
              </div>
              <div v-else>
                <b-card-text>All program requirements have been met</b-card-text>
              </div>
            </b-card>
          </b-card-group>
          <div v-if="this.projectedOptionalGradStatus">
            <div v-for="optionalProgram in this.projectedOptionalGradStatus" :key="optionalProgram.optionalProgramCode">
            <h3 class="optionalProgramName">{{ optionalProgram.optionalProgramName }}</h3>
            <b-card-group deck >           
              <b-card
                header="Requirements met"
              >
                <b-card-text>
                  <b-table small 
                          :items="optionalProgram.studentOptionalProgramData.optionalRequirementsMet" 
                          :fields='[{ key: "rule",label: "Rule",class:"px-0 py-2"},{key: "description",label: "Description",class:"px-0 py-2"}]'
                  >               
                  </b-table>
                </b-card-text>
              </b-card>
              <b-card
                header="Requirements not met"
              >
                <div v-if="optionalProgram.studentOptionalProgramData.optionalNonGradReasons">
                  <b-card-text>
                    <b-table small 
                            :items="optionalProgram.studentOptionalProgramData.optionalNonGradReasons"
                    >
                    </b-table>
                  </b-card-text>
                </div>
                <div v-else>
                  <b-card-text>All requirements have been met</b-card-text>
                </div>
              </b-card>
            </b-card-group>
            </div>
          </div>
            <template #modal-footer="{cancel}">
            <!-- Emulate built in modal footer ok and cancel button actions -->
            <b-button size="sm" variant="outline-secondary" v-on:click="cancel">
              Close
            </b-button>
          </template>
      </b-modal>
      <b-modal no-close-on-backdrop size="xl" ref="projectedGradStatusWithFinalAndReg" centered title="Projected Grad Status with Final Marks and Registrations">
            <b-alert variant="info" show>{{projectedGradStatus.gradMessage}}</b-alert>

            <b-card-group deck v-if="this.projectedGradStatus && this.projectedGradStatus.gradStatus">
            <b-card
              header="Requirements met"
            >
              <b-card-text>
                <b-table small :items="this.projectedGradStatus.requirementsMet" :fields='[{ key: "rule",label: "Rule",class:"px-0 py-2"},{key: "description",label: "Description",class:"px-0 py-2"}]'>
                  <template #cell(rule)="row">
                    <div v-if="row.item.projected" style="background-color:#eaf2fa; width:100% ">
                      {{row.item.rule}}
                    </div>
                    <div v-else>
                      {{row.item.rule}}
                    </div>
                  </template>
                  <template #cell(description)="row">
                    <div v-if="row.item.projected" style="background-color:#eaf2fa; width:100% ">
                      {{row.item.description}} (Projected)
                    </div>
                    <div v-else>
                      {{row.item.description}}
                    </div>
                  </template>
                </b-table>
              </b-card-text>
            </b-card>
            <!-- Original -->
            <b-card
              header="Noncompletion reasons"
            >
              <div v-if="projectedGradStatus && projectedGradStatus.nonGradReasons">
                <b-card-text><b-table small :items="this.projectedGradStatus.nonGradReasons"></b-table></b-card-text>
              </div>
              <div v-else>
                <b-card-text>All program requirements have been met</b-card-text>
              </div>
            </b-card>
          </b-card-group>
          <div v-if="this.projectedOptionalGradStatus">
            <div v-for="optionalProgram in this.projectedOptionalGradStatus" :key="optionalProgram.optionalProgramCode">
            <h3 class="optionalProgramName">{{ optionalProgram.optionalProgramName }}</h3>
            <b-card-group deck >           
              <b-card
                header="Requirements met"
              >
                <b-card-text>
                  <b-table small 
                          :items="optionalProgram.studentOptionalProgramData.optionalRequirementsMet" 
                          :fields='[{ key: "rule",label: "Rule",class:"px-0 py-2"},{key: "description",label: "Description",class:"px-0 py-2"}]'
                  >               
                  </b-table>
                </b-card-text>
              </b-card>
              <b-card
                header="Requirements not met"
              >
                <div v-if="optionalProgram.studentOptionalProgramData.optionalNonGradReasons">
                  <b-card-text>
                    <b-table small 
                            :items="optionalProgram.studentOptionalProgramData.optionalNonGradReasons"
                    >
                    </b-table>
                  </b-card-text>
                </div>
                <div v-else>
                  <b-card-text>All requirements have been met</b-card-text>
                </div>
              </b-card>
            </b-card-group>
            </div>
          </div>    
          <template #modal-footer="{ok, cancel, hide}">
            <!-- Emulate built in modal footer ok and cancel button actions -->
            <b-button size="sm" variant="outline-secondary" @click="cancel">
              Close
            </b-button>
          </template>
      </b-modal>
      <div>
        <b-modal id="ungraduate-student-modal" title="Undo Completion">
          <p>Undo Completion Reason</p>
          <b-form-select v-model="ungradReasonSelected" :options="ungradReasons" value-field="code" text-field="label"></b-form-select>

          <template #modal-footer="{ok, cancel, hide}">
            <!-- Emulate built in modal footer ok and cancel button actions -->
            <b-button size="sm" variant="outline-secondary" @click="cancel">
              Cancel
            </b-button>
            <!-- Button with custom close trigger value -->

            <b-button size="sm" variant="primary" @click="hide('ungraduate-student-modal'); ungraduateStudent()">
              Undo Completion
            </b-button>
          </template>
          <div v-if="ungradReasonSelected == 'OTH'" class="mt=3">
            <label class="pt-3">Description</label>
            <b-form-textarea v-model="ungradReasonDesc"></b-form-textarea>
          </div>
        </b-modal>
        
      </div>
    </div>
  </div>
</template>

<script>
  import sharedMethods from '../sharedMethods';  
  import AssessmentService from "@/services/AssessmentService.js";
  import GraduationCommonService from "@/services/GraduationCommonService.js";
  import CourseService from "@/services/CourseService.js";
  import StudentService from "@/services/StudentService.js";
  import GraduationService from "@/services/GraduationService.js"
  import GRADRequirementDetails from "@/components/GRADRequirementDetails";
  import StudentCourses from "@/components/StudentCourses";
  import StudentAssessments from "@/components/StudentAssessments";
  import StudentExams from "@/components/StudentExams";
  import StudentGraduationStatus from "@/components/StudentGraduationStatus";
  import StudentOptionalPrograms from "@/components/StudentOptionalPrograms";
  import StudentAuditHistory from "@/components/StudentAuditHistory";

  import {
    mapGetters
  } from "vuex";
  export default {
    name: "studentProfile",
    created() {

  
        StudentService.getStudentPen(this.$route.params.studentId, this.token).then(
          (response) => {           
            this.pen = response.data.pen
            const studentIdFromURL = this.$route.params.studentId;
            this.loadStudent(studentIdFromURL)
          }
        ).catch((error) => {
          if(error.response.status){

            this.showNotification(
              "danger",
              "There was an error: " + error.response.status
            );
          }
        })       

      this.showNotification = sharedMethods.showNotification;

      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
      if (this.window.width < 768) {
        this.smallScreen = true;
      }
      window.addEventListener('resize', this.handleResize);
      this.handleResize();

    },
    components: {
      StudentCourses: StudentCourses,
      GRADRequirementDetails: GRADRequirementDetails,
      StudentAssessments: StudentAssessments,
      StudentExams: StudentExams,
      StudentGraduationStatus: StudentGraduationStatus,
      StudentOptionalPrograms: StudentOptionalPrograms,
      StudentAuditHistory: StudentAuditHistory
    },
    props: {

    },
    data() {
      return { 
        pen: "",
        optionalProgramTab: "",
        projectedOptionalGradStatus:"",
        nonGradReasons:"",
        projectedrequirementsMet:"",
        ungradReasonSelected: "",
        ungradReasonDesc: "",
        selectedTab: 0,
        projectedGradStatus: [],
        projectedGradStatusWithRegistrations: [],
        tabLoading: false,
        gradTab:"gradStatus",
        show: false,
        opened: [],
        displayMessage: null,
        smallScreen: false,
        window: {
          width: 0,
          height: 0
        },
        courseViewMode: "showAllCourses",
        moreStudentInfo: false,
      };
    },
    computed: {
      ...mapGetters({
        profile: "getStudentProfile",
        courses: "getStudentCourses",
        studentFullName: "getStudentFullName",
        assessments: "getStudentAssessments",
        exams: "getStudentExams",
        studentHasCourses: "studentHasCourses",
        studentHasAssessments: "studentHasAssessments",
        studentHasNotes: "studentHasNotes",
        gradInfo: "getStudentGraduationCreationAndUpdate",
        hasGradStatus: "studentHasGradStatus",
        studentGradStatus: "getStudentGradStatus",
        token: "auth/getToken",
        studentId: "getStudentId",
        studentPen: "getStudentPen",
        studentInfo: "getStudentProfile",
        studentNotes: "getStudentNotes",
        optionalPrograms: "getStudentOptionalPrograms",    
        ungradReasons: "app/getUngradReasons",      
        studentUngradReasons: "getStudentUngradReasons",
        gradCourses: "gradStatusCourses",
        studentHistory: 'getStudentAuditHistory',
        optionalProgramHistory: 'getStudentOptionalProgramAuditHistory',
      }),
    },
    
    destroyed() {
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      ungraduateStudent(){
        this.tabLoading = true;
        let ungradCode = this.ungradReasonSelected;
        let ungradDesc = this.ungradReasonDesc;
        if(ungradCode != "OTH"){
          ungradDesc = this.ungradReasons.filter(function (reason){  
            return reason.code == ungradCode;
          });
          ungradDesc = ungradDesc[0].description;
        }
        StudentService.ungradStudent(
          this.studentId,
          ungradCode,
          ungradDesc,
          this.token
        )
          .then(() => {
            StudentService.getStudentUngradReasons(this.studentId, this.token).then(
              (response) => {           
                this.$store.dispatch("setStudentUngradReasons", response.data);
              }
            ).catch((error) => {
              if(error.response.status){
                // this.$bvToast.toast("ERROR " + error.response.statusText, {
                //   title: "ERROR" + error.response.status,
                //   variant: 'danger',
                //   noAutoHide: true,
                // });
                this.showNotification(
                  "danger",
                  "There was an error: " + error.response.status
                );
              }
            });            
            StudentService.getGraduationStatus(this.studentId, this.token).then(
              (response) => {
                this.$store.dispatch("setStudentGradStatus", response.data);
                this.tabLoading= false;
              }
            ).catch((error) => {
              this.tabLoading = false;
              if(error.response.status){
                this.$bvToast.toast("ERROR " + error.response.statusText, {
                  title: "ERROR" + error.response.status,
                  variant: 'danger',
                  noAutoHide: true,
                });
              }
            });
            this.getStudentReportsAndCertificates(this.studentId, this.studentPen);   
          })
          .catch((error) => {
            this.tabLoading= false;
            // eslint-disable-next-line
            console.log(error.response);
            this.showNotification(
              "danger",
              "There was an error: " + error.response.data.messages[0].message
            );
          });
      },
      resetUngraduateStudent(){
        this.ungradReasonSelected = "";
        this.ungradReasonDesc = "";
      },
      getStudentReportsAndCertificates(id, pen){
        GraduationCommonService.getStudentCertificates(id, this.token).then(
          (response) => {          
            this.$store.dispatch("setStudentCertificates", response.data);
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
        GraduationCommonService.getStudentReports(id, this.token).then(
          (response) => {                     
            this.$store.dispatch("setStudentReports", response.data);
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
        GraduationCommonService.getStudentTranscripts(id, this.token).then(
          (response) => {        
            this.$store.dispatch("setStudentTranscripts", response.data);
          }
        ).catch((error) => {
          if(error.response.status){
            this.$bvToast.toast("ERROR " + error.response.statusText, {
              title: "Service ERROR" + error.response.status,
              variant: 'danger',
              noAutoHide: true,
            });
          }
        }); 
        GraduationCommonService.getStudentXmlReport(pen, this.token).then(
          (response) => {        
            this.$store.dispatch("setStudentXmlReport", response.data);
          }
        ).catch((error) => {
          if(error.response.status == 404){
            // eslint-disable-next-line
            console.log(error);
          } else {
            this.$bvToast.toast("ERROR " + error.response.statusText, {
              title: "Service ERROR" + error.response.status,
              variant: 'danger',
              noAutoHide: true,
            });
          }
        });                       
      },
      reloadGradStatus(){  
        StudentService.getGraduationStatus(this.studentId, this.token).then(
          (res) => {
            this.$store.dispatch("setStudentGradStatus", res.data);
          }          
        ).catch((error) => {
          if(error.res.status){
            this.$bvToast.toast("ERROR " + error.res.statusText, {
              title: "ERROR" + error.res.status,
              variant: 'danger',
              noAutoHide: true,
            });
          }
        }); 
        this.getStudentReportsAndCertificates(this.studentId, this.studentPen);                                        
        this.tabLoading = false;
      },
      graduateStudent(){
        this.selectedTab = 0;
        this.tabLoading = true; 
        GraduationService.graduateStudent(this.studentId, this.token).then(() => {
          // this.reloadGradStatus();
          this.loadStudent(this.studentId);    
        }).catch((error) => {
          this.tabLoading = false; 
          if(error.response.status){
            this.$bvToast.toast("ERROR " + error.response.statusText, {
              title: "ERROR" + error.response.status,
              variant: 'danger',
              noAutoHide: true,
            });
          }
        });
      },
      updateStudentReports(){
        this.selectedTab = 0;
        this.tabLoading = true; 
        GraduationService.updateStudentReports(this.studentId, this.token).then(() => {
          this.getStudentReportsAndCertificates(this.studentId, this.studentPen);
          StudentService.getGraduationStatus(this.studentId, this.token).then(
            (res) => {             
              this.$store.dispatch("setStudentGradStatus", res.data);
              this.tabLoading= false;
            }          
          ).catch((error) => {
            if(error.res.status){
              this.$bvToast.toast("ERROR " + error.res.statusText, {
                title: "ERROR" + error.res.status,
                variant: 'danger',
                noAutoHide: true,
              });
            }
          }); 
          
        }).catch((error) => {       
          if(error.response.status){
            this.$bvToast.toast("ERROR " + error, {
              title: "ERROR" + error.response.status.response,
              variant: 'danger',
              noAutoHide: true,
            });
            this.tabLoading= false;
          }
        });
       
      },      
      projectedGradStatusWithFinalMarks(){
        this.tabLoading = true; 
        GraduationService.projectedGradFinalMarks(this.studentId, this.token) .then((response) => {
          this.projectedGradStatus = JSON.parse(response.data.graduationStudentRecord.studentGradData);
          this.projectedOptionalGradStatus = response.data.studentOptionalProgram;
          for (let i = 0; i < this.projectedOptionalGradStatus.length; i++) {
            this.projectedOptionalGradStatus[i].studentOptionalProgramData = JSON.parse(this.projectedOptionalGradStatus[i].studentOptionalProgramData);
          } 
          this.$refs['projectedGradStatusWithFinalMarks'].show();
          this.tabLoading = false; 
          this.getStudentReportsAndCertificates(this.studentId, this.studentPen);
        }).catch((error) => {
          this.tabLoading = false; 
          if(error.response.status){
            this.$bvToast.toast("ERROR " + error.response.statusText, {
              title: "ERROR" + error.response.status,
              variant: 'danger',
              noAutoHide: true,
            });
          }
        });
      },
      projectedGradStatusWithFinalAndReg() {
        this.nonGradReasons = this.studentGradStatus.studentGradData.nonGradReasons;
        this.tabLoading = true; 
        GraduationService.projectedGradStatusWithFinalAndReg(this.studentId, this.token) .then((response) => {
          this.projectedGradStatus = response.data;
          this.projectedGradStatus = JSON.parse(this.projectedGradStatus.graduationStudentRecord.studentGradData);
          this.projectedOptionalGradStatus = response.data.studentOptionalProgram;
          for (let i = 0; i < this.projectedOptionalGradStatus.length; i++) {
            this.projectedOptionalGradStatus[i].studentOptionalProgramData = JSON.parse(this.projectedOptionalGradStatus[i].studentOptionalProgramData);
          } 
          this.projectedrequirementsMet = this.projectedGradStatus.requirementsMet;
          this.$refs['projectedGradStatusWithFinalAndReg'].show();
          this.tabLoading = false; 
          this.getStudentReportsAndCertificates(this.studentId,this.studentPen);
        }).catch((error) => {
          if(error.response.status){
            this.tabLoading = false; 
            this.showNotification(
              "danger",
              "There was an error with the Graduation Service (projected Grad Status with Final and Reg): " + error.response.status
            );
          }
        });
      },
      closeRecord: function () {
        this.$store.commit("unsetStudent");
      },
      handleResize() {
        this.window.width = window.innerWidth;
        this.window.height = window.innerHeight;
        if (this.window.width < 992) {
          this.smallScreen = true;
        } else {
          this.smallScreen = false;
        }
      },
      loadStudent(studentIdFromURL) {
        StudentService.getStudentByPen(this.pen, this.token).then((response) => {
          this.$store.dispatch('setStudentProfile', response.data);
        }).catch((error) => {
          if(error.response.status){
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Student using PEN): " + error.response.status
            );
          }  
        });
        AssessmentService.getStudentAssessment(this.pen, this.token).then((response) => {
          this.$store.dispatch('setStudentAssessments', response.data);
        }).catch((error) => {
          if(error.response.status){
            this.showNotification(
              "danger",
              "There was an error with the Assessment Service: " + error.response.status
            );
          }
        });
        StudentService.getGraduationStatus(studentIdFromURL, this.token).then(
          (response) => {
            this.$store.dispatch("setStudentGradStatus", response.data);
          }
        ).catch((error) => {
          if(error.response.status){
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Graduation Status): " + error.response.status
            );
          }
        });
        StudentService.getGraduationStatusOptionalPrograms(studentIdFromURL, this.token).then(
          (response) => {
            this.$store.dispatch("setStudentGradStatusOptionalPrograms", response.data);
        }).catch((error) => {
          if(error.response.status){
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Graduation Status Optional Programs): " + error.response.status
            );
          }
        });
        StudentService.getStudentCareerPrograms(studentIdFromURL, this.token).then(
          (response) => {
            this.$store.dispatch("setStudentCareerPrograms", response.data);
        }
        ).catch((error) => {
          if(error.response.status){
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Student Career Programs): " + error.response.status
            );
          }
        });        
        CourseService.getStudentCourseAchievements(this.pen, this.token).then(
          (response) => {
            
            this.$store.dispatch("setStudentCourses", response.data);
          }
        ).catch((error) => {
          if(error.response.status){
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Student Course Achievements): " + error.response.status
            );
          }
        });
        CourseService.getStudentExamDetails(this.pen, this.token).then(
          (response) => {           
            this.$store.dispatch("setStudentExams", response.data);
          }
        ).catch((error) => {
          if(error.response.status){
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Student Exam Details): " + error.response.status
            );
          }
        });
        StudentService.getStudentNotes(studentIdFromURL, this.token).then(
          (response) => {           
            this.$store.dispatch("setStudentNotes", response.data);
          }
        ).catch((error) => {
          if(error.response.status){
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Student Notes): " + error.response.status
            );
          }
        });
        this.getStudentReportsAndCertificates(studentIdFromURL, this.pen);
        StudentService.getStudentUngradReasons(studentIdFromURL, this.token).then(
          (response) => {         
            this.$store.dispatch("setStudentUngradReasons", response.data);
          }
        ).catch((error) => {
          if(error.response.status){ 
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Undo Completion Reasons): " + error.response.status
            );
          }
        });    
        StudentService.getStudentHistory(studentIdFromURL, this.token).then(
            (response) => {
              this.$store.dispatch("setStudentAuditHistory", response.data);
            }
        ).catch((error) => {
          if(error.response.status){
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Student History): " + error.response.status
            );
          }
        });
        StudentService.getStudentOptionalProgramHistory(studentIdFromURL, this.token).then(
          (response) => {
  
            this.$store.dispatch("setStudentOptionalProgramsAuditHistory", response.data);
        }).catch((error) => {
          if(error.response.status){
            this.showNotification(
              "danger",
              "There was an error with the Student Service (getting the Student Optional Program History): " + error.response.status
            );
          }
        });
        this.tabLoading = false;
      },//loadStudent
    },
  };
</script>

<style scoped>
  .student-profile{
    padding-left: 25px;
    padding-right: 25px;
  }
  .grad-actions{
    position: absolute;
    right: 0;
    top: -100px
  }
  .profile-info{
    font-size: 29px;

  }
  .profile-info button{
    font-size: 29px;
    box-shadow: none !important;
    padding:0px;
    color: #313132
  }
  .profile-info button.btn.btn-link:focus{
    border: none !important;
  
  }
  .close-record {
    float: right;
    text-align: center;
  }

  .close-record .dropdown-menu.show {
    left: -120px !important;
  }

  .tab-loading {
    color: green !important;
  }

  .student-info {
    margin: 10px 0px;
    float: left;
  }

  .card {
    border-radius: 0px !important;
  }

  header.card-header button {
    border-radius: 0px !important;
  }

  .no-underline {
    text-decoration: none;
  }
  .profile-name-data{
    word-break: break-all;
    max-width:400px;
  }
  .profile-name label {
    font-size: 11px;
    float: left;
    clear: both;
    padding: 5px 0;
    margin-bottom: 0px;
    width: 100%;
    color: #036;
    border-bottom: 1px dotted #ccc;
  }
  .profile-name td {
      padding: 0px 10px
  }

  #filter-dropdown {
    position: absolute;
    right: 0;
    top: 0;
  }
  .link-active{
    text-decoration: none;
    border-bottom: 3px solid black;
  }
  .record-timestamp{
    position:absolute;
    right: 50px;
  }
  .optionalProgramName{
    margin-top: 1rem;
  }
</style>