import { Selector, t } from 'testcafe';

class CoursesPage {
    constructor() {

        this.view = Selector('#courses-route');
        // tabs
        this.courseTab = Selector('a[role=tab]').withExactText('Course');
        this.restrictionsTab = Selector('a[role=tab]').withExactText('Course restrictions');
        this.requirementsTab = Selector('a[role=tab]').withExactText('Course requirements');

        this.searchMessage = Selector('.active .search-results-message > strong');

        // course search elements
        //this.TRAXCode = Selector('#trax-code-input');
        // this.gradeLevel = Selector('#grade-level-input');
        // this.courseTitle = Selector('#course-title-input');
        // this.instructionLanguage = Selector('#instruction-lang-select');

        this.TRAXCode = Selector('.advanced-search-field > label').withExactText('TRAX Code').sibling('input');
        this.gradeLevel = Selector('.advanced-search-field > label').withExactText('TRAX Grade Level').sibling('input');
        this.courseTitle = Selector('.advanced-search-field > label').withExactText('Course Title').sibling('input');
        this.instructionLanguage = Selector('.advanced-search-field > label').withExactText('Instruction Language').sibling('select');
        this.TRAXStartDate = Selector('#datepicker-startDate');
        this.TRAXEndDate = Selector('#datepicker-endDate');
        
        // need to add an ID to this element later on; targeting using col count for now due to second table on crouses view.
        this.courseResults = Selector('.table-responsive table[aria-colcount="10"]');
        
        // course restrictions
        this.courseRestrictionsTab = Selector('.tab-content p.card-text table');
        this.courseRestrictionsFilter = Selector('#filter-input-course-restrictions');
        //this.courseCodeMain = Selector('th[role=columnheader][aria-colindex="1"]');

        // course requirements search elements
        this.courseCode = Selector('.advanced-search-field > label').withExactText('Course code').sibling('input');
        this.courseLevel = Selector('.advanced-search-field > label').withExactText('Course level').sibling('input');
        this.ruleNumber = Selector('.advanced-search-field > label').withExactText('Rule#').sibling('input');
        
        // form buttons
        this.searchSubmit = Selector('div.active button').withExactText('Search');
        this.formReset = Selector('button').withExactText('Reset');
    }

    // select tabs on courses page
    async selectCourseTab() {
        await t.click(this.courseTab);
    }

    async selectCourseRestrictionsTab() {
        await t.click(this.restrictionsTab);
    }

    async selectCourseRequirementsTab() {
        await t.click(this.requirementsTab);
    }

    // course search
    async courseSearch(code, grade, title, lang, start, end) {

        if (code) {
            await t.typeText(this.TRAXCode, code);
        }
        
        if (grade) {
            await t.typeText(this.gradeLevel, grade);
        }
        
        if (title) {
            await t.typeText(this.courseTitle, title);
        }
        
        if (lang) {
            await t.click(this.instructionLanguage)
            .click(this.instructionLanguage.child('option').withExactText(lang));
        }
        
        if(start) {
            await t.typeText(this.TRAXStartDate, start);
        }
        
        if (end) {
            await t.typeText(this.TRAXEndDate, end);
        }
        
        await t.click(this.searchSubmit);
    }

    // course restrictions table
    async getCellValue(col, row) {
        let t = await Selector(`tr[aria-rowindex="${row}"]>td[aria-colindex="${col}"]>div>div`).innerText;
        //console.log('debug output of cell: ', t);
        return t;
    }
}

export default CoursesPage;
