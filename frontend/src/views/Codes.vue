<template>
  <div class="codes-view">
    <h1>Codes</h1>
    <v-card no-body>
      <v-tabs v-model="tab" bg-color="bcGovLightGrey">
        <v-tab to="/codes/career-programs" class="text-none" size="large"
          >Career Program Codes</v-tab
        >
        <v-tab class="text-none" size="large" value="student-credentials">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                text
                v-bind="props"
                variant="text"
                class="text-none"
                size="large"
                append-icon="mdi-menu-down"
                >Credentials</v-btn
              >
            </template>
            <v-list>
              <v-list-item
                to="/codes/certificates-types"
                @click="tab = 'student-credentials'"
                >Certificate Types</v-list-item
              >
              <v-list-item
                to="/codes/transcript-types"
                @click="tab = 'student-credentials'"
                >Transcript Types</v-list-item
              >
              <v-list-item
                to="/codes/program-certificate-transcript"
                @click="tab = 'student-credentials'"
                >Program Certificate Transcript</v-list-item
              >
              <v-list-item
                to="/codes/digital-signatures"
                @click="tab = 'student-credentials'"
                >Digital Signature</v-list-item
              >
              <v-list-item
                to="/codes/signature-blocks"
                @click="tab = 'student-credentials'"
                >Signature Block</v-list-item
              >
              <v-list-item
                to="/codes/document-status-codes"
                @click="tab = 'student-credentials'"
                >Document Status Codes</v-list-item
              >
            </v-list>
          </v-menu>
        </v-tab>
        <v-tab to="/codes/report-types" class="text-none" size="large"
          >Report Types</v-tab
        >
        <v-tab class="text-none" size="large" value="student-grades">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                text
                v-bind="props"
                variant="text"
                class="text-none"
                size="large"
                append-icon="mdi-menu-down"
                >Student Codes</v-btn
              >
            </template>
            <v-list>
              <v-list-item
                @click="tab = 'student-grades'"
                to="/codes/student-grade-codes"
                >Student Grade Codes</v-list-item
              >
              <v-list-item
                to="/codes/student-status-codes"
                @click="tab = 'student-grades'"
                >Student Status Codes</v-list-item
              >
            </v-list>
          </v-menu>
        </v-tab>
        <v-tab to="/codes/ungrad-reasons" class="text-none" size="large"
          >Undo Completion Reason Codes</v-tab
        >
        <v-tab to="/codes/history-activity" class="text-none" size="large"
          >History Activity Codes</v-tab
        >
        <v-tab to="/codes/batch-types" class="text-none" size="large"
          >Batch Type Codes</v-tab
        >
      </v-tabs>
      <v-card-text>
        <router-view v-bind:key="$route.fullPath"></router-view>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAuthStore } from "../store/modules/auth";
import { useSnackbarStore } from "@/store/modules/snackbar";
import GraduationReportService from "@/services/GraduationReportService.js";
import StudentService from "@/services/StudentService.js";
import StudentGraduationService from "@/services/StudentGraduationService.js";
import ProgramManagementService from "@/services/ProgramManagementService.js";
import BatchProcessingService from "@/services/BatchProcessingService.js";

export default {
  name: "codes",
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      url: null,
      file: [],
      tab: 0,
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
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
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
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
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
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
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
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
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
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
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
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
        });
    },
    getUngradReasons() {
      StudentGraduationService.getUngradReasons()
        .then((response) => {
          this.ungradReasons = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          // eslint-disable-next-line
          console.error("API error:", error);
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
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
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
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
