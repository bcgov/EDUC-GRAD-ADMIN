<template>
  <v-container fluid class="full-height">
    <v-row>
      <v-spacer />
      <v-col cols="12" md="4" lg="4">
        <v-card class="pt-3 pb-4">
          <v-card-title>
            <h4 id="logout_text">Logged Out</h4>
          </v-card-title>
          <v-card-text id="logout_descriptor">
            You have Logged out of the Graduation Administration Application.
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="clearStorage"
              variant="text"
              :href="routes.LOGIN"
              color="primary"
              >Login</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <v-spacer />
    </v-row>
  </v-container>
</template>

<script>
import { Routes } from "@/utils/constants";
import { useAuthStore } from "../store/modules/auth";
import { mapActions } from "pinia";
export default {
  name: "Logout",
  data() {
    return {
      routes: Routes,
    };
  },
  mounted() {
    this.setJwtToken();
  },

  methods: {
    ...mapActions(useAuthStore, ["setJwtToken"]),

    clearStorage() {
      this.setJwtToken();
    },
  },
};
</script>

<style scoped>
.full-height {
  height: 100%;
}
.session-expired-card {
  margin-top: 15rem;
  width: 100%;
  background: #d9e7d8;
}
</style>
