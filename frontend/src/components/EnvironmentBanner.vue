<template>
  <div id="env-banner">
    <div v-if="environment == 'local'" class="local-env">
      <strong>localhost</strong> environment
    </div>
    <div v-else-if="environment == 'dev'" class="dev-env">
      <strong>DEV</strong> environment
    </div>
    <div v-if="environment == 'test'" class="test-env">
      <strong>UAT</strong> environment
    </div>
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
    };
  },
  methods: {
    getEnv() {
      //simple solution to display banner to UI that indicates what environment the user is in;
      //currently determined via browser URL since this is a simple visual aid for devs and testers
      if (location.host.includes(this.environments.local)) {
        this.environment = "local";
      } else if (location.host.includes(this.environments.dev)) {
        this.environment = "dev";
      } else if (location.host.includes(this.environments.test)) {
        this.environment = "test";
      }
    },
  },
  created() {
    this.getEnv();
  },
};
</script>

<style scoped>
#env-banner {
  display: block;
  position: fixed;
  z-index: 101;
  top: 0;
  width: 100%;
  text-align: center;
}
#env-banner div {
  float: right;
  padding: 0 1em;
  height: 26px;
}
#env-banner .local-env {
  background-color: #ffffff52;
  color: #000;
  text-align: left;
  width: fit-content;
}
#env-banner .dev-env {
  background-color: #ffa6009d;
}
#env-banner .test-env {
  background-color: #00000080;
  color: #fff;
}
</style>
