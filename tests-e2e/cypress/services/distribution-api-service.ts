import { RestUtils } from "../helpers/rest-utils"

export class DistributionAPIService {
  restUtils: RestUtils;
  baseUrl: string;

  constructor(config: Cypress.PluginConfigOptions) {
    this.restUtils = new RestUtils(config);
    this.baseUrl = config.env.api_url.distributionAPIURL;
  }

  async downloadBatchReport(batchId: string): Promise<string> {
    try {
      const url = `${this.baseUrl}/api/v1/distribute/download/${batchId}`;
      const data = await this.restUtils.getData<string>(url);
      
      return data;
    } catch (e) {
      throw e;
    }
  }
}