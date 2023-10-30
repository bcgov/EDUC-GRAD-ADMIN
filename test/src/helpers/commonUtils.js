const log = require('npmlog');
const commonUtils = {
    isAscending(cur, prev) {
        return String(cur) >= String(prev) || !(cur || prev);
    },
    isDescending(cur, prev) {
        return String(cur) <= String(prev) || !(cur || prev);
    },
    outputStatusCode(statusCode, threshold) {
        if (statusCode > threshold) {
            log.info(`Failed because of response status code of ${statusCode} is greater than the allowable ${threshold}`);
        } else {
            log.info('API call OK: ' + statusCode);
            return true;
        }
        return false;
    }
}

export default commonUtils;
