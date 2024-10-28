<template>
  <div>
    <v-app>
      <v-app-bar app color="bcGovBlue" dark>
        <a class="navbar-brand" href="/">
          <img
            class="img-fluid d-md-block"
            src="../../assets/images/bcid-logo-rev-en.svg"
            width="185"
            height="45"
            alt="B.C. Government Logo"
          />
        </a>
        <v-toolbar-title
          >Graduation Records and Achievement Data
          <span v-if="version">v{{ version }}</span>
          <v-spacer />
          <div class="float-right user-profile">
            <slot></slot>
          </div>
        </v-toolbar-title>

        <v-menu v-model="menu" offset-y>
          <template #activator="{ props }">
            <v-btn
              icon
              v-bind="props"
              class="d-md-none d-lg-none d-xl-none d-xxl-none"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="link in menuLinks"
              :key="link.id"
              @click="menu = false"
            >
              <router-link
                :to="link.route"
                style="text-decoration: none; color: inherit"
              >
                <v-list-item-title>{{ link.title }}</v-list-item-title>
              </router-link>
            </v-list-item>
            <v-spacer />
            <v-list-item v-if="!profile.pen">
              <a
                id="profile-route"
                class="text-decoration-none text-disabled"
                :disabled="true"
                >Profile (Student Not Loaded)</a
              >
            </v-list-item>
            <v-list-item v-else>
              <router-link
                :to="`/student-profile/${profile.studentID}`"
                id="profile-route"
                >Profile ({{ profile.pen }})</router-link
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-app-bar class="hide-on-small">
        <v-toolbar>
          <v-btn text v-for="link in menuLinks" :key="link.id">
            <router-link
              :to="link.route"
              style="text-decoration: none; color: inherit"
            >
              {{ link.title }}
            </router-link>
          </v-btn>
          <v-btn v-if="!profile.pen">
            <a
              id="profile-route"
              class="text-decoration-none text-disabled"
              :disabled="true"
              >Profile (Student Not Loaded)</a
            >
          </v-btn>
          <v-btn v-else>
            <router-link
              :to="`/student-profile/${profile.studentID}`"
              id="profile-route"
              >Profile ({{ profile.pen }})</router-link
            >
          </v-btn>
          <v-spacer />
          <form v-on:submit.prevent>
            <div class="form-group top-search">
              <div>
                <v-form @submit.prevent>
                  <v-row class="align-center">
                    <v-col class="d-flex align-center">
                      <v-text-field
                        density="compact"
                        size="small"
                        variant="outlined"
                        type="search"
                        v-model="penInput"
                        maxlength="9"
                        minlength="9"
                        outlined
                        dense
                        placeholder="PEN"
                        class="headerSearch"
                        ref="penSearch"
                      ></v-text-field>
                      <v-btn
                        v-if="!searchLoading"
                        @click="findStudentByPen"
                        variant="flat"
                        color="primary"
                        class="px-2 header-search-btn"
                        >Search
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </div>
          </form>
        </v-toolbar>
      </v-app-bar>
    </v-app>

    <!-- Other Components Here -->
  </div>
</template>

<script>
import { loadStudent } from "../../utils/common.js"; // Import your loadStudent function
import { useSnackbarStore } from "@/store/modules/snackbar"; // Import your snackbar store
import { useStudentStore } from "@/store/modules/student"; // Import your student store
import { mapState } from "pinia"; // Import mapState from Pinia

export default {
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      penInput: "",
      searchLoading: false,
      menu: false, // Control the hamburger menu visibility
      menuLinks: [
        { id: "studentSearch", title: "Student Search", route: "/" },
        { id: "programs", title: "Programs", route: "/programs" },
        { id: "courses", title: "Courses", route: "/courses" },
        { id: "assessments", title: "Assessments", route: "/assessments" },
        { id: "schools", title: "Schools", route: "/schools" },
        { id: "psi", title: "PSI", route: "/psi" },
        { id: "codes", title: "Codes", route: "/codes" },
        {
          id: "schoolReports",
          title: "School Reports",
          route: "/school-reports",
        },
        {
          id: "batchProcessing",
          title: "Batch Processing",
          route: "/batch-processing",
        },
      ],
      version: "",
    };
  },
  computed: {
    ...mapState(useStudentStore, {
      profile: "getStudentProfile",
    }),
    screenSize() {
      return window.innerWidth;
    },
    isDesktop() {
      return window.innerWidth >= 600; // Adjust this breakpoint as needed
    },
  },
  async created() {
    this.loadStudent = loadStudent; // Assign loadStudent to this context
    const versionResponse = await CommonService.getVersion();
    this.version = versionResponse.data;
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    findStudentByPen() {
      // Your existing findStudentByPen logic here
    },
  },
};
</script>

<style scoped>
@media (max-width: 760px) {
  .hide-on-small {
    display: none;
  }
}
</style>
