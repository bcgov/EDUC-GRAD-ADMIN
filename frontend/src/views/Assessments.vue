<template>
  <div class="assessments-view">
    <h1>Assessments</h1>
    <div>
      <v-card no-body>
        <v-tabs v-model="tab" bg-color="bcGovLightGrey">
          <v-tab value="assessmentLegacyTab" class="text-none" size="large"
            >Assessments</v-tab
          >
          <v-tab v-if="enableCRUD()" value="assessmentTab" class="text-none" size="large">
            Assessments
            <p class="text-caption font-weight-bold text-bcGovGold">
              BETA
            </p>
          </v-tab>
          <v-tab
            value="assessmentRequirementsTab"
            class="text-none"
            size="large"
            >Assessment Requirements</v-tab
          >
        </v-tabs>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="assessmentLegacyTab">
              <AssessmentsLegacy />
            </v-window-item>
            <v-window-item v-if="enableCRUD()" value="assessmentTab">
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
import AssessmentRequirements from "@/components/Assessments/AssessmentRequirements.vue";
import AssessmentsLegacy from "@/components/Assessments/AssessmentsLegacy.vue";
import Assessments from "@/components/Assessments/Assessments.vue";
import {mapState} from "pinia";
import {useAppStore} from "@/store/modules/app";
export default {
  name: "assessments",
  components: {
    AssessmentRequirements: AssessmentRequirements,
    AssessmentsLegacy: AssessmentsLegacy,
    Assessments: Assessments,
  },
  computed: {
    ...mapState(useAppStore, { enableCRUD: "enableCRUD" }),
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
