import { base_url, api_html_status_threshold, max_acceptable_timeout } from '../config/constants';
import { RequestLogger, Selector } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import adminUser from '../config/roles';
import ProgramsPage from '../page_objects/programsPage';

const log = require('npmlog');
const programsLogger = RequestLogger(/api\/v1/, {logResponseBody: true, logResponseHeader: true});
const programsPage = new ProgramsPage();

fixture `programs-page`
    .requestHooks(programsLogger)
    .page(base_url)
    .beforeEach( async t => {
        await t
        .useRole(adminUser)
        .navigateTo(base_url)
        .click(programsPage.view);
    })
    .afterEach( () => log.info(apiCallsFailed(programsLogger, api_html_status_threshold)));

    test('algorithm rules', async t => {
        log.info(' - testing "Algorithm rules" table loads');

        await t
        .click(programsPage.algorithmRulesTab)
        .expect(programsPage.testRowExists.exists)
        .ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });

    test('letter grades', async t => {
        log.info(' - testing "Letter grades" table loads');

        await t
        .click(programsPage.letterGradesTab)
        .expect(programsPage.testRowExists.exists)
        .ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });
