<template>
  <div class="courses-all">
    <h1>Courses</h1>
    <div>
      <v-card no-body>
        <v-tabs v-model="tab" bg-color="bcGovLightGrey" grow>
          <v-tab value="courseTab" class="text-none" size="large">Course</v-tab>
          <v-tab value="courseRestrictionsTab" class="text-none" size="large"
            >Course Restrictions</v-tab
          >
          <v-tab value="courseRequirementsTab" class="text-none" size="large"
            >Course Requirements</v-tab
          >
          <v-tab value="fineArtsAppliedSkillsTab" class="text-none" size="large"
            >Fine Arts Applied Skills</v-tab
          >
          <v-tab value="examSpecialCaseCodesTab" class="text-none" size="large"
            >Exam Special Cases</v-tab
          >
          <v-tab
            value="equivalentOrChallengeCodesTab"
            class="text-none"
            size="large"
            >Equivalency or Challenge</v-tab
          >
        </v-tabs>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="courseTab">
              <CourseAdvancedSearch />
            </v-window-item>
            <v-window-item value="courseRestrictionsTab">
              <CourseRestrictions />
            </v-window-item>
            <v-window-item value="courseRequirementsTab">
              <CourseRequirementsSearch />
            </v-window-item>
            <v-window-item value="fineArtsAppliedSkillsTab">
              <FineArtsAppliedSkillsCodes
            /></v-window-item>
            <v-window-item value="examSpecialCaseCodesTab">
              <ExamSpecialCaseCodes
            /></v-window-item>
            <v-window-item value="equivalentOrChallengeCodesTab">
              <EquivalentOrChallengeCodes
            /></v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import DisplayTable from "@/components/DisplayTable.vue";
import CourseAdvancedSearch from "@/components/Courses/CourseAdvancedSearch.vue";
import CourseRestrictions from "@/components/Courses/CourseRestrictions.vue";
import CourseRequirementsSearch from "@/components/Courses/CourseRequirementsSearch.vue";
import FineArtsAppliedSkillsCodes from "@/components/Courses/FineArtsAppliedSkillsCodes.vue";
import ExamSpecialCaseCodes from "@/components/Courses/ExamSpecialCaseCodes.vue";
import EquivalentOrChallengeCodes from "@/components/Courses/EquivalentOrChallengeCodes.vue";
export default {
  name: "courses",
  components: {
    DisplayTable: DisplayTable,
    CourseAdvancedSearch: CourseAdvancedSearch,
    CourseRestrictions: CourseRestrictions,
    CourseRequirementsSearch: CourseRequirementsSearch,
    FineArtsAppliedSkillsCodes: FineArtsAppliedSkillsCodes,
    ExamSpecialCaseCodes: ExamSpecialCaseCodes,
    EquivalentOrChallengeCodes: EquivalentOrChallengeCodes,
  },
  created() {},
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      tab: null,
      courseCode: "",
      show: false,
      displayMessage: null,
    };
  },

  methods: {},
};
</script>

<style scoped>
.courses-all {
  padding-left: 25px;
  padding-right: 25px;
}
.close-record {
  float: right;
}
.tab-loading {
  color: green !important;
}
.profile-name {
  padding-bottom: 10px;
}
.table-filter {
  top: 0px !important;
}
/* .advanced-search-form {
  background-color: #fff;
  margin-bottom: 20px;
}
.wild-card-button:hover {
  cursor: pointer;
}
.wild-card-button {
  color: #dee2eb;
  position: absolute;
  right: 21px;
  top: 10px;
  z-index: 10;
  text-decoration: none;
}
.wild-card-button:visited {
  color: #dee2eb;
  text-decoration: none;
}
.wild-card-button.active {
  color: green;
}
.search-results-message {
  float: left;
  clear: both;
}
.advanced-search-button {
  padding-left: 15px;
} */
</style>
