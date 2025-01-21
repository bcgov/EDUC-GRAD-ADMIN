<template>
  <v-container>
    <v-row>
      <v-col>
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
              variant="outlined"
              v-model="schoolId"
              label="Select a school to include"
              :items="getSchoolsList"
              :item-title="schoolTitle"
              item-value="schoolId"
            >
              <template v-slot:label="label">
                {{ label.label }}
              </template>
            </v-autocomplete>
            <v-alert v-if="validationMessage" type="error">{{
              validationMessage
            }}</v-alert>
          </v-col>
          <v-col md="2">
            <v-btn color="bcGovBlue" @click="addSchool()">Add School</v-btn>
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
              {{ item.info.displayName }}
            </div>
            <div>
              <strong>Transcript Eligibility:</strong>
              {{ item.info.canIssueTranscripts ? "Y" : "N" }}
            </div>
            <div>
              <strong>Certificate Eligibility:</strong>
              {{ item.info.canIssueCertificates ? "Y" : "N" }}
            </div>
            <div>
              <strong>School Category:</strong>
              {{ getInstituteCategoryDisplayByCode(item.info.schoolCategoryCode) }}
            </div>
          </template>
          <template #bottom> </template>
        </v-data-table>
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
      schoolId: "",
      mincodeSchoolInfo: "",
      mincodeValidating: false,
      validationMessage: "",
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
    clearmincodeSchoolInfo() {
      this.mincodeSchoolInfo = "";
    },
    clearMincode() {
      this.validationMessage = "";
      this.schoolId = "";
      this.mincode = "";
      this.clearmincodeSchoolInfo();
    },
    async addSchool() {
      this.validationMessage = "";
      //if (this.mincode === "") return true;
      if (!!this.schoolId.length) {
        try {
          let schoolInfo = this.getSchoolById(this.schoolId);
          if (schoolInfo) {
            this.mincodeSchoolInfo = {
              displayName: schoolInfo.displayName,
              canIssueTranscripts: schoolInfo.canIssueTranscripts,
              canIssueCertificates: schoolInfo.canIssueCertificates,
              schoolCategoryCode: schoolInfo.schoolCategoryCode,
            };
            this.mincode = schoolInfo.mincode; //set mincode to add to batch request here since schoolId is now the v-model
            this.schools.splice(0, 0, {
              mincode: this.mincode,
              info: this.mincodeSchoolInfo,
            });
            this.clearMincode();
            return true;
          }
        } catch (error) {
          this.validationMessage = this.mincode + " is not valid";
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
    ...mapState(useAppStore, ["getSchoolsList", "getSchoolById", "getInstituteCategoryDisplayByCode"]),
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
