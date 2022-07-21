<template>
  <b-container fluid class="full-height">

    <!-- login article -->
    <article name="session-expired-banner" class="top-banner">
      <b-row align-h="center">
        <b-col xs="10" sm="10" md="8" lg="4" xl="3">
          <b-card class="session-expired-card">
            <b-card-title class="gov-header">
              <h4 id="session-expired-text">Session Expired</h4>
            </b-card-title>
            <b-card-text id="session-expired-descriptor">
              <b-row style="margin: .3rem">Your secure session has ended as a result of inactivity.</b-row>
              <a id="login-button" @click="clearStorage" :href="routes.LOGIN" class="ma-1" dark color='#003366'>Log In</a><span>&nbsp;again to continue.</span>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </article>
  </b-container>
</template>

<script>
import {Routes} from '../utils/constants';

export default {
  name: 'SessionExpired',

  data() {
    return {
      routes: Routes
    };
  },
  mounted() {
    this.$store.commit('auth/setJwtToken');
  },
  methods: {
    clearStorage() {
      this.$store.commit('auth/setJwtToken');
    }
  }
};
</script>

<style scoped>
  .full-height{
    height: 100%;
  }
  .session-expired-card{
    margin-top: 15rem;
    width: 100%;
    background: #F2E8D5;
  }
</style>
