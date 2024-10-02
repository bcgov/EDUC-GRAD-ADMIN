<template>
  <v-card-text class="mt-12">
    <DisplayTable
      title="Course restrictions"
      v-bind:items="courseRestrictions"
      v-bind:fields="courseRestrictionFields"
      id="courseRestrictionId"
      :showFilter="true"
      pagination="true"
    >
    </DisplayTable>
  </v-card-text>
</template>
<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import CourseService from "@/services/CourseService.js";
import DisplayTable from "@/components/DisplayTable.vue";

export default {
  name: "CourseRestrictions",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    this.getAllCourseRestrictions();
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      courseRestrictions: [],
      courseRestrictionFields: [
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
      ],
    };
  },
  methods: {
    getAllCourseRestrictions() {
      CourseService.getCourseRestrictions()
        .then((response) => {
          this.courseRestrictions = response.data;
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
          // eslint-disable-next-line
          console.log("There was an error:" + error);
        });
    },
  },
};
</script>
<style scoped></style>
