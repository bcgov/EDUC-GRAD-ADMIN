export default {
	rows: '.v-table tbody tr:visible',
	selections: '.v-menu',

	login :{
		username: 'input#username',
		user: 'input#user',
		password: 'input#password',
		loginBtn: '.v-toolbar__content a[href="/api/auth/login"]',
		idirLoginBtn: 'a#social-idir',
		idirSubmitBtn: 'input[value=Continue]',
	},

	studentSearch: {
		title: '.studentlist > h1',
		searchByPEN: 'input#search-by-pen',
		searchSubmit: 'button#search-submit',
		editBtn: '.graduation-status > button',
		saveStatusBtn: '#save-status-btn',
		
		studentProfileView: '.student-profile',
		editForm: 'body > .v-overlay-container  .v-overlay__content > .v-card',
		program: '[data-cy="program-select"] input',
		programCompletionDate: '[data-cy="program-completion-date-textfield"] input',
		status: '[data-cy="student-status-select"] input',
		grade: '[data-cy="student-grade-select"] input',
		schoolOfRecord: '[data-cy="school-of-record-autoselect"] input',
		schoolOfRecordAutoselectText: '[data-cy="school-of-record-autoselect"] .v-autocomplete__selection-text',
		schoolAtGraduation: 'p[data-cy="school-at-graduation-text"]',
		adultStartDate: '[data-cy="adult-start-date-textfield"] input',
		recalcGrad: '[data-cy="recalculate-grad-select"] input',
		recalcProjected: '[data-cy="recalculate-projected-select"] input',
		errorMsg: 'div.bg-error',
		warningMsg: 'div.bg-warning',
		snackBar: '.v-overlay .v-snackbar__content',

		table: '.graduation-status > .v-card > .v-card-text > .v-table > .v-table__wrapper > table',
		programText: 'tbody > tr:nth-child(1) > td:nth-child(2)',
		programCompletionDateText: 'tbody > tr:nth-child(2) > td:nth-child(2)',
		statusText: 'tbody > tr:nth-child(3) > td:nth-child(2)',
		gradeText: 'tbody > tr:nth-child(4) > td:nth-child(2)',
		schoolOfRecordText: 'tbody > tr:nth-child(5) > td:nth-child(2)',
		schoolAtGraduationText: 'tbody > tr:nth-child(6) > td:nth-child(2)',
		honoursStandingText: 'tbody > tr:nth-child(7) > td:nth-child(2)',
		gpaText: 'tbody > tr:nth-child(8) > td:nth-child(2)',
		optionalProgramsText: 'tbody > tr:nth-child(9) > td:nth-child(2)',
		adultStartDateText: 'tbody > tr:nth-child(10) > td:nth-child(2)',
		cerText: 'tbody > tr:nth-child(11) > td:nth-child(2)',
		recalcGradText: 'tbody > tr:nth-child(12) > td:nth-child(2)',
		recalcProjectedText: 'tbody > tr:nth-child(13) > td:nth-child(2)',

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
		activeWindow: '.student-profile .v-card-text > .v-window > .v-window__container > .v-window-item:visible',
		noRow: '.v-table__wrapper .v-data-table-rows-no-data',
		firstRow: '.v-table__wrapper .v-data-table__tr:nth-child(1)',
		firstExpandArrow: '.v-table__wrapper .v-data-table__tr:nth-child(1) > td:nth-child(1) > td > button:visible',
		secondRowJsonData: '.v-table__wrapper tr:nth-child(2) > td > div > pre:visible',

		advancedSearchBtn: 'button[value="advance"]',
		legalSurnameInput: 'input#legal-surname-input',
		legalGivennameInput: 'input#legal-given-input',
		genderSelection: 'input#gender-select',
		advSearchSubmit: 'button#adv-search-submit',
		advSearchReset: 'button#adv-search-reset-button',
		searchResultTableRow: 'div.table-responsive .v-table__wrapper tbody > tr',
		penLink: 'td:nth-child(2) > a',

		optionalTableRows: 'div > div > .v-table > .v-table__wrapper > table > tbody > .v-data-table__tr',
		chooseOptional: 'body > div.v-overlay-container .v-overlay__content .v-window-item:nth-child(1) input[type="text"]',
		nextOptional: 'body > div.v-overlay-container .v-overlay__content > .v-sheet > .row > button.v-btn--elevated',
		deleteOptionalBtn: 'i.mdi-delete-forever',
		deleteOptionalConfirmBtn: 'body > div.v-overlay-container .v-overlay__content .v-card-actions > button.bg-error',
		addNoteBtn: '.v-row > button',
		noteTextarea: 'body > div.v-overlay-container .v-overlay__content .v-card-text textarea',
		addNoteConfirmBtn: 'body > div.v-overlay-container .v-overlay__content .v-card-actions button.bg-error',
		editNoteBtn: 'i.mdi-pencil',
		editTextarea: '.v-list-item textarea',
		saveNoteBtn: '.v-list-item button.bg-error',
		deleteNoteBtn: 'i.mdi-delete',
		errorMsg: '.studentlist .text-error > .v-alert__content:visible',

		transcriptTVRBtn: 'button#actions',
		undoCompletionReasonInput: '.v-overlay-container .v-card-text input[type="text"]',
		undoCompletionReasonTextarea: '.v-overlay-container .v-card-text textarea',
		undoCompletionConfirmCheckbox: '.v-overlay-container .v-card-text input[type="checkbox"]',
		undoCompletionBtn: '.v-overlay-container .v-card-actions > button.bg-error',
		noCompletionCard: '.requirements-not-met .v-card-text',
		graduationReportsCard: '.graduation-reports',
		certificateDogwoodsCard: '.certification-dogwoods',
		requirementMetCard: '.requirements-met',
		pdfLink: 'a.pdf-link',
	},

	programs: {
		navBtn: 'a[href="/programs"]',
		programsView: '.programs-all',
		navSlider: 'main .v-slide-group__container',
		itemPerPage: 'button[role="combobox"][aria-haspopup="listbox"]',
	},

	courses: {
		navBtn: 'a[href="/courses"]',
		coursesView: '.courses-all',
		advancedSearchForm: '.advanced-search-form',
		courseNav: 'button[value="courseTab"]',
		courseRestrictionNav: 'button[value="courseRestrictionsTab"]',
		courseRequirementsNav: 'button[value="courseRequirementsTab"]',
		courseReqForm: 'form#courseReqForm',
		fineArtAppliedSkillNav: 'button[value="fineArtsAppliedSkillsTab"]',
		examSpecialCaseNav: 'button[value="examSpecialCaseCodesTab"]',
		equivalencyOrChallengeCodesNav: 'button[value="equivalentOrChallengeCodesTab"]',
		errorMsg: '.text-error > .v-alert__content'
	},

	assessments: {
		navBtn: 'a[href="/assessments"]',
		assessmentsView: '.assessments-view',
		navSlider: 'main .v-slide-group__container',
		itemPerPage: 'div[role="combobox"][aria-haspopup="listbox"]',
	},

	schools: {
		navBtn: 'a[href="/schools"]',
	},

	psi: {
		navBtn: 'a[href="/psi"]',
		psiView: '.psi-view', 
		psiReqForm: 'form#psiReqForm',
		psiCodeInput: 'input#psiCode',
		psiNameInput: 'input#psiName',
		cslCodeInput: 'input#cslCode',
		activeFlagSelection: 'form#psiReqForm div[role="combobox"] input',
		transmissionModeInput: 'input#transmissionMode',
		errorMsg: '#psiReqForm div.text-error:visible'
	},

	codes: {
		navBtn: 'a[href="/codes"]',
		codesView: '.codes-view', 
		careerProgramCodesBtn: 'a[href="/codes/career-programs"]',
		credentialsBtn: '.v-slide-group__content > button[role="tab"]',
		reportTypesBtn: 'a[href="/codes/report-types"]',
		studentStatusCodesBtn: 'a[href="/codes/student-status-codes"]',
		undoCompletionReasonCodesBtn: 'a[href="/codes/ungrad-reasons"]',
		historyActivityCodeBtn: 'a[href="/codes/history-activity"]',
		batchTypeCodesBtn: 'a[href="/codes/batch-types"]',
	},

	reports: {
		navBtn: 'a[href="/school-reports"]',
		reportsView: '.reports-view',
		schoolReportsTab: 'button[value="schoolReportsTab"]',
		districtReportsTab: 'button[value="districtReportsTab"]',
		mincodeAuto: 'input#mincode',
		districtAuto: 'input#districtId',
		resultTable: '.reports-view div[sortkey="report"]',
		advancedSearchButtons: '.advanced-search-button:visible',
		messageAlert: '.advanced-search-form > div > div.text-error:visible'
	},

	batchProcessing: {
		navBtn: 'a[href="/batch-processing"]',
		batchProcessingView: '.batch-processing-view',
		batchRunsBtn: 'button[value="batchRuns"]',
		newRequestBtn: 'button[value="newBatchRequest"]',
		userScheduledBtn: 'button[value="scheduledRuns"]',
		scheduledRoutinesBtn: 'button[value="batchRoutines"]',
		overlayWindow: 'body > .v-overlay-container > .v-overlay--active > .v-overlay__content .v-sheet',
		innerCard: 'body > .v-overlay-container > .v-overlay--active > .v-overlay__content .v-sheet > .v-window > .v-window__container > .v-window-item:visible > .v-row:nth-child(2)',
		autocomplete: '.v-autocomplete input',
		numberInput: 'input[type="number"]',
		batchTable: '.v-table__wrapper > table > tbody:visible',
		itemPerPage: 'div[role="combobox"][aria-haspopup="listbox"]',
		firstRow: '.v-table:visible tbody tr.v-data-table__tr:nth-child(1)',
		secondRow: '.v-table:visible tbody tr:nth-child(2)',
		batchStatusCol: 'td:nth-child(7)',
		viewBatchResultBtn: '.v-overlay-container .v-overlay__content .v-list > .v-list-item:nth-child(1)',
		rerunSchoolReportBtn: '.v-overlay-container .v-overlay__content .v-list > .v-list-item:nth-child(2)',
		batchJobResultWrapper: '.v-row > div:nth-child(2)',
		batchJobResultNoData: 'tr.v-data-table-rows-no-data'
	}
}