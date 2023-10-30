const restUtils = require("../helpers/restUtils");
const constants = require("../config/constants");

const gradCourseApiService = {
    async getAllCourses(token) {
        const endpoint = 'api/v1/course';
        const url = `${constants.base_url}${endpoint}`;
        const responseBody = await restUtils.getData(token, url, '');
        return responseBody;
    },
    async courseSearch(token, params) {
        const endpoint = 'api/v1/course/coursesearch?';
        const url = `${constants.base_url}${endpoint}`;
        const responseBody = await restUtils.getData(token, url, '');
        return responseBody;
    }
}

module.exports = gradCourseApiService;
