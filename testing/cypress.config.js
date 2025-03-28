const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  numTestsKeptInMemory: 0,
  experimentalMemoryManagement: true,
  e2e: {
    baseUrl: 'https://dev.grad.gov.bc.ca',
    setupNodeEvents(on, config) {

    },
  },
});
