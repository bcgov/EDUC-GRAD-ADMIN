import { RestUtils } from "../helpers/rest-utils"

export interface BatchSummaryOptions {
  pageNumber: number;
  pageSize: number;
}

export interface BatchSummaryPayload extends paginationApiEntity {
  batchJobList: BatchJob[];
}

export class BatchAPIService {
  restUtils: RestUtils;
  baseUrl: string;

  constructor(config: Cypress.PluginConfigOptions) {
    this.restUtils = new RestUtils(config);
    this.baseUrl = config.env.api_url.batchAPIURL;
  }

  async getBatchSummary(pageNumber: number, pageSize: number): Promise<BatchSummaryPayload> {
    try {
      const url = `${this.baseUrl}/api/v1/batch/dashboard/summary?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      const data = await this.restUtils.getData<BatchSummaryPayload>(url);
      
      return data;
    } catch (e) {
      throw e;
    }
  }
}