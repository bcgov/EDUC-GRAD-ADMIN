<template>
  <div>
    <div class="px-0">
      {{ studentInfo[0] }}
      <table v-if="!smallScreen" class="profile-name" aria-label="student information">
        <tbody>
          <tr>
            <th class="align-top px-2" scope="col"></th>
            <th class="align-top px-2" scope="col">
              <label>PEN</label>
            </th>
            <th class="align-top px-2" scope="col">
              <label>Legal Surname</label>
            </th>
            <th class="align-top px-2" scope="col">
              <label>Legal Given</label>
            </th>
            <th class="align-top px-2" scope="col">
              <label>Legal Middle</label>
            </th>
            <th class="align-top px-2" scope="col">
              <label>Birthdate (yyyy-mm-dd)</label>
            </th>
          </tr>
          <tr>
            <td>
              <v-btn v-on:click="moreStudentInfo = !moreStudentInfo" text elevation="0" variant="flat"
                class="no-outline-btn">
                <v-icon v-show="!moreStudentInfo" icon="mdi-chevron-right" size="large"></v-icon>
                <v-icon v-show="moreStudentInfo" icon="mdi-chevron-down" size="large"></v-icon>
              </v-btn>
            </td>
            <td class="align-top profile-name-data px-0" v-if="studentFullName.pen">
              <strong>
                <p class="profile-info">{{ studentFullName.pen }}</p>
              </strong>
            </td>
            <td class="align-top profile-name-data" v-if="studentFullName.legalLastName">
              <p class="profile-info">{{ studentFullName.legalLastName }}</p>
            </td>
            <td class="align-top profile-name-data" v-if="studentFullName.legalFirstName">
              <p class="profile-info">{{ studentFullName.legalFirstName }}</p>
            </td>
            <td class="align-top profile-name-data" v-if="studentFullName.legalMiddleNames">
              <p class="profile-info">{{ studentFullName.legalMiddleNames }}</p>
            </td>
            <td class="align-top profile-name-data" v-if="!studentFullName.legalMiddleNames">
              <p class="profile-info"></p>
            </td>
            <td class="align-top profile-name-data" v-if="studentInfo.dob">
              <p class="profile-info">{{ studentInfo.dob }}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="smallScreen" class="profile-name">
        <div v-if="studentFullName.pen" class="p-0 profile-name-data">
          <label>PEN</label>
          <h2 class="px-0">{{ studentFullName.pen }}</h2>
        </div>
        <div v-if="studentFullName.legalLastName" class="p-0 profile-name-data">
          <label>Legal surname</label>
          <h2 class="px-0">{{ studentFullName.legalLastName }}</h2>
        </div>
        <div v-if="studentFullName.legalFirstName" class="p-0 profile-name-data">
          <label>Legal given</label>
          <h2 class="px-0">{{ studentFullName.legalFirstName }}</h2>
        </div>
        <div v-if="studentFullName.legalMiddleNames" class="p-0 profile-name-data">
          <label>Legal middle</label>
          <h2 class="px-0">{{ studentFullName.legalMiddleNames }}</h2>
        </div>
        <div v-if="studentInfo.dob" class="p-0 profile-name-data">
          <label>Birthdate(yyyy-mm-dd)</label>
          <h2 class="px-0">{{ studentInfo.dob }}</h2>
        </div>
        <v-btn class="text-decoration-none" v-on:click="moreStudentInfo = !moreStudentInfo" variant="plain">
          <v-icon v-show="!moreStudentInfo" icon="mdi-chevron-right" size="large"></v-icon>
          <v-icon v-show="moreStudentInfo" icon="mdi-chevron-down" size="large"></v-icon>
          &nbsp;{{ moreStudentInfo ? "Hide " : "Show " }}Student Details
        </v-btn>
      </div>
    </div>

    <div class="col-12 px-3">
      <div v-show="moreStudentInfo">
        <v-card no-body class="border-0">
          <v-table striped hover small stacked="lg" role="presentation" aria-label="student details">
            <tbody>
              <tr>
                <td class="px-2">
                  <strong>Usual surname:</strong>
                  {{ studentInfo.usualLastName }}
                </td>
                <td class="px-2">
                  <strong>Usual given:</strong>
                  {{ studentInfo.usualFirstName }}
                </td>
                <td class="px-2">
                  <strong>Usual middle:</strong>
                  {{ studentInfo.usualMiddleNames }}
                </td>
              </tr>
              <tr>
                <td class="px-2">
                  <strong>Gender:</strong> {{ studentInfo.genderCode }}
                </td>
                <td class="px-2">
                  <strong>True student ID: </strong>
                  <span v-if="studentInfo.trueStudentID">
                    {{ studentInfo.trueStudentID }}</span>
                </td>
                <td class="px-2">
                  <strong>Local ID:</strong> {{ studentInfo.localID }}
                </td>
              </tr>
              <tr>
                <td class="px-2">
                  <strong>PEN Status Code:</strong> {{ studentInfo.statusCode }}
                </td>
                <td class="px-2">
                  <strong>Postal code:</strong> {{ studentInfo.postalCode }}
                </td>
                <td class="px-2" v-if="studentInfo.studentStatus == 'D'">
                  <strong>Deceased date:</strong> {{ studentInfo.deceasedDate }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import sharedMethods from "../../sharedMethods";
import { useStudentStore } from "../../store/modules/student";
import { mapState } from "pinia";
export default {
  name: "StudentInformation",
  components: {},
  setup() {
    const studentStore = useStudentStore();
    return { studentStore };
  },
  computed: {
    ...mapState(useStudentStore, {
      studentInfo: "getStudentProfile",
      studentFullName: "getStudentFullName",
    }),
  },
  data() {
    return {
      smallScreen: false,
      moreStudentInfo: false,
      window: {
        width: 0,
        height: 0,
      },
    };
  },
  created() {
    this.loadStudent = sharedMethods.loadStudent;
    this.window.width = window.innerWidth;
    this.window.height = window.innerHeight;
    if (this.window.width < 768) {
      this.smallScreen = true;
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    isValidPEN(num) {
      //Use this until validation library implemented
      return num && num.length === 9;
    },
  },
};
</script>

<style scoped>
.profile-info {
  font-size: 29px;
}

.profile-info button {
  font-size: 29px;
  box-shadow: none !important;
  padding: 0px;
  color: #313132;
}

.profile-info button.btn.btn-link:focus {
  border: none !important;
}

.profile-name-data {
  word-break: break-all;
  max-width: 400px;
}

.profile-name label {
  font-size: 11px;
  float: left;
  clear: both;
  padding: 5px 0;
  margin-bottom: 0px;
  width: 100%;
  color: #036;
  border-bottom: 1px dotted #ccc;
}

.profile-name td {
  padding: 0px 10px;
}
</style>
