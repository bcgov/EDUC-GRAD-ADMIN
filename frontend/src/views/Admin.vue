<template>
  <div class="admin">
    <h1>Admin</h1>
    <v-card>
      <v-tabs v-model="tab" bg-color="bcGovLightGrey">
        <v-tab value="institute-alerts" class="text-none" size="large">
          Institute Event Messaging</v-tab
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
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import InstituteAlerts from "@/components/Admin/InstituteAlerts.vue";
import { useAccessStore } from "@/store/modules/access";
import { mapState } from "pinia";

export default {
  name: "admin",
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      tab: null,
    };
  },
  components: {
    InstituteAlerts: InstituteAlerts,
  },
  computed: {
    ...mapState(useAccessStore, ["hasPermissions"]),
  },
};
</script>

<style scoped>
.admin {
  padding-left: 25px;
  padding-right: 25px;
}
</style>
