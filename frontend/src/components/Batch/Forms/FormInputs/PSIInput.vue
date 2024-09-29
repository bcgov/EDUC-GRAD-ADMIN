<template>
  <v-card>
    <v-card-title>Include Post Secondary Institute(s)</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="psiYear"
        type="number"
        label="Enter PSI Year"
        outlined
        small
      >
      </v-text-field>

      <v-select
        v-model="transmissionMode"
        label="Select a Transmission Mode"
        :items="['Paper', 'FTP']"
        outlined
        small
        hide-details
      >
      </v-select>

      <div v-if="schoolCategory !== '04' && schoolCategory !== '09'">
        <v-text-field
          label="Post Secondary Institution Code"
          v-model="psi"
          maxlength="3"
          @input="validatePSI"
          class="w-25"
          outlined
        />
        <div
          v-for="error in v$.psi.$errors"
          :key="error.$uid"
          class="input-errors"
        >
          <div class="error-msg">{{ error.$message }}</div>
        </div>

        <div v-if="psiInfo">
          <v-card>
            <v-card-text>
              <v-alert
                v-if="validationMessage"
                type="error"
                dismissible
                v-model="showAlert"
              >
                {{ validationMessage }}
              </v-alert>
              <v-overlay :value="psiValidating">
                <template v-slot:activator="{ on, attrs }">
                  <v-row>
                    <v-col auto>
                      <strong>Post Secondary Institute:</strong>
                      {{ psiInfo.psiName }}<br />
                    </v-col>
                    <v-col>
                      <v-btn
                        @click="addPSI"
                        :disabled="validationMessage !== ''"
                        class="float-right"
                        color="primary"
                        small
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </template>
              </v-overlay>
            </v-card-text>
          </v-card>
        </div>
      </div>
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
    </v-card-text>
  </v-card>
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
    const transmissionMode = ref(batchRequestFormStore.transmissionMode);
    const psiYear = ref(batchRequestFormStore.getCurrentPSIYear);

    watch(psiYear, (newValue) => {
      batchRequestFormStore.psiYear = newValue;
    });

    watch(transmissionMode, (newValue) => {
      batchRequestFormStore.transmissionMode = newValue;
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
    addPSI() {
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
