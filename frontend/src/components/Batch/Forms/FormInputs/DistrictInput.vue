<template>
  <div>
    <b-card title="Include School Category">
      <b-card-text>
        <label class="font-weight-bold pt-2">Category</label>
        <b-form-select
          id="inline-form-select-type"
          class="col-4 m-2"
          :options="[
            { text: 'Select School Category', value: '' },
            { text: '01 Public', value: '01' },
            { text: '02 Independent', value: '02' },
            { text: '03 Federally Operated Band School', value: '03' },
            { text: '04 Yukon School', value: '04' },
            { text: '09 Offshore', value: '09' },
          ]"
          v-model="schoolCategory"
        ></b-form-select>
        <div
          v-if="
            schoolCategory != '04' &&
            schoolCategory != '09' &&
            runType != 'NONGRADRUN' &&
            (runType != 'DISTRUN_YE' || schoolCategory == '01')
          "
        >
          <label class="float-left font-weight-bold p-2">District</label>
          <b-input
            type="number"
            v-model="district"
            maxlength="3"
            @input="validateDistrict"
            class="w-25 col-1 float-left"
            :disabled="schoolCategory == ''"
          />
          <div
            class="input-errors"
            v-for="error of v$.district.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
          <div v-if="districtInfo" class="float-left col-10">
            <b-card>
              <b-card-text>
                <b-alert
                  dismissible
                  v-if="validationMessage"
                  show
                  variant="danger"
                  >{{ validationMessage }}</b-alert
                >
                <b-overlay :show="districtValidating">
                  <div v-if="!districtInfo">NOT VALID</div>
                  <div v-else>
                    <strong>District:</strong> {{ districtInfo.districtName
                    }}<br />
                    <strong>Active Flag:</strong> {{ districtInfo.activeFlag
                    }}<br />
                  </div>
                </b-overlay>
              </b-card-text>
              <b-button
                @click="addDistrict()"
                :disabled="validationMessage != ''"
                class="float-right"
                >Add</b-button
              >
            </b-card>
          </div>
        </div>
        <b-table
          v-if="districts.length > 0"
          :items="districts"
          :fields="districtInputFields"
          striped="true"
        >
          <template #cell(remove)="row">
            <b-button
              class="btn btn-primary w-100"
              @click="removeDistrict(row.item.district)"
            >
              Remove
            </b-button>
          </template>
          <template #cell(info)="row">
            <div>
              <strong>District Name:</strong> {{ row.item.info.districtName }}
            </div>
            <div>
              <strong>Active Flag:</strong> {{ row.item.info.activeFlag }}
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
import { mapActions, mapState } from "pinia";
import { useBatchProcessingStore } from "../../../../store/modules/batchprocessing";
import { required, minLength, helpers } from "@vuelidate/validators";
import { isProxy, toRaw } from "vue";

export default {
  components: {},
  setup(props) {
    return { v$: useVuelidate() };
  },
  watch: {
    schoolCategory(newValue, previousValue) {
      if (previousValue != newValue) {
        this.districts.splice(0);
      }
      if (this.runType == "DISTRUN_YE") {
        if (newValue == "02" || newValue == "03") {
          //default districts to all
          this.district = "all";
          this.districtInfo = {
            districtNumber: "All Schools",
            districtName: "All Schools",
            activeFlag: "Y",
          };
          this.addDistrict();
        }
      }
      if (newValue == "04") {
        this.districts.splice(0);
        this.district = "098";
        this.districtInfo = {
          districtNumber: "098",
          districtName: "YUKON TERRITORIES",
          activeFlag: "Y",
        };
        this.addDistrict();
      }
      if (newValue == "09") {
        this.districts.splice(0);
        this.district = "103";
        this.districtInfo = {
          districtNumber: "103",
          districtName: "OFFSHORE INDEPENDENT",
          activeFlag: "Y",
        };
        this.addDistrict();
      }
      this.setSchoolCategory(newValue);
    },
  },
  validations() {
    return {
      schoolCategory: {
        required: helpers.withMessage(
          "School Category field cannot be empty",
          required
        ),
      }, // Matches this.firstName
      district: {
        minLength: minLength(3),
        async isValid(value) {
          this.validationMessage = "";
          if (value === "") return true;
          if (value.length == 3) {
            let district = await TRAXService.getDistrict(value);
            if (district.data) {
              this.districtInfo = {
                districtNumber: district.data.districtNumber,
                districtName: district.data.districtName,
                activeFlag: district.data.activeFlag,
              };
              return true;
            }
          }
          return false;
        },
      }, // Matches this.firstName
    };
  },
  data() {
    return {
      district: "",
      districtInfo: "",
      districtValidating: false,
      validationMessage: "",
      schoolCategory: "",
      districts: [],
      districtInputFields: [
        {
          key: "district",
          label: "District",
          sortable: true,
          class: "text-left col-1",
        },
        {
          key: "info",
          label: "Info",
          sortable: true,
          class: "text-left",
        },
        {
          key: "remove",
          label: "remove",
          sortable: true,
          class: "text-left",
        },
      ],
    };
  },
  mounted() {},
  created() {},
  methods: {
    ...mapActions(useBatchProcessingStore, [
      "setDistricts",
      "setSchoolCategory",
    ]),
    async validateDistrict() {
      this.districtValidating = true;
      this.clearDistrictInfo();
      const result = await this.v$.$validate();
      if (!result) {
        console.log("NO RESULT");
        return;
      }
      this.districtValidating = false;
    },
    clearDistrictInfo() {
      this.districtInfo = "";
    },
    clearDistrictInput() {
      this.district = "";
      this.clearDistrictInfo();
    },
    addDistrict() {
      this.districts.splice(0, 0, {
        district: this.district,
        info: this.districtInfo,
      });
      this.setDistricts(this.districts);
      this.clearDistrictInput();
    },
    removeDistrict(district) {
      let districtList = toRaw(this.districts);
      for (const [index] in districtList) {
        console.log(district + index);
        if (districtList[index].district == district) {
          this.districts.splice(index, 1);
        }
      }
      this.setDistricts(districtList);
    },
  },
  props: {
    credentialType: String,
    runType: String,
  },

  computed: {
    ...mapState(useBatchProcessingStore, ["getDistricts"]),
    isEmpty() {
      return this.districts.length > 0;
    },
  },
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
</style>
