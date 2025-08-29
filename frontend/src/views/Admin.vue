<template>
  <div class="admin">
    <h1>Admin</h1>
    <v-card>
      <v-tabs v-model="tab" bg-color="bcGovLightGrey">
        <v-tab value="institute-alerts" class="text-none" size="large">
          Institute Event Messaging</v-tab
        >
        <v-tab value="course-alerts" class="text-none" size="large">
          Course Event Messaging</v-tab
        >
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item
            v-if="hasPermissions('ADMIN', 'readInstituteEventMessaging')"
            value="institute-alerts"
          >
            <h3>Institute Event Messaging</h3>
            <InstituteAlerts />
          </v-window-item>
          <v-window-item
              v-if="hasPermissions('ADMIN', 'readInstituteEventMessaging')"
              value="course-alerts"
          >
            <h3>Course Event Messaging</h3>
            <CourseAlerts />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import InstituteAlerts from "@/components/Admin/InstituteAlerts.vue";
import { useAccessStore } from "@/store/modules/access";
import { useAppStore } from "@/store/modules/app";
import { mapState, mapActions } from "pinia";
import CourseAlerts from "@/components/Admin/CourseAlerts.vue";

export default {
  name: "admin",
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
  components: {
    CourseAlerts,
    InstituteAlerts: InstituteAlerts,
  },
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
  },
  methods: {
    ...mapActions(useAppStore, ["getSchools", "getDistricts"]),
  },
};
</script>

<style scoped>
.admin {
  padding-left: 25px;
  padding-right: 25px;
}
</style>
