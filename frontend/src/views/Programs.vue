<template>
  <div class="programs-all">
    <h1>Programs</h1>

    <v-card no-body>
      <v-tabs v-model="tab" bg-color="bcGovLightGrey">
        <v-tab to="/programs/algorithm-rules" class="text-none" size="large"
          >Algorithm Rules</v-tab
        >
        <v-tab class="text-none" size="large">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                text
                v-bind="props"
                class="text-none"
                size="large"
                variant="text"
                append-icon="mdi-menu-down"
                >Programs</v-btn
              >
            </template>
            <v-list>
              <v-list-item @click="tab = 1" to="/programs/programs"
                >Programs</v-list-item
              >
              <v-list-item @click="tab = 1" to="/programs/program-rules"
                >Program Rules</v-list-item
              >
              <v-list-item @click="tab = 1" to="/programs/transcript-message"
                >Transcript Messaging</v-list-item
              >
            </v-list>
          </v-menu>
        </v-tab>
        <v-tab class="text-none" size="large">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                text
                v-bind="props"
                class="text-none"
                size="large"
                variant="text"
                append-icon="mdi-menu-down"
                block
                >Optional Programs</v-btn
              >
            </template>
            <v-list>
              <v-list-item @click="tab = 2" to="/programs/optional-programs"
                >Optional Programs</v-list-item
              >
              <v-list-item
                @click="tab = 2"
                to="/programs/optional-program-rules"
                >Optional Program Rules</v-list-item
              >
            </v-list>
          </v-menu>
        </v-tab>
        <v-tab to="/programs/letter-grades" class="text-none" size="large"
          >Letter Grades</v-tab
        >
        <v-tab to="/programs/special-cases" class="text-none" size="large"
          >Assessment Special Case Codes</v-tab
        >
        <v-tab to="/programs/requirement-types" class="text-none" size="large"
          >Requirement Type Codes</v-tab
        >
      </v-tabs>
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
      tab: 0,
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

:deep(a.v-btn),
:deep(a.v-btn.v-tab-item--selected) {
  text-decoration: none;
}
</style>
