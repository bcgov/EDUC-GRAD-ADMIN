import { Role } from 'testcafe';
import { base_url, credentials } from '../config/constants';
const log = require('npmlog');

const studentAdmin = Role(base_url, async t => {
    log.info('Inputting credentials');
    await t
        .typeText('#user', credentials.adminCredentials.username)
        .typeText('#password', credentials.adminCredentials.password)
        .click('input[name="btnSubmit"][value="Continue"]');
});
module.exports = studentAdmin;