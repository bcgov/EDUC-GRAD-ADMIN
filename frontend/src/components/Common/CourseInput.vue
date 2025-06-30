<template>
  <v-card flat class="p-0 m-0">
    <v-row>
      <v-col>
        <v-text-field v-model="localCourse.courseCode" label="Course Code" @input="onInput" :disabled="loading"
          variant="outlined" density="compact" class="my-2" hide-details persistent-placeholder persistent-hint />
      </v-col>
      <v-col>
        <v-text-field v-model="localCourse.courseLevel" label="Course Level" @input="onInput" :disabled="loading"
          variant="outlined" density="compact" class="my-2" hide-details persistent-placeholder persistent-hint />
      </v-col>
    </v-row>

    <!-- Loading Spinner -->
    <v-row v-if="loading" justify="center" class="mt-2">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <!-- Course Info Panel -->
    <v-expansion-panels v-if="localCourse.courseName && !notFound && !loading" class="mt-2">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <div class="d-flex align-center justify-space-between w-100">
            <strong>{{ localCourse.courseName }}</strong>
            <OpenStatusBadge :openedDateString="localCourse.startDate" :closedDateString="localCourse.endDate" />
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row no-gutters>
            <v-col cols="6"><strong>Course Code:</strong> {{ localCourse.courseCode }}</v-col>
            <v-col cols="6"><strong>Course Level:</strong> {{ localCourse.courseLevel }}</v-col>
            <v-col cols="6"><strong>Language:</strong> {{ localCourse.language || "N/A" }}</v-col>
            <v-col cols="6"><strong>Generic Type:</strong> {{ localCourse.genericCourseType || "N/A" }}</v-col>
            <v-col cols="6"><strong>Start Date:</strong> {{ localCourse.startDate }}</v-col>
            <v-col cols="6"><strong>End Date:</strong> {{ localCourse.endDate }}</v-col>
            <v-col cols="6"><strong>Completion End Date:</strong> {{ localCourse.completionEndDate || "N/A" }}</v-col>
            <v-col cols="6"><strong>Credits:</strong> {{ localCourse.credits }}</v-col>
            <v-col cols="12"><strong>Course ID:</strong> {{ localCourse.courseID }}</v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Not Found Alert -->
    <v-alert type="error" v-if="notFound && !loading" dense text>
      Course not found
    </v-alert>
  </v-card>
</template>

<script>
import { debounce } from "lodash";
import CourseService from "@/services/CourseService";
import OpenStatusBadge from "@/components/Common/OpenStatusBadge.vue";

export default {
  name: "CourseInput",
  components: { OpenStatusBadge },
  props: {
    courseFound: {
      type: Object,
      default: () => ({}),
    },
    courseFoundID: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      localCourse: {
        courseID: '',
        courseCode: "",
        courseLevel: "",
        courseName: "",
        startDate: "",
        endDate: "",
      },
      notFound: false,
      loading: false,
      debouncedLookup: null,
    };
  },
  watch: {
    courseFound: {
      immediate: true,
      handler(newCourse) {
        if (newCourse && newCourse.courseID) {
          this.localCourse = { ...newCourse };
          this.notFound = false;
        }
      },
    },
    courseFoundID: {
      immediate: true,
      handler(newID) {
        // Only fetch if different from current localCourse.courseID
        if (newID && newID !== this.localCourse.courseID) {
          this.fetchCourseByID(newID);
        } else if (!newID) {
          // Clear localCourse if courseID cleared
          this.localCourse = {
            courseID: '',
            courseCode: "",
            courseLevel: "",
            courseName: "",
            startDate: "",
            endDate: "",
          };
          this.notFound = false;
        }
      },
    },
  },
  methods: {
    async fetchCourseByID(id) {
      this.loading = true;
      try {
        const { data } = await CourseService.getCourseByID(id);
        if (data?.courseName) {
          this.localCourse = { ...data };
          this.notFound = false;
          this.$emit("update:courseFound", data);
          this.$emit("update:courseFoundID", data.courseID);
        } else {
          this.notFound = true;
          this.localCourse = { courseID: id };
          this.$emit("update:courseFound", {});
          this.$emit("update:courseFoundID", "");
        }
      } catch (e) {
        this.notFound = true;
        this.localCourse = { courseID: id };
        this.$emit("update:courseFound", {});
        this.$emit("update:courseFoundID", "");
      } finally {
        this.loading = false;
      }
    },
    async fetchCourse() {
      const { courseCode, courseLevel } = this.localCourse;

      if (!courseCode || !courseLevel) {
        this.localCourse = { courseCode, courseLevel };
        this.notFound = false;
        this.loading = false;
        this.$emit("update:courseFound", {});
        this.$emit("update:courseFoundID", "");
        return;
      }

      this.loading = true;
      try {
        const { data } = await CourseService.getCourseByCodeAndLevel(
          courseCode,
          courseLevel
        );
        if (data?.courseName) {
          this.localCourse = { ...data };
          this.notFound = false;
          this.$emit("update:courseFound", data);
          this.$emit("update:courseFoundID", data.courseID);
        } else {
          this.notFound = true;
          this.localCourse = { courseCode, courseLevel };
          this.$emit("update:courseFound", {});
          this.$emit("update:courseFoundID", "");
        }
      } catch (e) {
        this.notFound = true;
        this.localCourse = { courseCode, courseLevel };
        this.$emit("update:courseFound", {});
        this.$emit("update:courseFoundID", "");
      } finally {
        this.loading = false;
      }
    },
    onInput() {
      this.debouncedLookup();
    },
  },
  created() {
    this.debouncedLookup = debounce(this.fetchCourse, 1000);
  },
};
</script>