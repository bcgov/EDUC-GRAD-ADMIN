// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { Routes } from "../../../frontend/src/utils/constants"
import selectors from "./selectors"

function createLoginSession() {
    cy.session('loginSession', () => {
        cy.visit(Routes.LOGIN)
        cy.get(selectors.login.idirLoginBtn).click()
        cy.get(selectors.login.user).type(Cypress.env('username'))
        cy.get(selectors.login.password).type(Cypress.env('password'))
        cy.get(selectors.login.idirSubmitBtn).click()
        cy.get(selectors.studentSearch.title).should('contain.text', 'Student Search')
    })
}

function elementExists(selector) {
    return cy.document().then((doc) => {
        return Cypress.$(selector, doc).length > 0
    })
}
 
function resetDataToOriginal() {
    const test_student1 = Cypress.env('test_student1')
    // Edit
    cy.get(selectors.studentSearch.editBtn).click()
    cy.get(selectors.studentSearch.status).click({force: true})
    cy.get(selectors.studentSearch.selections).contains(test_student1.original_status).click()
    cy.get(selectors.studentSearch.grade).click({force: true})
    cy.get(selectors.studentSearch.selections).contains(test_student1.original_grade).click()
    cy.get(selectors.studentSearch.schoolOfRecord).click({force: true})
    cy.get(selectors.studentSearch.selections).contains(test_student1.original_school).click()
    cy.get(selectors.studentSearch.schoolAtGraduation).click({force: true})
    cy.get(selectors.studentSearch.selections).contains(test_student1.original_school).click()
    cy.get(selectors.studentSearch.saveStatusBtn).click()
}

Cypress.Commands.add('login', createLoginSession)
Cypress.Commands.add('doesExist', elementExists)
Cypress.Commands.add('resetDataToOriginal', resetDataToOriginal)

Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})