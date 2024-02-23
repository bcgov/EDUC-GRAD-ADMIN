<template>
  <v-container>
    <v-card>
      <v-card-title>Include Program(s)</v-card-title>
      <v-card-text>
        <label>Program</label>
        <v-autocomplete
          v-model="program"
          :items="getProgramOptions"
          :item-title="programTitle"
          item-value="programCode"
        ></v-autocomplete>

        <div class="float-right mb-3">
          <v-btn :disabled="!program" @click="addProgram()">Add</v-btn>
        </div>

        <v-data-table
          v-if="getPrograms.length > 0"
          :items="getPrograms"
          :headers="programInputFields"
        >
          <template v-slot:item.remove="{ item }">
            <v-btn
              @click="removeProgram(item.columns.program)"
              class="btn btn-primary w-100"
            >
              Remove
            </v-btn>
          </template>
          <template v-slot:item.info="{ item }">
            <div>
              {{ item.columns.info }}
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
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
          title: "Program",
          sortable: true,
          class: "text-left",
        },
        {
          key: "info",
          title: "Post Secondary Institute Name",
          sortable: true,
          class: "text-left",
        },
        {
          key: "remove",
          title: "Remove",
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
    programTitle(item) {
      // Customize this method to return the desired format
      return `${item.programCode} - ${item.programName}`;
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
