/**
 * @module PSIRun
 * 
 * @describe
 * Run "PSI Run FTP / Paper" in Batch Processing. This spec tests PSI Run by calling API directly
 * instead of naviagting thruogh UI to speed up the testing, as well as making sure endpoints work.
 */

import { formatTime, getCurrentTimestamp, isWithinMarginSeconds } from "tests-e2e/cypress/support/helperMethods";
import selectors from "../../support/selectors";
const batchProcessingSelectors = selectors.batchProcessing

describe('PSI Run FTP / Paper', () => {
  const instituteCode = 'h13'

  beforeEach(() => {
    cy.login()
    cy.visit('/')

    // Go to Batch Processing => New Batch Request
    cy.get(batchProcessingSelectors.navBtn).click()
    cy.get(batchProcessingSelectors.newRequestBtn).click()
    cy.contains('PSI Run FTP / Paper').next().find('button').click()
    cy.wait(500)
  })

  /**
   * @name runsPSIOnPaper
   * 
   * @description
   * Run PSI Run on Paper to make sure results meet an expectation
   * 
   * ## Steps:
   * 1. Open PSI Run modal on Batch Processing
   * 2. Enter 2025 as PSI year
   * 3. Enter H13 as PSI code
   * 4. Add PSI and Next
   * 5. Set up network interception for executepsireportbatchjob to get a batch id from response
   * 6. Click Submit
   *    - This will call executepsireportbatchjob and Cypress obtains a batch id out of the response
   * 7. Call batch summary endpoint repeatedly until it's completed
   *    - If it's not completed within set timeout, test fails
   * 8. Call batch history for the batch id to ensure data is valid
   *    - 3 students should be affected
   *    - their updateDate should be same/close to current date time
   */
  it('Runs PSI on Paper', () => {
    cy.get(batchProcessingSelectors.overlayWindow)
      .contains('label', 'Enter PSI Year')
      .next()
      .clear()
      .type('2025')
    cy.get(batchProcessingSelectors.overlayWindow)
      .contains('label', 'Post Secondary Institution Code')
      .next()
      .clear()
      .type(instituteCode)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Add PSI').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    
    // Setup interception for getting job exec id
    cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/executepsireportbatchjob/PAPER`).as('batchRun')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()
    
    // Watch Batch result through API
    cy.wait('@batchRun').then(({ response }) => {
      const batchId = response?.body?.batchId;
      cy.callBatchJobTillComplete(batchId, Date.now(), 20000);

      cy.task('getBatchHistoryResultById', {batchJobResultId: batchId}).then((data) => {
        const endTime = getCurrentTimestamp()
        const content = data.content
        expect(content).to.have.length(3)
        content.forEach(item => {
          expect(isWithinMarginSeconds(formatTime(item.updateDate), endTime)).to.be.true
        })
      })
    })
  })
})