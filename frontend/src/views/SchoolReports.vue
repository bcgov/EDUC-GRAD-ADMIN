<template>
  <div class="reports-view">
    <h1>School Reports</h1>
    <div>
      <v-card no-body>
        <v-tabs v-model="tab" bg-color="bcGovLightGrey">
          <v-tab value="schoolReportWithMincodeTab" class="text-none" size="large">
            Mincode
          </v-tab>
          <v-tab value="schoolReportWithDistTab" class="text-none" size="large">
            District Code
          </v-tab>
        </v-tabs>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="schoolReportWithMincodeTab">
              <SchoolReportsWithMincode />
            </v-window-item>
            <v-window-item value="schoolReportWithDistTab">
              <SchoolReportsWithDist />
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import SchoolReportsWithDist from "../components/SchoolReports/SchoolReportsWithDist.vue";
import SchoolReportsWithMincode from "../components/SchoolReports/SchoolReportsWithMincode.vue";

export default {
  name: "SchoolReports",
  components: {
    SchoolReportsWithMincode: SchoolReportsWithMincode,
    SchoolReportsWithDist: SchoolReportsWithDist,
  },
  data() {
    return {
      tab: null,
    };
  },
};
</script>

<style scoped>
.tab-loading {
  color: green !important;
}

.profile-name {
  padding-bottom: 10px;
}
.reports-view {
  padding-left: 25px;
  padding-right: 25px;
}

.table th,
.table td {
  border-top: none !important;
}
.advanced-search-form {
  background-color: #fff;
}
.search-results-message {
  float: left;
  clear: both;
}
.advanced-search-button {
  padding-left: 1 5px;
}
</style>
