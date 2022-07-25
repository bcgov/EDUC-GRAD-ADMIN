import { base_url, api_html_status_threshold } from '../config/constants';
import { RequestLogger, Selector } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import adminUser from '../config/roles';
import CoursesPage from '../page_objects/coursesPage';

const log = require('npmlog');
const requestLogger = RequestLogger(/api\/v1/, {logResponseBody: true, logResponseHeaders: true});
const coursesPage = new CoursesPage();

fixture `course-requirements`
    .page(base_url)
    .beforeEach( async t => {
        await t
        .useRole(adminUser)
        .navigateTo(base_url)
        .click(coursesPage.view)
        .click(coursesPage.restrictionsTab);
    })
