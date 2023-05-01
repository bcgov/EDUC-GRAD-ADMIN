import { base_url, api_html_status_threshold, max_acceptable_timeout } from '../config/constants';
import { RequestLogger, Selector } from 'testcafe';
import { apiCallsFailed } from '../helpers/requestHelper';
import adminUser from '../config/roles';
import CodesPage from '../page_objects/codesPage';

const log = require('npmlog');
const codesLogger = RequestLogger(/api\/v1/, {logResponseBody: true, logRequestBody: true});
const codesPage = new CodesPage();

fixture `codes-page`
    .requestHooks(codesLogger)
    .page(base_url)
    .beforeEach( async t => {
        await t
        .useRole(adminUser)
        .navigateTo(base_url)
        .click(codesPage.view);
    })
    .afterEach( () => log.info(apiCallsFailed(codesLogger, api_html_status_threshold)));

    test('career program codes', async t => {
        log.info(' - testing "Career Program Codes" table loads');

        await t
        .click(codesPage.careerProgramCodesTab)
        .expect(codesPage.testRowExists.exists)
        .ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });

    test('credentials > certificate types', async t => {
        log.info(' - testing "Certificate Types" table loads');

        await t
        .click(codesPage.credentialsSelector)
        .click(codesPage.certificateTypesTab)
        .expect(codesPage.testRowExists.exists)
        .ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });

    test('credentials > transcript types', async t => {
        log.info(' - testing "Transcript Types" table loads');
        
        await t
        .click(codesPage.credentialsSelector)
        .click(codesPage.transcriptTypesTab)
        .expect(codesPage.testRowExists.exists)
        .ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });

    test('credentials > program certificate transcript', async t => {
        log.info(' - testing "Program Certificate Transcript" table loads');
        
        await t
        .click(codesPage.credentialsSelector)
        .click(codesPage.programCertificateTranscriptTab)
        .expect(codesPage.testRowExists.exists)
        .ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });

    test('credentials > digital signature', async t => {
        log.info(' - testing "Digital Signature" table loads');
        
        await t
        .click(codesPage.credentialsSelector)
        .click(codesPage.digitalSignatureTab)
        .expect(codesPage.testRowExists.exists)
        .ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });

    test('credentials > signature block', async t => {
        log.info(' - testing "Signature Block" table loads');
        
        await t
        .click(codesPage.credentialsSelector)
        .click(codesPage.signatureBlockTab)
        .expect(codesPage.testRowExists.exists)
        .ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });

    test('credentials > document status codes', async t => {
        log.info(' - testing "Document Status Codes" table loads');
        
        await t
        .click(codesPage.credentialsSelector)
        .click(codesPage.documentStatusCodesTab)
        .expect(codesPage.testRowExists.exists)
        .ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });

    test('report types', async t => {
        log.info(' - testing "Report Types" table loads');

        await t
        .click(codesPage.reportTypesTab)
        .expect(codesPage.testRowExists.exists)
        .ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });

    test('student status codes', async t => {
        log.info(' - testing "Student Status Codes" table loads');

        await t
        .click(codesPage.studentStatusCodesTab)
        .expect(codesPage.testRowExists.exists)
        .ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });

    test('undo completion reason codes', async t => {
        log.info(' - testing "Undo Completion Reason Codes" table loads');

        await t
        .click(codesPage.undoCompletionReasonCodesTab)
        .expect(codesPage.testRowExists.exists)
        .ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });

    test('history activity codes', async t => {
        log.info(' - testing "History Activity Codes" table loads');

        await t
        .click(codesPage.historyActivityCodesTab)
        .expect(codesPage.testRowExists.exists)
        .ok();
    })
    .meta({
        testSuites: {
            smoke: true,
            regression: true,
        }
    });
