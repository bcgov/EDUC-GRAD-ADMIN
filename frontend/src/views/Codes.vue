<template>
  <div class="codes-view">
    <h1>Codes</h1>
    <div class="codes">
      <b-card title="Program Management" no-body>
        <b-card-header header-tag="nav" class="px-3">
          <b-nav card-header tabs>
            <b-nav-item
              to="/codes/career-programs"
              :active="tab === 1"
              @click="tab = 1"
              >Career Program Codes</b-nav-item
            >
            <b-nav-item-dropdown
              id="credentials-dropdown"
              text="Credentials"
              ref="credentials-dropdown"
              toggle-class="nav-link-credentials"
              left
            >
              <b-nav-item
                to="/codes/certificates-types"
                :active="tab === 2"
                @click="
                  tab = 2;
                  closeDropdown('credentials-dropdown');
                "
                >Certificate Types</b-nav-item
              >
              <b-nav-item
                to="/codes/transcript-types"
                :active="tab === 2"
                @click="
                  tab = 2;
                  closeDropdown('credentials-dropdown');
                "
                >Transcript Types</b-nav-item
              >
              <b-nav-item
                to="/codes/program-certificate-transcript"
                :active="tab === 2"
                @click="
                  tab = 2;
                  closeDropdown('credentials-dropdown');
                "
                >Program Certificate Transcript</b-nav-item
              >
              <b-nav-item
                to="/codes/digital-signatures"
                :active="tab === 2"
                @click="
                  tab = 2;
                  closeDropdown('credentials-dropdown');
                "
                >Digital Signature</b-nav-item
              >
              <b-nav-item
                to="/codes/signature-blocks"
                :active="tab === 2"
                @click="
                  tab = 2;
                  closeDropdown('credentials-dropdown');
                "
                >Signature Block</b-nav-item
              >
              <b-nav-item
                to="/codes/document-status-codes"
                :active="tab === 2"
                @click="
                  tab = 2;
                  closeDropdown('credentials-dropdown');
                "
                >Document Status Codes</b-nav-item
              >
            </b-nav-item-dropdown>
            <b-nav-item
              to="/codes/report-types"
              :active="tab === 3"
              @click="tab = 3"
              >Report Types</b-nav-item
            >
            <b-nav-item
              to="/codes/student-status-codes"
              :active="tab === 4"
              @click="tab = 4"
              >Student Status Codes</b-nav-item
            >
            <b-nav-item
              to="/codes/ungrad-reasons"
              :active="tab === 5"
              @click="tab = 5"
              >Undo Completion Reason Codes</b-nav-item
            >
            <b-nav-item
              to="/codes/history-activity"
              :active="tab === 6"
              @click="tab = 6"
              >History Activity Codes</b-nav-item
            >
            <b-nav-item
              to="/codes/batch-types"
              :active="tab === 7"
              @click="tab = 7"
              >Batch Type Codes</b-nav-item
            >
          </b-nav>
        </b-card-header>
        <b-card-body>
          <b-card-text>
            <router-view v-bind:key="$route.fullPath"></router-view>
          </b-card-text>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAuthStore } from "../store/modules/auth";

import GraduationReportService from "@/services/GraduationReportService.js";
import StudentService from "@/services/StudentService.js";
import ProgramManagementService from "@/services/ProgramManagementService.js";

export default {
  name: "codes",
  components: {},
  data() {
    return {
      url: null,
      file: [],
      tab: 1,

      certificateTypes: [],
      reportSignatures: [],
      batchTypes: [],
      batchTypesFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
        },
        {
          key: "label",
          label: "Label",
          sortable: true,
        },
      ],
      reportSignaturesFields: [
        {
          key: "signatureContent",
          label: "Signture",
          sortable: true,
        },
        {
          key: "updatedTimestamp",
          label: "Last Updated",
          sortable: true,
        },
        {
          key: "gradReportSignatureCode",
          label: "Filename",
          sortable: true,
        },
      ],
      certificateTypesFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "label",
          label: "Label",
          sortable: true,
        },
        {
          key: "description",
          label: "Description",
          sortable: true,
        },
        {
          key: "effectiveDate",
          label: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          label: "Expiry Date",
          sortable: true,
        },
      ],
      reportTypes: [],
      reportTypesFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "label",
          label: "Label",
          sortable: true,
        },
        {
          key: "description",
          label: "Description",
          sortable: true,
        },
        {
          key: "effectiveDate",
          label: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          label: "Expiry Date",
          sortable: true,
        },
      ],
      requirementTypes: [],
      requirementTypesFields: [
        {
          key: "reqTypeCode",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "label",
          label: "Label",
          sortable: true,
        },
        {
          key: "description",
          label: "Description",
          sortable: true,
        },
        {
          key: "effectiveDate",
          label: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          label: "Expiry Date",
          sortable: true,
        },
      ],
      studentStatusCodes: [],
      studentStatusCodesFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "label",
          label: "Label",
          sortable: true,
        },
        {
          key: "description",
          label: "Description",
          sortable: true,
        },
        {
          key: "effectiveDate",
          label: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          label: "Expiry Date",
          sortable: true,
        },
      ],
      ungradReasons: [],
      ungradReasonsFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "label",
          label: "Label",
          sortable: true,
        },
        {
          key: "description",
          label: "Description",
          sortable: true,
        },
        {
          key: "effectiveDate",
          label: "Effective Date",
          sortable: true,
        },
        {
          key: "expiryDate",
          label: "Expiry Date",
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
          this.$bvToast.toast("ERROR " + error.response.statusText, {
            title: "ERROR" + error.response.status,
            variant: "danger",
            noAutoHide: true,
          });
        });
    },
    getCertificateTypes() {
      GraduationReportService.getCertificateTypes()
        .then((response) => {
          this.certificateTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.$bvToast.toast("ERROR " + error.response.statusText, {
            title: "ERROR" + error.response.status,
            variant: "danger",
            noAutoHide: true,
          });
        });
    },
    getReportTypes() {
      GraduationReportService.getReportTypes()
        .then((response) => {
          this.reportTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.$bvToast.toast("ERROR " + error.response.statusText, {
            title: "ERROR" + error.response.status,
            variant: "danger",
            noAutoHide: true,
          });
        });
    },
    getRequirementTypes() {
      ProgramManagementService.getRequirementTypes()
        .then((response) => {
          this.requirementTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.$bvToast.toast("ERROR " + error.response.statusText, {
            title: "ERROR" + error.response.status,
            variant: "danger",
            noAutoHide: true,
          });
        });
    },
    getStudentStatusCodes() {
      StudentService.getStudentStatusCodes()
        .then((response) => {
          this.studentStatusCodes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.$bvToast.toast("ERROR " + error.response.statusText, {
            title: "ERROR" + error.response.status,
            variant: "danger",
            noAutoHide: true,
          });
        });
    },
    getBatchJobTypes() {
      BatchProcessingService.getBatchJobTypes()
        .then((response) => {
          this.batchTypes = response.data;
        })
        .catch((error) => {
          this.$bvToast.toast("ERROR " + error.response.statusText, {
            title: "ERROR" + error.response.status,
            variant: "danger",
            noAutoHide: true,
          });
        });
    },
    getUngradReasons() {
      StudentService.getUngradReasons()
        .then((response) => {
          this.ungradReasons = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.$bvToast.toast("ERROR " + error.response.statusText, {
            title: "ERROR" + error.response.status,
            variant: "danger",
            noAutoHide: true,
          });
        });
    },
    getReportSignatures() {
      GraduationReportService.getReportSignatures()
        .then((response) => {
          this.reportSignatures = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.$bvToast.toast("ERROR " + error.response.statusText, {
            title: "ERROR" + error.response.status,
            variant: "danger",
            noAutoHide: true,
          });
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
