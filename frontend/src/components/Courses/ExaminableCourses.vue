<template>
  <div>
    <h3 class="ml-2 mt-5">Examinable Courses</h3>
    <DisplayTable
      title="Examinable Courses"
      v-bind:items="examinableCourses"
      v-bind:fields="examinableCoursesFields"
      id="examinableCourseID"
      :showFilter="true"
      pagination="true"
    >
    </DisplayTable>
  </div>
</template>
<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import CourseService from "@/services/CourseService.js";
import DisplayTable from "@/components/DisplayTable.vue";

export default {
  name: "ExaminableCourses",
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
    this.getAllExaminableCourses();
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      examinableCourses: [],
      examinableCoursesFields: [
        {
          key: "courseCode",
          title: "Course Code",
          sortable: true,
          class: "text-left",
        },
        {
          key: "courseLevel",
          title: "Course Level",
          sortable: true,
          class: "text-left",
        },
        {
          key: "programYear",
          title: "Program Year",
          sortable: true,
          class: "text-left",
        },
        {
          key: "schoolWeightPercent",
          title: "% School Weight",
          sortable: true,
          class: "text-left",
        },
        {
          key: "examWeightPercent",
          title: "% Exam Weight",
          sortable: true,
          class: "text-left",
        },
        {
          key: "schoolWeightPercentPre1989",
          title: "% School Weight (Before 1989/08)",
          sortable: true,
          class: "text-left",
        },
        {
          key: "examWeightPercentPre1989",
          title: "% Exam Weight (Before 1989/08)",
          sortable: true,
          class: "text-left",
        },
        {
          key: "courseTitle",
          title: "Course Title",
          sortable: true,
          class: "text-left",
        },
        {
          key: "examinableStart",
          title: "Examinable Start",
          sortable: true,
          class: "text-left",
        },
        {
          key: "examinableEnd",
          title: "Examinable End",
          sortable: true,
          class: "text-left",
        }
      ],
    };
  },
  methods: {
    getAllExaminableCourses() {
      CourseService.getCourseExaminableCourses()
        .then((response) => {
          this.examinableCourses = response.data;
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
