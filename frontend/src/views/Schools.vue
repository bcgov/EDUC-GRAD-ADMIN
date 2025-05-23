<template>
  <div class="schools-view">
    <h1>Schools</h1>

    <v-card no-body>
      <v-card-text>
        <v-form v-on:submit.prevent id="courseReqForm">
          <div class="advanced-search-form">
            <v-row class="row my-3">
              <div class="advanced-search-field col-12 col-md-2">
                <div
                  href="#"
                  v-on:click="
                    search.district.contains = !search.district.contains
                  "
                  v-bind:class="{ active: search.district.contains }"
                  class="wild-card-button"
                >
                  <v-tooltip activator="parent" location="top"
                    >District contains</v-tooltip
                  >
                  [.*]
                </div>
                <v-text-field
                  label="District:"
                  variant="outlined"
                  density="compact"
                  v-model="search.district.value"
                  v-on:keyup="keyHandler"
                  placeholder=""
                  id="district"
                  trim
                  tabindex="1"
                ></v-text-field>
              </div>
              <div class="advanced-search-field col-12 col-md-2">
                <div
                  href="#"
                  v-on:click="
                    search.mincode.contains = !search.mincode.contains
                  "
                  v-bind:class="{ active: search.mincode.contains }"
                  class="wild-card-button"
                  title="Mincode contains"
                >
                  <v-tooltip activator="parent" location="top"
                    >Mincode contains</v-tooltip
                  >
                  [.*]
                </div>
                <v-text-field
                  label="Mincode:"
                  variant="outlined"
                  density="compact"
                  v-model="search.mincode.value"
                  v-on:keyup="keyHandler"
                  placeholder=""
                  minlength="3"
                  id="mincode"
                  trim
                  tabindex="2"
                ></v-text-field>
              </div>
              <div class="advanced-search-field col-12 col-md-2">
                <div
                  href="#"
                  v-on:click="
                    search.schoolName.contains = !search.schoolName.contains
                  "
                  v-bind:class="{ active: search.schoolName.contains }"
                  class="wild-card-button"
                >
                  <v-tooltip activator="parent" location="top"
                    >School name contains</v-tooltip
                  >
                  [.*]
                </div>
                <v-text-field
                  label="School name:"
                  variant="outlined"
                  density="compact"
                  v-model="search.schoolName.value"
                  v-on:keyup="keyHandler"
                  placeholder=""
                  id="schoolName"
                  tabindex="3"
                ></v-text-field>
              </div>
            </v-row>
          </div>
        </v-form>
        <v-row>
          <div class="advanced-search-button ml-4 mb-4">
            <v-btn
              prepend-icon="mdi-magnify"
              v-on:click="advancedSchoolSearch"
              :loading="searchLoading"
              :disabled="searchLoading"
              variant="flat"
              color="primary"
              class="text-none"
              >Search</v-btn
            >
            <v-btn
              color="primary"
              variant="outlined"
              @click="clearInput"
              class="text-none mx-2"
            >
              Reset
            </v-btn>
          </div>
        </v-row>
        <div v-if="schools">
          <v-alert
            type="success"
            variant="tonal"
            border="start"
            class="mt-8 mb-0 ml-1 py-3 width-fit-content"
            v-if="totalResults > 0 && !searchLoading"
            :text="`${totalResults} school record${
              totalResults > 1 ? 's' : ''
            } found`"
          >
          </v-alert>
          <v-alert
            type="error"
            variant="tonal"
            border="start"
            class="mt-8 mb-0 ml-1 py-3 width-fit-content"
            v-if="!!searchMessage"
            :text="searchMessage"
          ></v-alert>
        </div>
        <DisplayTable
          v-if="schools.length"
          :items="schools"
          :fields="schoolFields"
          :id="'minCode'"
          :showFilter="true"
          :pagination="true"
        >
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <ul>
                  <li v-if="item.address1">
                    <strong>Address:</strong> {{ item.address1 }}
                  </li>
                  <li v-if="item.city">
                    <strong>City:</strong> {{ item.city }}
                  </li>
                  <li v-if="item.provCode">
                    <strong>Province Code:</strong>
                    {{ item.provCode }}
                  </li>
                  <li v-if="item.postal">
                    <strong>Postal Code:</strong> {{ item.postal }}
                  </li>
                  <li v-if="item.schoolEmail">
                    <strong>Email:</strong> {{ item.schoolEmail }}
                  </li>
                  <li v-if="item.principalName">
                    <strong>Principal:</strong>
                    {{ item.principalName }}
                  </li>
                  <li v-if="item.schoolPhone">
                    <strong>Phone:</strong> {{ item.schoolPhone }}
                  </li>
                  <li v-if="item.schoolFax">
                    <strong>Fax:</strong> {{ item.schoolFax }}
                  </li>
                </ul>
              </td>
            </tr>
          </template>
        </DisplayTable>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import SchoolService from "@/services/SchoolService.js";
import DisplayTable from "@/components/DisplayTable.vue";
import { useSnackbarStore } from "@/store/modules/snackbar";
export default {
  name: "schools",
  components: {
    DisplayTable: DisplayTable,
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      courseRequirementLoading: true,
      url: null,
      file: [],
      schools: {},
      schoolFields: [
        {
          key: "data-table-expand",
          title: "",
          sortable: true,
          class: "text-left",
        },
        {
          key: "minCode",
          title: "TRAX School Code",
          sortable: true,
          sortDirection: "asc",
        },
        {
          key: "schoolName",
          title: "TRAX School Name",
          sortable: true,
        },
        {
          key: "transcriptEligibility",
          title: "TRAX Transcript Eligible",
          sortable: true,
          class: "text-center",
        },
        {
          key: "certificateEligibility",
          title: "TRAX Certificate Eligible",
          sortable: true,
          class: "text-center",
        },
        {
          key: "reportingFlag",
          title: "TRAX Reporting Flag",
          sortable: true,
          class: "text-center",
        },
        {
          key: "schoolCategory",
          title: "SPM School Category",
          sortable: true,
          class: "text-center",
        },
        {
          key: "appendTrans",
          title: "Append to Schools",
          sortable: true,
          class: "text-center",
        },
      ],
      totalResults: "",
      searchMessage: "",
      searchLoading: false,
      search: {
        district: {
          value: "",
          contains: false,
        },
        schoolName: {
          value: "",
          contains: false,
        },
        mincode: {
          value: "",
          contains: false,
        },
      },
    };
  },
  created() {},
  methods: {
    keyHandler: function (e) {
      if (e.keyCode === 13) {
        //enter key pressed
        this.advancedSchoolSearch();
      }
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);
    },
    advancedSchoolSearch() {
      this.totalResults = "";
      this.searchMessage = "";
      let isEmpty = true;
      for (const key in this.search) {
        if (this.search.hasOwnProperty(key)) {
          if (this.search[key].value != "") {
            isEmpty = false;
          }
        } //mincode
      }
      if (isEmpty) {
        this.totalResults = "";
        this.searchLoading = false;
        this.searchMessage = "Enter at least one field to search.";
      } else if (!isEmpty) {
        this.searchLoading = true;
        this.schools = {};
        SchoolService.searchSchools(this.search)
          .then((res) => {
            this.schools = res.data;
            this.searchLoading = false;
            this.totalResults = this.schools.length;
            if (this.schools.length == 0) {
              this.searchMessage = "School cannot be found.";
            }
            this.courseRequirementLoading = false;
          })
          .catch((error) => {
            this.searchLoading = false;
            this.courseRequirementLoading = false;
            this.searchMessage = "School cannot be found.";
            // eslint-disable-next-line
            console.error(error);
            this.snackbarStore.showSnackbar(error.message, "error", 5000);
          });
      }
    },
    clearInput: function () {
      this.schools = "";
      for (const key in this.search) {
        if (this.search.hasOwnProperty(key)) {
          this.search[key].value = "";
          this.search[key].contains = false;
        }
      }
    },
  },
};
</script>

<style scoped>
.schools-view {
  padding-left: 25px;
  padding-right: 25px;
}
.close-record {
  float: right;
}

.tab-loading {
  color: green !important;
}

.profile-name {
  padding-bottom: 10px;
}
.wild-card-button:hover {
  cursor: pointer;
}
.wild-card-button {
  color: #dee2eb;
  position: absolute;
  right: 21px;
  top: 10px;
  z-index: 10;
  text-decoration: none;
}

.wild-card-button:visited {
  color: #dee2eb;
  text-decoration: none;
}

.wild-card-button.active {
  color: green;
}
</style>
