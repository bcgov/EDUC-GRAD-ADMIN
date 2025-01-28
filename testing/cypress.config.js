const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  numTestsKeptInMemory: 0,
  experimentalMemoryManagement: true,
  screenshotOnRunFailure: true,
  watchForFileChanges: false,
  retries: 1,
  e2e: {
    baseUrl: 'https://dev.grad.gov.bc.ca',
    excludeSpecPattern: ['cypress/e2e/batchProcessing/*.cy.js'],
    setupNodeEvents(on, config) {

    },
  },
});
