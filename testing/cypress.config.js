const { defineConfig } = require("cypress");
const StudentAPIService = require("./cypress/services/student-api-service");
const BatchAPIService = require("./cypress/services/batch-api-service");

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
    excludeSpecPattern: ['cypress/e2e/schools/schoolSearch.cy.js'],
    setupNodeEvents(on, config) {
      on('task', {
        async getBatchHistoryResultById(options) {
          return await new StudentAPIService(config).getBatchHistoryResultById(options)
        },
        async getBatchSummary(options) {
          return await new BatchAPIService(config).getBatchSummary(options)
        }
      })
    },
  },
});
