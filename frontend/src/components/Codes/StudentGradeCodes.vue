<template>
    <div>
      <h3 class="ml-2 mt-5">Student Grade Codes</h3>
      <p class="ml-2 w-66">
        Student grade codes refer to a students' grade codes in the GRAD system.
      </p>
      <DisplayTable
        v-bind:items="studentGradeCodes"
        v-bind:fields="studentGradeCodesFields"
        id="code"
        showFilter="true"
      >
      </DisplayTable>
    </div>
  </template>
  
  <script>
  import DisplayTable from "@/components/DisplayTable.vue";
  import StudentService from "@/services/StudentService.js";
  import { applyDisplayOrder } from "@/utils/common.js";
  import { useSnackbarStore } from "@/store/modules/snackbar";
  export default {
    name: "GradeCodes",
    components: {
      DisplayTable: DisplayTable,
    },
    created() {
      StudentService.getStudentGradeCodes()
        .then((response) => {
          this.studentGradeCodes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
        });
    },
    data: function () {
      return {
        snackbarStore: useSnackbarStore(),
        studentGradeCodes: [],
        studentGradeCodesFields: [
          {
            key: "studentGradeCode",
            title: "Code",
            sortable: true,
            sortDirection: "desc",
            class: "w-15",
          },
          {
            key: "label",
            title: "Label",
            sortable: true,
          },
          {
            key: "description",
            title: "Description",
            sortable: true,
          }
        ],
      };
    },
    computed: {
    sortedStudentGradeCodes() {
      return applyDisplayOrder(this.studentGradeCodes);
    },
  },
    methods: {},
  };
  </script>
  
  <style>
  .table th,
  .table td {
    border-top: none !important;
  }
  </style>
  