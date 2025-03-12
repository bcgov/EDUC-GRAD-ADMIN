import { RestUtils } from "../helpers/rest-utils"

export interface BatchHistoryResultOption {
  batchJobResultId: string;
}

export interface BatchHistoryResultPayload extends paginationApiEntity {
  content: StudentApiEntity[];
  empty: boolean;
  first: boolean;
  last: boolean;
}

export class StudentAPIService {
  restUtils: RestUtils;
  baseUrl: string;

  constructor(config: Cypress.PluginConfigOptions) {
    this.restUtils = new RestUtils(config);
    this.baseUrl = config.env.api_url.studentAPIURL;
  }

  async getBatchHistoryResultById(batchJobResultId: string): Promise<BatchHistoryResultPayload> {
    try {
      const url = `${this.baseUrl}/api/v1/student/studentHistory/batchid/${batchJobResultId}?pageNumber=0&pageSize=10`;
      const data = await this.restUtils.getData<BatchHistoryResultPayload>(url);
      
      return data;
    } catch (e) {
      throw e;
    }
  }
}