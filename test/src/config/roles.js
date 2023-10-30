import { Role } from 'testcafe';
import { base_url, credentials } from './constants';

const adminUser = Role(base_url + '?login=noidir', async t => {
    await t
        .click('p#login_descriptor + div.card-body a');

    await t
        .typeText('#user', credentials.adminCredentials.username)
        .typeText('#password', credentials.adminCredentials.password)
        .click('.login-form-action [type="submit"]');
});

module.exports = adminUser;