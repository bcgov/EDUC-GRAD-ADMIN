<template>
  <div class="assessments-view">
    <h1>Assessments</h1>
    <div>
      <v-card no-body>
        <v-tabs v-model="tab" bg-color="primary" grow>
          <v-tab value="assessmentTab" class="text-none" size="large"
            >Assessments</v-tab
          >
          <v-tab
            value="assessmentRequirementsTab"
            class="text-none"
            size="large"
            >Assessment Requirements</v-tab
          >
        </v-tabs>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="assessmentTab">
              <Assessments />
            </v-window-item>
            <v-window-item value="assessmentRequirementsTab">
              <AssessmentRequirements />
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import AssessmentRequirements from "@/components/assessments/AssessmentRequirements.vue";
import Assessments from "@/components/assessments/Assessments.vue";
export default {
  name: "assessments",
  components: {
    AssessmentRequirements: AssessmentRequirements,
    Assessments: Assessments,
  },
  data() {
    return {
      tab: null,
    };
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
