<template>
  <div>
    <v-app-bar app color="bcGovBlue" dark>
      <a class="navbar-brand ml-6" href="/">
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
        <sup v-if="version">v{{ version }}</sup>
      </v-toolbar-title>
      <div class="user-profile mr-6">
        <slot></slot>
      </div>

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

    <v-app-bar v-if="!smallScreen" density="compact">
      <v-toolbar>
        <v-btn
          text
          v-for="link in menuLinks"
          :key="link.id"
          class="text-none"
          density="compact"
        >
          <router-link
            :to="link.route"
            style="text-decoration: none; color: inherit"
          >
            {{ link.title }}
          </router-link>
        </v-btn>
        <v-btn v-if="!profile.pen" class="text-none" density="compact">
          <a
            id="profile-route"
            class="text-decoration-none text-disabled"
            :disabled="true"
            >Profile (Student Not Loaded)</a
          >
        </v-btn>
        <v-btn v-else density="compact">
          <router-link
            :to="`/student-profile/${profile.studentID}`"
            id="profile-route"
            class="text-none"
            >Profile ({{ profile.pen }})</router-link
          >
        </v-btn>
        <v-spacer />
        <div class="form-group top-search mb-0">
          <v-form @submit.prevent class="d-flex mb-0">
            <v-text-field
              density="compact"
              variant="outlined"
              size="30"
              type="search"
              v-model="penInput"
              maxlength="9"
              minlength="9"
              placeholder="PEN"
              ref="penSearch"
              hide-details
              v-on:keyup="keyHandler"
            ></v-text-field>
            <v-btn
              @click="findStudentByPen"
              icon="mdi-magnify"
              density="comfortable"
              :loading="searchLoading"
              rounded="sm"
              variant="text"
              color="primary"
              class="px-2 mx-2 header-search-btn text-none"
            >
            </v-btn>
          </v-form>
        </div>
      </v-toolbar>
    </v-app-bar>

    <!-- Other Components Here -->
    <EnvironmentBanner />
  </div>
</template>

<script>
import StudentService from "@/services/StudentService.js";
import { loadStudent } from "../../utils/common.js"; // Import your loadStudent function
import { useSnackbarStore } from "@/store/modules/snackbar"; // Import your snackbar store
import { useStudentStore } from "@/store/modules/student"; // Import your student store
import { mapState } from "pinia"; // Import mapState from Pinia
import CommonService from "@/services/CommonService.js";
import EnvironmentBanner from "@/components/Header/EnvironmentBanner.vue";

export default {
  components: {
    EnvironmentBanner: EnvironmentBanner,
  },
  setup() {
    const studentStore = useStudentStore();
    return { studentStore };
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      penInput: "",
      searchLoading: false,
      menu: false, // Control the hamburger menu visibility
      smallScreen: false,
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
  mounted() {
    window.addEventListener("resize", this.updateDimensions);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateDimensions);
  },
  async created() {
    this.loadStudent = loadStudent; // Assign loadStudent to this context
    const versionResponse = await CommonService.getVersion();
    this.version = versionResponse.data;
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    updateDimensions() {
      //console.log(window.innerWidth); // Log the current window width for debugging
      this.smallScreen = window.innerWidth <= 760; //set flag to determine which header elements to show
      this.$forceUpdate(); // Force reactivity, if needed
    },
    keyHandler: function (e) {
      if (e.keyCode === 13) {
        //enter key pressed
        this.studentSearchResults = [];
        if (this.penInput) {
          this.findStudentByPen();
        }
      }
    },
    findStudentByPen() {
      // Your existing findStudentByPen logic here
      if (this.penInput) {
        if (this.penInput == this.profile.pen) {
          this.snackbarStore.showSnackbar(
            "The entered PEN is the same as the currently loaded student",
            "warning",
            5000
          );
        } else {
          this.searchLoading = true;
          this.studentSearchResults = [];
          StudentService.getStudentByPen(this.penInput)
            .then((response) => {
              if (response.data) {
                if (response.data.length == 0) {
                  throw new Error(
                    `Student ${this.penInput} cannot be found on the GRAD or PEN database`
                  );
                } else if (response.data[0].program == null || "") {
                  throw new Error(
                    `Student ${this.penInput} exists in PEN but does not have a GRAD system record.`
                  );
                }
                this.studentStore.unsetStudent();
                this.studentStore.setQuickSearchId(response.data[0].studentID);
                this.loadStudent(response.data);
                this.searchLoading = false;
              }
            })
            .catch((error) => {
              // eslint-disable-next-line
              console.error("Header Search: ", error?.message);
              this.searchLoading = false;
              this.snackbarStore.showSnackbar(error?.message, "error", 5000);
            })
            .finally(() => {
              this.penInput = "";
            });
        }
      }
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
