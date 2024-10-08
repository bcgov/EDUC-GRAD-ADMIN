<template>
  <div class="psi-view">
    <h1>Post Secondary Institutions</h1>
    <v-card no-body>
      <v-form v-on:submit.prevent id="psiReqForm">
        <div class="advanced-search-form mt-7">
          <div class="row mt-3 ml-1">
            <div class="advanced-search-field col-12 col-md-2">
              <div
                href="#"
                v-on:click="
                  advancedSearchInput.psiCode.contains =
                    !advancedSearchInput.psiCode.contains
                "
                v-bind:class="{
                  active: advancedSearchInput.psiCode.contains,
                }"
                class="wild-card-button"
              >
                <v-tooltip activator="parent" location="top"
                  >PSI code starts with</v-tooltip
                >
                [.*]
              </div>
              <v-text-field
                label="PSI Code:"
                v-model="advancedSearchInput.psiCode.value"
                placeholder=""
                id="psiCode"
                class="form__input"
                trim
                tabindex="1"
              ></v-text-field>
            </div>
            <div class="advanced-search-field col-12 col-md-2">
              <div
                href="#"
                v-on:click="
                  advancedSearchInput.psiName.contains =
                    !advancedSearchInput.psiName.contains
                "
                v-bind:class="{
                  active: advancedSearchInput.psiName.contains,
                }"
                class="wild-card-button"
              >
                <v-tooltip activator="parent" location="top"
                  >PSI name starts with</v-tooltip
                >
                [.*]
              </div>
              <v-text-field
                label="PSI Name:"
                v-model="advancedSearchInput.psiName.value"
                placeholder=""
                id="psiName"
                class="form__input"
                trim
                tabindex="2"
              ></v-text-field>
            </div>
            <div class="advanced-search-field col-12 col-md-2">
              <div
                href="#"
                v-on:click="
                  advancedSearchInput.cslCode.contains =
                    !advancedSearchInput.cslCode.contains
                "
                v-bind:class="{
                  active: advancedSearchInput.cslCode.contains,
                }"
                class="wild-card-button"
                title="CSL code starts with"
              >
                <v-tooltip activator="parent" location="top"
                  >CSL code starts with</v-tooltip
                >
                [.*]
              </div>
              <v-text-field
                label="CSL Code:"
                v-model="advancedSearchInput.cslCode.value"
                placeholder=""
                id="cslCode"
                class="form__input"
                trim
                tabindex="3"
              ></v-text-field>
            </div>
            <div class="advanced-search-field col-12 col-md-2">
              <v-select
                label="Active:"
                v-model="advancedSearchInput.openFlag.value"
                :items="options"
                item-title="text"
                item-value="value"
                tabindex="4"
              ></v-select>
            </div>
            <div class="advanced-search-field col-12 col-md-2">
              <div
                href="#"
                v-on:click="
                  advancedSearchInput.transmissionMode.contains =
                    !advancedSearchInput.transmissionMode.contains
                "
                v-bind:class="{
                  active: advancedSearchInput.transmissionMode.contains,
                }"
                class="wild-card-button"
              >
                [.*]
                <v-tooltip activator="parent" location="top"
                  >Transmission mode starts with</v-tooltip
                >
              </div>
              <v-text-field
                label="Transmission Mode:"
                v-model="advancedSearchInput.transmissionMode.value"
                placeholder=""
                id="transmissionMode"
                class="form__input"
                trim
                tabindex="5"
              ></v-text-field>
            </div>
          </div>
          <div class="row ml-1">
            <div class="advanced-search-button">
              <v-btn
                v-on:click="advancePSISearch"
                v-if="!advancedSearchLoading"
                color="primary"
                tabindex="6"
              >
                <i class="fas fa-search" aria-hidden="true"></i>
                Search
              </v-btn>
              <v-btn color="success" v-if="advancedSearchLoading" tabindex="6"
                ><i class="fas fa-search" aria-hidden="true"></i>Search
                <v-progress-circular
                  v-if="advancedSearchLoading"
                  indeterminate
                  color="green"
                ></v-progress-circular
              ></v-btn>
              <v-btn @click="clearInput" class="btn btn-outline-primary mx-2">
                Reset
              </v-btn>
            </div>
          </div>

          <div v-if="psiResults" class="ml-4">
            <v-alert
              type="success"
              variant="tonal"
              border="start"
              class="mt-8 mb-0 ml-1 py-3 width-fit-content"
              v-if="totalResults > 0"
              :text="`${totalResults} Post Secondary Institutions found`"
            ></v-alert>
            <v-alert
              type="error"
              variant="tonal"
              border="start"
              class="mt-8 mb-0 ml-1 py-3 width-fit-content"
              v-if="!!searchMessage"
              :text="searchMessage"
            ></v-alert>
          </div>
        </div>
      </v-form>
      <v-card-text>
        <DisplayTable
          v-if="psiResults.length"
          :items="psiResults"
          :fields="psiFields"
          :id="'psiCode'"
          :showFilter="true"
          :pagination="true"
          title="PSI"
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
                  <li v-if="item.provinceCode">
                    <strong>Province Code:</strong>
                    {{ item.provinceCode }}
                  </li>
                  <li v-if="item.provinceName">
                    <strong>Province Name:</strong>
                    {{ item.provinceName }}
                  </li>
                  <li v-if="item.countryCode">
                    <strong>Country Code:</strong> {{ item.countryCode }}
                  </li>
                  <li v-if="item.postal">
                    <strong>Postal Code:</strong> {{ item.postal }}
                  </li>
                  <li v-if="item.phone1">
                    <strong>Phone:</strong> {{ item.phone }}
                  </li>
                  <li v-if="item.fax"><strong>Fax:</strong> {{ item.fax }}</li>
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
import TRAXService from "../services/TRAXService.js";
import DisplayTable from "@/components/DisplayTable.vue";
import { useSnackbarStore } from "@/store/modules/snackbar";
export default {
  name: "psi",
  components: {
    DisplayTable: DisplayTable,
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      advancedSearchLoading: false,
      advancedSearchMessage: "",
      totalResults: "",
      params: {},
      psi: {},
      options: [
        { value: "Y", text: "Y" },
        { value: "N", text: "N" },
      ],
      psiResults: [],
      psiFields: [
        {
          key: "data-table-expand",
          title: "",
          sortable: true,
          class: "text-left",
        },
        {
          key: "psiCode",
          title: "PSI Code",
          sortable: true,
          class: "text-left",
        },
        {
          key: "psiName",
          title: "PSI Name",
          sortable: true,
        },
        {
          key: "cslCode",
          title: "CSL Code",
          sortable: true,
          class: "text-left",
        },
        {
          key: "psisCode",
          title: "PSIS Code",
          sortable: true,
          class: "text-center",
        },
        {
          key: "openFlag",
          title: "Active",
          sortable: true,
          class: "text-center",
        },
        {
          key: "transmissionMode",
          title: "Transmission Mode",
          sortable: true,
        },
      ],
      advancedSearchInput: {
        psiCode: {
          value: "",
          contains: false,
        },
        psiName: {
          value: "",
          contains: false,
        },
        cslCode: {
          value: "",
          contains: false,
        },
        openFlag: {
          value: "",
          contains: false,
        },
        transmissionMode: {
          value: "",
          contains: false,
        },
        psiGrouping: {
          value: "",
          contains: false,
        },
      },
    };
  },
  methods: {
    clearInput: function () {
      this.penInput = "";
      this.psiResults = "";
      for (const key in this.advancedSearchInput) {
        if (this.advancedSearchInput.hasOwnProperty(key)) {
          this.advancedSearchInput[key].value = "";
          this.advancedSearchInput[key].contains = false;
        }
      }
      for (const reqKey in this.requirementsSearchInput) {
        if (this.requirementsSearchInput.hasOwnProperty(reqKey)) {
          this.requirementsSearchInput[reqKey].value = "";
          this.requirementsSearchInput[reqKey].contains = false;
        }
      }
    },
    advancePSISearch() {
      this.totalResults = "";
      this.advancedSearchMessage = "";
      this.advancedSearchLoading = true;
      this.params = new URLSearchParams();
      this.psiResults = [];
      let isEmpty = true;
      for (const key in this.advancedSearchInput) {
        if (this.advancedSearchInput.hasOwnProperty(key)) {
          if (this.advancedSearchInput[key].value != "") {
            isEmpty = false;
          }
        }
      }
      if (isEmpty) {
        this.totalResults = "";
        this.advancedSearchLoading = false;
        this.advancedSearchMessage += "Enter at least one field to search.";
      } else if (!isEmpty) {
        try {
          if (this.advancedSearchInput) {
            if (this.advancedSearchInput.psiCode.value != "") {
              if (
                this.advancedSearchInput.psiCode.contains &&
                !this.advancedSearchInput.psiCode.value.includes("*")
              ) {
                this.params.append(
                  "psiCode",
                  this.advancedSearchInput.psiCode.value + "*"
                );
              } else {
                this.params.append(
                  "psiCode",
                  this.advancedSearchInput.psiCode.value
                );
              }
            }
            if (this.advancedSearchInput.psiName.value != "") {
              if (
                this.advancedSearchInput.psiName.contains &&
                !this.advancedSearchInput.psiName.value.includes("*")
              ) {
                this.params.append(
                  "psiName",
                  this.advancedSearchInput.psiName.value + "*"
                );
              } else {
                this.params.append(
                  "psiName",
                  this.advancedSearchInput.psiName.value
                );
              }
            }
            if (this.advancedSearchInput.cslCode.value != "") {
              if (
                this.advancedSearchInput.cslCode.contains &&
                !this.advancedSearchInput.cslCode.value.includes("*")
              ) {
                this.params.append(
                  "cslCode",
                  this.advancedSearchInput.cslCode.value + "*"
                );
              } else {
                this.params.append(
                  "cslCode",
                  this.advancedSearchInput.cslCode.value
                );
              }
            }
            if (this.advancedSearchInput.openFlag.value != "") {
              this.params.append(
                "openFlag",
                this.advancedSearchInput.openFlag.value
              );
            }
            if (this.advancedSearchInput.transmissionMode.value != "") {
              if (
                this.advancedSearchInput.transmissionMode.contains &&
                !this.advancedSearchInput.transmissionMode.value.includes("*")
              ) {
                this.params.append(
                  "transmissionMode",
                  this.advancedSearchInput.transmissionMode.value + "*"
                );
              } else {
                this.params.append(
                  "transmissionMode",
                  this.advancedSearchInput.transmissionMode.value
                );
              }
            }
            if (this.advancedSearchInput.psiGrouping.value != "") {
              if (
                this.advancedSearchInput.psiGrouping.contains &&
                !this.advancedSearchInput.psiGrouping.value.includes("*")
              ) {
                this.params.append(
                  "psiGrouping",
                  this.advancedSearchInput.psiGrouping.value + "*"
                );
              } else {
                this.params.append(
                  "psiGrouping",
                  this.advancedSearchInput.psiGrouping.value
                );
              }
            }
          } //if this.advanceSearchInput
          TRAXService.getPSIByAdvancedSearch(this.params)
            .then((response) => {
              this.advancedSearchLoading = false;
              this.psiResults = response.data;
              this.totalResults = this.psiResults.length;
              if (this.totalResults <= 0) {
                this.advancedSearchMessage = "No PSIs found.";
              }
            })
            .catch((error) => {
              this.advancedSearchLoading = false;
              this.advancedSearchMessage = "No PSIs found.";
              // eslint-disable-next-line
              console.log("There was an error:" + error);
              this.snackbarStore.showSnackbar(error.message, "error", 5000);
            }); //TRAXService
        } catch (error) {
          this.advancedSearchLoading = false;
          this.advancedSearchMessage = "Search Error" + error;
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
        }
      }
    },
  },
};
</script>

<style scoped>
.psi-view {
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
.table-filter {
  top: 0px !important;
}
.advanced-search-form {
  background-color: #fff;
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
.search-results-message {
  float: left;
  clear: both;
}
.advanced-search-button {
  padding-left: 15px;
}
</style>
