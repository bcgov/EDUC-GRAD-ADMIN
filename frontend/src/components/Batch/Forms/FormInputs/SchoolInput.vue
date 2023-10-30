<template>
  <div>
    {{ gradDateFrom }}
    <b-card title="Include School(s)">
      <b-card-text>
        <label class="font-weight-bold p-2 m-0 row float-left"
          >Select Schools</label
        >

        <b-form-select
          id="inline-form-select-audience"
          class="mb-2 mr-sm-2 mb-sm-0 col-3 float-left"
          :options="[
            { text: 'Current Students', value: 'Current Students' },
            { text: 'Date Range', value: 'Date Range' },
          ]"
          value="Current Students"
          v-model="includeStudents"
        ></b-form-select>

        <div
          class="date-ranges col-12 row"
          v-if="includeStudents == 'Date Range'"
        >
          <div class="row float-left col-3 m-0 p-0">
            <strong><label class="pt-1">Grad Start Date</label></strong>
            <b-input-group class="mb-3">
              <b-form-input
                id="gradDateFromInput"
                v-model="gradDateFrom"
                type="text"
                placeholder="YYYY-MM-DD"
                autocomplete="off"
                @change="updateSchoolDateRange"
              ></b-form-input>
              <ul class="position-absolute form-validation-message text-danger">
                <li v-for="error in errors" :key="error">{{ error }}</li>
              </ul>
              <b-input-group-append>
                <b-form-datepicker
                  v-model="gradDateFrom"
                  @change="updateSchoolDateRange"
                  button-only
                  right
                  locale="en-US"
                ></b-form-datepicker>
              </b-input-group-append>
            </b-input-group>
          </div>

          <div class="float-left col-4">
            <strong><label class="pt-1">Grad End Date</label></strong>
            <b-input-group class="mb-3">
              <b-form-input
                id="gradDateToInput"
                v-model="gradDateTo"
                type="text"
                placeholder="YYYY-MM-DD"
                autocomplete="off"
                @change="updateSchoolDateRange"
              ></b-form-input>

              <b-input-group-append>
                <b-form-datepicker
                  v-model="gradDateTo"
                  @change="updateSchoolDateRange"
                  button-only
                  right
                  locale="en-US"
                  aria-controls="example-input"
                ></b-form-datepicker>
              </b-input-group-append>
            </b-input-group>
          </div>
        </div>
        <div class="row">
          <div class="col-md-2 py-2">
            <label class="font-weight-bold">Mincode</label>
            <b-input type="number" v-model="mincode" @input="validateSchool" />
            <div
              class="input-errors"
              v-for="error of v$.mincode.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </div>
          <div class="col-md-10" v-if="mincodeSchoolInfo">
            <b-card>
              <b-card-text>
                <b-spinner v-if="mincodeValidating"></b-spinner>
                <b-overlay :show="mincodeValidating">
                  <Transition :duration="{ enter: 500, leave: 800 }">
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
                  </Transition>
                </b-overlay>
              </b-card-text>
              <b-button @click="addSchool()" class="float-right"
                >Add School</b-button
              >
            </b-card>
          </div>
        </div>
        <b-table
          v-if="schools.length"
          :items="schools"
          :fields="schoolInputFields"
          striped="true"
        >
          <template #cell(remove)="row">
            <b-button
              class="btn btn-primary w-100"
              @click="removeSchool(row.item.mincode)"
            >
              Remove
            </b-button>
          </template>
          <template #cell(info)="row">
            <div>
              <strong>School Name:</strong>
              {{ row.item.info.schoolName }}
            </div>
            <div>
              <strong>Transcript Eligibility:</strong>
              {{ row.item.info.transcriptEligibility }}
            </div>
            <div>
              <strong>Certificate Eligibility</strong>
              {{ row.item.info.certificateEligibility }}
            </div>
            <div>
              <strong>School Category</strong>
              {{ row.item.info.transcriptEligibility }}
            </div>
            <div>
              <strong>TRAX reporting</strong>
              {{ row.item.info.traxReporting }}
            </div>
          </template>
        </b-table>
      </b-card-text>
    </b-card>

    <!-- </b-card>             -->
  </div>
</template>
<script>
import { isProxy, toRaw } from "vue";
import TRAXService from "@/services/TRAXService.js";
import SchoolService from "@/services/SchoolService.js";
import StudentService from "@/services/StudentService.js";
import GraduationReportService from "@/services/GraduationReportService.js";
import { useVuelidate } from "@vuelidate/core";
import { useBatchProcessingStore } from "../../../../store/modules/batchprocessing";
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

      mincode: "",
      mincodeSchoolInfo: "",
      mincodeValidating: false,
      schools: [],
      schoolInputFields: [
        {
          key: "mincode",
          label: "Mincode",
          sortable: true,
          class: "text-left",
        },
        {
          key: "info",
          label: "School",
          sortable: true,
          class: "text-left",
        },
        {
          key: "remove",
          label: "",
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
