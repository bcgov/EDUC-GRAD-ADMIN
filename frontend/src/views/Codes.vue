<template>
  <div class="codes-view">
    <h1>Codes</h1>
    <v-card no-body>
      <v-card-title>
        <v-tabs v-model="tab" bg-color="transparent" grow>
          <v-tab to="/codes/career-programs">Career Program Codes</v-tab>
          <v-tab>
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn text v-bind="props">Credentials</v-btn>
              </template>
              <v-list>
                <v-list-item to="/codes/certificates-types"
                  >Certificate Types</v-list-item
                >
                <v-list-item to="/codes/transcript-types"
                  >Transcript Types</v-list-item
                >
                <v-list-item to="/codes/program-certificate-transcript"
                  >Program Certificate Transcript</v-list-item
                >
                <v-list-item to="/codes/digital-signatures"
                  >Digital Signature</v-list-item
                >
                <v-list-item to="/codes/signature-blocks"
                  >Signature Block</v-list-item
                >
                <v-list-item to="/codes/document-status-codes"
                  >Document Status Codes</v-list-item
                >
              </v-list>
            </v-menu>
          </v-tab>
          <v-tab to="/codes/report-types">Report Types</v-tab>
          <v-tab to="/codes/student-status-codes">Student Status Codes</v-tab>
          <v-tab to="/codes/ungrad-reasons">Undo Completion Reason Codes</v-tab>
          <v-tab to="/codes/history-activity">History Activity Codes</v-tab>
          <v-tab to="/codes/batch-types">Batch Type Codes</v-tab>
        </v-tabs>
      </v-card-title>
      <v-card-text>
        <router-view v-bind:key="$route.fullPath"></router-view>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAuthStore } from "../store/modules/auth";
import Snackbar from "@/components/Common/Snackbar.vue";
import GraduationReportService from "@/services/GraduationReportService.js";
import StudentService from "@/services/StudentService.js";
import ProgramManagementService from "@/services/ProgramManagementService.js";
import BatchProcessingService from "@/services/BatchProcessingService.js";

export default {
  name: "codes",
  components: { Snackbar: Snackbar },
  data() {
    return {
      url: null,
      file: [],
      tab: 1,
      snackbarVisible: false,
      snackbarMessage: "",
      certificateTypes: [],
      reportSignatures: [],
      batchTypes: [],
      batchTypesFields: [
        {
          key: "code",
          title: "Code",
          sortable: true,
        },
        {
          key: "label",
          title: "Label",
          sortable: true,
        },
      ],
      reportSignaturesFields: [
        {
          key: "signatureContent",
          title: "Signture",
          sortable: true,
        },
        {
          key: "updatedTimestamp",
          title: "Last Updated",
          sortable: true,
        },
        {
          key: "gradReportSignatureCode",
          title: "Filename",
          sortable: true,
        },
      ],
      certificateTypesFields: [
        {
          key: "code",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "label",
          title: "Label",
          sortable: true,
        },
        {
          key: "description",
          title: "Description",
          sortable: true,
        },
        {
          key: "effectiveDate",
          title: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          title: "Expiry Date",
          sortable: true,
        },
      ],
      reportTypes: [],
      reportTypesFields: [
        {
          key: "code",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "label",
          title: "Label",
          sortable: true,
        },
        {
          key: "description",
          title: "Description",
          sortable: true,
        },
        {
          key: "effectiveDate",
          title: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          title: "Expiry Date",
          sortable: true,
        },
      ],
      requirementTypes: [],
      requirementTypesFields: [
        {
          key: "reqTypeCode",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "label",
          title: "Label",
          sortable: true,
        },
        {
          key: "description",
          title: "Description",
          sortable: true,
        },
        {
          key: "effectiveDate",
          title: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          title: "Expiry Date",
          sortable: true,
        },
      ],
      studentStatusCodes: [],
      studentStatusCodesFields: [
        {
          key: "code",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "label",
          title: "Label",
          sortable: true,
        },
        {
          key: "description",
          title: "Description",
          sortable: true,
        },
        {
          key: "effectiveDate",
          title: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          title: "Expiry Date",
          sortable: true,
        },
      ],
      ungradReasons: [],
      ungradReasonsFields: [
        {
          key: "code",
          title: "Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "label",
          title: "Label",
          sortable: true,
        },
        {
          key: "description",
          title: "Description",
          sortable: true,
        },
        {
          key: "effectiveDate",
          title: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          title: "Expiry Date",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    ...mapState(useAuthStore, {
      token: "getToken",
    }),
  },
  created() {
    this.getCareerPrograms();
    this.getCertificateTypes();
    this.getRequirementTypes();
    this.getReportTypes();
    this.getStudentStatusCodes();
    this.getUngradReasons();
    this.getBatchJobTypes();
  },
  methods: {
    closeDropdown(dropdown) {
      this.$refs[dropdown].visible = false;
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);
    },
    getCareerPrograms() {
      ProgramManagementService.getCareerPrograms()
        .then((response) => {
          this.careerPrograms = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          // eslint-disable-next-line
          console.error("API error:", error);
          this.snackbarMessage = error.message;
          this.snackbarVisible = true;
        });
    },
    getCertificateTypes() {
      GraduationReportService.getCertificateTypes()
        .then((response) => {
          this.certificateTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          // eslint-disable-next-line
          console.error("API error:", error);
          this.snackbarMessage = error.message;
          this.snackbarVisible = true;
        });
    },
    getReportTypes() {
      GraduationReportService.getReportTypes()
        .then((response) => {
          this.reportTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          // eslint-disable-next-line
          console.error("API error:", error);
          this.snackbarMessage = error.message;
          this.snackbarVisible = true;
        });
    },
    getRequirementTypes() {
      ProgramManagementService.getRequirementTypes()
        .then((response) => {
          this.requirementTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          // eslint-disable-next-line
          console.error("API error:", error);
          this.snackbarMessage = error.message;
          this.snackbarVisible = true;
        });
    },
    getStudentStatusCodes() {
      StudentService.getStudentStatusCodes()
        .then((response) => {
          this.studentStatusCodes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          // eslint-disable-next-line
          console.error("API error:", error);
          this.snackbarMessage = error.message;
          this.snackbarVisible = true;
        });
    },
    getBatchJobTypes() {
      BatchProcessingService.getBatchJobTypes()
        .then((response) => {
          this.batchTypes = response.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error("API error:", error);
          this.snackbarMessage = error.message;
          this.snackbarVisible = true;
        });
    },
    getUngradReasons() {
      StudentService.getUngradReasons()
        .then((response) => {
          this.ungradReasons = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          // eslint-disable-next-line
          console.error("API error:", error);
          this.snackbarMessage = error.message;
          this.snackbarVisible = true;
        });
    },
    getReportSignatures() {
      GraduationReportService.getReportSignatures()
        .then((response) => {
          this.reportSignatures = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          // eslint-disable-next-line
          console.error("API error:", error);
          this.snackbarMessage = error.message;
          this.snackbarVisible = true;
        });
    },
  },
};
</script>

<style scoped>
.codes-view {
  padding-left: 25px;
  padding-right: 25px;
}
.close-record {
  float: right;
}

.tab-loading {
  color: green !important;
}

.profile-name {
  padding-bottom: 10px;
}
</style>
