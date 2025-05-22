<template>
  <div id="env-banner">
    <v-app-bar
      v-if="environment == 'local'"
      density="compact"
      class="local-env"
    >
      <v-spacer /><strong>localhost</strong>&nbsp;environment
      <v-spacer />
    </v-app-bar>
    <v-app-bar
      v-else-if="environment === 'dev'"
      density="compact"
      class="dev-env"
    >
      <v-spacer /><strong>DEV</strong>&nbsp;environment<v-spacer />
    </v-app-bar>
    <v-app-bar
      v-else-if="environment == 'test'"
      density="compact"
      class="test-env"
    >
      <v-spacer /><strong>TEST</strong>&nbsp;environment<v-spacer />
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "EnvironmentBanner",
  props: {
    environment: {
      type: String, // No validation
      default: "dev", // fallback if not provided
    },
  },
  data() {
    return {
      host: "",
    };
  },
};
</script>

<style scoped>
#env-banner :deep(div.v-toolbar__content) {
  height: 26px !important;
}
#env-banner header {
  padding: 0 1em;
  height: 26px;
}
#env-banner .local-env {
  background-color: #025cb652;
  color: #000;
  text-align: left;
  width: fit-content;
}

#env-banner .dev-env {
  background-color: #850eb480;
  width: 100%;
  float: none;
}
#env-banner .test-env {
  background-color: #80ff00ad;
  color: #000;
  width: 100%;
  float: none;
}
</style>
