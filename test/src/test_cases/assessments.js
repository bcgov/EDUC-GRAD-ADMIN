import { base_url, api_html_status_threshold } from '../config/constants';
import { RequestLogger, Selector } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import adminUser from '../config/roles';
import AssessmentsPage from '../page_objects/assessmentsPage';

const log = require('npmlog');
const assessmentLogger = RequestLogger(/api\/v1\/assessment/, { logResponseBody: true, logResponseHeaders: true });
const assessmentsPage = new AssessmentsPage();

fixture `assesments-page`
    .requestHooks(assessmentLogger)
    .page(base_url)
    .beforeEach( async t => {
        await t
        .useRole(adminUser)
        .navigateTo(base_url)
        .click(assessmentsPage.view);
    })
    .afterEach(() => log.info(apiCallsFailed(assessmentLogger, api_html_status_threshold)));

    test('assessments table loads', async t => {
        await t
        .click(assessmentsPage.assessmentTab);

        await t
        .expect(Selector('div.active table[aria-colcount="5"]').exists).ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
            qa: true,
        }
    });

    test('assessments requirements table loads', async t => {
        await t
        .click(assessmentsPage.assessmentRequirementsTab);

        await t
        .expect(Selector('div.active table[aria-colcount="6"]').exists).ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
            qa: true,
        }
    });
