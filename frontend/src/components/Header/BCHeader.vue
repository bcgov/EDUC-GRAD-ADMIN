<template>
  <div>
    <v-app-bar color="bcGovBlue" dark class="bc-header">
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

      <v-menu v-if="smallScreen" v-model="menu" offset-y>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="link in menuLinks"
            :key="link.id"
            @click="menu = false"
          >
            <v-btn
              :to="link.route"
              variant="text"
              color="primary"
              style="
                text-transform: none;
                text-decoration: none;
                color: inherit;
              "
              class="text-start"
            >
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-btn>
          </v-list-item>
          <v-btn
            v-if="hasPermissions('ADMIN', 'readPage')"
            variant="text"
            color="primary"
            to="/admin"
            style="text-transform: none; text-decoration: none; color: inherit"
            >Admin</v-btn
          >
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

    <v-app-bar v-if="!smallScreen" density="compact" class="header-nav">
      <v-toolbar class="pl-4 pr-6">
        <v-btn
          text
          v-for="link in menuLinks"
          :key="link.id"
          class="text-none"
          size="small"
          :to="link.route"
        >
          {{ link.title }}
        </v-btn>
        <v-btn
          v-if="hasPermissions('ADMIN', 'readPage')"
          id="admin"
          size="small"
          class="text-none"
          to="/admin"
          >Admin</v-btn
        >
        <v-btn
          v-if="!profile.pen"
          id="profile-route"
          size="small"
          disabled
          class="text-none"
          to="#"
        >
          Profile (Student Not Loaded)
        </v-btn>
        <v-btn
          id="profile-route"
          size="small"
          :to="`/student-profile/${profile.studentID}`"
          class="text-none"
          v-else
        >
          Profile ({{ profile.pen }})
        </v-btn>
        <v-spacer />
        <div class="form-group top-search mb-0">
          <v-form @submit.prevent class="d-flex mb-0">
            <v-text-field
              id="header-pen-search"
              density="compact"
              variant="outlined"
              size="9"
              type="search"
              v-model="penInput"
              maxlength="9"
              minlength="9"
              placeholder="PEN"
              ref="penSearch"
              hide-details
              v-on:keyup="keyHandler"
              append-inner-icon="mdi-magnify"
              @click:appendInner="findStudentByPen"
              :loading="searchLoading"
              color="primary"
            ></v-text-field>
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
import { useAccessStore } from "@/store/modules/access";
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
          title: "Reports",
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
    ...mapState(useAccessStore, ["hasPermissions"]),
    screenSize() {
      return window.innerWidth;
    },
    isDesktop() {
      return window.innerWidth >= 760; // Adjust this breakpoint as needed
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
:deep(header.bc-header) {
  border-bottom: 2px solid rgb(var(--v-theme-bcGovGold));
}
:deep(.header-nav .v-btn) {
  font-size: 0.825em;
  border-right: 1px solid
    rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
  border-radius: 0;
  color: rgba(var(--v-theme-on-surface-light), var(--v-high-emphasis-opacity));
  text-decoration: none !important;
}
:deep(.header-nav .v-btn .v-btn__content):hover {
  background-color: transparent;
  text-decoration: underline;
  border-radius: 2px;
}
:deep(.v-btn:has(.text-disabled)):hover {
  text-decoration: none;
}
:deep(.v-btn:hover > .v-btn__overlay) {
  opacity: 0;
}
:deep(.header-nav .v-btn):last-of-type {
  border-right: none;
}
:deep(#header-pen-search) {
  padding: 4px 16px;
  min-height: 0;
}
:deep(.v-field__append-inner i.v-icon):hover {
  color: rgb(var(--v-theme-bcGovBlue));
  background-color: rgba(var(--v-theme-bcGovBlue), var(--v-hover-opacity));
  border-radius: 4px;
  padding: 12px;
}
</style>
