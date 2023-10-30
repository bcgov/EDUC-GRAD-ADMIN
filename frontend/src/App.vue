<template>
  <div id="app">
    <EnvironmentBanner />

    <Bcheader class="bcheader" style="margin-bottom: 15px">
      <div v-if="isAuthenticatedGet && dataReady">
        <a v-b-toggle.grad-drawer>{{ userInfoGet.userName }} </a>
        <b-sidebar id="grad-drawer" title="Permissions" shadow>
          <div class="px-3 py-2 mt-5">
            <br />
            {{ roles }}<br />
          </div>
        </b-sidebar>
        |
        <a :href="authRoutes.LOGOUT" class="text-white">Logout</a>
      </div>
      <div v-else-if="!isAuthenticatedGet">
        <a :href="authRoutes.LOGIN">Login</a>
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
// Vue Store

import { useAppStore } from "./store/modules/app";
import { useAuthStore } from "./store/modules/auth";
import { useAccessStore } from "./store/modules/access";
import { mapState, mapActions } from "pinia";
import Bcheader from "@/components/Header/BCHeader.vue";
import BCFooter from "@/components/BCFooter.vue";
import EnvironmentBanner from "@/components/Header/EnvironmentBanner.vue";
import { Routes } from "@/utils/constants.js";
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
          this.userLogout();
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
    };
  },
  computed: {
    ...mapState(useAccessStore, ["roles", "userAccess"]),
    ...mapState(useAuthStore, ["userInfoGet", "isAuthenticatedGet"]),
    dataReady: function () {
      return this.userInfoGet;
    },
    loginUrl: function () {
      return this.authRoutes.LOGIN;
    },
  },
  methods: {
    ...mapActions(useAuthStore, [
      "setLoading",
      "getJwtToken",
      "getUserInfo",
      "logout",
    ]),
    ...mapActions(useAppStore, ["setApplicationVariables"]),
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
