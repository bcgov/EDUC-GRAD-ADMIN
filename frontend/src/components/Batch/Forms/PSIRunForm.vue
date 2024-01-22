<template>
  <div>
    <div>
      <PSIInput></PSIInput>
    </div>
    <label class="font-weight-bold row mt-3 ml-0 px-0">Transmission Mode</label>
    <b-form-select
      id="inline-form-select-type"
      class="col-3"
      :options="[
        { text: 'Choose...', value: null },
        { text: 'Paper', value: 'PAPER' },
        { text: 'FTP', value: 'FTP' },
      ]"
      :value="transmissionMode"
      v-model="transmissionMode"
    ></b-form-select>
    <label class="font-weight-bold row mt-3 ml-0 px-0">PSI Year</label>

    <b-form-input type="number" :value="psiYear" class="col-2" />
  </div>
</template>
<script>
import PSIInput from "@/components/Batch/Forms/FormInputs/PSIInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useBatchProcessingStore } from "../../../store/modules/batchprocessing";
import { mapActions } from "pinia";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  mounted() {
    this.$emit("update:schools", this.schools);
  },
  created() {
    this.psiYear = this.currentPSIYear();
    this.setGroup("Psi");
  },
  validations() {
    return {
      psiYear: {
        required: helpers.withMessage("PSI year cannot be empty", required),
      },
      transmissionMode: {
        required: helpers.withMessage(
          "Transmission mode field cannot be empty",
          required
        ),
      },
    };
  },
  components: {
    PSIInput: PSIInput,
  },
  data: function () {
    return {
      schedule: "",
      group: "PSI",
      groupData: [],
      schools: [],
      students: [],
      districts: [],
      psis: [],
      programs: [],
      groupOptions: ["PSI"],
      transmissionMode: "",
      psiYear: "",
    };
  },

  methods: {
    ...mapActions(useBatchProcessingStore, ["setGroup"]),
    currentPSIYear() {
      let date = new Date();
      if (date.getMonth() + 1 > 8) {
        return String(date.getFullYear() + 1);
      } else {
        return String(date.getFullYear());
      }
    },
    runbatch() {
      console.log("run batch");
      console.log(payload);
      console.log(groupData);
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
      this.psis = [];
      this.groupData = [];
    },
  },
  computed: {
    isValid() {
      if (this.transmissionMode && this.psiYear && this.group) {
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
