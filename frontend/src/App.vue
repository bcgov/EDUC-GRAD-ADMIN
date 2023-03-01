<template>
  <div id="app">
    <EnvironmentBanner />
    <Bcheader
      class="bcheader"
      style="margin-bottom: 15px; text-transform: capitalize"
    >
      <div v-if="isAuthenticated && dataReady">
        <a v-b-toggle.grad-drawer>{{ userInfo.userName }} </a>
        <b-sidebar id="grad-drawer" title="Permissions" shadow>
          <div class="px-3 py-2 mt-5">
            <br />
            {{ roles }}<br />
            <a href="#" @click="changeRole">Change Role</a>
          </div>
        </b-sidebar>
        |
        <a :href="authRoutes.LOGOUT" class="text-white">Logout</a>
      </div>
      <div v-else-if="!isAuthenticated">
        <a :href="authRoutes.LOGOUT">Login</a>
      </div>
    </Bcheader>

    <div class="container" style="min-height: 100vh">
      <transition name="fade">
        <router-view />
      </transition>
    </div>
    <BCFooter></BCFooter>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters, mapState } from "vuex";

import Bcheader from "@/components/BCHeader";
import BCFooter from "@/components/BCFooter";
import EnvironmentBanner from "@/components/EnvironmentBanner";
import { Routes } from "@/utils/constants";
export default {
  components: {
    Bcheader,
    BCFooter,
    EnvironmentBanner,
  },
  data() {
    return {
      authRoutes: Routes,
      host: location.protocol + "//" + location.host,
    };
  },
  computed: {
    ...mapGetters("auth", [
      "isAuthenticated",
      "loginError",
      "isLoading",
      "userInfo",
    ]),
    ...mapGetters("app", ["getProgramOptions"]),
    ...mapGetters("app", ["getProgramOptions"]),
    ...mapState("app", ["pageTitle"]),
    ...mapGetters("useraccess", ["roles", "userAccess"]),
    dataReady: function () {
      return this.userInfo;
    },
    loginUrl: function () {
      return this.authRoutes.LOGIN;
    },
  },
  methods: {
    ...mapMutations("auth", ["setLoading"]),
    ...mapMutations("useraccess", ["setUserRoles"]),
    ...mapActions("auth", ["getJwtToken", "getUserInfo", "logout"]),
    ...mapActions("app", ["setApplicationVariables"]),
    changeRole() {
      if (this.roles.includes("GRAD_SYSTEM_COORDINATOR")) {
        this.setUserRoles(["GRAD_INFO_OFFICER"]);
      } else if (this.roles.includes("GRAD_INFO_OFFICER")) {
        this.setUserRoles(["GRAD_PROGRAM_AREA_BA"]);
      } else if (this.roles.includes("GRAD_PROGRAM_AREA_BA")) {
        this.setUserRoles(["GRAD_SYSTEM_COORDINATOR"]);
      }
    },
  },
  async created() {
    this.getJwtToken()
      .then(() => this.setApplicationVariables())
      .catch((e) => {
        if (!e.response) {
          this.userLogout();
          this.$router.replace({
            name: "error",
            query: { message: `500_${e.data || "ServerError"}` },
          });
        }
      })
      .finally(() => {});
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
