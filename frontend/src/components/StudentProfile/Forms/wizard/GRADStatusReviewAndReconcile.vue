<template>
  <v-col>
    <v-row no-gutters
      ><v-col cols="4"></v-col>
      <v-col cols="4">
        <router-link
          :to="'/student-profile/' + sourceStudentData.studentID"
          target="_blank"
          >{{ sourceStudentName
          }}<v-icon color="info" :size="18" class="ml-1 mb-1"
            >mdi-open-in-new</v-icon
          ></router-link
        >
      </v-col>
      <v-col cols="4"
        ><router-link
          :to="'/student-profile/' + targetStudentData.studentID"
          target="_blank"
          >{{ targetStudentName
          }}<v-icon color="info" :size="18" class="ml-1 mb-1"
            >mdi-open-in-new</v-icon
          ></router-link
        ></v-col
      >
    </v-row>
    <v-row no-gutters
      ><v-col cols="4"
        ><v-checkbox
          v-model="keysToOverride.program"
          label="Program"
          hide-details
      /></v-col>
      <v-col cols="4">{{ sourceStudentGradStatus.program }}</v-col>
      <v-col v-if="keysToOverride.program" cols="4"
        ><strong>{{ sourceStudentGradStatus.program }}</strong></v-col
      >
      <v-col v-else cols="4">{{ targetStudentGradStatus.program }}</v-col>
    </v-row>
    <v-row no-gutters
      ><v-col cols="4"
        ><v-checkbox
          v-model="keysToOverride.programCompletionDate"
          label="Program Completion Date"
          hide-details
      /></v-col>
      <v-col cols="4">{{
        $filters.formatYYYYMMDate(sourceStudentGradStatus.programCompletionDate)
      }}</v-col>
      <v-col v-if="keysToOverride.program" cols="4"
        ><strong>{{
          $filters.formatYYYYMMDate(
            sourceStudentGradStatus.programCompletionDate
          )
        }}</strong></v-col
      >
      <v-col v-else cols="4">{{
        $filters.formatYYYYMMDate(targetStudentGradStatus.programCompletionDate)
      }}</v-col>
    </v-row>
    <v-row no-gutters
      ><v-col cols="4"
        ><v-checkbox
          v-model="keysToOverride.studentGrade"
          label="Student Grade"
          hide-details
      /></v-col>
      <v-col cols="4">{{ sourceStudentGradStatus.studentGrade }}</v-col>
      <v-col v-if="keysToOverride.studentGrade" cols="4"
        ><strong>{{ sourceStudentGradStatus.studentGrade }}</strong></v-col
      >
      <v-col v-else cols="4">{{ targetStudentGradStatus.studentGrade }}</v-col>
    </v-row>
    <v-row no-gutters
      ><v-col cols="4"
        ><v-checkbox
          v-model="keysToOverride.schoolOfRecord"
          label="School of Record"
          hide-details
      /></v-col>
      <v-col cols="4">{{
        formatSchoolName(sourceStudentSchoolOfRecord)
      }}</v-col>
      <v-col v-if="keysToOverride.schoolOfRecord" cols="4"
        ><strong>{{
          formatSchoolName(sourceStudentSchoolOfRecord)
        }}</strong></v-col
      >
      <v-col v-else cols="4">{{
        formatSchoolName(targetStudentSchoolOfRecord)
      }}</v-col>
    </v-row>
    <v-row no-gutters
      ><v-col cols="4"
        ><v-checkbox
          v-model="keysToOverride.schoolAtGrad"
          label="School at Graduation"
          hide-details
      /></v-col>
      <v-col cols="4">{{ formatSchoolName(sourceStudentSchoolAtGrad) }}</v-col>
      <v-col v-if="keysToOverride.schoolAtGrad" cols="4"
        ><strong>{{
          formatSchoolName(sourceStudentSchoolAtGrad)
        }}</strong></v-col
      >
      <v-col v-else cols="4">{{
        formatSchoolName(targetStudentSchoolAtGrad)
      }}</v-col>
    </v-row>
    <v-row no-gutters
      ><v-col cols="4"
        ><v-checkbox
          v-model="keysToOverride.honoursStanding"
          label="Honours Standing"
          hide-details
      /></v-col>
      <v-col cols="4">{{ sourceStudentGradStatus.honoursStanding }}</v-col>
      <v-col v-if="keysToOverride.honoursStanding" cols="4"
        ><strong>{{ sourceStudentGradStatus.honoursStanding }}</strong></v-col
      >
      <v-col v-else cols="4">{{
        targetStudentGradStatus.honoursStanding
      }}</v-col>
    </v-row>
    <v-row no-gutters
      ><v-col cols="4"
        ><v-checkbox
          v-model="keysToOverride.adultStartDate"
          label="Adult Start Date"
          hide-details
      /></v-col>
      <v-col cols="4">{{
        $filters.formatSimpleDate(sourceStudentGradStatus.adultStartDate)
      }}</v-col>
      <v-col v-if="keysToOverride.adultStartDate" cols="4"
        ><strong>{{
          $filters.formatSimpleDate(sourceStudentGradStatus.adultStartDate)
        }}</strong></v-col
      >
      <v-col v-else cols="4">{{
        $filters.formatSimpleDate(targetStudentGradStatus.adultStartDate)
      }}</v-col>
    </v-row>
    <v-row no-gutters
      ><v-col cols="4"
        ><v-checkbox
          v-model="keysToOverride.optionalPrograms"
          label="Optional Programs"
          hide-details
      /></v-col>
      <v-col cols="4">
        <ul
          class="p-0"
          v-if="sourceStudentGradStatus.optionalPrograms?.length > 0"
        >
          <li
            v-for="item in sourceStudentGradStatus.optionalPrograms"
            :key="item.optionalProgramCode"
          >
            {{ item.optionalProgramCode }} - {{ item.optionalProgramName }}
          </li>
        </ul></v-col
      >
      <v-col v-if="keysToOverride.optionalPrograms" cols="4">
        <strong>
          <ul
            class="p-0"
            v-if="sourceStudentGradStatus.optionalPrograms?.length > 0"
          >
            <li
              v-for="item in sourceStudentGradStatus.optionalPrograms"
              :key="item.optionalProgramCode"
            >
              {{ item.optionalProgramCode }} - {{ item.optionalProgramName }}
            </li>
          </ul>
        </strong>
      </v-col>
      <v-col v-else cols="4">
        <ul
          class="p-0"
          v-if="targetStudentGradStatus.optionalPrograms?.length > 0"
        >
          <li
            v-for="item in targetStudentGradStatus.optionalPrograms"
            :key="item.optionalProgramCode"
          >
            {{ item.optionalProgramCode }} - {{ item.optionalProgramName }}
          </li>
        </ul></v-col
      >
    </v-row>
  </v-col>
</template>
<script>
import { useStudentStore } from "@/store/modules/student";
import { useAppStore } from "@/store/modules/app";
import sharedMethods from "@/sharedMethods.js";
import { mapState, mapActions } from "pinia";

export default {
  name: "GRADStatusReviewAndReconcile",
  computed: {
    ...mapState(useStudentStore, {
      gradStatusToMerge: (state) => state.merge.gradStatus,
    }),
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
    updateKey(key, value) {
      const updated = { ...this.modelValue, [key]: value };
      this.$emit("update:keysToOverride", updated);
      this.updateGradStatusToMerge(); // update submission model
    },
    formatSchoolName(school) {
      return !!school ? `${school.mincode} - ${school.displayName}` : "";
    },

    updateGradStatusToMerge() {
      if (Object.values(this.keysToOverride).every((val) => val === false)) {
        this.clearGradStatusToMerge();
      } else {
        const merged = {
          studentID: this.targetStudentData.studentID,
          program: this.keysToOverride.program
            ? this.sourceStudentGradStatus.program
            : this.targetStudentGradStatus.program,

          studentStatus: this.targetStudentGradStatus.studentStatus,

          programCompletionDate: this.keysToOverride.programCompletionDate
            ? this.sourceStudentGradStatus.programCompletionDate
            : this.targetStudentGradStatus.programCompletionDate,

          studentGrade: this.keysToOverride.studentGrade
            ? this.sourceStudentGradStatus.studentGrade
            : this.targetStudentGradStatus.studentGrade,

          schoolOfRecordId: this.keysToOverride.schoolOfRecord
            ? this.sourceStudentGradStatus.schoolOfRecordId
            : this.targetStudentGradStatus.schoolOfRecordId,

          schoolAtGradId: this.keysToOverride.schoolAtGrad
            ? this.sourceStudentGradStatus.schoolAtGradId
            : this.targetStudentGradStatus.schoolAtGradId,

          honoursStanding: this.keysToOverride.honoursStanding
            ? this.sourceStudentGradStatus.honoursStanding
            : this.targetStudentGradStatus.honoursStanding,

          adultStartDate: this.keysToOverride.adultStartDate
            ? this.sourceStudentGradStatus.adultStartDate
            : this.targetStudentGradStatus.adultStartDate,

          optionalPrograms: this.keysToOverride.optionalPrograms
            ? this.setOptionalProgramsToOverride(
                this.sourceStudentGradStatus.optionalPrograms
              )
            : this.targetStudentGradStatus.optionalPrograms,

          careerPrograms: this.keysToOverride.optionalPrograms
            ? this.sourceStudentGradStatus.careerPrograms
            : this.targetStudentGradStatus.careerPrograms,
        };

        this.setGradStatusToMerge(merged);
      }
    },
    setOptionalProgramsToOverride(mergedOptionalPrograms) {
      let gradProgramOptionalPrograms = this.optionalProgramsByGradProgram(
        this.targetStudentGradStatus.program
      );
      return mergedOptionalPrograms
        .map((sourceOptProgram) => {
          return gradProgramOptionalPrograms.find(
            (targetOptProgram) =>
              targetOptProgram.optProgramCode ===
              sourceOptProgram.optProgramCode
          );
        })
        .filter(Boolean); // the Boolean will filter out undefined if no match is found
    },
  },
  watch: {
    keysToOverride: {
      deep: true,
      handler() {
        this.updateGradStatusToMerge();
      },
    },
  },
};
</script>
