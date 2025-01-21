<template>
  <div>
    <v-row>
      <v-col sm="2">Transmission Mode</v-col>
      <v-col>
        <v-select
          v-model="transmissionMode"
          label="Select a Transmission Mode"
          :items="[{ title: 'Paper', value: 'PAPER' }, 'FTP']"
          variant="outlined"
          small
          hide-details
        >
        </v-select
      ></v-col>
    </v-row>
    <v-row>
      <v-col sm="2">PSI Year</v-col>
      <v-col
        ><v-text-field
          v-model="psiYear"
          type="number"
          label="Enter PSI Year"
          variant="outlined"
          small
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="2">PSI</v-col>
      <v-col sm="8">
        <v-text-field
          v-if="!selectAllPSI"
          label="Post Secondary Institution Code"
          v-model="psi"
          maxlength="3"
          @input="validatePSI"
          variant="outlined"
        />

        <div
          v-for="error in v$.psi.$errors"
          :key="error.$uid"
          class="input-errors"
        >
          <div class="error-msg">{{ error.$message }}</div>
        </div>
        <v-checkbox
          v-model="selectAll"
          @change="selectAllPSICheckbox($event)"
          label="Select all post secondary institutes"
        ></v-checkbox>
      </v-col>
      <v-col sm="2">
        <v-btn
          @click="addPSI"
          :disabled="!psi || selectAll"
          class="float-right"
          color="bcGovBlue"
          small
        >
          READ PSI
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      v-if="psis.length > 0"
      :items="psis"
      :headers="psiInputFields"
      class="elevation-1"
    >
      <template #item.remove="{ item }">
        <v-btn color="primary" block @click="removePSI(item.psi)">
          Remove
        </v-btn>
      </template>
      <template #item.info="{ item }">
        <div>{{ item.info.psiName }}</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import TRAXService from "@/services/TRAXService.js";
import { useVuelidate } from "@vuelidate/core";
import { minLength } from "@vuelidate/validators";
import { mapActions, mapState } from "pinia";
import { useBatchRequestFormStore } from "../../../../store/modules/batchRequestFormStore";
import { toRaw, ref, watch } from "vue";

export default {
  setup() {
    const batchRequestFormStore = useBatchRequestFormStore();
    const psis = ref(batchRequestFormStore.psi);
    const transmissionMode = ref(batchRequestFormStore.psiTransmissionMode);
    transmissionMode.value = { title: 'Paper', value: 'PAPER' }
    const psiYear = ref(batchRequestFormStore.getCurrentPSIYear);

    watch(psiYear, (newValue) => {
      batchRequestFormStore.psiYear = newValue;
    });

    watch(transmissionMode, (newValue) => {
      batchRequestFormStore.psiTransmissionMode = newValue;
    });

    watch(psis, (newValue) => {
      batchRequestFormStore.psis = newValue;
    });
    return {
      psiYear,
      transmissionMode,
      psis,
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      selectAllPSI: false,
      psi: "",
      psiInfo: "",
      psiValidating: false,
      validationMessage: "",
      showAlert: true,
      psiInputFields: [
        { text: "Code", value: "psi", align: "start", sortable: true },
        {
          text: "Post Secondary Institute",
          value: "info",
          align: "start",
          sortable: true,
        },
        { text: "Remove", value: "remove", align: "start" },
      ],
    };
  },
  validations() {
    return {
      psi: {
        minLength: minLength(3),
        async isValid(value) {
          this.validationMessage = "";
          if (value === "") return true;
          if (value.length === 3) {
            let psi = await TRAXService.getPSIByAdvancedSearch(
              `psiCode=${value}`
            );
            if (psi.data[0]) {
              this.psiInfo = {
                psiCode: psi.data[0].psiCode,
                psiName: psi.data[0].psiName,
              };
              return true;
            }
          }
          return false;
        },
      },
    };
  },
  methods: {
    async validatePSI() {
      this.psiValidating = true;
      this.clearPSIInfo();
      const result = await this.v$.$validate();
      if (!result) {
        return;
      }
      this.psiValidating = false;
    },
    clearPSIInfo() {
      this.psiInfo = "";
    },
    clearPSI() {
      this.psi = "";
      this.clearPSIInfo();
    },
    selectAllPSICheckbox(event) {
      this.clearPSI();
      const AllPSIChecked = event.target.checked;
      if (AllPSIChecked) {
        // Remove all psis and automatically add the All PSI
        this.selectAllPSI = true;
        this.psis.splice(0, this.psis.length, {
          psi: "all",
          info: {
            psiCode: "All",
            psiName: "All Post Secondary Institutes",
          },
        });
      } else {
        // Remove the "ALL" PSIs and clear the array using splice
        this.selectAllPSI = false;

        // Clear the array using splice
        this.psis.splice(0, this.psis.length);
      }
    },
    async addPSI() {
      this.validationMessage = "";
      if (this.psi === "") return true;
      if (this.psi.length === 3) {
        let psi = await TRAXService.getPSIByAdvancedSearch(
          `psiCode=${this.psi}`
        );
        if (psi.data[0]) {
          this.psiInfo = {
            psiCode: psi.data[0].psiCode,
            psiName: psi.data[0].psiName,
          };
        } else {
          this.validationMessage = "Invalid post secondary institution";
        }
      }

      let info = this.psiInfo;
      this.psiInfo = {
        psiCode: info.psiCode,
        psiName: info.psiName,
      };
      this.psis.splice(0, 0, {
        psi: this.psi,
        info: this.psiInfo,
      });

      this.clearPSI();
    },
    removePSI(psi) {
      let psiList = toRaw(this.psis);
      for (const [index] in psiList) {
        if (psiList[index].psi === psi) {
          this.psis.splice(index, 1);
        }
      }
    },
  },
  computed: {
    ...mapState(useBatchRequestFormStore, ["getPsiYear", "getBatchRequest"]),
    isEmpty() {
      return this.psis.length > 0;
    },
  },
};
</script>

<style scoped>
.input-errors {
  color: red;
}
</style>
