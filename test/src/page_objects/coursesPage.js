import { Selector, t } from 'testcafe';

class CoursesPage {
    constructor() {

        // tabs
        this.courseTab = Selector('a[role=tab]').withExactText('Course');
        this.restrictionsTab = Selector('a[role=tab]').withExactText('Course restrictions');
        this.requirementsTab = Selector('a[role=tab]').withExactText('Course requirements');

        // course search elements
        this.TRAXCode = Selector('#trax-code-input');
        this.gradeLevel = Selector('#grade-level-input');
        this.courseTitle = Selector('#course-title-input');
        this.instructionLanguage = Selector('#instruction-lang-select');
        this.TRAXStartDate = Selector('#datepicker-startDate');
        this.TRAXEndDate = Selector('#datepicker-endDate');
        
        // course restrictions
        
        // course requirements search elements
        this.courseCode = Selector('#course-code-input');
        this.courseLevel = Selector('#course-level-input');
        this.ruleNumber = Selector('#rule-number-input');
        
        // form buttons
        this.searchSubmit = Selector('button').withExactText('Search');
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
        await t
        .typeText('test');
    }
}

export default CoursesPage;
