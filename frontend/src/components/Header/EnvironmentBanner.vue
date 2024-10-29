<template>
  <div id="env-banner">
    <v-app-bar
      v-if="environment == 'local'"
      density="compact"
      class="local-env"
    >
      <v-spacer />Vue 3 - <strong>localhost</strong> environment <v-spacer />
    </v-app-bar>
    <v-app-bar
      v-else-if="environment === 'dev'"
      density="compact"
      class="dev-env"
    >
      <v-spacer />Vue 3 - <strong>DEV</strong> environment<v-spacer />
    </v-app-bar>
    <v-app-bar
      v-else-if="environment == 'test'"
      density="compact"
      class="test-env"
    >
      <v-spacer />Vue 3 - <strong>TEST</strong> environment<v-spacer />
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "EnvironmentBanner",
  data() {
    return {
      environment: "",
      environments: {
        local: "localhost",
        dev: "dev.grad.gov.bc.ca",
        test: "test.grad.gov.bc.ca",
      },
      host: "",
    };
  },
  methods: {
    getEnv() {
      //simple solution to display banner to UI that indicates what environment the user is in;
      //currently determined via browser URL since this is a simple visual aid for devs and testers
      this.host = location.host;

      if (
        this.host.includes(this.environments.local) ||
        this.host.includes("127.0.0.1")
      ) {
        this.environment = "local";
      } else if (this.host.includes(this.environments.dev)) {
        this.environment = "dev";
      } else if (this.host.includes(this.environments.test)) {
        this.environment = "test";
      }
    },
  },
  mounted() {
    this.getEnv();
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
  background-color: #80ff00;
  color: #000;
  width: 100%;
  float: none;
}
</style>
