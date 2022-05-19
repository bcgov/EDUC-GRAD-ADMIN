<template>
  <div class="assessments-view">
    <h1>Assessments</h1>
    <div>
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Assessment" active>
            <b-card-text v-if="assessments">
              <DisplayTable
                title="Assessments"
                v-bind:items="assessments"
                v-bind:fields="assessmentFields"
                id="assessmentCode"
                v-bind:role="role"
                showFilter="true"
              >
              </DisplayTable>
            </b-card-text>
          </b-tab>
          <b-tab title="Assessment requirements">
            <b-card-text v-if="assessmentRequirements">
              <DisplayTable
                title="Assessment requirements"
                v-bind:items="assessmentRequirements"
                v-bind:fields="assessmentRequirementsFields"
                id="assessmentCode"
                showFilter="true"
              >
              </DisplayTable>
            </b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import AssessmentService from "@/services/AssessmentService.js";
import DisplayTable from "@/components/DisplayTable.vue";
export default {
  name: "assessments",
  components: {
    DisplayTable: DisplayTable,
  },
  data() {
    return {
      assessments: [],
      assessmentRequirements: [],
      assmtCode: "",
      assessmentFields: [
        {
          key: "assessmentCode",
          label: "Assessment code",
          sortable: true,
          sortDirection: "desc",
          class: "w-15",
        },
        {
          key: "assessmentName",
          label: "Assessment name",
          sortable: true,
          class: "w-40",
        },
        {
          key: "language",
          label: "Language",
          sortable: true,
          sortDirection: "desc",
          class: "w-5 text-center",
        },
        {
          key: "startDate",
          label: "Start date",
          sortable: true,
          class: "w-20",
        },
        {
          key: "endDate",
          label: "End date",
          sortable: true,
          class: "w-20",
        },
      ],

      assessmentRequirementsFields: [
        {
          key: "assessmentCode",
          label: "Assessment code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "assessmentName",
          label: "Assessment name",
          sortable: true,
        },
        {
          key: "ruleCode",
          label: "Rule#",
          sortable: true,
        },
        {
          key: "traxReqNumber",
          label: "Transcript Req #",
          sortable: true,
        },
        {
          key: "requirementName",
          label: "Requirement name",
          sortable: true,

        },
        {
          key: "requirementProgram",
          label: "Requirement program",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      token: "getToken",
      role: "getRoles"
    }),
  },
  created() {
    this.getAllAssessment();
    this.getAllAssessmentReqs();
  },
  methods: {
    getAllAssessment() {
      AssessmentService.getAllAssesments(this.token)
        .then((response) => {
          this.assessments = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.$bvToast.toast("ERROR " + error.response.statusText, {
            title: "ERROR" + error.response.status,
            variant: "danger",
            noAutoHide: true,
          });
        });
    },
    getAllAssessmentReqs() {
      AssessmentService.getAllAssesmentRequirements(this.token)
        .then((response) => {
          this.assessmentRequirements = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          this.$bvToast.toast("ERROR " + error.response.statusText, {
            title: "ERROR" + error.response.status,
            variant: "danger",
            noAutoHide: true,
          });
        });
    },
  },
};
</script>

<style scoped>
.assessments-view{
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
