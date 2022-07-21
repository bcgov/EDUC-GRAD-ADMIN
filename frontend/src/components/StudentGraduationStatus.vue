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
    <!-- GRAD Status View -->
    <div class="row px-2">
      <div class="col-12 col-xl-4 col-lg-12 px-2 pb-2">
        <GRADStatus></GRADStatus>
      </div>
      <div class="row col-12 col-xl-8 col-lg-12 px-0 m-0">
        <div class="col-12 col-lg-6 px-2"> 
          <NoncompletionReasons></NoncompletionReasons>
        </div>
        <div class="col-12 col-lg-6 px-2"> 
          <StudentGraduationReports></StudentGraduationReports>         
          <CertificationDogwoods></CertificationDogwoods>
        </div>
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
import sharedMethods from '../sharedMethods';
import NoncompletionReasons from "@/components/GraduationStatus/NoncompletionReasons";
import StudentGraduationReports from "@/components/GraduationStatus/StudentGraduationReports";
import CertificationDogwoods from "@/components/CertificationDogwoods";
import GRADStatus from "@/components/GraduationStatus/GRADStatus";

export default {
  name: "StudentGraduationStatus",
  components: {
    NoncompletionReasons: NoncompletionReasons,
    StudentGraduationReports: StudentGraduationReports,
    CertificationDogwoods: CertificationDogwoods,
    GRADStatus: GRADStatus
  },
  computed: {
    ...mapGetters({
      studentGradStatus: "getStudentGradStatus",
      hasGradStatus: "studentHasGradStatus",
      studentGradRequirementCourses: "gradStatusCourses",   
      studentPen: "getStudentPen",
      studentFullName: "getStudentFullName",
      role: "getRoles",
      optionalPrograms: "getStudentOptionalPrograms",
      programOptions: "app/getProgramOptions",
      studentStatusOptions: "app/getStudentStatusOptions",
      studentId: "getStudentId",
      username: "getUsername",
      certificates: "getStudentCertificates",  
      reports: "getStudentReports",
      transcripts: "getStudentTranscripts"
    }),
  },
  data() {
    return {
      programDropdownList: [],
      disableButton:false,
    };
  },
  created() {
    this.programDropdownList = this.$store.dispatch("getGraduationPrograms");
    this.disableButton = false;
    this.showNotification = sharedMethods.showNotification;
  },
  methods: {
    getStudentStatus(code) {
      return sharedMethods.getStudentStatus(code, this.studentStatusOptions);
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

