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
import selectors from "./selectors"

function login() {
	const loginSelectors = selectors.login
	cy.session('loginSession', () => {
		cy.visit('/')
		cy.get(loginSelectors.loginBtn).click({force: true})
		cy.get(loginSelectors.user).type(Cypress.env('username'))
		cy.get(loginSelectors.password).type(Cypress.env('password'))
		cy.get(loginSelectors.idirSubmitBtn).click()
		// If it is local, login button needs to be pressed twice
		if (Cypress.config('baseUrl').includes('localhost')) {
			cy.get(loginSelectors.loginBtn).click({force: true})
		}
		// Make sure that user has logged in
		cy.get(selectors.studentSearch.title).should('contain.text', 'Student Search')
	})
}

function doesExist(selector) {
	return cy.get('body').then(($body) => {
		return $body.find(selector).length > 0
	})
}

function shouldHaveData(selector, expectedRowNum = 0) {
	cy.wait(400)
	if (expectedRowNum && !isNaN(expectedRowNum)) {
		cy.get(selector).find(selectors.rows).its('length').should('be.eq', expectedRowNum)
	} else {
		cy.get(selector).find(selectors.rows).its('length').should('be.gt', 0)
	}
}

Cypress.Commands.add('login', login)
Cypress.Commands.add('doesExist', doesExist)
Cypress.Commands.add('shouldHaveData', shouldHaveData)

Cypress.on('uncaught:exception', (err, runnable) => {
	return false
})