import { Selector, t } from 'testcafe';

class SchoolReportsPage {
    constructor() {
        //this.view = Selector('#school-reports-route');
        this.view = Selector('#navbar li a').withExactText('School Reports'); //use this until I have a build with the new ID up

        this.mincode = Selector('input#mincode');
        this.wildcard = Selector('input#mincode').sibling('div');
        this.searchSubmit = Selector('button').withExactText('Search');
        this.formReset = Selector('button').withExactText('Reset');
    }
}

export default SchoolReportsPage;
