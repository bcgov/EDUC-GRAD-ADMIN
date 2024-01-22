<template>
  <div>
    <label class="font-weight-bold pt-1">Group</label>
    <b-form-select
      id="inline-form-select-audience"
      class="mb-2 mr-sm-2 mb-sm-0"
      :options="groupOptions"
      v-model="group"
      @change="
        validateForm;
        setGroup(this.group);
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
    <div v-if="group == 'Program'">
      <ProgramInput></ProgramInput>
    </div>
    <div v-if="group == 'School'">
      <SchoolInput></SchoolInput>
    </div>
    <div v-if="group == 'Student'">
      <StudentInput></StudentInput>
    </div>
    <div v-if="group == 'District'">
      <DistrictInput></DistrictInput>
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
import { mapActions } from "pinia";

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
      credentialDetails: [],
      credentialType: "",
      schedule: "",
      group: "",
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
  mounted() {
    this.$emit("update:schools", this.schools);
  },
  created() {
    this.transcriptTypes = this.getTranscriptTypes();
    this.certificateTypes = this.getCertificateTypes();
  },

  methods: {
    ...mapActions(useBatchProcessingStore, ["clearBatchGroupData", "setGroup"]),
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
  computed: {
    isValid() {
      if (this.where && this.group) {
        return true;
      } else {
        return false;
      }
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
