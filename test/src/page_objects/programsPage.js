import { Selector, t } from 'testcafe';


class ProgramsPage {
    constructor() {

        this.view = Selector('#programs-route');

        // selectors for assertions
        this.testRowExists = Selector('tr[role="row"][aria-rowindex="2"]');

        //tabs
        this.algorithmRulesTab = Selector('a.nav-link').withExactText('Algorithm rules');

        this.programsDropdown= Selector('#programs-dropdown__BV_toggle_');
        this.programsTab= Selector('#programs-dropdown__BV_toggle_menu_ a').withExactText('Programs');
        this.programRulesTab= Selector('#programs-dropdown__BV_toggle_menu_ a').withExactText('Program rules');
        this.transcriptMessageTab= Selector('#programs-dropdown__BV_toggle_menu_ a').withExactText('Transcript message');
        
        this.optionalProgramsDropdown= Selector('#optional-programs-dropdown__BV_toggle_');
        this.optionalProgramsTab= Selector('optional-programs-dropdown__BV_toggle_menu_ a').withExactText('Optional programs');
        this.optionalProgramRulesTab= Selector('optional-programs-dropdown__BV_toggle_menu_ a').withExactText('Optional program rules');

        this.letterGradesTab = Selector('a.nav-link').withExactText('Letter grades');
        this.specialCasesTab = Selector('a.nav-link').withExactText('Special cases');
        this.requirementTypeCodeTab = Selector('a.nav-link').withExactText('Requirement type code');

        // Other page elements
        this.algorithmRulesTable = Selector('#algorithm-rules table');
        this.graduationProgramsTable = Selector('#graduation-programs table');

    }
    // select with controller
    async selectAlgorithmRulesTab() {
        await t
        .click(this.algorithmRulesTab);
    }

    async selectProgramsTab() {
        await t
        .click(this.programsDropdown)
        .click(this.programsTab);
    }

    async selectProgramRulesTab() {
        await t
        .click(this.programsDropdown)
        .click(this.selectProgramRulesTab);
    }

    async selectTranscriptMessageTab() {
        await t
        .click(this.programsDropdown)
        .click(this.transcriptMessageTab);
    }

    async selectOptionalProgramsTab() {
        await t
        .click(this.optionalProgramsDropdown)
        .click(this.optionalProgramsTab);
    }

    async selectOptionalProgramRulesTab() {
        await t
        .click(this.optionalProgramsDropdown)
        .click(this.optionalProgramRulesTab);
    }

    async selectLetterGradesTab() {
        await t
        .click(this.letterGradesTab);
    }

    async selectSpecialCasesTab() {
        await t
        .click(this.specialCasesTab);
    }

    async selectRequirementTypeCodeTab() {
        await t
        .click(this.requirementTypeCodeTab);
    }
    

}

export default ProgramsPage;
