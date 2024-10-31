<template>
  <div class="studentlist">
    <h1>Student Search</h1>
    <v-card>
      <v-tabs v-model="tab" bg-color="bcGovLightGrey">
        <v-tab value="pen" class="text-none" size="large"> PEN Search </v-tab>
        <v-tab value="advance" class="text-none" size="large">
          Advanced Search
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
  components: {
    DisplayTable: DisplayTable,
    PenSearchForm: PenSearchForm,
    StudentAdvancedSearch: StudentAdvancedSearch,
  },
};
</script>
<style scoped>
.studentlist {
  padding-left: 25px;
  padding-right: 25px;
}
.alert,
.card,
.pen-search {
  width: 100%;
  margin-right: 9px;
  float: left;
}
h6 {
  font-size: 1.5rem;
}
.loading-spinner {
  float: left;
  margin-left: 10px;
}
.sample-pens {
  float: left;
  clear: both;
  margin-top: 15px;
}

.fade-enter-active {
  transition: opacity 0.8s;
}

.fade-enter,
  .fade-leave-to

  /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
