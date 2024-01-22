<template>
  <b-container fluid class="full-height">
    <b-row align-h="center">
      <b-col xs="10" sm="10" md="8" lg="4" xl="3">
        <b-card class="session-expired-card">
          <b-card-title class="gov-header">
            <h4 id="logout_text">Logged Out</h4>
          </b-card-title>
          <b-card-text id="logout_descriptor">
            <b-row style="margin: 0.3rem">You have Logged out.</b-row>
            <a
              id="login-button"
              @click="clearStorage"
              :href="routes.LOGIN"
              class="ma-1"
              dark
              color="#003366"
              >Log In</a
            ><span>&nbsp;again if you wish to continue.</span>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
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
  created() {
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
