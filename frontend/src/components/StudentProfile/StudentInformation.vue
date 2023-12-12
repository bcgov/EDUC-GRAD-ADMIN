<template>
  <div>
    <div class="px-0">
      {{ studentInfo[0] }}
      <table
        v-if="!smallScreen"
        class="profile-name"
        aria-label="student information"
      >
        <tr>
          <th class="align-top profile-name-header" scope="col"></th>
          <th class="align-top profile-name-header" scope="col">
            <label>PEN</label>
          </th>
          <th class="align-top profile-name-header" scope="col">
            <label>Legal Surname</label>
          </th>
          <th class="align-top profile-name-header" scope="col">
            <label>Legal Given</label>
          </th>
          <th class="align-top profile-name-header" scope="col">
            <label>Legal Middle</label>
          </th>
          <th class="align-top profile-name-header" scope="col">
            <label>Birthdate (yyyy-mm-dd)</label>
          </th>
        </tr>
        <tr>
          <td>
            <b-button
              v-b-toggle.student-accordion
              variant="link"
              v-on:click="moreStudentInfo = !moreStudentInfo"
            >
              <img
                v-show="!moreStudentInfo"
                src="../../assets/images/icon-right.svg"
                width="14"
                aria-hidden="true"
                alt=""
              />
              <img
                v-show="moreStudentInfo"
                src="../../assets/images/icon-down.svg"
                height="8"
                aria-hidden="true"
                alt=""
              />
            </b-button>
          </td>
          <td
            class="align-top profile-name-data px-0"
            v-if="studentFullName.pen"
          >
            <strong
              ><p class="profile-info">{{ studentFullName.pen }}</p></strong
            >
          </td>
          <td
            class="align-top profile-name-data"
            v-if="studentFullName.legalLastName"
          >
            <p class="profile-info">{{ studentFullName.legalLastName }}</p>
          </td>
          <td
            class="align-top profile-name-data"
            v-if="studentFullName.legalFirstName"
          >
            <p class="profile-info">{{ studentFullName.legalFirstName }}</p>
          </td>
          <td
            class="align-top profile-name-data"
            v-if="studentFullName.legalMiddleNames"
          >
            <p class="profile-info">{{ studentFullName.legalMiddleNames }}</p>
          </td>
          <td
            class="align-top profile-name-data"
            v-if="!studentFullName.legalMiddleNames"
          >
            <p class="profile-info"></p>
          </td>
          <td class="align-top profile-name-data" v-if="studentInfo.dob">
            <p class="profile-info">{{ studentInfo.dob }}</p>
          </td>
        </tr>
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
        <div
          v-if="studentFullName.legalFirstName"
          class="p-0 profile-name-data"
        >
          <label>Legal given</label>
          <h2 class="px-0">{{ studentFullName.legalFirstName }}</h2>
        </div>
        <div
          v-if="studentFullName.legalMiddleNames"
          class="p-0 profile-name-data"
        >
          <label>Legal middle</label>
          <h2 class="px-0">{{ studentFullName.legalMiddleNames }}</h2>
        </div>
        <div v-if="studentInfo.dob" class="p-0 profile-name-data">
          <label>Birthdate(yyyy-mm-dd)</label>
          <h2 class="px-0">{{ studentInfo.dob }}</h2>
        </div>
        <b-button
          class="text-decoration-none"
          v-b-toggle.student-accordion
          variant="link"
          v-on:click="moreStudentInfo = !moreStudentInfo"
        >
          <img
            v-show="!moreStudentInfo"
            src="../../assets/images/icon-right.svg"
            height="14"
            aria-hidden="true"
            alt=""
          />
          <img
            v-show="moreStudentInfo"
            src="../../assets/images/icon-down.svg"
            height="8"
            aria-hidden="true"
            alt=""
          />
          &nbsp;{{ moreStudentInfo ? "Hide " : "Show " }}Student Details
        </b-button>
      </div>
    </div>

    <div class="col-12 px-3">
      <b-collapse id="student-accordion" class="">
        <b-card no-body class="border-0">
          <b-table-simple
            striped
            hover
            small
            stacked="lg"
            role="presentation"
            aria-label="student details"
          >
            <b-tbody>
              <b-tr>
                <b-td class="px-2"
                  ><strong>Usual surname:</strong>
                  {{ studentInfo.usualLastName }}</b-td
                >
                <b-td class="px-2"
                  ><strong>Usual given:</strong>
                  {{ studentInfo.usualFirstName }}
                </b-td>
                <b-td class="px-2"
                  ><strong>Usual middle:</strong>
                  {{ studentInfo.usualMiddleNames }}
                </b-td>
              </b-tr>
              <b-tr>
                <b-td class="px-2"
                  ><strong>Gender:</strong> {{ studentInfo.genderCode }}</b-td
                >
                <b-td class="px-2"
                  ><strong>True student ID:</strong>
                  <span
                    v-if="
                      studentInfo.trueStudentID &&
                      isValidPEN(studentInfo.trueStudentID)
                    "
                    :id="'pen' + studentInfo.trueStudentID"
                  >
                    {{ studentInfo.trueStudentID }}</span
                  >
                  <span v-else-if="studentInfo.trueStudentID">
                    Fetching PEN...
                  </span>
                </b-td>
                <b-td class="px-2"
                  ><strong>Local ID:</strong> {{ studentInfo.localID }}</b-td
                >
              </b-tr>
              <b-tr>
                <b-td class="px-2"
                  ><strong>PEN Status Code:</strong>
                  {{ studentInfo.statusCode }}</b-td
                >
                <b-td class="px-2"
                  ><strong>Postal code:</strong>
                  {{ studentInfo.postalCode }}</b-td
                >
                <b-td class="px-2" v-if="studentInfo.studentStatus == 'D'"
                  ><strong>Deceased date:</strong>
                  {{ studentInfo.deceasedDate }}</b-td
                >
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-card>
      </b-collapse>
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
