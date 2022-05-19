<template>
  <div class="graduation-reports pb-2">
    <b-card
      header="Student Transcript Reports"
      no-body
    >   
      <b-card-text class="py-4">
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
                <li>
                  <strong>Distributed:</strong> {{report.distributionDate | formatTime}}
                </li>
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
              <a @click="openXml(xmlReports)" href="#">View XML Preview</a>
          </div>    
        </div>                          
      </b-card-text>
    </b-card>       
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import sharedMethods from '../sharedMethods';

  export default {
    name: "GraduationReports",
    props: {},
    computed: {
      ...mapGetters({
        reports: "getStudentReports",
        transcripts: "getStudentTranscripts",
        xmlReports: "getStudentXmlReports"
      })
    },
    methods: {
      downloadPDF: function (data, mimeType) {
        sharedMethods.base64ToPdfAndOpenWindow(data,mimeType)
      },
      openXml: function (data) {
        sharedMethods.base64XMLToPdfAndOpenWindow(data)
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