<template>
  <div class="courses-all">
    <h1>Courses</h1>
    <div>
      <v-card no-body>
        <v-tabs v-model="tab" bg-color="bcGovLightGrey">
          <v-tab to="/courses/courses" class="text-none" size="large">Courses</v-tab>
          <v-tab to="/courses/course-restrictions" class="text-none" size="large">Course Restrictions</v-tab>
          <v-tab to="/courses/course-requirements/" class="text-none" size="large">Course Requirements</v-tab>
          <v-tab to="/courses/examinable-courses/" class="text-none" size="large">Examinable Courses</v-tab>
          <!-- <v-tab value="examinableCoursesTab" class="text-none" size="large">Examinable Courses</v-tab> -->
          <v-tab to="/courses/finearts-appliedskills/" class="text-none" size="large">Fine Arts Applied Skills</v-tab>
          <v-tab to="/courses/exam-special-cases/" class="text-none" size="large">Exam Special Cases</v-tab>
          <v-tab to="/courses/equivalency-or-challenge/" class="text-none" size="large">Equivalency or Challenge</v-tab>
          <v-spacer />
          <v-btn color="bcGovBlue" append-icon="mdi-open-in-new"
            href="https://www.bced.gov.bc.ca/datacollections/course_registry_web_search/advanced-search.php"
            target="_blank" class="text-none mr-1 my-1">Search Courses</v-btn>
        </v-tabs>
        <v-card-text>
          <router-view :key="$route.fullPath"></router-view>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import DisplayTable from "@/components/DisplayTable.vue";
import CoursesTable from "@/components/Courses/CoursesTable.vue";
import CourseRestrictions from "@/components/Courses/CourseRestrictions.vue";
import CourseRequirementsSearch from "@/components/Courses/CourseRequirementsSearch.vue";
import FineArtsAppliedSkillsCodes from "@/components/Courses/FineArtsAppliedSkillsCodes.vue";
import ExamSpecialCaseCodes from "@/components/Courses/ExamSpecialCaseCodes.vue";
import EquivalentOrChallengeCodes from "@/components/Courses/EquivalentOrChallengeCodes.vue";
import ExaminableCourses from "@/components/Courses/ExaminableCourses.vue";
export default {
  name: "courses",
  components: {
    DisplayTable: DisplayTable,
    CoursesTable: CoursesTable,
    CourseRestrictions: CourseRestrictions,
    CourseRequirementsSearch: CourseRequirementsSearch,
    FineArtsAppliedSkillsCodes: FineArtsAppliedSkillsCodes,
    ExamSpecialCaseCodes: ExamSpecialCaseCodes,
    EquivalentOrChallengeCodes: EquivalentOrChallengeCodes,
    ExaminableCourses: ExaminableCourses,
  },
  created() { },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      tab: 0,
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
</style>
