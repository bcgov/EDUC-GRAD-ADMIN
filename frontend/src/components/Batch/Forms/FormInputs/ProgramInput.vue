<template>
  <v-container>
    <v-card>
      <v-card-title>Include Program(s)</v-card-title>
      <v-card-text>
        <label>Program</label>
        <v-row>
          <v-col sm="11">
            <v-autocomplete
              v-model="program"
              :items="computedProgramList"
              :item-title="programTitle"
              item-value="programCode"
              :item-disabled="true"
            ></v-autocomplete>
          </v-col>
          <v-col sm="1" class="p-2">
            <v-btn :disabled="!program" @click="addProgram()">Add</v-btn>
          </v-col>
        </v-row>
        <v-data-table
          v-if="programs.length > 0"
          :items="programs"
          :headers="programInputFields"
        >
          <template v-slot:item.remove="{ item }">
            <v-btn
              @click="removeProgram(item.program)"
              class="btn btn-primary w-100"
            >
              Remove
            </v-btn>
          </template>
          <template v-slot:item.info="{ item }">
            <div>
              {{ item.info }}
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { isProxy, toRaw, ref, watch } from "vue";
import TRAXService from "@/services/TRAXService.js";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";
import { useBatchRequestFormStore } from "../../../../store/modules/batchRequestFormStore";
import { useAppStore } from "../../../../store/modules/app";
import { mapActions, mapState } from "pinia";

export default {
  components: {},
  setup() {
    const batchRequestFormStore = useBatchRequestFormStore();
    const gradDateFrom = ref(batchRequestFormStore.gradDateFrom);
    const gradDateTo = ref(batchRequestFormStore.gradDateTo);
    const programs = ref(batchRequestFormStore.programs);

    watch(gradDateFrom, (newValue) => {
      batchRequestFormStore.gradDateFrom = newValue;
    });
    watch(gradDateTo, (newValue) => {
      batchRequestFormStore.gradDateTo = newValue;
    });

    return {
      gradDateTo,
      gradDateFrom,
      programs,
      v$: useVuelidate(),
    };
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
      this.clearProgram();
    },
    removeProgram(program) {
      for (const [index] in this.programs) {
        if (this.programs[index].program == program) {
          this.programs.splice(index, 1);
        }
      }
    },
    programTitle(item) {
      // Customize this method to return the desired format
      if (item) {
        return `${item.programCode} - ${item.programName}`;
      } else {
        return null;
      }
    },
  },

  computed: {
    computedProgramList() {
      const programCodesToFilterOut = this.programs.map((p) => p.program);
      console.log(programCodesToFilterOut);
      return this.getProgramOptions.filter(
        (program) => !programCodesToFilterOut.includes(program.programCode)
      );
    },
    ...mapState(useBatchRequestFormStore, ["getPrograms"]),
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
