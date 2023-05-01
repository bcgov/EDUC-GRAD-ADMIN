import { Selector, t } from 'testcafe';

class AssessmentsPage {
    constructor() {

        this.view = Selector('#assessments-route');

        this.assessmentTab = Selector('a.nav-link').withExactText('Assessment');
        this.assessmentTable = Selector('#assessment-table');

        this.assessmentRequirementsTab = Selector('a.nav-link').withExactText('Assessment Requirements');

    }
}

export default AssessmentsPage;
