const { defineConfig } = require("cypress");
const StudentAPIService = require("./cypress/services/student-api-service")

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
    baseUrl: 'http://localhost:8081',
    experimentalRunAllSpecs: true,
    excludeSpecPattern: ['cypress/e2e/batchProcessing/graduationAlgorithm.cy.js', 'cypress/e2e/schools/schoolSearch.cy.js'],
    setupNodeEvents(on, config) {
      on('task', {
        async getBatchHistoryResultById(options) {
          return await new StudentAPIService(config).getBatchHistoryResultById(options)
        },
      })
    },
  },
});
