import { Role } from 'testcafe';
import { base_url, credentials } from './constants';

const adminUser = Role(base_url + '?login=noidir', async t => {
    await t
        .typeText('#username', credentials.adminCredentials.username)
        .typeText('#password', credentials.adminCredentials.password)
        .click('#kc-login');
});

module.exports = adminUser;
