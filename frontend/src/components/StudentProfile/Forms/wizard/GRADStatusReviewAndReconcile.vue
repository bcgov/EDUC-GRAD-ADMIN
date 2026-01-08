<template>
  <v-col>
    <v-row no-gutters class="mb-6">
      <v-col cols="12" md="6" class="pr-md-2">
        <v-card class="mb-2">
          <v-card-title class="pb-2">
            <router-link
              :to="'/student-profile/' + sourceStudentData.studentID"
              target="_blank"
              class="text-decoration-none"
            >
              <span class="text-h6">
                {{ sourceStudentName }}
                <v-icon :size="16" class="ml-1">mdi-open-in-new</v-icon>
              </span>
            </router-link>
          </v-card-title>
          <v-card-text>
            <v-table dense>
              <tbody>
                <tr>
                  <td class="font-weight-medium">Program</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': overrideAll }">
                    {{ sourceStudentGradStatus.program }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Program Completion Date</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': overrideAll }">
                    {{ $filters.formatYYYYMMDate(sourceStudentGradStatus.programCompletionDate) }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Student Grade</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': overrideAll }">
                    {{ sourceStudentGradStatus.studentGrade }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">School of Record</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': overrideAll }">
                    {{ formatSchoolName(sourceStudentSchoolOfRecord) }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">School at Graduation</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': overrideAll }">
                    {{ formatSchoolName(sourceStudentSchoolAtGrad) }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Honours Standing</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': overrideAll }">
                    {{ sourceStudentGradStatus.honoursStanding }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Adult Start Date</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': overrideAll }">
                    {{ $filters.formatSimpleDate(sourceStudentGradStatus.adultStartDate) }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Optional Programs</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': overrideAll }">
                    <div v-if="sourceStudentGradStatus.optionalPrograms?.length > 0">
                      <div
                        v-for="item in sourceStudentGradStatus.optionalPrograms"
                        :key="item.optionalProgramCode"
                      >
                        {{ item.optionalProgramCode }} - {{ item.optionalProgramName }}
                      </div>
                    </div>
                    <span v-else class="text--secondary">None</span>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" class="pl-md-2">
        <v-card class="mb-2">
          <v-card-title class="pb-2">
            <router-link
              :to="'/student-profile/' + targetStudentData.studentID"
              target="_blank"
              class="text-decoration-none"
            >
              <span class="text-h6">
                {{ targetStudentName }}
                <v-icon :size="16" class="ml-1">mdi-open-in-new</v-icon>
              </span>
            </router-link>
          </v-card-title>
          <v-card-text>
            <v-table dense>
              <tbody>
                <tr>
                  <td class="font-weight-medium">Program</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': !overrideAll }">
                    {{ targetStudentGradStatus.program }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Program Completion Date</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': !overrideAll }">
                    {{ $filters.formatYYYYMMDate(targetStudentGradStatus.programCompletionDate) }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Student Grade</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': !overrideAll }">
                    {{ targetStudentGradStatus.studentGrade }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">School of Record</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': !overrideAll }">
                    {{ formatSchoolName(targetStudentSchoolOfRecord) }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">School at Graduation</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': !overrideAll }">
                    {{ formatSchoolName(targetStudentSchoolAtGrad) }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Honours Standing</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': !overrideAll }">
                    {{ targetStudentGradStatus.honoursStanding }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Adult Start Date</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': !overrideAll }">
                    {{ $filters.formatSimpleDate(targetStudentGradStatus.adultStartDate) }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Consumer Education Requirement Met</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': !overrideAll }">
                    {{ targetStudentGradStatus.consumerEducationRequirementMet }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-medium">Optional Programs</td>
                  <td class="font-weight-bold" :class="{ 'primary--text': !overrideAll }">
                    <div v-if="targetStudentGradStatus.optionalPrograms?.length > 0">
                      <div
                        v-for="item in targetStudentGradStatus.optionalPrograms"
                        :key="item.optionalProgramCode"
                      >
                        {{ item.optionalProgramCode }} - {{ item.optionalProgramName }}
                      </div>
                    </div>
                    <span v-else class="text--secondary">None</span>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-radio-group v-model="overrideAll" class="mb-6">
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pr-md-2">
          <v-radio
            :value="true"
            :label="`Copy over all values from ${sourceStudentData.pen}`"
            hide-details />
        </v-col>
        <v-col cols="12" md="6" class="pl-md-2">
          <v-radio :value="false" :label="`Keep all values from ${targetStudentData.pen}`" hide-details />
        </v-col>
      </v-row>
    </v-radio-group>
  </v-col>
</template>
<script>
import {useStudentStore} from "@/store/modules/student";
import {useAppStore} from "@/store/modules/app";
import sharedMethods from "@/sharedMethods.js";
import {mapActions, mapState} from "pinia";

export default {
  name: "GRADStatusReviewAndReconcile",
  data() {
    return {
      overrideAll: false,
    };
  },
  computed: {
    ...mapState(useAppStore, {
      getSchoolById: "getSchoolById",
      optionalProgramsByGradProgram: "optionalProgramsByGradProgram",
    }),
    sourceStudentName() {
      return sharedMethods.formatStudentName(this.sourceStudentData);
    },
    sourceStudentSchoolOfRecord() {
      return this.getSchoolById(this.sourceStudentGradStatus?.schoolOfRecordId);
    },
    targetStudentSchoolOfRecord() {
      return this.getSchoolById(this.targetStudentGradStatus?.schoolOfRecordId);
    },
    sourceStudentSchoolAtGrad() {
      return this.getSchoolById(this.sourceStudentGradStatus?.schoolAtGradId);
    },
    targetStudentSchoolAtGrad() {
      return this.getSchoolById(this.targetStudentGradStatus?.schoolAtGradId);
    },
    targetStudentName() {
      return sharedMethods.formatStudentName(this.targetStudentData);
    },
  },
  props: {
    sourceStudentData: {
      type: Object,
      required: true,
    },
    targetStudentData: {
      type: Object,
      required: true,
    },
    sourceStudentGradStatus: {
      type: Object,
      required: true,
    },
    targetStudentGradStatus: {
      type: Object,
      required: true,
    },
    keysToOverride: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:keysToOverride"],
  methods: {
    ...mapActions(useStudentStore, [
      "setGradStatusToMerge",
      "clearGradStatusToMerge",
    ]),
    formatSchoolName(school) {
      return !!school ? `${school.mincode} - ${school.displayName}` : "";
    },
    updateGradStatusToMerge() {
      if (!this.overrideAll) {
        // Keep all target values - clear the merge
        this.clearGradStatusToMerge();
        // Update keysToOverride to all false
        const allFalse = {
          program: false,
          programCompletionDate: false,
          studentGrade: false,
          schoolOfRecord: false,
          schoolAtGrad: false,
          honoursStanding: false,
          adultStartDate: false,
          consumerEducationRequirementMet: false,
          optionalPrograms: false,
        };
        this.$emit("update:keysToOverride", allFalse);
      } else {
        // Override all from source - set all keys to true
        const allTrue = {
          program: true,
          programCompletionDate: true,
          studentGrade: true,
          schoolOfRecord: true,
          schoolAtGrad: true,
          honoursStanding: true,
          adultStartDate: true,
          consumerEducationRequirementMet: true,
          optionalPrograms: true,
        };
        this.$emit("update:keysToOverride", allTrue);

        // Build merged object with all source values
        const merged = {
          studentID: this.targetStudentData.studentID,
          program: this.sourceStudentGradStatus.program,
          studentStatus: this.targetStudentGradStatus.studentStatus,
          programCompletionDate: this.sourceStudentGradStatus.programCompletionDate,
          studentGrade: this.sourceStudentGradStatus.studentGrade,
          schoolOfRecordId: this.sourceStudentGradStatus.schoolOfRecordId,
          schoolAtGradId: this.sourceStudentGradStatus.schoolAtGradId,
          honoursStanding: this.sourceStudentGradStatus.honoursStanding,
          adultStartDate: this.sourceStudentGradStatus.adultStartDate,
          consumerEducationRequirementMet:
            this.sourceStudentGradStatus.consumerEducationRequirementMet,
          optionalPrograms: this.setOptionalProgramsToOverride(
            this.sourceStudentGradStatus.optionalPrograms
          ),
          careerPrograms: this.sourceStudentGradStatus.careerPrograms,
        };

        this.setGradStatusToMerge(merged);
      }
    },
    setOptionalProgramsToOverride(sourceOptionalPrograms) {
      if (!sourceOptionalPrograms || sourceOptionalPrograms.length === 0) {
        return [];
      }
      let gradProgramOptionalPrograms = this.optionalProgramsByGradProgram(
        this.sourceStudentGradStatus.program
      );
      return sourceOptionalPrograms
        .map((sourceOptProgram) => {
          return gradProgramOptionalPrograms.find(
            (targetOptProgram) =>
              targetOptProgram.optProgramCode ===
              sourceOptProgram.optionalProgramCode
          );
        })
        .filter(Boolean); // the Boolean will filter out undefined if no match is found
    },
  },
  watch: {
    overrideAll() {
      this.updateGradStatusToMerge();
    },
  },
  mounted() {
    // If any key is true, set overrideAll to true
    this.overrideAll = Object.values(this.keysToOverride).some(
        (val) => val === true
    );
  },
};
</script>

<style scoped>
.v-radio :deep(.v-label) {
  margin-bottom: 0 !important;
}
</style>
