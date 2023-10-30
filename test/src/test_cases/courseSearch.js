import { base_url, api_html_status_threshold, max_acceptable_timeout } from '../config/constants';
import { RequestLogger, Selector } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import adminUser from '../config/roles';
import CoursesPage from '../page_objects/coursesPage';
import commonUtils from '../helpers/commonUtils';
import { info } from 'console';

const log = require('npmlog');
const courseLogger = RequestLogger(/api\/v1\/course/, {logResponseBody: true, logResponseHeaders: true});
const coursesPage = new CoursesPage();
const searchMessage = Selector('.search-results-message > strong'); //this can be moved to courses page object

// test data variables
const TRAXStartDate = '1995-01-01';
const TRAXEndDate = '2022-05-31';
const expectedResults = {
    goodDataRows : 16,
};

fixture `course-search`
    .requestHooks(courseLogger)
    .page(base_url)
    .beforeEach( async t => {
        await t
            .useRole(adminUser)
            .navigateTo(base_url)
            .click(coursesPage.view);
    })
    .afterEach(() => log.info(apiCallsFailed(courseLogger, api_html_status_threshold)));

test('empty', async t => {
    await t
    .click(coursesPage.searchSubmit);
    
    await t
    //.wait(max_acceptable_timeout)
    .expect(await searchMessage.textContent)
    .contains('Enter at least one field to search.');
})
.meta({
    testSuites: {
        smoke: false,
        regression: true,
    }
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
    .typeText(coursesPage.TRAXStartDate, TRAXStartDate)
    .typeText(coursesPage.TRAXEndDate, TRAXEndDate)
    .click(coursesPage.formReset)
    .click(coursesPage.searchSubmit);

    await t
    .expect(await searchMessage.textContent)
    .contains('Enter at least one field to search.', {timeout: max_acceptable_timeout});
})
.meta({
    testSuites: {
        smoke: false,
        regression: true,
    }
});

test('good data - all fields', async t => {
    log.info('Testing course search with good data');

    await coursesPage.courseSearch('A*', '12', 'A*', 'EN', TRAXStartDate, TRAXEndDate);

    await t
    .expect(searchMessage.textContent).contains('16');

})
.meta({
    testSuites: {
        smoke: true,
        regression: true,
        qa: false
    }
});

test('no courses', async t => {
    await t
    .typeText(coursesPage.TRAXCode, 'XX')
    .click(coursesPage.searchSubmit);

    // do not expect table to load since we have no courses with a code of 'A'
    await t
    .expect(await coursesPage.courseResults.exists).notOk();
})
.meta({
    testSuites: {
        smoke: false,
        regression: true,
        qa: true,
    }
});

test('good data - course code and level', async t => {

    await coursesPage.courseSearch('ACL*', '12', '', '', '', '');

    await t
    .expect(searchMessage.textContent).contains('2');
})
.meta({
    testSuites: {
        smoke: false,
        regression: true,
        qa: true
    }
});

test('good data - course title', async t => {

    await coursesPage.courseSearch('', '', 'living*', '', '', '');

    await t
    .expect(searchMessage.textContent).contains('21');
})
.meta({
    testSuites: {
        smoke: false,
        regression: true,
        qa: true
    }
});

test('good data - course language', async t => {

    await coursesPage.courseSearch('', '', '', 'FR', '', '');

    await t
    .expect(searchMessage.textContent).contains('866');
})
.meta({
    testSuites: {
        smoke: false,
        regression: true,
        qa: true
    }
});

// test('validation', async t => {
//     // test the form validations
//     await t
//     .typeText(coursesPage, 'AAAAAA')
// })
