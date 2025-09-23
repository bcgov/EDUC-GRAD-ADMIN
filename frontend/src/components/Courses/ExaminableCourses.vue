<template>
  <div>
    <h3 class="ml-2 mt-5">Examinable Courses</h3>
    <p>
      Courses are listed by graduation program code(s)*. For courses completed within the examinable date range, the
      student must have written the provincial exam to earn a final mark and completed the course. When editing or
      updating a provincially examinable course, please follow these instructions.
    </p>

    <p>
      Use the Q-coded version if the course was completed outside B.C. or if the student was on the Adult Graduation
      Program at the time of course completion.
    </p>

    <p>
      *"2004+" refers to all program codes from 2004 onward.
    </p>
    <BlendingRules :expand="$route.path === '/courses/examinable-courses/blending-rules'" class="message" />

    <DisplayTable title="Examinable Courses" v-bind:items="examinableCourses" v-bind:fields="examinableCoursesFields"
      id="examinableCourseID" :showFilter="true" pagination="true" class="">
      <template #item.programYear="{ item }">
        {{ item.programYear ?? '2004+' }}
      </template>

    </DisplayTable>
  </div>
</template>
<script>
import { useSnackbarStore } from "@/store/modules/snackbar";
import CourseService from "@/services/CourseService.js";
import DisplayTable from "@/components/DisplayTable.vue";
import BlendingRules from "@/components/Common/BlendingRules.vue";

export default {
  name: "ExaminableCourses",
  components: {
    DisplayTable: DisplayTable,
    BlendingRules: BlendingRules,
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
<style scoped>
.message {
  margin-bottom: 100px
}
</style>
