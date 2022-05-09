import { base_url } from '../../config/constants';
import { screen } from '@testing-library/testcafe';

const log = require('npmlog');
const { getToken } = require('../../helpers/oauthUtils');
const { studentSearch } = require('../../services/studentApiService');

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
            const studentSearch = await studentSearch(data.access_token);
            log.info("Received from API: " + JSON.stringify(studentSearch, null, 2));
        }).catch((error => {
            log.error(error)
            throw new Error("Setup failed")
        }))})
    .after(async ctx => {
        log.info("Performing tear-down operation");
    });

/**
 * Test concept for:
 * 1. Getting token from keycloak
 * 2. Simulate data loading directly to API (GET request in this case)
 * 3. Loading a page from the front-end
 */
test('get_Token_Load_From_API_Then_Hit_Main_Page', async t => {
    // hit the login screen and see if it loads
    await t.click(screen.getByText('Welcome to the Education Data Exchange!'));
    log.info("EDX Login page loaded successfully!");
});