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
        status: '#student-status-select',
        grade: '#student-grade-select',
        schoolOfRecord: '#school-of-record-autoselect',
        schoolAtGraduation: '#school-at-graduation-autoselect',
        selections: 'div.v-menu',
        saveStatusBtn: '#save-status-btn',
        table: '.graduation-status > .v-card > .v-card-text > .v-table > .v-table__wrapper > table',
        statusText: 'tbody > tr:nth-child(3) > td:nth-child(2) > span',
        gradeText: 'tbody > tr:nth-child(4) > td:nth-child(2) > span',
        schoolOfRecordText: 'tbody > tr:nth-child(5) > td:nth-child(2) span.v-btn__content',
        schoolAtGraduationText: 'tbody > tr:nth-child(6) > td:nth-child(2) span.v-btn__content',
    }
}