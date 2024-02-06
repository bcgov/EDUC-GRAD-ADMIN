<template>
  <v-container class="programs-all">
    <h1>Programs</h1>

    <v-card>
      <v-card-title class="px-3">Program Management</v-card-title>
      <v-card-subtitle class="px-3">
        <v-tabs v-model="tab" background-color="transparent" color="blue">
          <v-tab to="/programs/algorithm-rules">Algorithm Rules</v-tab>
          <v-tab-item-dropdown
            text="Programs"
            toggle-class="nav-link-programs"
            left
          >
            <v-tab to="/programs/programs">Programs</v-tab>
            <v-tab to="/programs/program-rules">Program Rules</v-tab>
            <v-tab to="/programs/transcript-message"
              >Transcript Messaging</v-tab
            >
          </v-tab-item-dropdown>

          <v-tab-item-dropdown
            text="Optional Programs"
            toggle-class="nav-link-optional-programs"
            left
          >
            <v-tab to="/programs/optional-programs">Optional Programs</v-tab>
            <v-tab to="/programs/optional-program-rules"
              >Optional Program Rules</v-tab
            >
          </v-tab-item-dropdown>

          <v-tab to="/programs/letter-grades">Letter Grades</v-tab>
          <v-tab to="/programs/special-cases"
            >Assessment Special Case Codes</v-tab
          >
          <v-tab to="/programs/requirement-types">Requirement Type Code</v-tab>
        </v-tabs>
      </v-card-subtitle>
      <v-card-text>
        <router-view v-bind:key="$route.fullPath"></router-view>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "graduationPrograms",
  data() {
    return {
      tab: 1,
    };
  },
  methods: {},
};
</script>

<style scoped>
.programs-all {
  padding-left: 25px;
  padding-right: 25px;
}

.nav-link-programs {
  color: blue;
}

.tab-item a {
  border-radius: 0px !important;
}
</style>
