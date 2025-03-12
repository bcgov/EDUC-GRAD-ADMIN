/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
    const baseUrl = Cypress.config('baseUrl')
		if (baseUrl && baseUrl.includes('localhost')) {
			cy.get(loginSelectors.loginBtn).click({force: true})
		}
		// Make sure that user has logged in
		cy.get(selectors.studentSearch.title).should('contain.text', 'Student Search')
	})
}

function doesExist(selector: string) {
	return cy.get('body').then(($body) => {
		return $body.find(selector).length > 0
	})
}

function shouldHaveData(selector: string, expectedRowNum: number = 0) {
	cy.wait(400)
	if (expectedRowNum && !isNaN(expectedRowNum)) {
		cy.get(selector).find(selectors.rows).its('length').should('be.eq', expectedRowNum)
	} else {
		cy.get(selector).find(selectors.rows).its('length').should('be.gt', 0)
	}
}

function selectDropdown(selector: string, text: string, forceFlag: boolean = false) {
	cy.get(selector).click({force: true})
	cy.get(selectors.selections).contains(text).click({force: forceFlag})
}

function selectAutoselect(selector: string, text: string) {
	cy.get(selector).clear().type(text)
	selectDropdown(selector, text)
}

// function callBatchJobTillComplete(jobId: string, startTime: number, timeout: number, interval: number = 2000) {
//   const currentTime = Date.now()

//   if (currentTime - startTime >= timeout) {
//     throw new Error('Timeout: Job was not completed within a given time')
//   }

//   cy.wait(interval)
//   cy.task('getBatchSummary', {pageNumber: 0, pageSize: 10}).then((data) => {
//     const batchJob = data.batchJobList.find(batchJob => batchJob.jobExecutionId == jobId)

//     // If job is completed, stop recalling
//     if (!!batchJob && batchJob.status == 'COMPLETED') {
//       cy.log(`Batch Job ID ${jobId} - COMPLETED`)
//     } else {
//     // Otherwise keep calling
// 			callBatchJobTillComplete(jobId, startTime, timeout, interval)
//     }
//   })
// }

Cypress.Commands.add('login', login)
Cypress.Commands.add('doesExist', doesExist)
Cypress.Commands.add('shouldHaveData', shouldHaveData)
Cypress.Commands.add('selectDropdown', selectDropdown)
Cypress.Commands.add('selectAutoselect', selectAutoselect)
// Cypress.Commands.add('callBatchJobTillComplete', callBatchJobTillComplete)

Cypress.on('uncaught:exception', (err, runnable) => {
	return false
})