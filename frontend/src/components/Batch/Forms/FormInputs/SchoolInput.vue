<template>
  <v-container>
    <v-row>
      <v-col>
        {{ gradDateFrom }}
        <v-card title="Include School(s)">
          <v-card-text>
            <label class="font-weight-bold p-2 m-0 row float-left"
              >Select Schools</label
            >

            <v-select
              v-model="includeStudents"
              :items="['Current Students', 'Date Range']"
              label="Include Students"
              class="mb-2 mr-sm-2 mb-sm-0 col-3 float-left"
            ></v-select>

            <v-row
              v-if="includeStudents === 'Date Range'"
              class="date-ranges col-12 row"
            >
              <v-col class="row float-left col-3 m-0 p-0">
                <strong><label class="pt-1">Grad Start Date</label></strong>
                <v-date-picker
                  v-model="gradDateFrom"
                  @change="updateSchoolDateRange"
                  :max="gradDateTo"
                ></v-date-picker>
              </v-col>

              <v-col class="float-left col-4">
                <strong><label class="pt-1">Grad End Date</label></strong>
                <v-date-picker
                  v-model="gradDateTo"
                  @change="updateSchoolDateRange"
                  :min="gradDateFrom"
                ></v-date-picker>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <label class="font-weight-bold">Mincode</label>
                {{ selectedSchool }}
                <v-autocomplete
                  v-model="mincode"
                  label="Autocomplete"
                  :items="getSchoolsList"
                  :item-title="schoolTitle"
                  item-value="mincode"
                >
                  <template v-slot:label="label">
                    {{ label.label }}
                  </template>
                </v-autocomplete>

                <v-row v-for="error in v$.mincode.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </v-row>
              </v-col>

              <v-col md="10" v-if="mincodeSchoolInfo">
                <v-card>
                  <v-card-text>
                    <v-spinner v-if="mincodeValidating"></v-spinner>
                    <v-overlay :value="mincodeValidating">
                      <transition :duration="{ enter: 500, leave: 800 }">
                        <div v-if="!mincodeSchoolInfo">NOT VALID</div>
                        <div v-else>
                          <strong>School Name:</strong>
                          {{ mincodeSchoolInfo.schoolName }}<br />
                          <strong>Transcript Eligibility:</strong>
                          {{ mincodeSchoolInfo.transcriptEligibility }}<br />
                          <strong>Certificate Eligibility</strong>
                          {{ mincodeSchoolInfo.certificateEligibility }}<br />
                          <strong>School Category</strong>
                          {{ mincodeSchoolInfo.transcriptEligibility }}<br />
                          <strong>TRAX reporting</strong>
                          {{ mincodeSchoolInfo.traxReporting }}<br />
                        </div>
                      </transition>
                    </v-overlay>
                  </v-card-text>
                  <v-btn @click="addSchool()" class="float-right"
                    >Add School</v-btn
                  >
                </v-card>
              </v-col>
            </v-row>
            {{ schools }}
            <v-data-table
              v-if="schools.length"
              :items="schools"
              :headers="schoolInputFields"
            >
              <template v-slot:item.remove="{ item }">
                <v-btn
                  @click="removeSchool(item.raw.mincode)"
                  class="btn btn-primary w-100"
                  >Remove</v-btn
                >
              </template>
              <template v-slot:item.info="{ item }">
                <div>
                  <strong>School Name:</strong>
                  {{ item.raw.info.schoolName }}
                </div>
                <div>
                  <strong>Transcript Eligibility:</strong>
                  {{ item.raw.info.transcriptEligibility }}
                </div>
                <div>
                  <strong>Certificate Eligibility</strong>
                  {{ item.raw.info.certificateEligibility }}
                </div>
                <div>
                  <strong>School Category</strong>
                  {{ item.raw.info.transcriptEligibility }}
                </div>
                <div>
                  <strong>TRAX reporting</strong>
                  {{ item.raw.info.traxReporting }}
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { isProxy, toRaw } from "vue";
import TRAXService from "@/services/TRAXService.js";
import SchoolService from "@/services/SchoolService.js";
import StudentService from "@/services/StudentService.js";
import GraduationReportService from "@/services/GraduationReportService.js";
import { useVuelidate } from "@vuelidate/core";
import { useBatchProcessingStore } from "../../../../store/modules/batchprocessing";
import { useAppStore } from "../../../../store/modules/app";
import { mapActions, mapState } from "pinia";
import { required, minLength, helpers } from "@vuelidate/validators";

export default {
  components: {},
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      mincode: {
        minLength: minLength(8),
        async isValid(value) {
          if (value === "") return true;
          if (value.length == 8) {
            let schoolInfo = await SchoolService.getSchoolInfo(value);
            if (schoolInfo.data) {
              this.mincodeSchoolInfo = {
                schoolName: schoolInfo.data.schoolName,
                transcriptEligibility: schoolInfo.data.transcriptEligibility,
                certificateEligibility: schoolInfo.data.certificateEligibility,
                schoolCategory: schoolInfo.data.schoolCategory,
                traxReporting: schoolInfo.data.reportingFlag,
              };
              return true;
            } else {
              return false;
            }
          }
        },
      }, // Matches this.firstName
    };
  },
  data() {
    return {
      includeStudents: "Current Students",
      gradDateFrom: "",
      gradDateTo: "",
      selectedSchool: "",
      mincode: "",
      mincodeSchoolInfo: "",
      mincodeValidating: false,
      schools: [],
      schoolInputFields: [
        {
          key: "mincode",
          title: "Mincode",
          sortable: true,
          class: "text-left",
        },
        {
          key: "info",
          title: "School",
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
    ...mapActions(useBatchProcessingStore, [
      "setSchools",
      "setGradDateFrom",
      "setGradDateTo",
    ]),
    schoolTitle(item) {
      // Customize this method to return the desired format
      return `${item.mincode} - ${item.displayName}`;
    },
    async validateSchool() {
      this.mincodeValidating = true;
      if (this.mincode.length < 8) {
        this.clearmincodeSchoolInfo();
      } else {
        const result = await this.v$.$validate();
        if (!result) {
          return;
        }
      }

      this.mincodeValidating = false;
    },
    clearmincodeSchoolInfo() {
      this.mincodeSchoolInfo = "";
    },
    clearMincode() {
      this.mincode = "";
      this.clearmincodeSchoolInfo();
    },
    updateSchoolDateRange() {
      console.log("gradDateChange");
      this.setGradDateFrom(this.gradDateFrom);
      this.setGradDateTo(this.gradDateTo);
    },
    addSchool() {
      this.schools.splice(0, 0, {
        mincode: this.mincode,
        info: this.mincodeSchoolInfo,
      });
      this.setSchools(this.schools);
      this.clearMincode();
    },
    removeSchool(mincode) {
      const schoolList = toRaw(this.schools);
      for (const [index, school] in schoolList) {
        if (schoolList[index].mincode == mincode) {
          this.schools.splice(index, 1);
        }
      }
      this.setSchools(schoolList);
    },
  },
  props: {},

  computed: {
    ...mapState(useBatchProcessingStore, ["getSchools"]),
    ...mapState(useAppStore, ["getSchoolsList"]),
    isEmpty() {
      return this.students.length > 0;
    },
  },
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
</style>
