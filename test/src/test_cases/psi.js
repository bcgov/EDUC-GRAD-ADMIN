import { base_url, api_html_status_threshold, max_acceptable_timeout } from '../config/constants';
import { RequestLogger, Selector } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import adminUser from '../config/roles';
import PSIPage from '../page_objects/psiPage';

const log = require('npmlog');
const psiLogger = RequestLogger(/api\/v1\/trax\/psi/, {logResponseBody: true, logResponseHeaders: true});
const psiPage = new PSIPage();

const testData = {
    psi0: {name: 'No PSIs found', psiCode: '000', cslCode: '0000', active: 'Y', transmissionMode: 'XML'},
    psi1: {name: 'CAMOSUN COLLEGE', psiCode: '271', cslCode: 'AJAA', active: 'Y', transmissionMode: 'XML'},
    psi2: {name: 'CAMOSUN COLLEGE INTERURBAN', psiCode: 'Q75', cslCode: 'AJAA', active: 'N', transmissionMode: 'PAPER'},
    psi3: {name: 'UNIVERSITY OF VICTORIA', psiCode: '201', cslCode: 'AUAF', active: 'Y', transmissionMode: 'XML'},
    psi4: {name: 'VICTORIA CONSERVATORY OF MUSIC', psiCode: '658', cslCode: 'APAR', active: 'Y', transmissionMode: 'PAPER'},
}

const searchMessageResults = {
    notFound: 'No PSIs found',
    emptySearch: 'Enter at least one field to search.',
}

fixture `psi-page`
    .requestHooks(psiLogger)
    .page(base_url)
    .beforeEach( async t => {
        await t
        .useRole(adminUser)
        .navigateTo(base_url)
        .click(psiPage.view);
    })
    .afterEach(() => log.info(apiCallsFailed(psiLogger, api_html_status_threshold)));

    test('empty', async t => {
        log.info(' - testing empty search on PSI view');

        await t
        .click(psiPage.searchSubmit);

        await t
        .expect(await psiPage.searchMessage.textContent).contains(searchMessageResults.emptySearch);
        
        log.info(' - testing empty search after form reset on PSI view');
        
        await t
        .click(psiPage.psiCode)
        .typeText(psiPage.psiCode, testData.psi0.psiCode)
        .click(psiPage.psiName)
        .typeText(psiPage.psiName, testData.psi0.name);
        
        await t
        .click(psiPage.formReset)
        .expect(await psiPage.searchMessage.textContent).contains(searchMessageResults.emptySearch);

    })
    .meta({
        testSuites: {
            smoke: false,
            regression: true,
        }
    });

    test('valid search', async t => {
        log.info(' - testing search with valid PSI Code in PSI view');
        await t
        .click(psiPage.psiCode)
        .typeText(psiPage.psiCode, testData.psi1.psiCode)
        .click(psiPage.searchSubmit);

        await t
        .expect(await psiPage.searchMessage.textContent)
        .contains('1')
        
        await t
        .expect(Selector('div.table-responsive td[data-label="PSI Name"] div').textContent)
        .contains(testData.psi1.name);
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
            qa: false,
        }
    });

    test('PSI doesn\'t exist', async t => {
        await t
        .click(psiPage.psiCode)
        .typeText(psiPage.psiCode, 'XXX')
        .click(psiPage.searchSubmit);

        await t
        .expect(psiPage.searchMessage.textContent)
        .contains('No PSIs found');
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
            qa: true,
        }
    });

    test('Search on PSI Code', async t => {
        await t
        .click(psiPage.psiCode)
        .typeText(psiPage.psiCode, '00*')
        .click(psiPage.searchSubmit);

        await t
        .expect(psiPage.searchMessage.textContent)
        .contains('9');
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
            qa: true,
        }
    });
    
    test('Search on PSI Name', async t => {
        await t
        .click(psiPage.psiName)
        .typeText(psiPage.psiName, 'alberta college*')
        .click(psiPage.searchSubmit);

        await t
        .expect(psiPage.searchMessage.textContent)
        .contains('4');
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
            qa: true,
        }
    });
    
    test('Search on CSL Code', async t => {
        await t
        .click(psiPage.cslCode)
        .typeText(psiPage.cslCode, 'DU*')
        .click(psiPage.searchSubmit);

        await t
        .expect(psiPage.searchMessage.textContent)
        .contains('5');
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
            qa: true,
        }
    });
    
    test('Search on Active flag and transmission mode', async t => {
        await t
        .click(psiPage.openFlag)
        .click(psiPage.optionY)
        .click(psiPage.transmissionMode)
        .typeText(psiPage.transmissionMode, 'FTP')
        .click(psiPage.searchSubmit);

        await t
        .expect(psiPage.searchMessage.textContent)
        .contains('8');
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
            qa: true,
        }
    });

