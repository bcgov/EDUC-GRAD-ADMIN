<template>
  <v-container>
    <v-card>
      <v-alert v-if="$slots.inputWarning" type="info" class="pb-2">
        <slot name="inputWarning"></slot>
      </v-alert>
      <v-card-text>
        <v-row v-if="!disableSelectCategory">
          <v-col md="2">
            <label class="font-weight-bold">Category</label>
          </v-col>
          <v-col md="10">
            <v-select
              v-model="schoolCategory"
              :items="getBatchSchoolCategoryCodes"
              item-title="label"
              item-value="schoolCategoryCode"
              label="School Category"
              class="my-2"
              variant="outlined"
              outlined
              hide-details
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="!disableSelectStudents">
          <v-col md="12">
            <DateRangeInput></DateRangeInput>
          </v-col>
        </v-row>
        <v-row
          v-if="
            schoolCategory !== 'YUKON' &&
            schoolCategory !== 'OFFSHORE' &&
            !disableSelectDistrict
          "
        >
          <v-col md="2">
            <label class="font-weight-bold">District</label>
          </v-col>
          <v-col sm="5" lg="8">
            <v-autocomplete
              v-model="district"
              v-if="!selectAllDistricts"
              :items="getDistrictList"
              label="District"
              variant="outlined"
              :item-title="districtTitle"
              item-value="districtNumber"
            ></v-autocomplete>
            <v-checkbox
              v-model="selectAllDistricts"
              @change="selectAllDistrictsCheckbox($event)"
              label="Select all districts"
            ></v-checkbox>
          </v-col>
          <v-col sm="5" lg="2">
            <v-btn
              :disabled="!district || selectAllDistricts"
              @click="addDistrict()"
              class="float-left bg-primary"
              >Add District</v-btn
            >
          </v-col>
        </v-row>

        <v-row>
          <v-col>
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
                    <v-icon>mdi-plus</v-icon>
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
              v-if="schoolCategory != 'YUKON' && schoolCategory != 'OFFSHORE'"
              @click="removeDistrict(item.district)"
              color="primary"
            >
              Remove
            </v-btn>
          </template>
          <template v-slot:item.info="{ item }">
            <div>
              <strong>District Name:</strong>
              {{ item.info.districtName }}
            </div>
            <div><strong>Active Flag:</strong> {{ item.info.activeFlag }}</div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import { isProxy, toRaw, ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { mapActions, mapState } from "pinia";
import { useAppStore } from "../../../../store/modules/app";
import DateRangeInput from "./DateRangeInput.vue";
import { useBatchRequestFormStore } from "../../../../store/modules/batchRequestFormStore";
import { required, minLength, helpers } from "@vuelidate/validators";

export default {
  components: { DateRangeInput: DateRangeInput },
  setup() {
    const batchRequestFormStore = useBatchRequestFormStore();
    const gradDateFrom = ref(batchRequestFormStore.gradDateFrom);
    const gradDateTo = ref(batchRequestFormStore.gradDateTo);
    const districts = ref(batchRequestFormStore.districts);
    const schoolCategory = ref(batchRequestFormStore.categoryCode);
    watch(schoolCategory, (newValue) => {
      batchRequestFormStore.categoryCode = newValue;
    });
    watch(gradDateFrom, (newValue) => {
      batchRequestFormStore.gradDateFrom = newValue;
    });
    watch(gradDateTo, (newValue) => {
      batchRequestFormStore.gradDateTo = newValue;
    });

    return {
      schoolCategory,
      gradDateTo,
      gradDateFrom,
      districts,
      v$: useVuelidate(),
    };
  },
  watch: {
    schoolCategory(newValue, previousValue) {
      if (previousValue != newValue) {
        this.selectAllDistricts = false;
        this.districts.splice(0);
      }
      if (this.runType == "DISTRUN_YE") {
        if (newValue == "PUBLIC" || newValue == "INDEPEND") {
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
      if (newValue == "YUKON") {
        this.districts.splice(0);
        this.district = "098";
        let districtId = this.getDistrictByDistrictNumber(
          this.district
        ).districtId;
        this.districtInfo = {
          districtId: districtId,
          districtNumber: "098",
          districtName: "YUKON TERRITORIES",
          activeFlag: "Y",
        };
        this.addDistrict();
      }
      if (newValue == "OFFSHORE") {
        this.districts.splice(0);
        this.district = "103";
        let districtId = this.getDistrictByDistrictNumber(
          this.district
        ).districtId;
        this.districtInfo = {
          districtId: districtId,
          districtNumber: "103",
          districtName: "OFFSHORE INDEPENDENT",
          activeFlag: "Y",
        };
        this.addDistrict();
      }
    },
  },
  validations() {
    return {};
  },
  data() {
    return {
      selectAllDistricts: false,
      addMode: true,
      includeStudents: "Current Students",
      district: "",
      districtInfo: "",
      districtValidating: false,
      validationMessage: "",
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
          title: "",
          sortable: true,
          class: "text-left",
        },
      ],
    };
  },
  mounted() {},
  created() {},
  methods: {
    districtTitle(item) {
      if (item) {
        return `${item.districtNumber} - ${item.displayName}`;
      } else {
        return null;
      }
    },
    async validateDistrict() {
      this.districtValidating = true;
      this.clearDistrictInfo();
      const result = await this.v$.$validate();
      if (!result) {
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
    selectAllDistrictsCheckbox(event) {
      this.clearDistrictInput();
      const AllDistrictChecked = event.target.checked;
      if (AllDistrictChecked) {
        // Remove all psis and automatically add the All PSI
        this.selectAllDistricts = true;
        this.districts.splice(0, this.districts.length, {
          district: "all",
          info: {
            districtId: "all",
            districtNumber: "all",
            districtName: "All School Districts",
            activeFlag: "ALL",
          },
        });
      } else {
        // Remove the "ALL" PSIs and clear the array using splice
        this.selectAllDistricts = false;

        // Clear the array using splice
        this.districts.splice(0, this.districts.length);
      }
    },
    addDistrict() {
      let info = this.getDistrictByDistrictNumber(this.district);
      this.districtInfo = {
        districtId: info.districtId,
        districtNumber: info.districtNumber,
        districtName: info.displayName,
        activeFlag: info.districtStatusCode,
      };
      this.districts.splice(0, 0, {
        district: this.district,
        info: this.districtInfo,
      });

      this.clearDistrictInput();
      this.addMode = false;
    },
    removeDistrict(district) {
      for (const [index] in this.districts) {
        if (this.districts[index].district == district) {
          this.districts.splice(index, 1);
        }
      }
      if (this.districts.length == 0) {
        this.addMode = true;
      }
    },
  },
  props: {
    credentialType: String,
    runType: String,
    disableSelectStudents: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableSelectCategory: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableSelectDistrict: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  computed: {
    ...mapState(useAppStore, [
      "getDistrictList",
      "getDistrictById",
      "getDistrictByDistrictNumber",
      "getBatchSchoolCategoryCodes",
      "getInstituteCategoryCodes",
    ]),
    ...mapState(useBatchRequestFormStore, [
      "getDistricts",
      "getBatchRequest",
      "getSchoolCategory",
    ]),

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
