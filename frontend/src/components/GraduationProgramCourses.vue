<template>
  <div>
    <div v-if="graduationProgramRuleCourses == 'not applicable'">
      Not applicable
    </div>

    <div v-else>
      <DisplayTable
        v-bind:items="graduationProgramRuleCourses"
        title="Program"
        v-bind:fields="fields"
        id="courseName"
        showFilter="true"
        pagination="true"
      >
      </DisplayTable>
    </div>
  </div>
</template>

<script>
import AssessmentService from "@/services/AssessmentService.js";
import CourseService from "@/services/CourseService.js";
import DisplayTable from "@/components/DisplayTable";
export default {
  name: "GraduationProgramCourses",
  props: {},
  components: {
    DisplayTable: DisplayTable,
  },
  data: function () {
    return {
      opened: [],
      selectedRule: "",
      category: "",
      ruleName: "",
      programCode: "",
      isOptionalProgram: "",
      graduationProgramRuleCourses: [],
      fields: [],
      courseFields: [
        {
          key: "courseCode",
          label: "Course",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "courseLevel",
          label: "Course Level",
          sortable: true,
          editable: true,
        },
        {
          key: "courseName",
          label: "Course Title",
          sortable: true,
          editable: true,
        },
        {
          key: "startDate",
          label: "TRAX Start Date",
          sortable: true,
          editable: true,
        },
        {
          key: "endDate",
          label: "TRAX End Date",
          sortable: true,
          editable: true,
        },
      ],
      assessmentFields: [
        {
          key: "assessmentCode",
          label: "Assessment Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "assessmentName",
          label: "Assessment Name",
          sortable: true,
          editable: true,
        },
      ],
    };
  },
  created() {
    this.selectedRule = this.$route.params.rule;
    this.category = this.$route.params.category;
    this.ruleName = this.$route.params.ruleName;
    this.programCode = this.$route.params.programCode;
    this.isOptionalProgram = this.$route.params.isOptionalProgram;
    if (this.$route.params.category == "A") {
      AssessmentService.getRuleCourseRequirements(this.$route.params.rule).then(
        (response) => {
          this.fields = this.assessmentFields;
          this.graduationProgramRuleCourses = response.data;

          if (!this.graduationProgramRuleCourses.length) {
            this.graduationProgramRuleCourses = "not applicable";
          }
        }
      );
    }
    if (this.$route.params.category == "C") {
      CourseService.getRuleCourseRequirements(this.$route.params.rule).then(
        (response) => {
          this.fields = this.courseFields;
          this.graduationProgramRuleCourses = response.data;

          if (!this.graduationProgramRuleCourses.length) {
            this.graduationProgramRuleCourses = "not applicable";
          }
        }
      );
    }
  },
  methods: {},
};
</script>

<style>
.table th {
  border-bottom: 2px solid #38598a !important;
}
</style>
