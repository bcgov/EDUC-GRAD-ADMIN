<template>
  <div>
    <v-app-bar color="primary" density="prominent"
      ><div class="container">
        <div class="banner">
          <a class="navbar-brand" href="/">
            <img
              class="img-fluid d-md-block"
              src="../../assets/images/bcid-logo-rev-en.svg"
              width="185"
              height="45"
              alt="B.C. Government Logo"
            />
          </a>
          <h1>Graduation Records and Achievement Data</h1>
          <span v-if="version">v{{ version }}</span>
        </div>
        <div class="float-right user-profile">
          <slot></slot>
        </div>
      </div>
    </v-app-bar>
    <v-app-bar class="navigation-main" id="navbar" aria-label="aria-label">
      <ul>
        <li>
          <router-link :to="routes.studentSearch" id="select-student-route"
            >Student Search</router-link
          >
        </li>
        <li>
          <router-link :to="routes.programs" id="programs-route"
            >Programs</router-link
          >
        </li>
        <li>
          <router-link :to="routes.courses" id="courses-route"
            >Courses</router-link
          >
        </li>
        <li>
          <router-link :to="routes.assessments" id="assessments-route"
            >Assessments</router-link
          >
        </li>
        <li>
          <router-link :to="routes.schools" id="schools-route"
            >Schools</router-link
          >
        </li>
        <li>
          <router-link :to="routes.psi" id="psi-route">PSI</router-link>
        </li>
        <li>
          <router-link :to="routes.codes" id="codes-route">Codes</router-link>
        </li>
        <li>
          <router-link :to="routes.schoolReports">School Reports</router-link>
        </li>
        <li>
          <router-link :to="routes.batchProcessing"
            >Batch Processing</router-link
          >
        </li>
        <li v-if="!profile.pen" class="disabled">
          <a
            id="profile-route"
            class="text-decoration-none text-disabled"
            :disabled="true"
            >Profile (Student Not Loaded)</a
          >
        </li>
        <li v-else>
          <router-link
            :to="`/student-profile/${this.profile.studentID}`"
            id="profile-route"
            >Profile ({{
              profile.pen ? profile.pen : "Student Not Loaded"
            }})</router-link
          >
        </li>
        <li>
          <form v-on:submit.prevent>
            <div class="form-group top-search">
              <div>
                <v-form @submit.prevent>
                  <v-row class="align-center">
                    <v-col class="d-flex align-center">
                      <v-text-field
                        type="search"
                        v-model="penInput"
                        maxlength="9"
                        minlength="9"
                        outlined
                        dense
                        placeholder=""
                        class=""
                        ref="penSearch"
                      ></v-text-field>
                      <v-btn
                        v-if="!searchLoading"
                        @click="findStudentByPen"
                        variant="flat"
                        color="primary"
                        class="px-2"
                        >Search
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </div>
          </form>
        </li>
      </ul>
    </v-app-bar>
  </div>
</template>
<script>
import StudentService from "@/services/StudentService.js";
import CommonService from "@/services/CommonService.js";
import { loadStudent, showNotification } from "../../utils/common.js";
import { useStudentStore } from "@/store/modules/student";
import { mapState } from "pinia";

export default {
  components: {},
  setup() {
    const studentStore = useStudentStore();
    return { studentStore };
  },
  data() {
    return {
      pen: "",
      searchLoading: false,
      penInput: "",
      studentSearchResults: [],
      host: location.protocol + "//" + location.host,
      studentUrlID: "",
      routes: {
        studentSearch: "/",
        programs: "/programs",
        courses: "/courses",
        assessments: "/assessments",
        schools: "/schools",
        psi: "/psi",
        codes: "/codes",
        schoolReports: "/school-reports",
        batchProcessing: "/batch-processing",
      },
      version: "",
    };
  },
  async created() {
    this.loadStudent = loadStudent;
    this.showNotification = showNotification;
    let versionResponse = await CommonService.getVersion();
    this.version = versionResponse.data;
  },
  computed: {
    ...mapState(useStudentStore, {
      profile: "getStudentProfile",
    }),
  },
  methods: {
    logout() {
      if (localStorage.getItem("jwt") != null) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("refresh");
      }
      this.studentStore.unsetStudent();
      // this.$store.commit("logout");
      this.$router.push("/logout");
    },
    selectStudent() {
      this.$router.push("/");
    },
    findStudentByPen: function () {
      if (this.penInput) {
        if (this.penInput == this.profile.pen) {
          this.showNotification(
            "warning",
            "The entered PEN is the same as the currently loaded student"
          );
        } else {
          this.searchLoading = true;
          this.studentSearchResults = [];
          StudentService.getStudentByPen(this.penInput)
            .then((response) => {
              if (response.data) {
                if (response.data.length == 0) {
                  throw new Error("Student not found");
                }
                this.studentStore.unsetStudent();
                this.studentStore.setQuickSearchId(response.data[0].studentID);
                this.loadStudent(response.data);
                this.searchLoading = false;
              }
            })
            .catch((error) => {
              // eslint-disable-next-line
              console.log("BCHeader: " + error);
              this.searchLoading = false;
              this.showNotification(
                "danger",
                `Student ${this.penInput} cannot be found on the GRAD or PEN database`
              );
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
.navbar,
.nav {
  z-index: 99;
}
.navbar-brand {
  padding-top: 0.5rem;
  padding-left: 65px;
}
#navbar {
  z-index: 99;
}
header#navbar {
  top: 55px !important;
  height: 56px;
}
button.v-btn.v-theme--light.bg-primary.v-btn--density-default.v-btn--size-default.v-btn--variant-flat.px-2 {
  top: 14px;
}
header {
  z-index: 99;
  background-color: var(--primary-nav);
  border-bottom: 2px solid var(--bcgold);
  padding: 0 30px 0 30px;
  color: #fff;
  display: flex;
  height: 65px;
  top: 0;
  position: fixed;
  width: 100%;
  -webkit-box-shadow: 0 6px 8px -4px #b3b1b3;
  -moz-box-shadow: 0 6px 8px -4px #b3b1b3;
  box-shadow: 0 6px 8px -4px #b3b1b3;
}

header h1 {
  font-family: "BC Sans", "Noto Sans", Verdana, Arial, sans-serif;
  font-weight: normal; /* 400 */
  margin: 5px 5px 0 18px;
  text-transform: none;
  display: none;
  /* visibility: hidden; */
}

header .banner {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0 10px 0 0;
}

header .other {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

header a [class^="fas fa-"] {
  color: white;
  font-size: 1.4em;
  font-style: bold;
  line-height: 1;
  padding: 5px;
  -webkit-font-smoothing: antialiased;
}

header .nav-btn {
  display: block;
  width: auto;
  margin: 0 0 0 auto;
  cursor: pointer;
}

.user-profile {
  margin-top: 0px;
  display: none;
}

.navigation-main {
  display: none;
  position: fixed;
  top: 40px;
  width: 100%;
  -webkit-box-shadow: 0 6px 8px -4px #b3b1b3;
  -moz-box-shadow: 0 6px 8px -4px #b3b1b3;
  box-shadow: 0 6px 8px -4px #b3b1b3;
  padding: 10px 0 10px 0;
}

.navigation-main ul {
  display: flex;
  flex-direction: column;
  margin: 0;
  list-style: none;
  margin-left: -25px;
}

.navigation-main ul li {
  margin: 5px 0;
}

.navigation-main ul li a {
  display: flex;
  font-size: 0.813em;
  font-weight: normal;
  padding: 0 14px 0 14px;
  text-decoration: none;
}

.navigation-main ul li a:hover {
  text-decoration: underline;
}

.navigation-main ul .active {
  text-decoration: underline;
  font-weight: bold;
}

.min-nav {
  position: fixed;
  left: 80px;
  z-index: 110;
  top: 5px;
}
.burgernav {
  position: fixed;
}
#navbarSmallScreen {
  z-index: 100;
  /* padding: 10px 0; */
  background-color: #38598a;
  color: white;
  top: 65px;
  position: fixed;
  width: 100%;
  -webkit-box-shadow: 0 6px 8px -4px #b3b1b3;
  -moz-box-shadow: 0 6px 8px -4px #b3b1b3;
  box-shadow: 0 6px 8px -4px #b3b1b3;
}
#navbarSmallScreen a {
  color: white;
  margin-left: 10px;
}
.user-burgernav {
  padding: 5px 0 5px 15px;
  background-color: var(--primary-nav);
  border-top: 2px solid var(--bcgold);
}

:focus {
  outline: 4px solid #3b99fc;
  outline-offset: 1px;
}

/*
    These are sample media queries only. Media queries are quite subjective
    but, in general, should be made for the three different classes of screen
    size: phone, tablet, full.
  */

@media screen and (min-width: 774px) {
  header {
    height: 85px;
  }
  header h1 {
    display: inline;
  }
  .top-search {
    width: 100px;
    position: absolute;
    top: -78px;
    right: 20px;
  }
  .burgernav {
    display: none;
  }
  .navigation-main {
    display: block;
    margin-bottom: 100px; /* do I need this? */
  }
  .navigation-main ul {
    flex-direction: row;
  }
  .navigation-main ul li {
    margin: 0;
  }
  .navigation-main ul li a {
    border-right: 1px solid #9b9b9b;
  }
  .navbar-brand {
    padding-left: 0;
  }
  .user-profile {
    display: block;
  }
  /* removes vertical line on last item on nav */
  #profile-route {
    border-right: none;
  }
}

@media screen and (min-width: 774px) and (max-width: 1360px) {
  header h1 {
    font-size: calc(5px + 2.05vw);
  }
  .navigation-main ul li a {
    padding: 0 calc(2px + 0.85vw) 0 calc(2px + 0.85vw);
    font-size: calc(8.5px + 0.35vw);
  }
}

@media screen and (min-width: 1200px) {
  header {
    height: 65px;
  }
  .navigation-main {
    top: 65px;
  }
  .top-search {
    position: absolute;
    width: 230px;
    top: 1px;
    right: 0px;
  }
  .user-profile {
    margin-top: -20px;
  }
}
</style>
