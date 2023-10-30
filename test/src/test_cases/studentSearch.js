import StudentSearchPage from '../page_objects/studentSearchPage';
import MainMenu from '../page_objects/mainMenu';
import { base_url, credentials, test_pen, api_html_status_threshold } from '../config/constants';
import { ClientFunction, RequestLogger, Role  } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import commonUtils from '../helpers/commonUtils';
import adminUser from '../config/roles';
import { info } from 'console';

const log = require('npmlog');
//const adminUser = require('../config/roles');
const bad_pen = '121212121';
const searchPage = new StudentSearchPage();
const mainMenu = new MainMenu();
const penSearchLogger = RequestLogger(/api\/v1\/student\/pen/);

fixture `grad-login-admin`
    .requestHooks(penSearchLogger)
    .beforeEach(async t => {
        // log in as studentAdmin
        await t.useRole(adminUser).navigateTo(base_url);
        //await t.maximizeWindow();
    }).afterEach(async t => {
            // run locally for api call failure output
            //log.info(apiCallsFailed(penSearchLogger, api_html_status_threshold));
            await t.useRole(Role.anonymous());
        });

test('Pen Search - bad PEN', async t => {
    
    // testing bad pen search
    log.info('Testing search with nonexistant PEN')
    await searchPage.selectPenSearchTab();
    await searchPage.studentSearch(bad_pen);
    //await t.expect(penSearchLogger.contains(r => commonUtils.outputStatusCode(r.response.statusCode, api_html_status_threshold))).ok();
    await t.expect(searchPage.searchMessage.innerText).contains('Student cannot be found', 'Student cannot be found error message did not occur');
})
.meta({
    testSuites: {
        smoke: false,
        regression: true,
    }
});

test('Pen Search - good PEN', async t => {
    await t.navigateTo(base_url);
    const getLocation = ClientFunction(() => document.location.href);
    
    // testing good pen search
    log.info("Testing search for existing student");
    await t.typeText(searchPage.searchInput, bad_pen)
           .click(searchPage.searchSubmit);
           //.wait(30000)
           //.expect(penSearchLogger.contains(r => commonUtils.outputStatusCode(r.response.statusCode, api_html_status_threshold)), {timeout: max_acceptable_timeout}).ok();
           
    await t
        //.wait(max_acceptable_timeout)
        .expect(getLocation())
        .contains('/student-profile', 'Failed to navigate to student profile');

    // testing pen bad pen search from top menu
    // TODO: awaiting resolution for bugfix https://gww.jira.educ.gov.bc.ca/browse/GRAD2-874
    /**log.info("Testing bad pen search from top menu");
    await t.typeText(mainMenu.searchByPenInput, bad_pen)
           .click(mainMenu.searchByPenButton)
           .expect(requestLogger.contains(r => r.response.statusCode > api_html_status_threshold)).notOk();
    
    await t.expect(searchPage.searchMessage.innerText).contains('Student cannot be found', 'Student cannot be found error message did not occur', {timeout: 2000});


    // testing good pen search from main menu
    log.info("Testing good pen search from top menu");
    await mainMenu.selectSearchByPenInput(test_pen);
    await t.expect(getLocation()).contains('/student-profile');

    // testing advanced search
    log.info("Testing advanced search reset");
    await mainMenu.selectStudentSearchLink();
     **/

    // TODO: tests adv search

})
.meta({
    testSuites: {
        smoke: true,
        regression: true,
    }
});
