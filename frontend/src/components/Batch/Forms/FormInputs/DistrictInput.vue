<template>
  <v-container>
    <v-card>
      <v-card-title>Include School Category</v-card-title>
      <v-card-text>
        <v-row>
          <v-col sm="6" lg="9">
            <v-autocomplete
              v-model="district"
              :items="getDistrictList"
              label="Category"
              outlined
              :item-title="districtTitle"
              item-value="districtNumber"
            ></v-autocomplete>
          </v-col>
          <v-col sm="6" lg="3">
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
            <v-btn @click="removeDistrict(item.district)" color="primary">
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
import { useBatchRequestFormStore } from "../../../../store/modules/batchRequestFormStore";
import { required, minLength, helpers } from "@vuelidate/validators";

export default {
  components: {},
  setup() {
    const batchRequestFormStore = useBatchRequestFormStore();
    const gradDateFrom = ref(batchRequestFormStore.gradDateFrom);
    const gradDateTo = ref(batchRequestFormStore.gradDateTo);
    const districts = ref(batchRequestFormStore.districts);

    watch(gradDateFrom, (newValue) => {
      batchRequestFormStore.gradDateFrom = newValue;
    });
    watch(gradDateTo, (newValue) => {
      batchRequestFormStore.gradDateTo = newValue;
    });

    return {
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
      district: "",
      districtInfo: "",
      districtValidating: false,
      validationMessage: "",
      schoolCategory: "",
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

      this.clearDistrictInput();
    },
    removeDistrict(district) {
      for (const [index] in this.districts) {
        if (this.districts[index].district == district) {
          this.districts.splice(index, 1);
        }
      }
    },
  },
  props: {
    credentialType: String,
    runType: String,
  },

  computed: {
    ...mapState(useAppStore, ["getDistrictList"]),
    ...mapState(useBatchRequestFormStore, ["getDistricts", "getBatchRequest"]),

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
