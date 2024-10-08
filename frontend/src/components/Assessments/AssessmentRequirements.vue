<template>
  <div>
    <h3 class="ml-3 mt-5">Assessment Requirements</h3>
    <DisplayTable
      v-if="assessmentRequirements"
      v-bind:items="assessmentRequirements"
      v-bind:fields="assessmentRequirementsFields"
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
  name: "AssessmentRequirements",
  components: {
    DisplayTable: DisplayTable,
  },
  data() {
    return {
      snackbarStore: useSnackbarStore(),
      assessmentRequirements: [],
      assessmentRequirementsFields: [
        {
          key: "assessmentCode",
          title: "Assessment Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "assessmentName",
          title: "Assessment Name",
          sortable: true,
        },
        {
          key: "ruleCode",
          title: "Rule#",
          sortable: true,
        },
        {
          key: "traxReqNumber",
          title: "Transcript Req #",
          sortable: true,
        },
        {
          key: "requirementName",
          title: "Requirement Name",
          sortable: true,
        },
        {
          key: "requirementProgram",
          title: "Requirement Program",
          sortable: true,
        },
      ],
    };
  },
  created() {
    this.getAllAssessmentReqs();
  },
  methods: {
    getAllAssessmentReqs() {
      AssessmentService.getAllAssesmentRequirements()
        .then((response) => {
          this.assessmentRequirements = response.data;
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

<style scoped></style>
