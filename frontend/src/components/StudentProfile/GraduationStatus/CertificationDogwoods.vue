<template>
  <div class="certification-dogwoods pb-2">
    <v-card title="Student Certificates/Dogwoods" no-body>
      <v-card-text class="py-4">
        <div
          v-if="
            !!studentGradStatus.schoolAtGradId &&
            !isCertificateEligible(studentGradStatus.schoolAtGradId)
          "
        >
          <v-alert type="info" class="">
            <h4 class="alert-heading">Ineligible for ministry certificates</h4>
            <p class="locked-message">
              This student's school at graduation is ineligible for ministry
              certificates.
            </p>
          </v-alert>
        </div>
        <div v-if="certificates">
          <div
            v-for="(certificate, index) in certificates"
            :key="index"
            class="px-3 w-100 float-left"
          >
            <a
              @click="
                downloadFile(
                  certificate.certificate,
                  'application/pdf',
                  certificate.gradCertificateTypeLabel
                )
              "
              href="javascript:void(0)"
              class="pdf-link float-left mt-2"
              >{{ certificate.gradCertificateTypeLabel }} (PDF)</a
            >
            <div class="float-left col-12 pr-3">
              <ul>
                <li>
                  <strong>Status:</strong> {{ certificate.documentStatusLabel }}
                </li>
                <li>
                  <strong>Created:</strong>
                  {{ $filters.formatTime(certificate.createDate) }}
                </li>
                <li>
                  <strong>Distributed:</strong>
                  {{ $filters.formatTime(certificate.distributionDate) }}
                </li>
              </ul>
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
import { useSnackbarStore } from "@/store/modules/snackbar";
import { base64ToFileTypeAndOpenWindow } from "../../../utils/common.js";
import { useAppStore } from "../../../store/modules/app.js";

export default {
  name: "CertificationDogwoods",
  created() {
    this.base64ToFileTypeAndOpenWindow = base64ToFileTypeAndOpenWindow;
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      certificateEligible: true,
    };
  },
  props: {},
  computed: {
    ...mapState(useStudentStore, {
      certificates: "getStudentCertificates",
      studentGradStatus: "getStudentGradStatus",
    }),
    ...mapState(useAppStore, {
      getSchoolById: "getSchoolById",
    }),
  },
  methods: {
    downloadFile: function (data, mimeType, filename) {
      this.base64ToFileTypeAndOpenWindow(data, mimeType, filename);
    },
    isCertificateEligible: function (schoolId) {
      return this.getSchoolById(schoolId)?.canIssueCertificates;
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
</style>
