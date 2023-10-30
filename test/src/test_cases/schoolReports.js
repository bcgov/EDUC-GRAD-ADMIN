import { base_url, api_html_status_threshold } from '../config/constants';
import { RequestLogger, Selector } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import adminUser from '../config/roles';
import SchoolReportsPage from '../page_objects/schoolReportsPage';

const log = require('npmlog');
const requestLogger = RequestLogger(/api\/v1/, {logResponseBody: true, logResponseHeaders: true});
const schoolReportsPage = new SchoolReportsPage();

fixture `school-reports`
    .page(base_url)
    .beforeEach( async t => {
        await t
            .useRole(adminUser)
            .navigateTo(base_url)
            .click(schoolReportsPage.view)
    })
    .afterEach(() => log.info(apiCallsFailed(requestLogger, api_html_status_threshold)));

    test('page loads', async t => {
        await t
            .expect(await schoolReportsPage.mincode.exists).ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });
