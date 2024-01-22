<template>
  <div>
    <DistrictInput runType="DISTRUN_SUPP"></DistrictInput>
  </div>
</template>
<script>
import GraduationReportService from "@/services/GraduationReportService.js";

import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import DistrictInput from "@/components/Batch/Forms/FormInputs/DistrictInput.vue";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      copies: {
        required: helpers.withMessage("Copies field cannot be empty", required),
      }, // Matches this.firstName
      where: {
        required: helpers.withMessage("where field cannot be empty", required), // Matches this.firstName
      },
    };
  },
  components: { DistrictInput: DistrictInput },
  data: function () {
    return {
      schedule: "",
      districts: [],
      where: "BC Mail",
      copies: "1",
      group: "district",
      groupData: [],
    };
  },
  mounted() {},
  created() {},

  methods: {
    async validateForm(event) {
      const result = await this.v$.$validate();
      if (!result) {
        console.log("INVALID");
        return;
      }
      console.log("VALID");
    },
    runbatch() {
      console.log("run batch");
      console.log(payload);
      console.log(groupData);
    },
    clearGroupData() {
      this.districts = [];
    },
  },
  computed: {
    isValid() {
      if (this.where && this.group && this.districts && this.districts.length) {
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
