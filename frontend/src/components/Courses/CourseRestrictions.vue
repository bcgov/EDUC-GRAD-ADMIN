<template>
  <div>
    <v-row class="align-center ml-2 mt-5 mr-3 mb-0">
      <v-col cols="auto">
        <h3 class="my-0">Course Restrictions</h3>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <DownloadLink
            label="Course Restrictions"
            icon="mdi-download"
            :downloadAction="CourseService.downloadCourseRestrictionsCSV"
            :disabled="isRefreshing"
            @success="snackbarStore.showSnackbar('CSV downloaded successfully', 'success', 3000)"
            @error="snackbarStore.showSnackbar('Error downloading CSV', 'error', 5000)"
        />
      </v-col>
      <v-col cols="auto" v-if="enableCRUD">
        <CourseRestrictionsCreateForm
          :disabled="isRefreshing"
          @restriction-created="onRestrictionCreated"
        />
      </v-col>

    </v-row>
    <v-spacer />
    <v-row no-gutters>
      <v-row id="filter" class="mt-4">
        <v-col lg="8" class="px-0 float-left"></v-col>
        <v-col sm="12" lg="4" class="my-1 pr-3 table-filter p-0">
          <v-row>
            <v-col cols="12">
              <v-form>
                <v-text-field
                  v-model="rawSearchInput"
                  @update:modelValue="onSearchInput"
                  label="Filter"
                  variant="outlined"
                  density="comfortable"
                  debounce="500"
                  placeholder=""
                  append-icon="mdi-close"
                  @click:append="clearSearchInput"
                  class="mt-2"
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-data-table
        v-if="courseRestrictions.length > 0"
        v-model="selected"
        :items="courseRestrictions"
        :headers="courseRestrictionHeaders"
        :item-value="(item) => item"
        :items-per-page="defaultItemsPerPage"
        title="courseRestriction"
        :search="search"
        :loading="isRefreshing"
        loading-text="Refreshing course restrictions..."
      >
        <template v-slot:item.restrictionStartDate="{ item }">
          {{ $filters.formatYYYYMMDate(item.restrictionStartDate) }}
        </template>
        <template v-slot:item.restrictionEndDate="{ item }">
          {{ $filters.formatYYYYMMDate(item.restrictionEndDate) }}
        </template>
        <template v-slot:item.edit="{ item }" v-if="enableCRUD">
          <CourseRestrictionsUpdateForm
            :selectedCourseRestrictionToUpdate="item"
            :disabled="isRefreshing"
            @restriction-updated="onRestrictionUpdated"
          >
          </CourseRestrictionsUpdateForm>
        </template>
      </v-data-table>
    </v-row>
  </div>
</template>
<script>
import { useAppStore } from "@/store/modules/app";
import { useSnackbarStore } from "@/store/modules/snackbar";
import { mapState } from "pinia";
import CourseRestrictionsCreateForm from "@/components/Courses/Forms/CourseRestrictionsCreateForm.vue";
import CourseRestrictionsUpdateForm from "@/components/Courses/Forms/CourseRestrictionsUpdateForm.vue";
import DownloadLink from "@/components/Common/DownloadLink.vue";
import CourseService from "@/services/CourseService.js";

export default {
  name: "CourseRestrictions",
  components: {
    CourseRestrictionsCreateForm,
    CourseRestrictionsUpdateForm,
    DownloadLink,
  },
  async beforeMount() {
    await this.loadData();
  },
  computed: {
    ...mapState(useAppStore, ["enableCRUD"]),
    CourseService() {
      return CourseService;
    },

    courseRestrictionHeaders() {
      const tableHeaders = [
        {
          key: "mainCourse",
          title: "Course Code Main",
          sortable: true,
          class: "text-left",
        },
        {
          key: "mainCourseLevel",
          title: "Course Level Main",
          sortable: true,
          class: "text-left",
        },
        {
          key: "restrictedCourse",
          title: "Course Code Restricted",
          sortable: true,
          class: "text-left",
        },
        {
          key: "restrictedCourseLevel",
          title: "Course Level Restricted",
          sortable: true,
          class: "text-left",
        },
        {
          key: "restrictionStartDate",
          title: "Restriction Start Date",
          sortable: true,
          class: "text-left",
        },
        {
          key: "restrictionEndDate",
          title: "Restriction End Date",
          sortable: true,
          class: "text-left",
        },
      ];

      if (this.enableCRUD) {
        tableHeaders.push({
          key: "edit",
          title: "Edit",
          cellProps: {
            style: "vertical-align: baseline;",
            class: "pt-5 pb-5",
          },
        });
      }

      return tableHeaders;
    },
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      defaultItemsPerPage: 20,
      rawSearchInput: "",
      search: "",
      selected: [],
      isRefreshing: false,
      courseRestrictions: [], // Always fetched fresh from backend cache
    };
  },
  methods: {
    async loadData() {
      try {
        const response = await CourseService.getCourseRestrictions();
        this.courseRestrictions = response.data || [];
      } catch (error) {
        console.error('Error loading course restrictions:', error);
        this.snackbarStore.showSnackbar('Error loading course restrictions', 'error', 5000);
      }
    },
    onSearchInput(value) {
      this.search = value?.replace("-", "/");
    },
    clearSearchInput() {
      this.search = "";
      this.rawSearchInput = "";
    },
    async onRestrictionCreated() {
      this.isRefreshing = true;
      try {
        await CourseService.waitForCacheRefresh();
        await this.loadData();
      } catch (error) {
        console.error('Error after creating restriction:', error);
        this.snackbarStore.showSnackbar('Created successfully but error refreshing list', 'warning', 5000);
      } finally {
        this.isRefreshing = false;
      }
    },
    async onRestrictionUpdated() {
      this.isRefreshing = true;
      try {
        await CourseService.waitForCacheRefresh();
        await this.loadData();
      } catch (error) {
        console.error('Error after updating restriction:', error);
        this.snackbarStore.showSnackbar('Updated successfully but error refreshing list', 'warning', 5000);
      } finally {
        this.isRefreshing = false;
      }
    },
  },
};
</script>
<style scoped>
</style>
