const RestUtils = require('../support/rest-utils')

class StudentAPIService {
  constructor(config) {
    this.restUtils = new RestUtils(config)
    this.baseUrl = config.env.api_url.studentAPIURL
  }

  async getBatchHistoryResultById(options) {
    try {
      const url = `${this.baseUrl}/api/v1/student/studentHistory/batchid/${options.batchJobResultId}?pageNumber=0&pageSize=10`
      const data = await this.restUtils.getData(url)
      
      return data
    } catch (e) {
      throw e
    }
  }
}

module.exports = StudentAPIService