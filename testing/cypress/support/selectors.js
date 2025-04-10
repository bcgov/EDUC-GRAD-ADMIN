export default {
    login :{
        username: '#username',
        user: '#user',
        password: '#password',
        loginBtn: 'a[href="/api/auth/login"]',
        idirLoginBtn: '#social-idir',
        idirSubmitBtn: 'input[value=Continue]',
    },

    studentSearch: {
        title: 'div.studentlist > h1',
        searchByPEN: '#search-by-pen',
        searchSubmit: '#search-submit',
        editBtn: '.graduation-status > button',
        status: '[data-cy="student-status-select"] input',
        grade: '[data-cy="student-grade-select"] input',
        schoolOfRecord: '[data-cy="school-of-record-autoselect"] input',
        schoolAtGraduation: '[data-cy="school-at-graduation-autoselect"] input',
        selections: 'div.v-menu',
        saveStatusBtn: '#save-status-btn',
        table: '.graduation-status > .v-card > .v-card-text > .v-table > .v-table__wrapper > table',
        statusText: 'tbody > tr:nth-child(3) > td:nth-child(2) > span',
        gradeText: 'tbody > tr:nth-child(4) > td:nth-child(2) > span',
        schoolOfRecordText: 'tbody > tr:nth-child(5) > td:nth-child(2) span.v-btn__content',
        schoolAtGraduationText: 'tbody > tr:nth-child(6) > td:nth-child(2) span.v-btn__content',
        gradBtn: 'button[value="GRAD"]',
        coursesBtn: 'button[value="Courses"]',
        assessmentBtn: 'button[value="Assessments"]',
        examsBtn: 'button[value="Exams"]',
        optionalBtn: 'button[value="Optional"]',
        auditBtn: 'button[value="Audit"]',
        optionalProgramChangeHistoryBtn: 'button[value="optionalProgramChangeHistory"]',
        undoBtn: 'button[value="Undo Completion Reasons"]',
        coursesWindow:  '[data-cy="courses-window-item"]',
        assessmentsWindow: '[data-cy="assessments-window-item"]',
        examsWindow: '[data-cy="exams-window-item"]',
        optionalWindow: '[data-cy="optional-window-item"]',
        auditWindow: '[data-cy="audit-window-item"]',
        undoWindow: '[data-cy="undo-window-item"]',
        noRow: '.v-table__wrapper .v-data-table-rows-no-data',
        rows: '.v-table__wrapper .v-data-table__tr',

        advancedSearchBtn: 'button[value="advance"]',
        legalSurnameInput: 'input#legal-surname-input',
        legalGivennameInput: 'input#legal-given-input',
        advSearchSubmit: 'button#adv-search-submit',
        searchResultTableRow: 'div.table-responsive .v-table__wrapper tbody > tr',
        penLink: 'td:nth-child(2) > a'
    }
}