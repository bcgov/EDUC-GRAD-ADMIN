<template>
  <div class="programs-all">
    <h1>Programs</h1>

    <v-card>
      <v-card-title> Program Management </v-card-title>
      <v-card-subtitle>
        <v-tabs v-model="tab">
          <v-tab to="/programs/algorithm-rules">Algorithm Rules</v-tab>
          <v-tab>
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn text v-bind="props">Programs</v-btn>
              </template>
              <v-list>
                <v-list-item to="/programs/programs">Programs</v-list-item>
                <v-list-item to="/programs/program-rules"
                  >Program Rules</v-list-item
                >
                <v-list-item to="/programs/transcript-message"
                  >Transcript Messaging</v-list-item
                >
              </v-list>
            </v-menu>
          </v-tab>
          <v-tab>
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn text v-bind="props">Optional Programs</v-btn>
              </template>
              <v-list>
                <v-list-item to="/programs/optional-programs"
                  >Optional Programs</v-list-item
                >
                <v-list-item to="/programs/optional-program-rules"
                  >Optional Program Rules</v-list-item
                >
              </v-list>
            </v-menu>
          </v-tab>
          <v-tab to="/programs/letter-grades">Letter Grades</v-tab>
          <v-tab to="/programs/special-cases"
            >Assessment Special Case Codes</v-tab
          >
          <v-tab to="/programs/requirement-types">Requirement Type Code</v-tab>
        </v-tabs>
      </v-card-subtitle>
      <v-card-text>
        <router-view :key="$route.fullPath"></router-view>
      </v-card-text>
    </v-card>
  </div>
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
</style>
