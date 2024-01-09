<template>
  <div id="env-banner">
    env - {{ environment }} | host - {{ host }}
    <div v-if="environment == 'local'" class="local-env">
      Vue 3 - <strong>localhost</strong> environment
    </div>
    <div v-else-if="environment === 'dev'" class="dev-env">
      Vue 3 - <strong>DEV</strong> environment
    </div>
    <div v-else-if="environment == 'test'" class="test-env">
      Vue 3 - <strong>TEST</strong> environment
    </div>
    <div v-else>Vue 3 - <strong>Environment not recognized</strong></div>
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
      host: location.host,
    };
  },
  methods: {
    getEnv() {
      console.log(location);
      console.log(location.host.includes(this.environments.dev));
      //simple solution to display banner to UI that indicates what environment the user is in;
      //currently determined via browser URL since this is a simple visual aid for devs and testers
      if (
        location.host.includes(this.environments.local) ||
        location.got.includes("127.0.0.1")
      ) {
        this.environment = "local";
      } else if (location.host.includes(this.environments.dev)) {
        this.environment = "dev";
      } else if (location.host.includes(this.environments.test)) {
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
#env-banner {
  display: block;
  position: fixed;
  z-index: 101;
  top: 106px;
  width: 100%;
  text-align: center;
}
#env-banner div {
  float: right;
  padding: 0 1em;
  height: 26px;
  margin-right: 40px;
}
#env-banner .local-env {
  background-color: #c1c1c152;
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
