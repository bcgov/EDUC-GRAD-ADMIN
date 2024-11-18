<template>
  <div class="graduation-reports pb-2">
    <v-card title="Student Transcript Reports" no-body>
      <v-card-text class="py-1">
        <div v-if="studentGradStatus.studentGradData">
          <div v-if="studentGradStatus.studentGradData.school">
            <div v-if="!isTranscriptEligible()">
              <v-alert type="info" class="">
                <h4 class="alert-heading">
                  Ineligible for Ministry transcripts
                </h4>
                <p class="locked-message">
                  This student's school is ineligible for Ministry transcripts.
                </p>
              </v-alert>
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
                  href="javascript:void(0)"
                  class="pdf-link float-left mt-2"
                  >{{ report.gradReportTypeLabel }} (PDF)</a
                >
                <div class="float-left col-12 pr-4 ml-1">
                  <ul>
                    <li>
                      <strong>Last Updated:</strong>
                      {{ $filters.formatTime(report.reportUpdateDate) }}
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
                  href="javascript:void(0)"
                  class="pdf-link float-left"
                  >{{ transcript.transcriptTypeLabel }} (PDF)</a
                >
                <div class="float-left col-12 pr-4 ml-1">
                  <ul>
                    <li>
                      <strong>Last Updated:</strong>
                      {{ $filters.formatTime(transcript.transcriptUpdateDate) }}
                    </li>
                    <li>
                      <strong>Last Distributed:</strong>
                      {{ $filters.formatTime(transcript.distributionDate) }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <div class="px-3 w-100 float-left mt-2 mb-6">
                <a
                  v-if="showXMLPreview()"
                  @click="
                    downloadFile(xmlReports, 'application/pdf', 'xml-preview')
                  "
                  href="javascript:void(0)"
                  class="pdf-link"
                  >View XML Preview</a
                >
                <a
                  v-else
                  class="text-disabled"
                  disabled
                  href="javascropt:void(0)"
                >
                  View XML Preview
                </a>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useStudentStore } from "../../../store/modules/student";
import sharedMethods from "../../../sharedMethods.js";
export default {
  name: "StudentGraduationReports",
  computed: {
    ...mapState(useStudentStore, {
      transcripts: "getStudentTranscripts",
      reports: "getStudentReports",
      xmlReports: "getStudentXmlReports",
      studentGradStatus: "getStudentGradStatus",
      optionalPrograms: "getStudentOptionalPrograms",
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
:deep(.card-body) {
  border-bottom: 1px solid #ccc;
}
:deep(.card) {
  margin-bottom: 10px;
}

:deep(.card-header) {
  font-weight: 700;
}
:deep(.active) {
  opacity: 20%;
}
:deep(.fade-leave-to) {
  opacity: 0;
}
</style>
