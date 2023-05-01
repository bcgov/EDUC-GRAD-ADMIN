<template>
  <div class="graduation-reports pb-2">
    <b-card header="Student Transcript Reports" no-body>
      <b-card-text class="py-4">
        <div v-if="studentGradStatus.studentGradData">
          <div v-if="studentGradStatus.studentGradData.school">
            <div v-if="!isTranscriptEligible()">
              <b-alert show variant="info" class="p-3 mb-1 mx-3">
                <h4 class="alert-heading">
                  Ineligible for Ministry transcripts
                </h4>
                <p class="locked-message">
                  This student's school is ineligible for Ministry transcripts.
                </p>
              </b-alert>
            </div>

            <div v-if="reports">
              <div
                v-for="(report, index) in reports"
                :key="index"
                class="px-3 w-100 float-left"
              >
                <a
                  @click="
                    downloadFile(
                      report.report,
                      'application/pdf',
                      report.gradReportTypeLabel
                    )
                  "
                  href="#"
                  class="pdf-link float-left mt-2"
                  >{{ report.gradReportTypeLabel }} (PDF)</a
                >
                <div class="float-left col-12 pr-4 ml-1">
                  <ul>
                    <li>
                      <strong>Last Updated:</strong>
                      {{ report.reportUpdateDate | formatTime }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-if="transcripts">
              <div
                v-for="transcript in transcripts"
                :key="transcript.id"
                class="px-3 w-100 float-left mt-2"
              >
                <a
                  @click="
                    downloadFile(
                      transcript.transcript,
                      'application/pdf',
                      transcript.transcriptTypeLabel
                    )
                  "
                  href="#"
                  class="pdf-link float-left"
                  >{{ transcript.transcriptTypeLabel }} (PDF)</a
                >
                <div class="float-left col-12 pr-4 ml-1">
                  <ul>
                    <li>
                      <strong>Last Updated:</strong>
                      {{ transcript.transcriptUpdateDate | formatTime }}
                    </li>
                    <li>
                      <strong>Last Distributed:</strong>
                      {{ transcript.distributionDate | formatTime }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <div class="px-3 w-100 float-left mt-2">
                <b-button
                  variant="link"
                  :disabled="!showXMLPreview()"
                  @click="
                    downloadFile(xmlReports, 'application/pdf', 'xml-preview')
                  "
                  href="#"
                  >View XML Preview</b-button
                >
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
import sharedMethods from "../../sharedMethods.js";

export default {
  name: "StudentGraduationReports",
  props: {},
  created() {
    this.showNotification = sharedMethods.showNotification;
  },
  computed: {
    ...mapGetters({
      transcripts: "student/getStudentTranscripts",
      reports: "student/getStudentReports",
      xmlReports: "student/getStudentXmlReports",
      studentGradStatus: "student/getStudentGradStatus",
      optionalPrograms: "student/getStudentOptionalPrograms",
    }),
  },
  methods: {
    downloadFile: function (data, mimeType, filename) {
      sharedMethods.base64ToFileTypeAndOpenWindow(data, mimeType, filename);
    },
    isTranscriptEligible: function () {
      return (
        this.studentGradStatus.studentGradData.school.transcriptEligibility ===
        "Y"
      );
    },
    showXMLPreview: function () {
      return (
        this.studentGradStatus &&
        this.studentGradStatus.studentGradData &&
        ((this.studentGradStatus.studentGradData.studentAssessments &&
          this.studentGradStatus.studentGradData.studentAssessments
            .studentAssessmentList.length) ||
          (this.studentGradStatus.studentGradData.studentCourses &&
            this.studentGradStatus.studentGradData.studentCourses
              .studentCourseList.length) ||
          (this.studentGradStatus.studentGradData.studentExams &&
            this.studentGradStatus.studentGradData.studentExams.length) ||
          (this.optionalPrograms && this.optionalPrograms.length)) &&
        this.isTranscriptEligible()
      );
    },
  },
};
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
.active {
  opacity: 20%;
}
.fade-leave-to {
  opacity: 0;
}
</style>
