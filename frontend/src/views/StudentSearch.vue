<template>
  <div class="studentlist">
    <h1>Student Search</h1>
    <v-card>
      <v-tabs v-model="tab" bg-color="bcGovLightGrey">
        <v-tab value="pen" class="text-none" size="large"> PEN Search </v-tab>
        <v-tab value="advance" class="text-none" size="large">
          Advanced Search
        </v-tab>
        <v-tab value="assessment-search" class="text-none" size="large" v-if="enableCRUD">Assessment Search
          <p class="text-caption font-weight-bold text-bcGovGold">
            BETA
          </p>
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="pen">
            <h3>PEN Search</h3>
            <p class="px-1">
              Search by Personal Education Number(PEN) or use the advanced
              search to look up students by other criteria.
            </p>
            <PenSearchForm />
          </v-window-item>
          <v-window-item value="advance">
            <StudentAdvancedSearch />
          </v-window-item>
          <v-window-item value="assessment-search">
            <StudentAssessmentSearch />
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
import {mapState} from "pinia";
import {useAppStore} from "@/store/modules/app";

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
    }),
  },
  components: {
    DisplayTable: DisplayTable,
    PenSearchForm: PenSearchForm,
    StudentAdvancedSearch: StudentAdvancedSearch,
    StudentAssessmentSearch: StudentAssessmentSearch,
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
