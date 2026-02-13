<template>
  <div class="studentlist">
    <h1>Student Search</h1>
    <v-card>
      <v-tabs v-model="tab" bg-color="bcGovLightGrey">
        <v-tab value="pen" class="text-none" size="large"> PEN Search </v-tab>
        <v-tab value="advance" class="text-none" size="large" v-if="showLegacy">
          Advanced Search
        </v-tab>
        <v-tab value="adv-search" class="text-none" size="large" v-if="enableCRUD">Student Search
        </v-tab>
        <v-tab value="assessment-search" class="text-none" size="large" v-if="enableCRUD">Assessment Search
        </v-tab>
        <v-tab value="course-search" class="text-none" size="large" v-if="enableCRUD">Course Search
        </v-tab>
        <v-tab value="program-search" class="text-none" size="large" v-if="enableCRUD">Program Search
        </v-tab>
        <v-tab value="optional-program-search" class="text-none" size="large" v-if="enableCRUD">Optional Program Search
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="pen" >
            <h3>PEN Search</h3>
            <p class="px-1">
              Search by Personal Education Number(PEN) or use the advanced
              search to look up students by other criteria.
            </p>
            <PenSearchForm />
          </v-window-item>
          <v-window-item value="advance" v-if="showLegacy">
            <StudentAdvancedSearch />
          </v-window-item>
          <v-window-item value="adv-search">
            <StudentAdvSearch/>
          </v-window-item>
          <v-window-item value="assessment-search">
            <StudentAssessmentSearch />
          </v-window-item>
          <v-window-item value="course-search">
            <StudentCourseSearch />
          </v-window-item>
          <v-window-item value="program-search">
            <StudentProgramSearch />
          </v-window-item>
          <v-window-item value="optional-program-search">
            <StudentOptionalProgramSearch />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { useVuelidate } from "@vuelidate/core";
import { useSnackbarStore } from "@/store/modules/snackbar";
import DisplayTable from "@/components/DisplayTable.vue";
import PenSearchForm from "@/components/StudentSearch/PenSearchForm.vue";
import StudentAdvancedSearch from "@/components/StudentSearch/StudentAdvancedSearch.vue";
import StudentAssessmentSearch from "@/components/Search/StudentAssessmentSearch.vue";
import StudentCourseSearch from "@/components/Search/StudentCourseSearch.vue";
import StudentProgramSearch from "@/components/Search/StudentProgramSearch.vue";
import StudentOptionalProgramSearch from "@/components/Search/StudentOptionalProgramSearch.vue";
import {mapState} from "pinia";
import {useAppStore} from "@/store/modules/app";
import StudentAdvSearch from "@/components/Search/StudentAdvSearch.vue";

export default {
  name: "studentSearch",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      tab: null,
    };
  },
  computed: {
    ...mapState(useAppStore, {
      enableCRUD: "enableCRUD",
      showLegacy: "showLegacy",
    }),
  },
  components: {
    DisplayTable: DisplayTable,
    PenSearchForm: PenSearchForm,
    StudentAdvancedSearch: StudentAdvancedSearch,
    StudentAssessmentSearch: StudentAssessmentSearch,
    StudentCourseSearch: StudentCourseSearch,
    StudentProgramSearch: StudentProgramSearch,
    StudentAdvSearch: StudentAdvSearch,
    StudentOptionalProgramSearch: StudentOptionalProgramSearch,
  },
};
</script>
<style scoped>
.studentlist {
  padding-left: 25px;
  padding-right: 25px;
}
h6 {
  font-size: 1.5rem;
}
</style>
