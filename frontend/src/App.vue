<template>
  <v-app>
    <Snackbar></Snackbar>

    <Bcheader class="bcheader">
      <div v-if="isAuthenticatedGet && dataReady">
        <v-btn @click="dialog = true">{{ userInfoGet.userName }}</v-btn>

        <!-- Dialog component -->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <!-- The button opens the dialog, already set up above -->
          </template>

          <v-card>
            <v-card-title> User Information </v-card-title>

            <v-card-text>
              <!-- You can display more user info here or switch roles -->
              <p>Username: {{ userInfoGet.userName }}</p>
              <p>Current Role: {{ roles }}</p>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="bcGovBlue"
                variant="outlined"
                class="text-none"
                density="default"
                text
                @click="dialog = false"
                >Close</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        |
        <a :href="authRoutes.LOGOUT" class="text-white">Logout</a>
      </div>
      <div v-else-if="!isAuthenticatedGet">
        <a :href="authRoutes.LOGIN">Login</a>
      </div>
    </Bcheader>

    <!-- <div class="container"> -->
    <v-main>
      <router-view />
      <div class="overlay-dialog">
        <v-dialog v-model="tokenExpiring" max-width="600px">
          <v-card>
            <v-card-title>
              <span v-if="tokenExpired">Session Expired</span>
              <span v-else>Session Expiring</span>
            </v-card-title>

            <v-card-text>
              <p v-if="tokenExpired">Your session has expired. Please Login.</p>
              <p v-else>
                Your session is about to expire in {{ timeRemaining }} seconds.
                Do you want to extend your session?
              </p>
            </v-card-text>

            <v-card-actions>
              <v-btn :href="authRoutes.LOGIN" v-if="tokenExpired">Login</v-btn>
              <v-btn @click="resumeSession" v-else>Yes</v-btn>
              <v-btn @click="logout">Logout</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-main>
    <!-- </div> -->

    <BCFooter></BCFooter>
  </v-app>
</template>
<script>
// Vue Store
import { useAppStore } from "./store/modules/app";
import { useAuthStore } from "./store/modules/auth";
import { useAccessStore } from "./store/modules/access";
import { mapState, mapActions } from "pinia";
import Bcheader from "@/components/Header/BCHeader.vue";
import BCFooter from "@/components/BCFooter.vue";
import { Routes } from "@/utils/constants.js";
import authService from "./common/authService";
import Snackbar from "@/components/Common/Snackbar.vue";
export default {
  name: "App",
  components: {
    Bcheader,
    BCFooter,
    Snackbar,
  },
  async created() {
    try {
      await this.getJwtToken();
      await this.setApplicationVariables();
    } catch (e) {
      if (!e.response) {
        this.logout();
        this.$router.replace({
          name: "error",
          query: { message: `500_${e.data || "ServerError"}` },
        });
      }
    }
    // .then(() => this.setApplicationVariables())
    // .catch((e) => {
    //   if (!e.response) {
    //     this.logout();
    //     this.$router.replace({
    //       name: "error",
    //       query: { message: `500_${e.data || "ServerError"}` },
    //     });
    //   }
    // })
    // .finally(() => {});
  },
  data() {
    return {
      authRoutes: Routes,
      host: location.protocol + "//" + location.host,
      timerValue: 0,
      tokenExpired: false,
      tokenExpiring: false,
      dialog: false,
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
    timeRemaining: function () {
      return Math.floor(this.timerValue);
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
    ...mapActions(useAccessStore, ["setUserRoles"]),
    switchRole() {
      if (this.roles.includes("GRAD_SYSTEM_COORDINATOR")) {
        this.setUserRoles(["GRAD_INFO_OFFICER"]);
      } else if (this.roles.includes("GRAD_INFO_OFFICER")) {
        this.setUserRoles(["GRAD_BA"]);
      } else if (this.roles.includes("GRAD_BA")) {
        this.setUserRoles(["GRAD_SYSTEM_COORDINATOR"]);
      }
    },
    setupTimer() {
      setInterval(async () => {
        if (this.jwtTokenGet) {
          this.timerValue = await this.getTokenRemainingTime();
          if (this.timerValue < 300) this.tokenExpiring = true;
          this.tokenExpired = await this.checkJWTTokenExpired();
        }
      }, 30000); // Update every 10000 milliseconds (30 seconds)
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
      this.$router.push(this.authRoutes.LOGIN);
    },
  },
};
</script>

<style>
/* #app {
  background: #f9f9fb;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
} */
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
.no-outline-btn:focus {
  outline: none;
  box-shadow: none;
}
@media (min-width: 1300px) {
  .container {
    /* max-width: 1300px !important; */
    max-width: 100%;
    /* padding-right: 50px !important;
      padding-left: 50px !important; */
  }
}
/* .bcheader {
  height: 115px;
}
@media (max-width: 768px) {
  .bcheader {
    height: 75px;
  }
} */
</style>
