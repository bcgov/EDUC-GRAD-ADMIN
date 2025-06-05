import { RestUtils } from "../helpers/rest-utils"

export interface BatchSummaryOptions {
  pageNumber: number;
  pageSize: number;
}

export interface BatchSummaryPayload extends paginationApiEntity {
  batchJobList: BatchJob[];
}

export interface BatchPayload extends paginationApiEntity {
  content: BatchJobv2[];
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

  async getBatchById(batchId: string): Promise<BatchPayload> {
    let searchParams = [{
      condition: null,
      searchCriteriaList: [
        { "key": "jobExecutionId",
          "operation": "eq",
          "value": parseInt(batchId),
          "valueType": "INTEGER",
          "condition": null
        }
      ]
    }]

    try {
      const encodedSearchParams = encodeURIComponent(JSON.stringify(searchParams));
      const url = `${this.baseUrl}/api/v2/batch/dashboard?pageNumber=0&pageSize=10&searchParams=${encodedSearchParams}`;
      const data = await this.restUtils.getData<BatchPayload>(url);
      
      return data;
    } catch (e) {
      throw e;
    }
    
  }
}