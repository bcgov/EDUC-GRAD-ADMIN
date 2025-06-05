import { defineConfig } from "cypress";
import { BatchHistoryResultOption, BatchHistoryResultPayload, StudentAPIService } from "./cypress/services/student-api-service";
import { BatchAPIService, BatchPayload, BatchSummaryOptions, BatchSummaryPayload } from "./cypress/services/batch-api-service";
import { CertificatePayload, GraduationReportAPIService, SchoolReport, TranscriptPayload, TVRPayload } from "./cypress/services/graduation-report-api-service";
import { DistributionAPIService } from "./cypress/services/distribution-api-service";
const Admzip = require('adm-zip');
const { removeDirectory } = require('cypress-delete-downloads-folder');

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
    baseUrl: 'http://localhost:8081',
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
        async getBatchById(batchId: string): Promise<BatchPayload> {
          return await new BatchAPIService(config).getBatchById(batchId);
        },
        async getTranscript(studentId: string): Promise<TranscriptPayload[]> {
          return await new GraduationReportAPIService(config).getTranscript(studentId);
        },
        async getCertificate(studentId: string): Promise<CertificatePayload[]> {
          return await new GraduationReportAPIService(config).getCertificate(studentId);
        },
        async getTranscriptVerificationReport(studentId: string): Promise<TVRPayload[]> {
          return await new GraduationReportAPIService(config).getTranscriptVerificationReport(studentId);
        },
        async getSchoolReportById(schoolOfRecordId: string): Promise<SchoolReport[]> {
          return await new GraduationReportAPIService(config).getSchoolReportById(schoolOfRecordId);
        },
        async downloadBatchReport(batchId: string): Promise<string> {
          return await new DistributionAPIService(config).downloadBatchReport(batchId);
        },
        checkPDFInZip(zipPath: string): string {
          try {
            const zip = new Admzip(zipPath)
            const zipEntries = zip.getEntries();

            // Find the first PDF in the ZIP
            const pdfEntry = zipEntries.find((entry: any) => entry.entryName.endsWith(".pdf"));
            if (!pdfEntry) return "No PDF found";

            const pdfContent = pdfEntry.getData(); // Get PDF file buffer
            return pdfContent.length > 0 ? "PDF is not empty" : "PDF is empty";
          } catch (err: any) {
            return `Error: ${err.message}`;
          }
        },
        removeDirectory,
      })
    },
  },
});
