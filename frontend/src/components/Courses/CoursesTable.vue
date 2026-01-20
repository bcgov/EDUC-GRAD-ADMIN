<template>
  <div>
    <v-row class="align-center ml-2 mt-5 mr-3 mb-0">
      <v-col cols="auto">
        <h3 class="my-0">Courses</h3>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <DownloadLink
          label="Courses"
          icon="mdi-download"
          :downloadAction="downloadCourses"
          @success="snackbarStore.showSnackbar('CSV downloaded successfully', 'success', 3000)"
          @error="snackbarStore.showSnackbar('Error downloading CSV', 'error', 5000)"
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
                  placeholder="Search by course name"
                  append-icon="mdi-close"
                  @click:append="clearSearchInput"
                  class="mt-2"
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-data-table-server
        v-model="selected"
        :items="courses"
        :headers="courseHeaders"
        :items-length="totalCourses"
        :loading="loading"
        @update:options="loadCourses"
        title="courses"
      >
        <template v-slot:item.courseCode="{ item }">
          {{ getCourseCode(item) }}
        </template>
        <template v-slot:item.courseLevel="{ item }">
          {{ getCourseLevel(item) }}
        </template>
        <template v-slot:item.status="{ item }">
          {{ getStatus(item) }}
        </template>
        <template v-slot:item.startDate="{ item }">
          {{ $filters.formatSimpleDate(item.startDate) }}
        </template>
        <template v-slot:item.endDate="{ item }">
          {{ item.endDate ? $filters.formatSimpleDate(item.endDate) : '' }}
        </template>
        <template v-slot:item.completionEndDate="{ item }">
          {{ item.completionEndDate ? $filters.formatSimpleDate(item.completionEndDate) : '' }}
        </template>
        <template v-slot:item.credits="{ item }">
          {{ getCredits(item) }}
        </template>
        <template v-slot:item.generic="{ item }">
          {{ item.genericCourseType === 'G' ? 'Y' : 'N' }}
        </template>
        <template v-slot:item.instructionLanguage="{ item }">
          {{ getInstructionLanguage(item) }}
        </template>
      </v-data-table-server>
    </v-row>
  </div>
</template>

<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import CourseService from "@/services/CourseService.js";
import DownloadLink from "@/components/Common/DownloadLink.vue";

export default {
  name: "CoursesTable",
  components: {
    DownloadLink,
  },
  beforeUnmount() {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      loading: false,
      rawSearchInput: "",
      search: "",
      selected: [],
      courses: [],
      totalCourses: 0,
      searchDebounceTimer: null,
    };
  },
  computed: {
    courseHeaders() {
      return [
        {
          key: "courseCode",
          title: "Code",
          sortable: false,
          class: "text-left",
        },
        {
          key: "courseLevel",
          title: "Level",
          sortable: false,
          class: "text-left",
        },
        {
          key: "status",
          title: "Status",
          sortable: false,
          class: "text-left",
        },
        {
          key: "courseTitle",
          title: "Name",
          sortable: true,
          class: "text-left",
        },
        {
          key: "startDate",
          title: "Open Date",
          sortable: true,
          class: "text-left",
        },
        {
          key: "endDate",
          title: "Close Date",
          sortable: true,
          class: "text-left",
        },
        {
          key: "completionEndDate",
          title: "Completion Date",
          sortable: true,
          class: "text-left",
        },
        {
          key: "credits",
          title: "Credits",
          sortable: false,
          class: "text-left",
        },
        {
          key: "generic",
          title: "Generic",
          sortable: true,
          class: "text-left",
        },
        {
          key: "instructionLanguage",
          title: "Instruction Language",
          sortable: false,
          class: "text-left",
        },
      ];
    },
  },
  methods: {
    async loadCourses(options) {
      this.loading = true;
      try {
        const { page, itemsPerPage, sortBy } = options;

        // sort by course ID desc as default
        const sortCriteria = sortBy && sortBy.length > 0 ? { [sortBy[0].key]: sortBy[0].order } : { courseID: 'desc' };

        const response = await CourseService.getCoursePaginated(
          page - 1,
          itemsPerPage,
          sortCriteria,
          this.getSearchCriteria()
        );

        this.courses = response.data.content;
        this.totalCourses = response.data.totalElements;
      } catch (error) {
        console.error("Error loading courses:", error);
        this.snackbarStore.showSnackbar(
          "Error loading courses",
          "error",
          5000
        );
      } finally {
        this.loading = false;
      }
    },
    // basic search on course title
    getSearchCriteria() {
      if (!this.search) return [];

      return [
        {
          condition: "AND",
          searchCriteriaList: [
            {
              key: "courseTitle",
              operation: "like",
              value: `%${this.search}%`,
              valueType: "STRING",
              condition: "AND"
            }
          ]
        }
      ];
    },
    getCourseCode(item) {
      if (item.courseCode && item.courseCode.length > 0) {
        const code39 = item.courseCode.find(code => code.originatingSystem === '39');
        if (code39 && code39.externalCode) {
          return code39.externalCode.substring(0, 5).trim();
        }
      }
      return "";
    },
    getCourseLevel(item) {
      if (item.courseCode && item.courseCode.length > 0) {
        const code39 = item.courseCode.find(code => code.originatingSystem === '39');
        if (code39 && code39.externalCode) {
          const externalCode = code39.externalCode;
          return externalCode.substring(externalCode.length - 3).trim();
        }
      }
      return "";
    },
    getStatus(item) {
      const now = new Date();
      const endDate = item.endDate ? new Date(item.endDate) : null;

      if (!endDate || endDate > now) {
        return "Open";
      }
      return "Closed";
    },
    getCredits(item) {
      if (item.courseAllowableCredit && item.courseAllowableCredit.length > 0) {
        const credits = item.courseAllowableCredit
          .map((credit) => credit.creditValue)
          .filter((credit) => credit !== null && credit !== undefined)
          .map((credit) => parseFloat(credit))
          .sort((a, b) => a - b)
          .join(", ");
        return credits || "";
      }
      return "";
    },
    getInstructionLanguage(item) {
      if (item.courseCharacteristics && item.courseCharacteristics.description) {
        return item.courseCharacteristics.description;
      }
      return "";
    },
    onSearchInput(value) {
      this.search = value?.replace("-", "/");

      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }

      this.searchDebounceTimer = setTimeout(() => {
        this.loadCourses({
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
        });
      }, 500);
    },
    clearSearchInput() {
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
        this.searchDebounceTimer = null;
      }

      this.search = "";
      this.rawSearchInput = "";
      this.loadCourses({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
      });
    },
    downloadCourses() {
      return CourseService.downloadCoursesCSV();
    },
  },
};
</script>

<style scoped></style>
