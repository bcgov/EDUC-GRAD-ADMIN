import { base_url, api_html_status_threshold } from '../config/constants';
import { RequestLogger, Selector } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import { adminUser } from '../config/roles';
import CoursesPage from '../page_objects/coursesPage';

const log = require('npmlog');
const requestLogger = RequestLogger(/api\/v1/, {logResponseBody: true, logResponseHeaders: true});
const coursesPage = new CoursesPage();
const searchMessage = Selector('.search-results-message > strong')

// test data variables
const TRAXSartDate = '1995-01-01';
const TRAXEndDate = '2022-05-31';
const expectedResults = {
    goodDataRows : 48,
};

fixture `course-search`
    .page(base_url)
    .beforeEach( async t => {
        await t
            .useRole(adminUser)
            .click('#courses-route');
    })
    .afterEach(() => log.info(apiCallsFailed(requestLogger, api_html_status_threshold)));

test('empty', async t => {
    await t
    .click(coursesPage.searchSubmit)
    
    await t
    .expect(await searchMessage.textContent)
    .contains('Enter at least one field to search.');
});

test('reset', async t => {
    await t
    .typeText(coursesPage.TRAXCode, 'A')
    .click(coursesPage.TRAXCode.sibling('.wild-card-button'))
    .typeText(coursesPage.gradeLevel, '12')
    .typeText(coursesPage.courseTitle, 'A')
    .click(coursesPage.courseTitle.sibling('.wild-card-button'))
    .click(coursesPage.instructionLanguage)
    .click(coursesPage.instructionLanguage.child('option').withExactText('EN'))
    .typeText(coursesPage.TRAXStartDate, TRAXSartDate)
    .typeText(coursesPage.TRAXEndDate, TRAXEndDate)
    .click(coursesPage.formReset)
    .click(coursesPage.searchSubmit);

    await t
    .expect(await searchMessage.textContent)
    .contains('Enter at least one field to search.', {timeout: 2000});
})

test('good data - all fields', async t => {
    await t
    .typeText(coursesPage.TRAXCode, 'A')
    .click(coursesPage.TRAXCode.sibling('.wild-card-button'))
    .typeText(coursesPage.gradeLevel, '12')
    .typeText(coursesPage.courseTitle, 'A')
    .click(coursesPage.courseTitle.sibling('.wild-card-button'))
    .click(coursesPage.instructionLanguage)
    .click(coursesPage.instructionLanguage.child('option').withExactText('EN'))
    .typeText(coursesPage.TRAXStartDate, TRAXSartDate)
    .typeText(coursesPage.TRAXEndDate, TRAXEndDate)
    //.click(coursesPage.formReset)
    .click(coursesPage.searchSubmit);

    await t
    //.expect(await Selector('table').count)
    .expect(await coursesPage.courseResults.withAttribute('aria-rowcount', String(expectedResults.goodDataRows)).exists)
    .ok();
    //.notContains('Enter at least one field to search.');

})

test('no courses', async t => {
    await t
    .typeText(coursesPage.TRAXCode, 'A')
    .click(coursesPage.searchSubmit);

    // do not expect table to load since we have no courses with a code of 'A'
    await t
    .expect(await coursesPage.courseResults.exists).notOk();
})

// test('validation', async t => {
//     // test the form validations
//     await t
//     .typeText(coursesPage, 'AAAAAA')
// })
