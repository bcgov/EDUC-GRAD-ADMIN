<template>
  <div id="app">
    <v-app>
      <EnvironmentBanner />

      <Bcheader class="bcheader" style="margin-bottom: 15px">
        <div v-if="isAuthenticatedGet && dataReady">
          {{ userInfoGet.userName }}

          |
          <a :href="authRoutes.LOGOUT" class="text-white">Logout</a>
        </div>
        <div v-else-if="!isAuthenticatedGet">
          <a :href="authRoutes.LOGIN">Login</a>
        </div>
      </Bcheader>

      <div class="container" style="min-height: 100vh">
        <router-view />
        <div>{{ timerValue }}</div>
        <div class="overlay-dialog">
          <v-dialog v-model="tokenExpiring" max-width="600px">
            <v-card>
              <v-card-title>
                <span v-if="tokenExpired">Session Expired</span>
                <span v-else>Session Expiring</span>
              </v-card-title>

              <v-card-text>
                <p v-if="tokenExpired">
                  Your session has expired. Please Login.
                </p>
                <p v-else>
                  Your session is about to expire in {{ timerValue }} seconds.
                  Are you still there?
                </p>
              </v-card-text>

              <v-card-actions>
                <v-btn @click="login" v-if="tokenExpired">Login</v-btn>
                <v-btn @click="resumeSession" v-else>Yes</v-btn>
                <v-btn @click="logout">Logout</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>

      <BCFooter></BCFooter>
    </v-app>
  </div>
</template>
<script>
// Vue Store
import { useAppStore } from "./store/modules/app";
import { useAuthStore } from "./store/modules/auth";
import { useAccessStore } from "./store/modules/access";
import { mapState, mapActions } from "pinia";
import Bcheader from "@/components/Header/BCHeader.vue";
import BCFooter from "@/components/BCFooter.vue";
import EnvironmentBanner from "@/components/Header/EnvironmentBanner.vue";
import { Routes } from "@/utils/constants.js";
import authService from "./common/authService";
export default {
  name: "App",
  components: {
    Bcheader,
    BCFooter,
    EnvironmentBanner,
  },
  setup() {
    const appStore = useAppStore();
    const authStore = useAuthStore();
    const accessStore = useAccessStore();
    return { appStore, authStore, accessStore };
  },
  async created() {
    this.getJwtToken()
      .then(() => this.setApplicationVariables())
      .catch((e) => {
        if (!e.response) {
          this.logout();
          this.$router.replace({
            name: "error",
            query: { message: `500_${e.data || "ServerError"}` },
          });
        }
      })
      .finally(() => {});
  },
  data() {
    return {
      authRoutes: Routes,
      host: location.protocol + "//" + location.host,
      timerValue: 0,
      tokenExpired: false,
      tokenExpiring: false,
      dialog: true,
    };
  },
  mounted() {
    this.setupTimer();
  },
  computed: {
    ...mapState(useAccessStore, ["roles", "userAccess"]),
    ...mapState(useAuthStore, [
      "userInfoGet",
      "isAuthenticatedGet",
      "checkJWTTokenExpired",
      "getTokenRemainingTime",
      "jwtTokenGet",
    ]),
    dataReady: function () {
      return this.userInfoGet;
    },
    loginUrl: function () {
      return this.authRoutes.LOGIN;
    },
  },
  methods: {
    ...mapActions(useAuthStore, [
      "setJwtToken",
      "setLoading",
      "getJwtToken",
      "getUserInfo",
      "logout",
    ]),
    ...mapActions(useAppStore, ["setApplicationVariables"]),
    setupTimer() {
      setInterval(async () => {
        if (this.jwtTokenGet) {
          this.timerValue = await this.getTokenRemainingTime();
          if (this.timerValue < 300) this.tokenExpiring = true;
          this.tokenExpired = await this.checkJWTTokenExpired();
        }
      }, 10000); // Update every 10000 milliseconds (10 seconds)
    },
    async resumeSession() {
      // Handle the logic to resume the session
      // For example, refresh the token or perform any necessary actions

      const updatedJwtToken = await authService.refreshAuthToken(
        this.jwtTokenGet
      );
      this.setJwtToken(updatedJwtToken.jwtFrontend);
      this.tokenExpiring = false; // Hide the overlay dialog
    },
    login() {
      // Use Vue Router to navigate to the login route
      this.$router.push("/login");
    },
  },
};
</script>

<style>
#app {
  background: #f9f9fb;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.main-container {
  font-size: 14px;
  margin-top: 135px !important;
}
.logo {
  align-self: center;
  color: #fff;
  font-weight: bold;
}
.main-nav {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.8rem;
}
#grad-drawer {
  z-index: 200 !important;
}
ul.sidebar-panel-nav {
  list-style-type: none;
}
ul.sidebar-panel-nav > li > a {
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;
  display: block;
  padding-bottom: 0.5em;
}
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0.2;
}
.container {
  max-width: 100% !important;
}
@media (min-width: 1300px) {
  .container {
    /* max-width: 1300px !important; */
    max-width: 100%;
    /* padding-right: 50px !important;
      padding-left: 50px !important; */
  }
}
.bcheader {
  height: 115px;
}
@media (max-width: 768px) {
  .bcheader {
    height: 75px;
  }
}
</style>
