<template>
  <div>
    <h3 class="ml-3 mt-5">Assessments</h3>
    <DisplayTable
      v-if="assessments"
      v-bind:items="assessments"
      v-bind:fields="assessmentFields"
      id="assessmentCode"
      showFilter="true"
    >
    </DisplayTable>
  </div>
</template>

<script>
import AssessmentService from "@/services/AssessmentService.js";
import { useSnackbarStore } from "@/store/modules/snackbar";
import DisplayTable from "@/components/DisplayTable.vue";

export default {
  name: "Assessments",
  components: {
    DisplayTable: DisplayTable,
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      assessments: [],
      assessmentFields: [
        {
          key: "assessmentCode",
          title: "Assessment Code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "assessmentName",
          title: "Assessment Name",
          sortable: true,
          class: "w-40",
        },
        {
          key: "language",
          title: "Language",
          sortable: true,
          sortDirection: "desc",
          class: "w-5 text-center",
        },
        {
          key: "startDate",
          title: "Start Date",
          sortable: true,
          class: "w-20",
        },
        {
          key: "endDate",
          title: "End Date",
          sortable: true,
          class: "w-20",
        },
      ],
    };
  },
  created() {
    this.getAllAssessment();
  },
  methods: {
    getAllAssessment() {
      AssessmentService.getAllAssesments()
        .then((response) => {
          this.assessments = response.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error("API error:", error);
          this.snackbarStore.showSnackbar(error.message, "error", 5000);
        });
    },
  },
};
</script>
