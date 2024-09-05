<template>
  <div>
    {{ getWhere }}
    <label class="font-weight-bold">Credential Type</label>
    <b-form-select
      id="inline-form-select-audience"
      class="mb-2 mr-sm-2 mb-sm-0 col-2"
      :options="[
        { text: 'Choose...', value: null },
        {
          text: 'Blank certificate print',
          value: 'Blank certificate print',
        },
        {
          text: 'Reprint certificate – no principal signature block',
          value: 'RC',
        },
        {
          text: 'Original certificate – with principal signature block',
          value: 'OC',
        },
        {
          text: 'Blank transcript print',
          value: 'Blank transcript print',
        },
        { text: 'Transcript', value: 'OT' },
      ]"
      v-model="credentialType"
      @change="setCredential(credentialType)"
    ></b-form-select>
    <div
      v-if="credentialType == 'Blank transcript print'"
      class="accordion"
      role="tablist"
    >
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-1 variant="info"
            >Choose Transcript Type</b-button
          >
        </b-card-header>
        <b-collapse
          id="accordion-1"
          visible
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card
            v-if="credentialType == 'Blank transcript print'"
            class="mt-3 px-0"
            header="Choose Transcript Type(s)"
          >
            <b-form-checkbox-group
              multiple
              stacked
              :select-size="10"
              id="inline-form-select-audience"
              class="mb-2 mr-sm-2 mb-sm-0"
              :options="transcriptTypes"
              value-field="code"
              text-field="description"
              v-model="credentialDetails"
            ></b-form-checkbox-group>
          </b-card>
        </b-collapse>
      </b-card>
      {{ credentialDetails.length ? credentialDetails : "" }}
    </div>
    <label class="font-weight-bold pt-1">Group</label>
    <b-form-select
      id="inline-form-select-audience"
      class="mb-2 mr-sm-2 mb-sm-0"
      :options="groupOptions"
      v-model="group"
      @change="
        validateForm;
        setGroup(group);
        clearGroupData();
      "
      value="group"
    ></b-form-select>
    <div
      class="input-errors"
      v-for="error of v$.group.$errors"
      :key="error.$uid"
    >
      <div class="error-msg">{{ error.$message }}</div>
    </div>
    <div v-if="group == 'School'">
      <SchoolInput></SchoolInput>
    </div>
    <div v-if="group == 'Student'">
      <StudentInput
        v-model:students="groupData"
        :credentialType="credentialType"
        runType="DISTRUNUSER"
      ></StudentInput>
    </div>
    <div v-if="group == 'District'">
      <DistrictInput
        v-model:districts="groupData"
        :credentialType="credentialType"
        runType="DISTRUNUSER"
      ></DistrictInput>
    </div>
    <div v-if="group == 'Program'">
      <ProgramInput></ProgramInput>
    </div>

    <label class="font-weight-bold">Copies</label>
    <b-form-input
      type="number"
      id="inline-form-select-audience"
      class="mb-2 mr-sm-2 mb-sm-0"
      :value="1"
      v-model="copies"
      @change="validateForm"
    ></b-form-input>
    <div
      class="input-errors"
      v-for="error of v$.copies.$errors"
      :key="error.$uid"
    >
      <div class="error-msg">{{ error.$message }}</div>
    </div>

    <label class="font-weight-bold">Where</label>
    <b-form-select
      id="inline-form-select-type"
      class="mb-2 mr-sm-2 mb-sm-0"
      v-model="where"
      :value="where"
      @change="
        validateForm;
        setWhere(this.where);
      "
      :options="[
        { text: 'Download', value: 'localDownload' },
        'BC Mail',
        { text: 'User', value: 'User' },
      ]"
    ></b-form-select>
    <div
      class="input-errors"
      v-for="error of v$.where.$errors"
      :key="error.$uid"
    >
      <div class="error-msg">{{ error.$message }}</div>
    </div>
  </div>
</template>
<script>
import DistrictInput from "@/components/Batch/Forms/FormInputs/DistrictInput.vue";
import SchoolInput from "@/components/Batch/Forms/FormInputs/SchoolInput.vue";
import StudentInput from "@/components/Batch/Forms/FormInputs/StudentInput.vue";
import ProgramInput from "@/components/Batch/Forms/FormInputs/ProgramInput.vue";
import GraduationReportService from "@/services/GraduationReportService.js";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useBatchProcessingStore } from "../../../store/modules/batchprocessing";
import { mapActions, mapState } from "pinia";

export default {
  setup() {
    return { v$: useVuelidate() };
  },

  getSchools(value) {
    console.log("VALUE ADDED" + value);
  },
  validations() {
    return {
      group: {
        required: helpers.withMessage("Group field cannot be empty", required),
      }, // Matches this.firstName
      copies: {
        required: helpers.withMessage("Copies field cannot be empty", required),
      }, // Matches this.firstName
      where: {
        required: helpers.withMessage("where field cannot be empty", required), // Matches this.firstName
      },
    };
  },
  components: {
    SchoolInput: SchoolInput,
    StudentInput: StudentInput,
    DistrictInput: DistrictInput,
    ProgramInput: ProgramInput,
  },
  data: function () {
    return {
      request: {},
      credentialDetails: [],
      credentialType: "",
      schedule: "",
      where: "BC Mail",
      group: "",
      copies: "1",
      groupData: [],
      schools: [],
      students: [],
      districts: [],
      programs: [],
      transcriptTypes: [],
      certificateTypes: [],

      groupOptions: [
        "Student",
        "School",
        { text: "School Category", value: "District" },
        "Program",
      ],
    };
  },
  mounted() {},
  created() {
    this.transcriptTypes = this.getTranscriptTypes();
    this.certificateTypes = this.getCertificateTypes();
  },
  computed: {
    ...mapState(useBatchProcessingStore, ["getCredential"]),
  },
  methods: {
    ...mapActions(useBatchProcessingStore, [
      "clearBatchGroupData",
      "setGroup",
      "setCredential",
      "setWhere",
    ]),
    getTranscriptTypes() {
      GraduationReportService.getTranscriptTypes()
        .then((response) => {
          this.transcriptTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          if (error.response.statusText) {
            this.makeToast("ERROR " + error.response.statusText, "danger");
          } else {
            this.makeToast("ERROR " + "error with webservervice", "danger");
          }
        });
    },
    getCertificateTypes() {
      GraduationReportService.getCertificateTypes()
        .then((response) => {
          this.certificateTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          if (error.response.statusText) {
            this.makeToast("ERROR " + error.response.statusText, "danger");
          } else {
            this.makeToast("ERROR " + "error with webservervice", "danger");
          }
        });
    },
    async validateForm(event) {
      const result = await this.v$.$validate();
      if (!result) {
        console.log("INVALID");
        return;
      }
      console.log("VALID");
    },
    clearGroupData() {
      this.schools = [];
      this.students = [];
      this.districts = [];
      this.programs = [];
      this.groupData = [];
      this.clearBatchGroupData();
    },
    makeToast(message, variant) {
      this.$bvToast.toast(message, {
        title: message,
        variant: variant,
        noAutoHide: true,
      });
    },
  },
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
.input-errors {
  color: red;
}
</style>
