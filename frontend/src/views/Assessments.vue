<template>
  <div class="assessments-view">
    <h1>Assessments</h1>
    <Snackbar
      v-model="snackbarVisible"
      :message="snackbarMessage"
      color="error"
    />
    <div>
      <v-card no-body>
        <v-tabs v-model="tab" bg-color="transparent" grow>
          <v-tab value="assessmentTab" color="primary">Assessments</v-tab>
          <v-tab value="assessmentRequirementsTab" color="primary"
            >Assessment Requirements</v-tab
          >
        </v-tabs>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="assessmentTab">
              <DisplayTable
                v-if="assessments"
                v-bind:items="assessments"
                v-bind:fields="assessmentFields"
                id="assessmentCode"
                showFilter="true"
              >
              </DisplayTable>
            </v-window-item>
            <v-window-item value="assessmentRequirementsTab">
              <DisplayTable
                v-if="assessmentRequirements"
                v-bind:items="assessmentRequirements"
                v-bind:fields="assessmentRequirementsFields"
                id="assessmentCode"
                showFilter="true"
              >
              </DisplayTable>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import AssessmentService from "@/services/AssessmentService.js";
import DisplayTable from "@/components/DisplayTable.vue";
import Snackbar from "@/components/Common/Snackbar.vue";
export default {
  name: "assessments",
  components: {
    DisplayTable: DisplayTable,
    Snackbar: Snackbar,
  },
  data() {
    return {
      tab: null,
      snackbarVisible: false,
      snackbarMessage: "",
      assessments: [],
      assessmentRequirements: [],
      assmtCode: "",
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
    this.getAllAssessment();
    this.getAllAssessmentReqs();
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
          this.snackbarMessage = error.message;
          this.snackbarVisible = true;
        });
    },
    getAllAssessmentReqs() {
      AssessmentService.getAllAssesmentRequirements()
        .then((response) => {
          this.assessmentRequirements = response.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error("API error:", error);
          this.snackbarMessage = error.message;
          this.snackbarVisible = true;
        });
    },
  },
};
</script>

<style scoped>
.assessments-view {
  padding-left: 25px;
  padding-right: 25px;
}
.close-record {
  float: right;
}

.tab-loading {
  color: green !important;
}

.profile-name {
  padding-bottom: 10px;
}
</style>
