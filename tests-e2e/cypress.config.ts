import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  video: false,
  screenshotOnRunFailure: false,
  defaultCommandTimeout: 10000,
  numTestsKeptInMemory: 0,
  retries: {
    runMode: 1,
    openMode: 0
  },
  e2e: {
    baseUrl: 'https://dev.grad.gov.bc.ca',
    experimentalRunAllSpecs: true,
    excludeSpecPattern: ['cypress/e2e/schools/schoolSearch.cy.ts', 'cypress/e2e/batchProcessing/graduationAlgorithm.cy.ts', 'cypress/e2e/batchProcessing/transcriptVerificationReport.cy.ts'],
    setupNodeEvents(on, config) {
    },
  },
});
