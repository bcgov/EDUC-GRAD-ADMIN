<template>
  <div>

    <b-card no-body class="col-12 px-0 mx-0" v-if="!hasGradStatus">

      <b-button block v-b-toggle.accordion-1 variant="info" class="text-left"><i class="fas fa-info-circle primary"></i>
        Student graduation
        information</b-button>

      <b-card-body>
        <b-card-text>
          {{studentGradStatus}}
          <div v-if="!hasGradStatus">


            <i class="fas fa-info-circle primary"></i> {{studentFullName.studGiven }} does not have a Graduation Status

          </div>
        </b-card-text>
      </b-card-body>

    </b-card>

    <div class="accordion col-12 px-0 mx-0" role="tablist" v-if="hasGradStatus">
      <b-card no-body class="col-12 px-0 mx-0">

        <b-button block v-b-toggle.accordion-1 variant="info" class="text-left pt-4"><i
            class="fas fa-info-circle primary"></i> Student graduation
          information</b-button>

        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              <div class="row">
                <div class="col-12">
                  <div>
                    <button @click="projectGraduationStatus(studentPen)" class="w-50 float-left btn-primary btn-sm">
                      <i class="fas fa-eye"></i> Projected<br> Graduation Status
                    </button>

                    <b-modal id="modal-1" size="lg" >
                      <div v-if="showModal" class="row col-12">
                        <div class="col-12 header">
                            <h2>Projected Graduation status</h2>
                          </div>

                        <div class="col-6">
                          <div class="col-12 header">
                            <h4>Graduation status</h4>
                          </div>

                          <ul>
                            <li>
                              <strong>Program:</strong>
                              {{ projectedStudentGradStatus.program }}
                            </li>
                            <li>
                              <strong>Program completion date:</strong>
                              {{ projectedStudentGradStatus.programCompletionDate }}
                            </li>
                            <li>
                              <strong>Program at graduation:</strong>
                              {{ projectedStudentGradStatus.gradProgramAtGraduation }}
                            </li>
                            <li>
                              <strong>School of Record:</strong>
                              <li>
                        <strong>School of Record:</strong>
                               <div class="p-2">

                                <span class="link" href="#" id="popover-button-sync"
                                  variant="primary">{{projectedStudentGradStatus.studentGradData.school.schoolName}}
                                  ({{projectedStudentGradStatus.studentGradData.school.minCode}})
                                </span>
                              </div>
                          <b-popover :show.sync="show" :boundary-padding="50" target="popover-button-sync"
                            title="School Information">
                            <p><strong>District:</strong> {{projectedStudentGradStatus.studentGradData.school.districtName}}</p>
                            <p><strong>Certificate eligibility:</strong>
                              {{projectedStudentGradStatus.studentGradData.school.certificateEligibility}}</p>
                            <p><strong>Independent:</strong> {{projectedStudentGradStatus.studentGradData.school.independentDesignation}}
                            </p>
                            <p><strong>Mailer type:</strong> {{projectedStudentGradStatus.studentGradData.school.mailerType}}</p>
                            <p><strong>Address:</strong> {{projectedStudentGradStatus.studentGradData.school.address1}}</p>
                            <p><strong>Postal:</strong> {{projectedStudentGradStatus.studentGradData.school.postal}}</p>
                            <b-button class="px-1" @click="popClose">Close</b-button>
                          </b-popover>


                      
          
        
                            </li>
                            <li v-if="projectedStudentGradStatus.studentGrade">
                              <strong>Grade at graduation:</strong>
                              {{ projectedStudentGradStatus.studentGrade }}
                            </li>

                            <li v-if="projectedStudentGradStatus.graduationDate">
                              <strong>Graduation Date:</strong>
                              {{ projectedStudentGradStatus.graduationDate }}
                            </li>
                            <li>
                              <strong>Credits used for Graduation:</strong>
                              {{ projectedStudentGradStatus.creditsUsedForGrad }}
                            </li>
                            <li v-if="projectedStudentGradStatus.gpa">
                              <strong>GPA:</strong> {{ projectedStudentGradStatus.gpa }}
                            </li>
                            <li v-if="projectedStudentGradStatus.honoursFlag">
                              <strong>Honours:</strong>
                              {{ projectedStudentGradStatus.honoursFlag }}
                            </li>

                            <li v-if="projectedStudentGradStatus.sccpGraduationDate">
                              <strong>School Completion Certificate Program (SCCP)
                                Graduation Date:</strong>{{ projectedStudentGradStatus.sccpGraduationDate }}
                            </li>
                            <li v-if="projectedStudentGradStatus.schoolAtGrad">
                              <strong>School at Graduation:</strong>{{ projectedStudentGradStatus.schoolAtGrad }}
                            </li>
                            <li v-if="projectedStudentGradStatus.studentGradeAtGraduation">
                              <strong>Grade at Graduation:</strong>{{ projectedStudentGradStatus.studentGradeAtGraduation }}
                            </li>
                          </ul>

                          <!-- Student Certifications and Diplomas -->
                          <div class="col-12 header">
                            <h4>Certification/Dogwoods</h4>
                          </div>
                          <ul>
                            <li v-if="projectedStudentGradStatus.certificateType1">
                              <strong>Certificate #1:</strong>
                              {{ projectedStudentGradStatus.certificateType1 }}
                              <br>
                              <span v-if="projectedStudentGradStatus.certificateType1Date">
                                <strong>Date obtained:</strong>
                                {{ projectedStudentGradStatus.certificateType1Date }}
                              </span>
                            </li>
                          </ul>
                          <ul>
                            <li v-if="projectedStudentGradStatus.certificateType2">
                              <strong>Certificate #2:</strong>
                              {{ projectedStudentGradStatus.certificateType2 }}
                              <br>
                              <span v-if="projectedStudentGradStatus.certificateType2Date">
                                <strong>Date obtained:</strong>
                                {{ projectedStudentGradStatus.certificateType2Date }}
                              </span>
                            </li>
                          </ul>
                          <ul>

                            <li v-if="projectedStudentGradStatus.dualDogwoodEligibility">
                              <strong>Dual Dogwood</strong>{{ projectedStudentGradStatus.dualDogwoodEligibility }}
                            </li>
                            <li v-if="projectedStudentGradStatus.transcriptDate">
                              <strong>Transcript Date:</strong>
                              {{ projectedStudentGradStatus.transcriptDate }}
                            </li>

                          </ul>
                          <!-- Programs -->
                          <div class="col-12 header">
                            <h4>Special programs</h4>

                          </div>
                          <ul>

                            <li v-if="projectedStudentGradStatus.frenchProgramParticipation">
                              <strong>Program Cadre:</strong>
                              {{ projectedStudentGradStatus.frenchProgramParticipation }}
                            </li>
                            <li v-if="projectedStudentGradStatus.advancePlacementParticipation">
                              <strong>AP:</strong>
                              {{ projectedStudentGradStatus.advancePlacementParticipation }}
                            </li>
                            <li v-if="projectedStudentGradStatus.careerProgramParticipation">
                              <strong>Career Program:</strong>
                              {{ projectedStudentGradStatus.careerProgramParticipation }}
                            </li>
                            <li v-if="projectedStudentGradStatus.recalculateFlag">
                              <strong>Recalculate Flag</strong>{{ projectedStudentGradStatus.recalculateFlag }}
                            </li>
                            <li v-if="projectedStudentGradStatus.ibParticipationFlag">
                              <strong>IB:</strong>
                              {{ projectedStudentGradStatus.ibParticipationFlag }}
                            </li>
                          </ul>
                        </div>
                        <div class="col-6">
                          <div class="col-12 header pl-0">
                            <h4>Requirements Met</h4>
                          </div>

                          <ul class="requirements-met px-0">
                            <li v-for="requirement in projectedStudentGradStatus.studentGradData.requirementsMet"
                              :key="requirement.rule">
                              <i class="fas fa-check-circle text-success"></i>{{ requirement.description }}
                              (Rule {{ requirement.rule }})
                            </li>
                          </ul>

                          <div class="col-12 header pl-0">
                            <h4>Requirements Not Met</h4>
                          </div>
                          <ul class="requirements-met px-0">
                            <li v-for="requirement in projectedStudentGradStatus.studentGradData.nonGradReasons"
                              :key="requirement.rule">
                              <i class="fas fa-check-circle text-success"></i> {{ requirement.description }}
                              (Rule {{ requirement.rule }})
                            </li>
                          </ul>
                        </div>
                      </div>



                    </b-modal>
                  </div>


                  <button v-on:click="updateGraduationStatus(studentPen)" class="float-right w-50 btn-primary btn-sm">
                    <i class="fas fa-sync"></i> Run Graduation<br>Algorithm
                  </button>
                </div>
                <div class="graduation-status-content col-12 px-0 mx-0">
                  <div>
                    <!-- Student Graduation Status -->
                    <div class="col-12 header">
                      <h2>Graduation status</h2>
                      <button v-on:click="editGradStatus" class="btn-sm">
                        <span v-if="!showEdit"> Edit</span><span v-if="showEdit"> Cancel</span>
                      </button>
                      <button v-on:click="saveEditedGradStatus(studentPen)" class="btn-primary">
                        <span> Save</span>
                      </button>
                    </div>

                    <ul>
                      <li v-if="!showEdit">
                        <strong>Program:</strong>
                        {{ studentGradStatus.program }}
                      </li>
                      <li v-if="showEdit">
                        <strong>Program:</strong><b-input v-model='editedGradStatus.program'></b-input>      
                      </li>
                      
                      <li v-if="!showEdit">
                        <strong>Program completion date:</strong>
                        {{ studentGradStatus.programCompletionDate }}
                      </li>
                      <li v-if="showEdit">
                        <strong>Program completion date:</strong><b-input v-model='editedGradStatus.programCompletionDate'></b-input>      
                      </li>
                      <li>
                        <strong>Program at graduation:</strong>
            
                        {{ studentGradStatus.gradProgramAtGraduation }}
                      </li>
                       <!-- <li v-if="showEdit">
                        <strong>Program at graduation:</strong><b-input v-model='editedGradStatus.gradProgramAtGraduation'></b-input>      
                      </li> -->
                      <li>
                        <strong>School of Record:</strong>
                               <div class="p-2">

                                <span class="link" href="#" id="popover-button-sync"
                                  variant="primary">{{studentGradStatus.studentGradData.school.schoolName}}
                                  ({{studentGradStatus.studentGradData.school.minCode}})
                                </span>
                              </div>
                          <b-popover :show.sync="show" :boundary-padding="50" target="popover-button-sync"
                            title="School Information">
                            <p><strong>District:</strong> {{studentGradStatus.studentGradData.school.districtName}}</p>
                            <p><strong>Certificate eligibility:</strong>
                              {{studentGradStatus.studentGradData.school.certificateEligibility}}</p>
                            <p><strong>Independent:</strong> {{studentGradStatus.studentGradData.school.independentDesignation}}
                            </p>
                            <p><strong>Mailer type:</strong> {{studentGradStatus.studentGradData.school.mailerType}}</p>
                            <p><strong>Address:</strong> {{studentGradStatus.studentGradData.school.address1}}</p>
                            <p><strong>Postal:</strong> {{studentGradStatus.studentGradData.school.postal}}</p>
                            <b-button class="px-1" @click="popClose">Close</b-button>
                          </b-popover>
                      </li>
                      <li v-if="studentGradStatus.studentGrade">
                        <strong>Grade at graduation:</strong>
                        {{ studentGradStatus.studentGrade }}
                      </li>

                      <li v-if="studentGradStatus.graduationDate">
                        <strong>Graduation Date:</strong>
                        {{ studentGradStatus.graduationDate }}
                      </li>
                      <li>
                        <strong>Credits used for Graduation:</strong>
                        {{ studentGradStatus.creditsUsedForGrad }}
                      </li>
                      <li v-if="!showEdit">
                        <strong>GPA:</strong> {{ studentGradStatus.gpa }}
                      </li>
                       <li v-if="showEdit">
                        <strong>GPA:</strong><b-input v-model='editedGradStatus.gpa'></b-input>      
                      </li>
                      <li v-if="studentGradStatus.honoursFlag">
                        <strong>Honours:</strong>
                        {{ studentGradStatus.honoursFlag }}
                      </li>

                      <li v-if="studentGradStatus.sccpGraduationDate">
                        <strong>School Completion Certificate Program (SCCP)
                          Graduation Date:</strong>{{ studentGradStatus.sccpGraduationDate }}
                      </li>
                      <li v-if="studentGradStatus.schoolAtGrad">
                        <strong>School at Graduation:</strong>{{ studentGradStatus.schoolAtGrad }}
                      </li>
                      <li v-if="studentGradStatus.studentGradeAtGraduation">
                        <strong>Grade at Graduation:</strong>{{ studentGradStatus.studentGradeAtGraduation }}
                      </li>
                    </ul>

                    <!-- Student Certifications and Diplomas -->
                    <div class="col-12 header">
                      <h2>Certification/Dogwoods</h2>
                    </div>
                    <ul>
                      <li v-if="studentGradStatus.certificateType1">
                        <strong>Certificate #1:</strong>
                        {{ studentGradStatus.certificateType1 }}
                        <br>
                        <span v-if="studentGradStatus.certificateType1Date">
                          <strong>Date obtained:</strong>
                          {{ studentGradStatus.certificateType1Date }}
                        </span>
                      </li>
                    </ul>
                    <ul>
                      <li v-if="studentGradStatus.certificateType2">
                        <strong>Certificate #2:</strong>
                        {{ studentGradStatus.certificateType2 }}
                        <br>
                        <span v-if="studentGradStatus.certificateType2Date">
                          <strong>Date obtained:</strong>
                          {{ studentGradStatus.certificateType2Date }}
                        </span>
                      </li>
                    </ul>
                    <ul>

                      <li v-if="studentGradStatus.dualDogwoodEligibility">
                        <strong>Dual Dogwood</strong>{{ studentGradStatus.dualDogwoodEligibility }}
                      </li>
                      <li v-if="studentGradStatus.transcriptDate">
                        <strong>Transcript Date:</strong>
                        {{ studentGradStatus.transcriptDate }}
                      </li>

                    </ul>
                    <!-- Programs -->
                    <div class="col-12 header">
                      <h2>Special programs</h2>

                    </div>
                    <ul>

                      <li v-if="studentGradStatus.frenchProgramParticipation">
                        <strong>Program Cadre:</strong>
                        {{ studentGradStatus.frenchProgramParticipation }}
                      </li>
                      <li v-if="studentGradStatus.advancePlacementParticipation">
                        <strong>AP:</strong>
                        {{ studentGradStatus.advancePlacementParticipation }}
                      </li>
                      <li v-if="studentGradStatus.careerProgramParticipation">
                        <strong>Career Program:</strong>
                        {{ studentGradStatus.careerProgramParticipation }}
                      </li>
                      <li v-if="studentGradStatus.recalculateFlag">
                        <strong>Recalculate Flag</strong>{{ studentGradStatus.recalculateFlag }}
                      </li>
                      <li v-if="studentGradStatus.ibParticipationFlag">
                        <strong>IB:</strong>
                        {{ studentGradStatus.ibParticipationFlag }}
                      </li>
                    </ul>
                    <div class="col-12 header">
                      <h2>Graduation reports</h2>
                    </div>
                    <div class="col-12">

                      <ul>
                        <li>
                          <a v-on:click="getStudentAchievementReportPDF" href="#" class="">Achievement Report (PDF)</a>
                        </li>
                        <li>
                          <a v-on:click="getStudentTranscriptPDF" href="#" class="">Transcript (PDF)</a>
                        </li>
                      </ul>
                    </div>

                  </div>
                </div>
              </div>
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card no-body class="col-12 px-0 mx-0">
        <b-button block v-b-toggle.accordion-2 variant="info" class="text-left"><i
            class="fas fa-times-circle text-danger"></i> Requirements not
          met ({{studentGradStatus.studentGradData.nonGradReasons.length}}) </b-button>

        <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              <ul v-if="!studentGradStatus.studentGradData.nonGradReasons.length">
                <li>All graduation requirements have been met</li>
              </ul>
              <ul v-if="studentGradStatus.studentGradData.nonGradReasons.length" class="non-grad-reasons px-0">
                <li v-for="requirement in studentGradStatus.studentGradData.nonGradReasons" :key="requirement.rule">
                  <i class="fas fa-check-circle text-danger"></i> {{ requirement.description }} (Rule
                  {{ requirement.rule }})
                </li>
              </ul>
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>

      <b-card no-body class="col-12 px-0 mx-0">

        <b-button block v-b-toggle.accordion-3 variant="info" class="text-left"><i
            class="fas fa-check-circle text-success"></i> Requirements met
          ({{studentGradStatus.studentGradData.requirementsMet.length}} )</b-button>

        <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>


              <ul class="requirements-met px-0">
                <li v-for="requirement in studentGradStatus.studentGradData.requirementsMet" :key="requirement.rule">
                  <i class="fas fa-check-circle text-success"></i> <a href="#"
                    @click='getCourseCompletedProgramCode(requirement.rule,studentGradStatus.studentGradData.studentCourses.studentCourseList)'>{{ requirement.description }}
                    (Rule {{ requirement.rule }})</a>


                </li>
              </ul>
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>


    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";
  import GraduationCommonService from "@/services/GraduationCommonService.js";
  import GraduationService from "@/services/GraduationService.js";
  import GraduationStatusService from "@/services/GraduationStatusService.js";

  export default {
    name: "StudentGraduationStatus",

    computed: {
      ...mapGetters({
        studentGradStatus: "getStudentGradStatus",
        hasGradStatus: "studentHasGradStatus",
        studentPen: "getStudentPen",
        studentFullName: "getStudentFullName",
        token: "getToken",
      }),


    },
    data() {
      return {
        showModal: false,
        showEdit:false,
        show: false,
        projectedStudentGradStatus: [],
        updateStatus:[],
        editedGradStatus: {
            createdBy:"",
            createdTimestamp: "",
            updatedBy: "",
            updatedTimestamp: "",
            pen: "",
            program: "TEST",
            programCompletionDate: null,
            gpa: "",
            honoursStanding: null,
            recalculateGradStatus: null,
            schoolOfRecord: "",
            studentGrade: ""
          }
      };
    },
    created() {},
    methods: {
      editGradStatus() {
        this.showEdit = !this.showEdit;
        this.editedGradStatus.pen = this.studentGradStatus.pen;
        this.editedGradStatus.program = this.studentGradStatus.program;  
        this.editedGradStatus.gpa = this.studentGradStatus.gpa;  
      },

      saveEditedGradStatus(pen) {
        GraduationStatusService.editGraduationStatus(pen, this.token, this.editedGradStatus)
          .then((response) => {
            this.updateStatus = response.data;
            this.studentGradStatus.program = this.editedGradStatus.program;
            this.studentGradStatus.gpa = this.editedGradStatus.gpa;
            console.log('Update status: ' + this.updateStatus);
          }).catch((error) => {
          // eslint-disable-next-line
          console.log('There was an error:' + error.response);
        });
      },

      popClose() {
        this.show = false;
      },

      projectGraduationStatus(pen) {
      //  console.log( "PROJECTED" + this.projectedStudentGradStatus);
        GraduationStatusService.getGraduationStatus(pen, this.token) .then((response) => {
            this.projectedStudentGradStatus = response.data;
            this.projectedStudentGradStatus.studentGradData = JSON.parse(this.projectedStudentGradStatus.studentGradData); 
            //console.log( "PROJECTED" + this.projectedStudentGradStatus);
            this.$bvModal.show("modal-1");
            this.showModal = true;
        }).catch((error) => {
          // eslint-disable-next-line
          console.log('There was an error:' + error.response);
        });
      },

      updateGraduationStatus: function (pen) {
        // eslint-disable-next-line no-use-before-define
        GraduationService.graduateStudent(pen, this.token).then((response) => {
          //console.log(response.data);
          this.$store.dispatch("setStudentGradStatus", response.data);
        }).catch((error) => {
          // eslint-disable-next-line
          console.log('There was an error:' + error.response);
        });
      },
      getStudentAchievementReportPDF: function () {
        GraduationCommonService.getAchievementReport(this.studentGradStatus.pen, this.token)
          .then((response) => {
            //Create a Blob from the PDF Stream
            const file = new Blob(
              [response.data], {
                type: 'application/pdf'
              });
            //Build a URL from the file
            if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE
              window.navigator.msSaveOrOpenBlob(file);
            } else {
              const fileURL = URL.createObjectURL(file);
              window.open(fileURL); //Open the URL on new Window
            }
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            //console.log('There was an error:' + error.response);
          });
      },
      getStudentTranscriptPDF: function () {
      //  console.log("transcript");
        GraduationCommonService.getStudentTranscript(this.studentGradStatus.pen, this.token)
          .then((response) => {
            //Create a Blob from the PDF Stream
            const file = new Blob(
              [response.data], {
                type: 'application/pdf'
              });
            //Build a URL from the file
            if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE
              window.navigator.msSaveOrOpenBlob(file);
            } else {
              const fileURL = URL.createObjectURL(file);
              window.open(fileURL); //Open the URL on new Window
            }
          })
          // eslint-disable-next-line no-unused-vars
          .catch((error) => {
            //console.log('There was an error:' + error.response);
          });
      },
    },
  };
</script>

<style scoped>
  .graduation-status-content .header {
    border-bottom: 1px solid #ccc;
    font-weight: bold;
    color: #517195;
    margin: 10px 0px;
    background: #f2f2f2 !important;

  }

  .graduation-status-content .header h2 {
    font-size: 16px;
    margin: 0px !important;
    padding: 10px;
  }

  ul.requirements-met,
  ul.non-grad-reasons {
    list-style: none;
  }

  ul.requirements-met li,
  ul.non-grad-reasons li {
    border-bottom: 1px solid #ccc;
  }

  .card-header>button {
    border-radius: 0px !important;
  }

  .card-header {
    padding: 0px 0px !important;
  }

  .card {
    border-radius: 0px;
  }

  .accordion>.card .card-header {
    padding: 0px !important;
  }

  .btn {
    border-radius: 0px !important;
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
  h5.modal-title{
    font-size: 30px !important;
  }
</style>

