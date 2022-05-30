import { base_url, api_html_status_threshold } from '../config/constants';
import { RequestLogger, Selector } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import { adminUser } from '../config/roles';
import CoursesPage from '../page_objects/coursesPage';

const log = require('npmlog');
const requestLogger = RequestLogger(/api\/v1/, {logResponseBody: true, logResponseHeaders: true});
const coursesPage = new CoursesPage();
const searchMessage = Selector('.search-results-message > strong')

fixture `course-search`
    .page(base_url)
    .beforeEach( async t => {
        await t
            .useRole(adminUser)
            .click('#courses-route');
    })
    .afterEach(() => log.info(apiCallsFailed(requestLogger, api_html_status_threshold)));

test('Course Search - empty', async t => {
    await t
    .click(coursesPage.searchSubmit)
    
    await t
    .expect(await searchMessage.textContent)
    .contains('Enter at least one field to search.');

    //Selector('.search-results-message > strong').withExactText('Enter at least one field to search.')
    
});

test('Course Search - reset', async t => {
    await t
    .typeText(coursesPage.TRAXCode, 'A')
    .typeText(coursesPage.gradeLevel, '12')
    .typeText(coursesPage.courseTitle, 'A')
})

test('Course Search - good data', async t => {
    await t
    .typeText(coursesPage.TRAXCode, 'A')
})
