import { RestUtils } from "../helpers/rest-utils";

export interface TranscriptPayload extends BaseReportPayload {
  transcript: string;
  transcriptTypeCode: string;
  transcriptTypeLabel: string;
  transcriptUpdateDate: string;
  overwrite: boolean;
}

export interface CertificatePayload extends BaseReportPayload {
  pen: string;
  certificate: string;
  gradCertificateTypeCode: string;
  gradCertificateTypeLabel: string;
  overwrite: boolean;
}

export interface TVRPayload extends BaseReportPayload {
  pen: string;
  report: string;
  gradReportTypeCode: string;
  gradReportTypeLabel: string;
  reportUpdateDate: string;
}

export class GraduationReportAPIService {
  restUtils: RestUtils;
  baseUrl: string;

  constructor(config: Cypress.PluginConfigOptions) {
    this.restUtils = new RestUtils(config);
    this.baseUrl = config.env.api_url.graduationReportAPIURL
  }

  async getTranscript(studentId: string): Promise<TranscriptPayload> {
    try {
      const url = `${this.baseUrl}/api/v1/graduationreports/studenttranscript/${studentId}`;
      const data = await this.restUtils.getData<TranscriptPayload>(url);
      
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getCertificate(studentId: string): Promise<CertificatePayload> {
    try {
      const url = `${this.baseUrl}/api/v1/graduationreports/studentcertificate/${studentId};`
      const data = await this.restUtils.getData<CertificatePayload>(url);
      
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getTranscriptVerificationReport(studentId: string): Promise<TVRPayload> {
    try {
      const url = `${this.baseUrl}/api/v1/graduationreports/studentreport/${studentId};`
      const data = await this.restUtils.getData<TVRPayload>(url);
      
      return data;
    } catch (e) {
      throw e;
    }
  }
} 