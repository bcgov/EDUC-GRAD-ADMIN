<template>
  <div class="graduation-reports pb-2">
    <b-card
      header="Student Transcript Reports"
      no-body
    > 
      <b-card-text class="py-4">
        <div v-if="studentGradStatus.studentGradData">
          <div v-if="studentGradStatus.studentGradData.school">
            <div v-if="studentGradStatus.studentGradData.school.transcriptEligibility === 'N'">
              <b-alert show variant="info" class="p-3 mb-1 mx-3">
                <h4 class="alert-heading">Ineligible for Ministry transcripts</h4>
                <p class="locked-message">
                  This student's school is ineligible for Ministry transcripts.
                </p>
              </b-alert>
            </div>
              
        <div v-if="reports">
          <div v-for="(report, index) in reports" :key="index" class="px-3 w-100 float-left">
            <a  @click="downloadPDF(report.report,'application/pdf')" href="#" class="pdf-link float-left mt-2">{{report.gradReportTypeLabel}} (PDF)</a> 
            <div class="float-left col-12 pr-4 ml-1">
              <ul>
                <li>
                  <strong>Status:</strong> {{report.documentStatusLabel}} 
                </li>
                <li>
                  <strong>Last Updated:</strong> {{report.updateDate | formatTime}} 
                </li>
                <!-- <li>
                  <strong>Distributed:</strong> {{report.distributionDate | formatTime}}
                </li> -->
              </ul>
            </div>
          </div>
          </div>        
        <div v-if="transcripts">
          <div  v-for="transcript in transcripts" :key="transcript.id" class="px-3 w-100 float-left mt-2">
            <a  @click="downloadPDF(transcript.transcript,'application/pdf')" href="#"  class="pdf-link float-left ">{{transcript.transcriptTypeLabel}} (PDF)</a> 
            <div class="float-left col-12 pr-4 ml-1">
              <ul>
                <li>
                  <strong>Status:</strong> {{transcript.documentStatusLabel}} 
                </li>
                <li>
                  <strong>Last Updated:</strong> {{transcript.updateDate | formatTime}} 
                </li>
                <li>
                  <strong>Distributed:</strong> {{transcript.distributionDate | formatTime}}
                </li>
              </ul>
            </div>
          </div>    
        </div>  
        <div>
          <div class="px-3 w-100 float-left mt-2">
              <b-button variant="link" :disabled="studentGradStatus.studentGradData.school.transcriptEligibility === 'N'" @click="downloadPDF(xmlReports,'application/pdf')" href="#">View XML Preview</b-button>
          </div>    
        </div> 
      </div>                          
      </div> 
      </b-card-text>
    </b-card>       
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import sharedMethods from '../../sharedMethods';

  export default {
    name: "StudentGraduationReports",
    props: {},
    computed: {
      ...mapGetters({
        transcripts: "getStudentTranscripts",
        reports: "getStudentReports",
        xmlReports: "getStudentXmlReports",
        studentGradStatus: "getStudentGradStatus"
      })
    },
    methods: {
      downloadPDF: function (data, mimeType) {
        sharedMethods.base64ToPdfAndOpenWindow(data,mimeType)
      }
  }
  }
</script>

<style scoped>
.card-body {
border-bottom: 1px solid #ccc;
}
.card {
  margin-bottom: 10px;
}

.card-header {
  font-weight: 700;
}
</style>