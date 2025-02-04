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

function login() {
    cy.session('loginSession', () => {
        cy.visit(Routes.LOGIN)
        cy.get(selectors.login.idirLoginBtn).click()
        cy.get(selectors.login.user).type(Cypress.env('username'))
        cy.get(selectors.login.password).type(Cypress.env('password'))
        cy.get(selectors.login.idirSubmitBtn).click()
        cy.get(selectors.studentSearch.title).should('contain.text', 'Student Search')
    })
}

function doesExist(selector) {
    return cy.get('body').then(($body) => {
        return $body.find(selector).length > 0
    })
}

Cypress.Commands.add('login', login)
Cypress.Commands.add('doesExist', doesExist)

Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})