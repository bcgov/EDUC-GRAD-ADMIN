<template>
  <div class="reports-view">
    <h1>Reports</h1>
    <div>
      <v-card no-body>
        <v-tabs v-model="tab" bg-color="bcGovLightGrey">
          <v-tab value="schoolReportsTab" class="text-none" size="large">
            School Reports
          </v-tab>
          <v-tab value="districtReportsTab" class="text-none" size="large">
            District Reports
          </v-tab>
        </v-tabs>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="schoolReportsTab">
              <SchoolReports />
            </v-window-item>
            <v-window-item value="districtReportsTab">
              <DistrictReports />
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import DistrictReports from "../components/SchoolReports/DistrictReports.vue";
import SchoolReports from "../components/SchoolReports/SchoolReports.vue";

import { useSnackbarStore } from "@/store/modules/snackbar";

import { useAppStore } from "@/store/modules/app";
import { mapActions } from "pinia";

export default {
  name: "Reports",
  components: {
    SchoolReports: SchoolReports,
    DistrictReports: DistrictReports,
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      tab: null,
    };
  },
  async beforeMount() {
    try {
      await this.getSchools(false);
      await this.getDistricts(false);
    } catch (e) {
      if (e.response.status) {
        this.snackbarStore.showSnackbar(
          "There was an error: " + e.response.status,
          "error",
          5000
        );
      }
    }
  },
  methods: {
    ...mapActions(useAppStore, ["getSchools", "getDistricts"]),
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
