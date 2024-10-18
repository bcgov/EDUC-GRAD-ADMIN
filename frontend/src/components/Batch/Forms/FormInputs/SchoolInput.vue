<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card title="Include School(s)">
          <v-card-text>
            <v-alert v-if="$slots.inputWarning" type="info" class="pb-2">
              <slot name="inputWarning"></slot>
            </v-alert>

            <v-row v-if="!disableSelectStudents">
              <v-col sm="12">
                <DateRangeInput></DateRangeInput>
              </v-col>
            </v-row>

            <v-row>
              <v-col md="2">
                <label class="font-weight-bold">School</label>
              </v-col>
              <v-col md="8">
                <v-autocomplete
                  v-model="mincode"
                  label="Select a school to include"
                  :items="getSchoolsList"
                  :item-title="schoolTitle"
                  item-value="mincode"
                >
                  <template v-slot:label="label">
                    {{ label.label }}
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col md="2">
                <v-btn @click="addSchool()">Add School</v-btn>
                <v-row v-for="error in v$.mincode.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </v-row>
              </v-col>
            </v-row>
            <v-data-table
              v-if="schools.length"
              :items="schools"
              :headers="schoolInputFields"
            >
              <template v-slot:item.remove="{ item }">
                <v-btn
                  @click="removeSchool(item.mincode)"
                  class="btn btn-primary w-100"
                  >Remove</v-btn
                >
              </template>
              <template v-slot:item.info="{ item }">
                <div>
                  <strong>School Name:</strong>
                  {{ item.info.schoolName }}
                </div>
                <div>
                  <strong>Transcript Eligibility:</strong>
                  {{ item.info.transcriptEligibility ? "Y" : "N" }}
                </div>
                <div>
                  <strong>Certificate Eligibility</strong>
                  {{ item.info.certificateEligibility ? "Y" : "N" }}
                </div>
                <div>
                  <strong>School Category</strong>
                  {{ item.info.schoolCategory }}
                </div>
                <div>
                  <strong>TRAX reporting</strong>
                  {{ item.info.traxReporting }}
                </div>
              </template>
              <template #bottom></template>
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
import DateRangeInput from "./DateRangeInput.vue";
import { useVuelidate } from "@vuelidate/core";
import { useBatchRequestFormStore } from "../../../../store/modules/batchRequestFormStore";
import { useAppStore } from "../../../../store/modules/app";
import { mapActions, mapState } from "pinia";
import { required, minLength, helpers } from "@vuelidate/validators";

export default {
  components: { DateRangeInput: DateRangeInput },
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
          return true;
        },
      }, // Matches this.firstName
    };
  },
  data() {
    return {
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
      if (item) {
        return `${item.mincode} - ${item.displayName}`;
      } else {
        return null;
      }
    },
    schoolTitle(item) {
      // Customize this method to return the desired format
      if (item) {
        return `${item.mincode} - ${item.displayName}`;
      } else {
        return null;
      }
    },
    clearmincodeSchoolInfo() {
      this.mincodeSchoolInfo = "";
    },
    clearMincode() {
      this.mincode = "";
      this.clearmincodeSchoolInfo();
    },
    async addSchool() {
      if (this.mincode === "") return true;
      if (this.mincode.length == 8) {
        console.log("8");
        try {
          let schoolInfo = await SchoolService.getSchoolInfo(this.mincode);
          if (schoolInfo.data) {
            this.mincodeSchoolInfo = {
              schoolName: schoolInfo.data.schoolName,
              transcriptEligibility: schoolInfo.data.transcriptEligibility,
              certificateEligibility: schoolInfo.data.certificateEligibility,
              schoolCategory: schoolInfo.data.schoolCategory,
              traxReporting: schoolInfo.data.reportingFlag,
            };
            this.schools.splice(0, 0, {
              mincode: this.mincode,
              info: this.mincodeSchoolInfo,
            });
            this.clearMincode();
            return true;
          }
        } catch (error) {
          console.log(error);
          this.mincodeSchoolInfo = null;
          return false;
        }
      }
    },
    removeSchool(mincode) {
      for (const [index, school] in this.schools) {
        if (this.schools[index].mincode == mincode) {
          this.schools.splice(index, 1);
        }
      }
    },
  },

  props: {
    disableSelectStudents: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

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
.w-100 {
  width: 100%;
}
</style>
