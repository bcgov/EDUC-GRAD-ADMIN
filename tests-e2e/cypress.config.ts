import { defineConfig } from "cypress";
import { BatchHistoryResultOption, BatchHistoryResultPayload, StudentAPIService } from "./cypress/services/student-api-service";
import { BatchAPIService, BatchSummaryOptions, BatchSummaryPayload } from "./cypress/services/batch-api-service";
import { CertificatePayload, GraduationReportAPIService, TranscriptPayload, TVRPayload } from "./cypress/services/graduation-report-api-service";

export default defineConfig({
  chromeWebSecurity: false,
  video: false,
  screenshotOnRunFailure: false,
  defaultCommandTimeout: 10000,
  numTestsKeptInMemory: 0,
  watchForFileChanges: false,
  retries: {
    runMode: 1,
    openMode: 0
  },
  e2e: {
    baseUrl: 'https://dev.grad.gov.bc.ca',
    experimentalRunAllSpecs: true,
    excludeSpecPattern: ['cypress/e2e/schools/schoolSearch.cy.ts'],
    setupNodeEvents(on, config) {
      on('task', {
        async getBatchHistoryResultById(options: BatchHistoryResultOption): Promise<BatchHistoryResultPayload> {
          return await new StudentAPIService(config).getBatchHistoryResultById(options.batchJobResultId);
        },
        async getBatchSummary(options: BatchSummaryOptions): Promise<BatchSummaryPayload> {
          return await new BatchAPIService(config).getBatchSummary(options.pageNumber, options.pageSize);
        },
        async getTranscript(studentId: string): Promise<TranscriptPayload[]> {
          return await new GraduationReportAPIService(config).getTranscript(studentId)
        },
        async getCertificate(studentId: string): Promise<CertificatePayload[]> {
          return await new GraduationReportAPIService(config).getCertificate(studentId)
        },
        async getTranscriptVerificationReport(studentId: string): Promise<TVRPayload[]> {
          return await new GraduationReportAPIService(config).getTranscriptVerificationReport(studentId)
        },
      })
    },
  },
});
