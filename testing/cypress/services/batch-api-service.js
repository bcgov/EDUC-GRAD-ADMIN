const RestUtils = require('../support/rest-utils')

class BatchAPIService {
  constructor(config) {
    this.restUtils = new RestUtils(config)
    this.baseUrl = config.env.api_url.batchAPIURL
  }

  async getBatchSummary(options) {
    try {
      const url = `${this.baseUrl}/api/v1/batch/dashboard/summary?pageNumber=${options.pageNumber}&pageSize=${options.pageSize}`
      const data = await this.restUtils.getData(url)
      
      return data
    } catch (e) {
      throw e
    }
  }
}

module.exports = BatchAPIService