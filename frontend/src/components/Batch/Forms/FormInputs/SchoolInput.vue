<template>
  <v-container>
    <v-row>
      <v-col>
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
                  :max="gradDateTo"
                ></v-date-picker>
              </v-col>

              <v-col class="float-left col-4">
                <strong><label class="pt-1">Grad End Date</label></strong>
                <v-date-picker
                  v-model="gradDateTo"
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
                    {{ mincodeSchoolInfo }}
                    <div v-if="mincodeSchoolInfo">
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
                    <div v-else>NOT VALID</div>
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
import { isProxy, toRaw, ref, watch } from "vue";
import TRAXService from "@/services/TRAXService.js";
import SchoolService from "@/services/SchoolService.js";
import StudentService from "@/services/StudentService.js";
import GraduationReportService from "@/services/GraduationReportService.js";
import { useVuelidate } from "@vuelidate/core";
import { useBatchRequestFormStore } from "../../../../store/modules/batchRequestFormStore";
import { useAppStore } from "../../../../store/modules/app";
import { mapActions, mapState } from "pinia";
import { required, minLength, helpers } from "@vuelidate/validators";

export default {
  components: {},
  setup() {
    const batchRequestFormStore = useBatchRequestFormStore();
    const gradDateFrom = ref(batchRequestFormStore.gradDateFrom);
    const gradDateTo = ref(batchRequestFormStore.gradDateTo);
    const schools = ref(batchRequestFormStore.schools);

    watch(gradDateFrom, (newValue) => {
      batchRequestFormStore.gradDateFrom = newValue;
    });
    watch(gradDateTo, (newValue) => {
      batchRequestFormStore.gradDateTo = newValue;
    });

    return {
      gradDateTo,
      gradDateFrom,
      schools,
      v$: useVuelidate(),
    };
  },
  validations() {
    return {
      mincode: {
        async isValid(value) {
          console.log("validatiing " + value);
          if (value === "") return true;
          if (value.length == 8) {
            try {
              let schoolInfo = await SchoolService.getSchoolInfo(value);
              if (schoolInfo.data) {
                this.mincodeSchoolInfo = {
                  schoolName: schoolInfo.data.schoolName,
                  transcriptEligibility: schoolInfo.data.transcriptEligibility,
                  certificateEligibility:
                    schoolInfo.data.certificateEligibility,
                  schoolCategory: schoolInfo.data.schoolCategory,
                  traxReporting: schoolInfo.data.reportingFlag,
                };
                return true;
              }
            } catch (error) {
              console.log(error);
              this.mincodeSchoolInfo = null;
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
      selectedSchool: "",
      mincode: "",
      mincodeSchoolInfo: "",
      mincodeValidating: false,
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
    schoolTitle(item) {
      // Customize this method to return the desired format
      return `${item.mincode} - ${item.displayName}`;
    },
    clearmincodeSchoolInfo() {
      this.mincodeSchoolInfo = "";
    },
    clearMincode() {
      this.mincode = "";
      this.clearmincodeSchoolInfo();
    },

    addSchool() {
      this.schools.splice(0, 0, {
        mincode: this.mincode,
        info: this.mincodeSchoolInfo,
      });
      this.clearMincode();
    },
    removeSchool(mincode) {
      for (const [index, school] in this.schools) {
        if (this.schools[index].mincode == mincode) {
          this.schools.splice(index, 1);
        }
      }
    },
  },
  props: {},

  computed: {
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
