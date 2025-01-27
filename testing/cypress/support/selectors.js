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
        notesBtn: 'button[value="Notes"]',
        studentChangeHistoryBtn: 'button[value="studentChangeHistory"]',
        optionalProgramChangeHistoryBtn: 'button[value="optionalProgramChangeHistory"]',
        undoBtn: 'button[value="Undo Completion Reasons"]',
        coursesWindow:  '[data-cy="courses-window-item"]',
        assessmentsWindow: '[data-cy="assessments-window-item"]',
        examsWindow: '[data-cy="exams-window-item"]',
        optionalWindow: '[data-cy="optional-window-item"]',
        auditWindow: '[data-cy="audit-window-item"]',
        notesWindow: '[data-cy="notes-window-item"]',
        undoWindow: '[data-cy="undo-window-item"]',
        noRow: '.v-table__wrapper .v-data-table-rows-no-data',
        rows: '.v-table__wrapper .v-data-table__tr',
        firstExpandArrow: '.v-table__wrapper .v-data-table__tr:nth-child(1) > td:nth-child(1) > td > button:visible',
        secondRowJsonData: '.v-table__wrapper tr:nth-child(2) > td > div > pre:visible',

        advancedSearchBtn: 'button[value="advance"]',
        legalSurnameInput: 'input#legal-surname-input',
        legalGivennameInput: 'input#legal-given-input',
        advSearchSubmit: 'button#adv-search-submit',
        advSearchReset: 'button#adv-search-reset-button',
        searchResultTableRow: 'div.table-responsive .v-table__wrapper tbody > tr',
        penLink: 'td:nth-child(2) > a',

        chooseOptional: 'body > div.v-overlay-container .v-overlay__content .v-window-item:nth-child(1) input[type="text"]',
        nextOptional: 'body > div.v-overlay-container .v-overlay__content > .v-sheet > .row > button.v-btn--elevated',
        optionalProgramTable: '.v-table tbody > tr',
        deleteOptinalBtn: 'i.mdi-delete-forever',
        deleteOptionalConfirmBtn: 'body > div.v-overlay-container .v-overlay__content .v-card-actions > button.bg-error',
        addNoteBtn: '.v-row > button',
        noteTextarea: 'body > div.v-overlay-container .v-overlay__content .v-card-text textarea',
        addNoteConfirmBtn: 'body > div.v-overlay-container .v-overlay__content .v-card-actions button.bg-error',
        editNoteBtn: 'i.mdi-pencil',
        editTextarea: '.v-list-item textarea',
        saveNoteBtn: '.v-list-item button.bg-error',
        deleteNoteBtn: 'i.mdi-delete',
        errorMsg: 'div.studentlist div.text-error > .v-alert__content:visible'
    },

    programs: {
        navBtn: 'a[href="/programs"]',
        navSlider: 'main .v-slide-group__container',
        selections: 'div.v-menu',
        itemPerPage: 'div[role="combobox"][aria-haspopup="listbox"]',
        algorithmRulesTable: 'div#algorithm-rules table',
        programTable: 'div#graduation-programs table',
        programRuleTable: 'div#graduation-program-rules table',
        transcriptMessageTable: 'div#transcript-message table',
        optionalProgramTable: 'div.v-container[isoptionalprogram="true"] table',
        optionalProgramRuleTable: 'div#optional-graduation-program-rules table',
        otherTable: 'div.v-container, .v-container--fluid, .v-locale--is-ltr table',
        rows: 'tbody > tr',
    },

    courses: {
        navBtn: 'a[href="/courses"]',
        advancedSearchForm: 'div.advanced-search-form',
        activeWindow: 'div.courses-all div.v-window-item:visible',
        selections: 'div.v-menu',
        rows: 'table > tbody > tr',
        courseNav: 'button[value="courseTab"]',
        courseRestrictionNav: 'button[value="courseRestrictionsTab"]',
        courseRequirementsNav: 'button[value="courseRequirementsTab"]',
        courseReqForm: 'form#courseReqForm',
        fineArtAppliedSkillNav: 'button[value="fineArtsAppliedSkillsTab"]',
        examSpecialCaseNav: 'button[value="examSpecialCaseCodesTab"]',
        equivalencyOrChallengeCodesNav: 'button[value="equivalentOrChallengeCodesTab"]',
        errorMsg: 'div.text-error > .v-alert__content'
    },

    assessments: {
        navBtn: 'a[href="/assessments"]',
        navSlider: 'main .v-slide-group__container',
        selections: 'div.v-menu',
        itemPerPage: 'div[role="combobox"][aria-haspopup="listbox"]',
        assessmentsWindow: 'div.assessments-view > div > .v-card > .v-card-text > .v-window > .v-window__container > .v-window-item:nth-child(1)',
        requirementsWindow: 'div.assessments-view > div > .v-card > .v-card-text > .v-window > .v-window__container > .v-window-item:nth-child(2)',
        rows: 'table > tbody > tr',
    },

    schools: {
        navBtn: 'a[href="/schools"]',
        districtInput: 'input#district',
        mincodeInput: 'input#mincode',
        schoolNameInput: 'input#schoolName',
        schoolWindow: 'div.schools-view',
        rows: 'div.schools-view .v-table > .v-table__wrapper > table > tbody > tr'
    },

    batchProcessing: {
        navBtn: 'a[href="/batch-processing"]',
        newRequestBtn: 'button[value="newBatchRequest"]',
        selections: 'div.v-menu',
        overlayWindow: 'body > div.v-overlay-container > .v-overlay--active > .v-overlay__content .v-sheet',
        autocomplete: 'div.v-autocomplete__selection',
        batchRunsTable: 'div#id > .v-table__wrapper > table > tbody',
        newRow: 'tr.v-data-table__tr:nth-child(1)',
        batchStatusCol: 'td:nth-child(7)'
    }
}