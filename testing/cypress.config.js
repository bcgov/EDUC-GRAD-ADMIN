const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  numTestsKeptInMemory: 0,
  experimentalMemoryManagement: true, 
  screenshotOnRunFailure: false,
  watchForFileChanges: false,
  retries: {
    runMode: 1,
    openMode: 0
  },
  e2e: {
    baseUrl: 'https://dev.grad.gov.bc.ca',
    experimentalRunAllSpecs: true,
    excludeSpecPattern: ['cypress/e2e/batchProcessing/graduationAlgorithm.cy.js', 'cypress/e2e/schools/schoolSearch.cy.js'],
    setupNodeEvents(on, config) {

    },
  },
});
