<template>
  <div>
    <div v-if="!exams" class="container">
      This student does not have any exams.
    </div>
    <DisplayTable
      :items="exams"
      :fields="fields"
      showFilter="true"
      title="Assessments"
    >
      <template #cell(sessionDate)="row">
        {{ row.value | formatYYYYMMDate }}
      </template>
    </DisplayTable>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DisplayTable from "@/components/DisplayTable.vue";
export default {
  name: "StudentExams",
  props: {},
  computed: {
    ...mapGetters({
      exams: "student/getStudentExams",
    }),
  },
  components: {
    DisplayTable: DisplayTable,
  },
  data: function () {
    return {
      // show: false,
      // opened: [],
      // student: [],
      // examsList: [],
      // filters: {
      //   name: { value: "", keys: ["courseCode"] },
      // },
      // pen: "",
      // courseCode: "",
      // courseName: "",
      // courseLevel: "",
      // sessionDate: "",
      // gradReqMet: "",
      // courseType: "",
      // completedCourseSchoolPercentage: null,
      // completedCourseExamPercentage: null,
      // completedCourseFinalPercentage: null,
      // completedCourseLetterGrade: "",
      // interimPercent: null,
      // interimLetterGrade: "",
      // credits: null,
      // creditsUsedForGrad: null,
      // reqMetLiteracyNumeracy: "",
      // wroteFlag: "",
      // specialCase: " ",
      // currentPage: 1,
      // totalPages: 0,
      // displayMessage: null,
      // modalVisible: null,
      // inputPenMissing: false,
      fields: [
        { key: "more", label: "" },
        {
          key: "courseCode",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "courseLevel",
          label: "Level",
          sortable: true,
          class: "text-md-center",
        },
        {
          key: "sessionDate",
          label: "Session",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "completedSchoolPercentage",
          label: "School %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "bestSchoolPercentage",
          label: "Best School %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "optIn",
          label: "Opt In",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "specialCase",
          label: "Special Case",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "wroteFlag",
          label: "Wrote Exam",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "completedCourseExamPercentage",
          label: "Exam %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "bestExamPercentage",
          label: "Best Exam %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "completedCourseFinalPercentage",
          label: "Final %",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
        {
          key: "completedCourseLetterGrade",
          label: "Final LG",
          sortable: true,
          sortDirection: "desc",
          class: "text-md-center",
        },
      ],
    };
  },
  methods: {
    // toggle(id) {
    //   const index = this.opened.indexOf(id);
    //   if (index > -1) {
    //     this.opened.splice(index, 1);
    //   } else {
    //     this.opened.push(id);
    //   }
    // },
    // showMsgBoxOne(message) {
    //   this.$bvModal.msgBoxOk(message);
    // },
    // getCourseName: function(cid) {
    //   let result = "";
    //   this.courses.filter(function(n) {
    //     if (n.id === cid) {
    //       result = n.name;
    //       return result;
    //     }
    //   });
    //   return result;
    // },
  },
};
</script>

<style>
.table th,
.table td {
  border-top: none !important;
}
</style>
