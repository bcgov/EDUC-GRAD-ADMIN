import { base_url, credentials, test_pen, api_html_status_threshold } from '../config/constants';
import { RequestLogger  } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import { adminUser } from '../config/roles';

const log = require('npmlog');
const requestLogger = RequestLogger(/api\/v1/, {logResponseBody: true, logResponseHeaders: true});

fixture `course-search`
    .page(base_url)
    .afterEach(() => log.info(apiCallsFailed(requestLogger, api_html_status_threshold)));

test('Course Search', async t => {
    await t
    .useRole(adminUser)
    .click('#courses-route')
});
