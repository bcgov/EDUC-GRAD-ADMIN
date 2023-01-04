<template>
  <div class="certification-dogwoods pb-2">
    <b-card header="Student Certificates/Dogwoods" no-body>
      <b-card-text class="py-4">
        <div v-if="studentGradStatus">
          <div v-if="studentGradStatus.studentGradData">
            <div v-if="studentGradStatus.studentGradData.school">
              <div v-if="!isCertificateEligible()">
                <b-alert show variant="info" class="p-3 mb-1 mx-3">
                  <h4 class="alert-heading">
                    Ineligible for Ministry certificates
                  </h4>
                  <p class="locked-message">
                    This student's school is ineligible for Ministry
                    certificates.
                  </p>
                </b-alert>
              </div>
            </div>
          </div>
        </div>
        <div v-if="certificates">
          <div
            v-for="(certificate, index) in certificates"
            :key="index"
            class="px-3 w-100 float-left"
          >
            <a
              @click="downloadFile(certificate.certificate, 'application/pdf')"
              href="#"
              class="pdf-link float-left mt-2"
              >{{ certificate.gradCertificateTypeLabel }} (PDF)</a
            >
            <div class="float-left col-12 pr-3">
              <ul>
                <li>
                  <strong>Status:</strong> {{ certificate.documentStatusLabel }}
                </li>
                <li>
                  <strong>Last Updated:</strong>
                  {{ certificate.updateDate | formatTime }}
                </li>
                <li>
                  <strong>Distributed:</strong>
                  {{ certificate.distributionDate | formatTime }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import sharedMethods from "../sharedMethods";

export default {
  name: "CertificationDogwoods",
  props: {},
  computed: {
    ...mapGetters({
      certificates: "getStudentCertificates",
      studentGradStatus: "student/getStudentGradStatus",
    }),
  },
  methods: {
    downloadFile: function (data, mimeType) {
      sharedMethods.base64ToFileTypeAndOpenWindow(data, mimeType);
    },
    isCertificateEligible: function () {
      return (
        this.studentGradStatus.studentGradData.school.certificateEligibility ==
        "Y"
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
</style>
