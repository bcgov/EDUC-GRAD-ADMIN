<template>
  <div class="certification-dogwoods pb-2">
    <v-card title="Student Certificates/Dogwoods" no-body>
      <v-card-text class="py-4">
        <div
          v-if="this.studentGradStatus.schoolAtGrad && !isCertificateEligible()"
        >
          <v-alert type="info" class="p-3 mb-1 mx-3">
            <h4 class="alert-heading">Ineligible for Ministry certificates</h4>
            <p class="locked-message">
              This student's school at graduation is ineligible for Ministry
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
import sharedMethods from "../../../sharedMethods";
import {
  showNotification,
  base64ToFileTypeAndOpenWindow,
} from "../../../utils/common.js";
import SchoolService from "@/services/SchoolService.js";

export default {
  name: "CertificationDogwoods",
  created() {
    this.showNotification = showNotification;
    this.base64ToFileTypeAndOpenWindow = base64ToFileTypeAndOpenWindow;
    this.isCertificateEligible();
  },
  data() {
    return {
      certificateEligible: true,
    };
  },
  props: {},
  computed: {
    ...mapState(useStudentStore, {
      certificates: "getStudentCertificates",
      studentGradStatus: "getStudentGradStatus",
    }),
  },
  methods: {
    downloadFile: function (data, mimeType, filename) {
      this.base64ToFileTypeAndOpenWindow(data, mimeType, filename);
    },
    isCertificateEligible: function () {
      // This is a bandaid solution to check school at grad instead of the school of record that is packaged with the student GRAD status; address in Vue 3
      if (this.studentGradStatus.schoolAtGrad) {
        SchoolService.getSchoolInfo(this.studentGradStatus.schoolAtGrad)
          .then((response) => {
            this.certificateEligible =
              response.data.certificateEligibility == "Y";
          })
          .catch((error) => {
            if (error.response.data.code == "404") {
              this.showNotification("danger", "School at grad cannot be found");
            }
          });
      }

      return this.certificateEligible;
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
