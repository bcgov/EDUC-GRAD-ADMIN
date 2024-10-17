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
              :items="schoolCategoryOptions"
              item-title="title"
              item-value="value"
              label="School Category"
              class="my-2"
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
            schoolCategory !== '04' &&
            schoolCategory !== '09' &&
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
              label="Category"
              outlined
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
              :disabled="!district"
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
              v-if="schoolCategory != '09' && schoolCategory != '04'"
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
      schoolCategoryOptions: [
        { title: "01 Public", value: "01" },
        { title: "02 Independent", value: "02" },
        { title: "03 Federally Operated Band School", value: "03" },
        { title: "04 Yukon School", value: "04" },
        { title: "09 Offshore", value: "09" },
      ],
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
    districtTitle(item) {
      if (item) {
        return `${item.districtNumber} - ${item.districtName}`;
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
      const AllDistrictChecked = event.target.checked;
      if (AllDistrictChecked) {
        // Remove all psis and automatically add the All PSI
        this.selectAllDistricts = true;
        this.districts.splice(0, this.districts.length, {
          district: "all",
          info: {
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
      let info = this.getDistrictList.find(
        (districtObject) => districtObject.districtNumber === this.district
      );
      this.districtInfo = {
        districtNumber: info.districtNumber,
        districtName: info.districtName,
        activeFlag: info.activeFlag,
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
    ...mapState(useAppStore, ["getDistrictList"]),
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
