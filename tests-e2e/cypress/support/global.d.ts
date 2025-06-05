import { BatchPayload, BatchSummaryOptions, BatchSummaryPayload } from "../services/batch-api-service";
import { CertificatePayload, SchoolReport, TranscriptPayload, TVRPayload } from "../services/graduation-report-api-service";
import { BatchHistoryResultOption, BatchHistoryResultPayload } from "../services/student-api-service";

export {}; // This file needs to be a module

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      login(): Chainable<void>;
      doesExist(selector: string): Chainable<boolean>;
      shouldHaveData(selector: string, expectedRowNum?: number): Chainable<void>;
      selectDropdown(selector: string, text: string, forceFlag?: boolean): Chainable<void>;
      selectAutoselect(selector: string, text: string): Chainable<void>;
      callBatchJobTillComplete(jobId: string, startTime: number, timeout: number, interval?: number): Chainable<void>

      task<T = BatchHistoryResultOption, S = BatchHistoryResultPayload> (
        event: 'getBatchHistoryResultById',
        arg: T
      ): Chainable<S>;

      task<T = BatchSummaryOptions, S = BatchSummaryPayload> (
        event: 'getBatchSummary',
        arg: T
      ): Chainable<S>;

      task<S = BatchPayload> (
        event: 'getBatchById',
        batchId: string
      ): Chainable<S>;

      task<S = TranscriptPayload> (
        event: 'getTranscript',
        studentId: string
      ): Chainable<S[]>;

      task<S = CertificatePayload> (
        event: 'getCertificate',
        studentId: string
      ): Chainable<S[]>;

      task<S = TVRPayload> (
        event: 'getTranscriptVerificationReport',
        studentId: string
      ): Chainable<S[]>;

      task<S = SchoolReport> (
        event: 'getSchoolReportById',
        schoolOfRecordId: string
      ): Chainable<S[]>;

      task(
        event: 'downloadBatchReport',
        batchId: string
      ): Chainable<string>;

      task(
        event: 'checkPDFInZip',
        zipPath: string
      ): Chainable<string>;
    }
  }
}