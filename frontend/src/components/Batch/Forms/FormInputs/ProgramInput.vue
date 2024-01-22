<template>
  <div>
    <b-card title="Include Program(s)">
      <b-card-text>
        <div>
          <label>Program</label>

          <b-form-select
            id="inline-form-select-type"
            class="col-2 mx-2"
            :options="getProgramOptions"
            value-field="programCode"
            text-field="programCode"
            v-model="program"
          ></b-form-select>
          <div
            class="input-errors"
            v-for="error of v$.program.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>

          <div class="float-right mb-3">
            <b-button :disabled="!program" @click="addProgram()">Add</b-button>
          </div>
        </div>
        <b-table
          v-if="programs.length > 0"
          :items="programs"
          :fields="programInputFields"
          striped="true"
        >
          <template #cell(remove)="row">
            <b-button
              class="btn btn-primary w-100"
              @click="removeProgram(row.item.program)"
            >
              Remove
            </b-button>
          </template>
          <template #cell(info)="row">
            <div>
              {{ row.item.info }}
            </div>
          </template>
        </b-table>
      </b-card-text>
    </b-card>
  </div>
</template>
<script>
import TRAXService from "@/services/TRAXService.js";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";
import { isProxy, toRaw } from "vue";
import { useBatchProcessingStore } from "../../../../store/modules/batchprocessing";
import { useAppStore } from "../../../../store/modules/app";
import { mapActions, mapState } from "pinia";

export default {
  components: {},
  setup(props) {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      program: {
        minLength: minLength(3),
      },
    };
  },
  data() {
    return {
      program: "",
      programInfo: {},
      programValidating: false,
      validationMessage: "",
      schoolCategory: "",
      programs: [],
      programInputFields: [
        {
          key: "program",
          label: "Program",
          sortable: true,
          class: "text-left",
        },
        {
          key: "info",
          label: "Post Secondary Institute Name",
          sortable: true,
          class: "text-left",
        },
        {
          key: "remove",
          label: "Remove",
          sortable: true,
          class: "text-left",
        },
      ],
    };
  },
  mounted() {},
  created() {},
  methods: {
    ...mapActions(useBatchProcessingStore, ["setPrograms"]),
    async validateProgram() {
      this.programValidating = true;
      this.clearProgramInfo();
      const result = await this.v$.$validate();
      if (!result) {
        return;
      }
      this.programValidating = false;
    },
    clearProgramInfo() {
      this.programInfo = "";
    },
    clearProgram() {
      this.program = "";
      this.clearProgramInfo();
    },
    findProgramByCode(programs, programCode) {
      return programs.find((program) => program.programCode === programCode);
    },
    addProgram() {
      const prog = toRaw(
        this.findProgramByCode(this.getProgramOptions, this.program)
      );

      this.programs.splice(0, 0, {
        program: this.program,
        info: prog.programName,
      });
      this.setPrograms(this.programs);
      this.clearProgram();
    },
    removeProgram(program) {
      let programList = toRaw(this.programs);
      for (const [index] in programList) {
        if (programList[index].program == program) {
          console.log(program);
          this.programs.splice(index, 1);
        }
      }
      this.setPrograms(programList);
    },
  },

  computed: {
    ...mapState(useBatchProcessingStore, ["getPrograms"]),
    ...mapState(useAppStore, ["getProgramOptions"]),
    isEmpty() {
      return this.programs.length > 0;
    },
  },
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
</style>
