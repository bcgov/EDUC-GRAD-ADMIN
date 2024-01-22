<template>
  <div>
    <b-card title="Include Post Secondary Institute(s)">
      <b-card-text>
        <div v-if="schoolCategory != '04' && schoolCategory != '09'">
          <label>Post Secondary Institution Code</label>
          <b-input
            type="text"
            v-model="psi"
            maxlength="3"
            @input="validatePSI"
            class="w-25"
          />
          <div
            class="input-errors"
            v-for="error of v$.psi.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>

          <div v-if="psiInfo">
            <b-card>
              <b-card-text>
                <b-alert
                  dismissible
                  v-if="validationMessage"
                  show
                  variant="danger"
                  >{{ validationMessage }}</b-alert
                >
                <b-overlay :show="psiValidating">
                  <div v-if="!psiInfo">NOT VALID</div>
                  <div v-else>
                    <strong>Post Secondary Institute:</strong>
                    {{ psiInfo.psiName }}<br />
                  </div>
                  <b-button
                    @click="addPSI()"
                    :disabled="validationMessage != ''"
                    class="float-right"
                    >Add</b-button
                  >
                </b-overlay>
              </b-card-text>
            </b-card>
          </div>
        </div>
        <b-table
          v-if="psis.length > 0"
          :items="psis"
          :fields="psiInputFields"
          striped="true"
        >
          <template #cell(remove)="row">
            <b-button
              class="btn btn-primary w-100"
              @click="removePSI(row.item.psi)"
            >
              Remove
            </b-button>
          </template>
          <template #cell(info)="row">
            <div>
              {{ row.item.info.psiName }}
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
import { mapActions, mapState } from "pinia";
import { useBatchProcessingStore } from "../../../../store/modules/batchprocessing";
import { isProxy, toRaw } from "vue";

export default {
  components: {},
  setup(props) {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      psi: {
        minLength: minLength(3),
        async isValid(value) {
          this.validationMessage = "";
          if (value === "") return true;
          if (value.length == 3) {
            console.log(value);

            let psi = await TRAXService.getPSIByAdvancedSearch(
              "psiCode=" + value
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
  data() {
    return {
      psi: "",
      psiInfo: "",
      psiValidating: false,
      validationMessage: "",
      psis: [],
      psiInputFields: [
        {
          key: "psi",
          label: "Code",
          sortable: true,
          class: "text-left",
        },
        {
          key: "info",
          label: "Post Secondary Institute",
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
    ...mapActions(useBatchProcessingStore, ["setPsi"]),
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
      this.psis.splice(0, 0, {
        psi: this.psi,
        info: this.psiInfo,
      });
      this.setPsi(this.psis);

      this.clearPSI();
    },
    removePSI(psi) {
      let psiList = toRaw(this.psis);
      for (const [index] in psiList) {
        if (psiList[index].psi == psi) {
          this.psis.splice(index, 1);
        }
      }
      this.setPsi(psiList);
    },
  },
  props: {
    credentialType: String,
    runType: String,
  },

  computed: {
    ...mapState(useBatchProcessingStore, ["getPsi"]),
    isEmpty() {
      return this.psis.length > 0;
    },
  },
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
</style>
