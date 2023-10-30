import { Selector, t } from 'testcafe';

class SchoolsPage {
    constructor() {

        this.view = Selector('#schools-route');

        // search inputs
        this.districtInput = Selector('input#district');
        this.districtWildCard = Selector('input#district').sibling('div.wild-card-button');

        this.mincodeInput = Selector('input#mincode');
        this.mincodeWildcard = Selector('input#mincode').sibling('div.wild-card-button');

        this.schoolNameInput = Selector('input#schoolName');
        this.schoolNameWildcard = Selector('input#schoolName').sibling('div.wild-card-button');

        // form buttons
        this.searchSubmit = Selector('div.active button').withExactText('Search');
        this.formReset = Selector('button').withExactText('Reset');

        // search message
        this.searchMessage = Selector('div.search-results-message strong');

        // column selectors
        this.spmCode = Selector('div.table-responsive td[data-label="TRAX School Code"] div');
        this.schoolName = Selector('div.table-responsive td[data-label="TRAX School Name"] div');

    }
}

export default SchoolsPage;
