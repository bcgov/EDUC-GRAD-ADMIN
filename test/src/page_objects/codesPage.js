import { Selector, t } from 'testcafe';

class CodesPage {
    constructor() {

        this.view = Selector('#codes-route');
        
        // selectors for assertions
        this.testRowExists = Selector('tr[role="row"][aria-rowindex="2"]');

        // tabs
        this.careerProgramCodesTab = Selector('a.nav-link').withExactText('Career Program Codes');
        this.reportTypesTab = Selector('a.nav-link').withExactText('Report Types');
        this.studentStatusCodesTab = Selector('a.nav-link').withExactText('Student Status Codes');
        this.undoCompletionReasonCodesTab = Selector('a.nav-link').withExactText('Undo Completion Reason Codes');
        this.historyActivityCodesTab = Selector('a.nav-link').withExactText('History Activity Codes');

        this.credentialsSelector = Selector('#credentials-dropdown a.nav-link').withExactText('Credentials');
        this.certificateTypesTab = Selector('#credentials-dropdown ul li a.nav-link').withExactText('Certificate Types');
        this.transcriptTypesTab = Selector('#credentials-dropdown ul li a.nav-link').withExactText('Transcript Types');
        this.programCertificateTranscriptTab = Selector('#credentials-dropdown ul li a.nav-link').withExactText('Program Certificate Transcript');
        this.digitalSignatureTab = Selector('#credentials-dropdown ul li a.nav-link').withExactText('Digital Signature');
        this.signatureBlockTab = Selector('#credentials-dropdown ul li a.nav-link').withExactText('Signature Block');
        this.documentStatusCodesTab = Selector('#credentials-dropdown ul li a.nav-link').withExactText('Document Status Codes');
        
    }
}

export default CodesPage;
