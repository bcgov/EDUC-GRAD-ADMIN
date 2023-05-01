import {api_html_status_threshold, base_url, credentials} from '../config/constants';
import { screen } from '@testing-library/testcafe';
import {apiCallsFailed} from "../helpers/requestHelper";
import {RequestLogger} from "testcafe";
import LoginPage from "../page_objects/loginPage";
import StudentSearchPage from '../page_objects/studentSearchPage';

const log = require('npmlog');
const login = new LoginPage();
const searchPage = new StudentSearchPage();
const { getToken } = require('../helpers/oauthUtils');
const { studentSearch } = require('../services/studentApiService');
const requestLogger = RequestLogger(/api\/v1/, {logResponseBody: true, logResponseHeaders: true});

fixture `test-case-with-api-call-poc`
    .page(base_url)
    .before(tkn => {
        getToken().then(async (data) => {
            // retrieve data from a backend API 'service' (Data priming)
            const params =  {
              params: {
                  legalFirstName: 'Smith'
              }
            }
            const studentSearch = await studentSearch(data.access_token, params);
            log.info("Received from API: " + JSON.stringify(studentSearch, null, 2));
        }).catch((error => {
            log.error(error)
            throw new Error("Setup failed" + error);
        }))})
    .after(async ctx => {
        log.info("Performing tear-down operation");
    })
    .requestHooks(requestLogger)
    .beforeEach(async t => {
        await login.staffLogin(credentials.adminCredentials, base_url);
        await t.maximizeWindow();
    }).afterEach(() => log.info(apiCallsFailed(requestLogger, api_html_status_threshold)));

/**
 * Test concept for:
 * 1. Getting token from keycloak
 * 2. Simulate data loading directly to API (GET request in this case)
 * 3. Loading a page from the front-end
 */
test('get_Token_Load_From_API_Then_Hit_Main_Page', async t => {
    // hit the login screen and see if it loads
    await t.click(screen.getByText('Graduation Records and Achievement Data'));
    log.info("GRAD page loaded successfully!");
})
.meta({
    testSuites: {
        smoke: false,
        regression: false,
    }
});