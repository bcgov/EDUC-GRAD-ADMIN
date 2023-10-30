import { Selector, t } from 'testcafe';

class PSIPage {
    constructor() {

        this.view = Selector('#psi-route');

        // search elements
        this.psiCode = Selector('.advanced-search-field > label').withExactText('PSI Code').sibling('input');
        this.psiCodeWildcard = Selector('.advanced-search-field > label').withExactText('PSI Code').sibling('div.wild-card-button');

        this.psiName = Selector('.advanced-search-field > label').withExactText('PSI Name').sibling('input');
        this.psiNameWildcard = Selector('.advanced-search-field > label').withExactText('PSI Name').sibling('div.wild-card-button');

        this.cslCode = Selector('.advanced-search-field > label').withExactText('CSL Code').sibling('input');
        this.cslCodeWildcard = Selector('.advanced-search-field > label').withExactText('CSL Code').sibling('div.wild-card-button');

        this.openFlag = Selector('.advanced-search-field > label').withExactText('Active').sibling('select');
        this.optionY = this.openFlag.child('option').withExactText('Y');
        this.optionN = this.openFlag.child('option').withExactText('N');
        
        this.transmissionMode = Selector('.advanced-search-field > label').withExactText('Transmission Mode').sibling('input');
        //this.transmissionModeWildcard = Selector();

        this.psiGrouping = Selector('.advanced-search-field > label').withExactText('PSI Grouping').sibling('input');
        this.psiGroupingWildcard = Selector('.advanced-search-field > label').withExactText('PSI Grouping').sibling('input');

         // form buttons
         this.searchSubmit = Selector('div.active button').withExactText('Search');
         this.formReset = Selector('button').withExactText('Reset');

         this.searchMessage = Selector('.search-results-message strong');

    }
}

export default PSIPage;
