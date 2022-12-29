import { base_url, api_html_status_threshold } from '../config/constants';
import { RequestLogger, Selector } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import adminUser from '../config/roles';
import CoursesPage from '../page_objects/coursesPage';

const log = require('npmlog');
const courseLogger = RequestLogger(/api\/v1\/course/, {logResponseBody: true, logResponseHeaders: true});
const coursesPage = new CoursesPage();
const searchMessage = Selector('.search-results-message > strong');

fixture `course-requirements`
    .requestHooks(courseLogger)
    .page(base_url)
    .beforeEach( async t => {
        await t
        .useRole(adminUser)
        .navigateTo(base_url)
        .click(coursesPage.view)
        .click(coursesPage.requirementsTab);
    })
    .afterEach( () => log.info(apiCallsFailed(courseLogger, api_html_status_threshold)));

    test('empty', async t => {
        await t
        .click(coursesPage.searchSubmit);

        await t
        .expect(await searchMessage.textContent)
        .contains('Enter at least one field to search.');
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });

    test('Search on Course Code and Course Level', async t => {
        await t
        .click(coursesPage.courseCode)
        .typeText(coursesPage.courseCode, 'EN')
        .click(coursesPage.courseLevel)
        .typeText(coursesPage.courseLevel, '12')
        .click(coursesPage.searchSubmit);

        await t
        .expect(coursesPage.searchMessage.textContent)
        .contains('11');
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
            qa: true,
        }
    });

    test('Search on Rule #', async t => {
        await t
        .click(coursesPage.ruleNumber)
        .typeText(coursesPage.ruleNumber, '103')
        .click(coursesPage.searchSubmit);

        await t
        .expect(coursesPage.searchMessage.textContent)
        .contains('19');
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
            qa: true,
        }
    });
    