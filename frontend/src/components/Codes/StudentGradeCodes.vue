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
  import { useSnackbarStore } from "@/store/modules/snackbar";
  import { mapState, mapActions } from "pinia";
  import { useAppStore } from "@/store/modules/app";
  export default {
    name: "GradeCodes",
    components: {
      DisplayTable: DisplayTable,
    },
    async beforeMount() {
    try {
      await this.getStudentGradeCodes(false);
    } catch (e) {
      if (e.response.status) {
        this.snackbarStore.showSnackbar(
          "There was an error: " + e.response.status,
          "error",
          5000
        );
      }
    }
  },
    data: function () {
      return {
        snackbarStore: useSnackbarStore(),
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
    ...mapState(useAppStore, {
      studentGradeCodes: "getGradeCodes",
    }),
  },
    methods: {
      ...mapActions(useAppStore, ["getStudentGradeCodes"]),
    },
  };
  </script>
  
  <style>
  .table th,
  .table td {
    border-top: none !important;
  }
  </style>
  