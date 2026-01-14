<template>
  <div class="px-4 my-7">
    <v-form v-on:submit.prevent>
      <v-row class="mt-1">
        <div class="col-12 col-md-2">
          <v-text-field
            id="psiCode"
            v-model="searchParams.psiCode"
            label="PSI Code"
            variant="outlined"
            density="comfortable"
            clearable
            v-on:keyup="keyHandler"
          ></v-text-field>
        </div>
        <div class="col-12 col-md-2">
          <v-text-field
            id="psiName"
            v-model="searchParams.psiName"
            label="PSI Name"
            variant="outlined"
            density="comfortable"
            clearable
            v-on:keyup="keyHandler"
          ></v-text-field>
        </div>
        <div class="col-12 col-md-2">
          <v-text-field
            id="cslCode"
            v-model="searchParams.cslCode"
            label="CSL Code"
            variant="outlined"
            density="comfortable"
            clearable
            v-on:keyup="keyHandler"
          ></v-text-field>
        </div>
        <div class="col-12 col-md-2">
          <v-select
            id="openFlag"
            v-model="searchParams.openFlag"
            label="Active"
            variant="outlined"
            density="comfortable"
            :items="openFlagOptions"
            item-title="text"
            item-value="value"
            clearable
            v-on:keyup="keyHandler"
          ></v-select>
        </div>
        <div class="col-12 col-md-2">
          <v-text-field
            id="transmissionMode"
            v-model="searchParams.transmissionMode"
            label="Transmission Mode"
            variant="outlined"
            density="comfortable"
            clearable
            v-on:keyup="keyHandler"
          ></v-text-field>
        </div>
      </v-row>
      <v-row class="mt-1">
        <div class="pl-4">
          <v-btn
            prepend-icon="mdi-magnify"
            id="adv-search-submit"
            v-on:click="onSearchClicked"
            :loading="searchLoading"
            :disabled="searchLoading"
            variant="flat"
            color="primary"
            class="text-none"
          >Search</v-btn>
          <v-btn
            class="mx-2 text-none"
            id="adv-search-reset-button"
            color="primary"
            variant="outlined"
            @click="clearInput"
          >
            Reset
          </v-btn>
        </div>
      </v-row>
    </v-form>
    <div v-if="searchMessage" class="d-flex align-center mt-7">
      <v-alert
        type="success"
        variant="tonal"
        border="start"
        class="ml-1 py-3 width-fit-content"
        :text="searchMessage"
      ></v-alert>
    </div>

    <transition name="fade">
      <div v-if="totalPages > 0 && hasSearched" class="table-responsive">
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          v-model:sort-by="sortBy"
          :items-per-page-options="itemsPerPageOptions"
          :headers="searchResultsHeaders"
          :items="searchResults"
          :items-length="totalElements"
          :loading="searchLoading"
          :show-expand="true"
          item-value="psiCode"
          @update:options="updateDataTable"
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
                    <strong>Province Code:</strong> {{ item.provinceCode }}
                  </li>
                  <li v-if="item.provinceName">
                    <strong>Province Name:</strong> {{ item.provinceName }}
                  </li>
                  <li v-if="item.countryCode">
                    <strong>Country Code:</strong> {{ item.countryCode }}
                  </li>
                  <li v-if="item.postal">
                    <strong>Postal Code:</strong> {{ item.postal }}
                  </li>
                  <li v-if="item.phone1">
                    <strong>Phone:</strong> {{ item.phone1 }}
                  </li>
                  <li v-if="item.fax">
                    <strong>Fax:</strong> {{ item.fax }}
                  </li>
                </ul>
              </td>
            </tr>
          </template>
        </v-data-table-server>
      </div>
    </transition>
  </div>
</template>

<script>
import SchoolsService from "@/services/SchoolsService";
import { useSnackbarStore } from "@/store/modules/snackbar";

const OPEN_FLAG_OPTIONS = [
  { value: "Y", text: "Y" },
  { value: "N", text: "N" },
];

const ITEMS_PER_PAGE_OPTIONS = [
  { title: "10", value: 10 },
  { title: "25", value: 25 },
  { title: "50", value: 50 },
  { title: "100", value: 100 },
];

export default {
  name: "PSISearch",
  setup() {
    const snackbarStore = useSnackbarStore();
    return { snackbarStore };
  },
  data() {
    return {
      searchResults: [],
      currentPage: 1,
      itemsPerPage: 10,
      hasSearched: false,
      itemsPerPageOptions: ITEMS_PER_PAGE_OPTIONS,
      totalPages: 0,
      searchMessage: "",
      searchLoading: false,
      totalElements: 0,
      responseContent: null,
      openFlagOptions: OPEN_FLAG_OPTIONS,
      sortBy: [{ key: 'psiCode', order: 'asc' }],
      searchParams: {
        psiCode: "",
        psiName: "",
        cslCode: "",
        openFlag: "",
        transmissionMode: "",
      },
      searchResultsHeaders: [
        {
          key: "data-table-expand",
          title: "",
          sortable: false,
          editable: false,
        },
        {
          key: "psiCode",
          title: "PSI Code",
          sortable: true,
          editable: false,
          class: "text-left",
        },
        {
          key: "psiName",
          title: "PSI Name",
          sortable: true,
          editable: false,
        },
        {
          key: "cslCode",
          title: "CSL Code",
          sortable: false,
          editable: false,
          class: "text-left",
        },
        {
          key: "psisCode",
          title: "PSIS Code",
          sortable: false,
          editable: false,
          class: "text-center",
        },
        {
          key: "openFlag",
          title: "Active",
          sortable: false,
          editable: false,
          class: "text-center",
        },
        {
          key: "transmissionMode",
          title: "Transmission Mode",
          sortable: false,
          editable: false,
        },
      ],
    };
  },
  methods: {
    apiSearchParamsBuilder() {
      const apiSearchParams = {};
      const searchKeys = Object.keys(this.searchParams).filter((key) => {
        const value = this.searchParams[key];
        if (value === null || value === undefined) return false;
        return !(typeof value === "string" && value.trim() === "");

      });
      
      searchKeys.forEach((key) => {
        apiSearchParams[key] = this.searchParams[key];
      });
      
      return apiSearchParams;
    },
    clearInput() {
      this.searchResults = [];
      this.searchMessage = "";
      this.hasSearched = false;
      this.totalElements = 0;
      this.totalPages = 0;
      this.responseContent = null;
      this.sortBy = [{ key: 'psiCode', order: 'asc' }];
      this.searchParams = {
        psiCode: "",
        psiName: "",
        cslCode: "",
        openFlag: "",
        transmissionMode: "",
      };
    },
    keyHandler(e) {
      if (e.keyCode === 13) {
        this.onSearchClicked();
      }
    },
    onSearchClicked() {
      const hasSearchValue = Object.keys(this.searchParams).some((key) => {
        const value = this.searchParams[key];
        return value !== null && value !== undefined && value !== "";
      });
      
      if (!hasSearchValue) {
        this.searchMessage = "Enter at least one field to search.";
        return;
      }
      
      this.hasSearched = true;
      this.search();
    },
    search() {
      if (!this.hasSearched) {
        return;
      }
      this.searchLoading = true;
      
      // Build sort object from sortBy array
      const sort = {};
      if (this.sortBy && this.sortBy.length > 0) {
        this.sortBy.forEach((sortItem) => {
          sort[sortItem.key] = sortItem.order.toUpperCase();
        });
      } else {
        // Default sort on psiCode
        sort.psiCode = 'ASC';
      }
      
      SchoolsService.getPSIPaginated(
        this.apiSearchParamsBuilder(),
        sort,
        this.currentPage - 1,
        this.itemsPerPage
      )
        .then((response) => {
          if (response.data) {
            this.responseContent = response.data;
            this.searchResults = this.responseContent?.content || [];
            this.totalElements = this.responseContent.totalElements || 0;
            this.totalPages = this.responseContent.totalPages || 0;
            this.searchMessage =
              this.totalElements === 1
                ? "1 Post Secondary Institution found."
                : `${this.totalElements} Post Secondary Institutions found.`;
          }
        })
        .catch((error) => {
          if (error?.response?.status) {
            this.snackbarStore.showSnackbar(
              "ERROR " + error?.response?.statusText,
              "error",
              10000,
              "There was an error with the PSI Service: " + error?.response?.status
            );
          } else {
            this.snackbarStore.showSnackbar(
              "Failed to search PSIs",
              "error",
              5000
            );
          }
          this.searchResults = [];
          this.totalElements = 0;
          this.totalPages = 0;
        })
        .finally(() => {
          this.searchLoading = false;
        });
    },
    updateDataTable({ page }) {
      this.currentPage = page;
      this.search();
    },
  },
};
</script>

<style scoped>

</style>
