<template>
  <v-container>
    <v-card>
      <v-card-title>Include School Category</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            {{ getBatchRequest }}
            |||||

            {{ getDistricts }}
            <v-autocomplete
              v-model="district"
              :items="getDistrictList"
              label="Category"
              outlined
              :item-title="districtTitle"
              item-value="districtNumber"
            ></v-autocomplete>
            <v-btn
              :disabled="!district"
              @click="addDistrict()"
              class="float-right"
              >Add District</v-btn
            >
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <label class="font-weight-bold pt-2">District</label>

            <v-row v-if="districtInfo" class="float-left col-10">
              <v-card>
                <v-card-text>
                  <v-alert v-if="validationMessage" dismissible type="danger">{{
                    validationMessage
                  }}</v-alert>
                  <v-overlay :value="districtValidating">
                    <div v-if="!districtInfo">NOT VALID</div>
                    <div v-else>
                      <strong>District:</strong> {{ districtInfo.districtName
                      }}<br />
                      <strong>Active Flag:</strong> {{ districtInfo.activeFlag
                      }}<br />
                    </div>
                  </v-overlay>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    @click="addDistrict()"
                    :disabled="validationMessage !== ''"
                  >
                    Add
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-col>
        </v-row>

        <v-data-table
          v-if="districts.length > 0"
          :items="districts"
          :headers="districtInputFields"
          striped
        >
          <template v-slot:item.remove="{ item }">
            <v-btn
              @click="removeDistrict(item.columns.district)"
              color="primary"
            >
              Remove
            </v-btn>
          </template>
          <template v-slot:item.info="{ item }">
            <div>
              <strong>District Name:</strong>
              {{ item.columns.info.districtName }}
            </div>
            <div>
              <strong>Active Flag:</strong> {{ item.columns.info.activeFlag }}
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import { mapActions, mapState } from "pinia";
import { useAppStore } from "../../../../store/modules/app";
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
    return {};
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
          title: "District",
          sortable: true,
          class: "text-left col-1",
        },
        {
          key: "info",
          title: "Info",
          sortable: true,
          class: "text-left",
        },
        {
          key: "remove",
          title: "remove",
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
    districtTitle(item) {
      return `${item.districtNumber} - ${item.displayName}`;
    },
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
      let info = this.getDistrictList.find(
        (districtObject) => districtObject.districtNumber === this.district
      );
      this.districtInfo = {
        districtNumber: info.districtNumber,
        districtName: info.displayName,
        activeFlag: info.activeFlag,
      };
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
    ...mapState(useAppStore, ["getDistrictList"]),
    ...mapState(useBatchProcessingStore, ["getDistricts", "getBatchRequest"]),

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
