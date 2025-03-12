import { defineConfig } from "cypress";
import { BatchHistoryResultOption, BatchHistoryResultPayload, StudentAPIService } from "./cypress/services/student-api-service";
import { BatchAPIService, BatchSummaryOptions, BatchSummaryPayload } from "./cypress/services/batch-api-service";

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
      on('task', {
        async getBatchHistoryResultById(options: BatchHistoryResultOption): Promise<BatchHistoryResultPayload> {
          return await new StudentAPIService(config).getBatchHistoryResultById(options.batchJobResultId);
        },
        async getBatchSummary(options: BatchSummaryOptions): Promise<BatchSummaryPayload> {
          return await new BatchAPIService(config).getBatchSummary(options.pageNumber, options.pageSize);
        }
      })
    },
  },
});
