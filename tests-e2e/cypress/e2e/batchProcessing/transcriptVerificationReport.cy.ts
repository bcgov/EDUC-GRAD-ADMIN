/**
 * @module TranscriptVerificationReport
 * 
 * @description
 * Run "Transcript Verfication Report" in Batch Processing. This spec tests TVR by calling API directly
 * instead of naviagting thruogh UI to speed up the testing, as well as making sure endpoints work.
 * They are 4 different groups that need individual test cases.
 */

import selectors from "../../support/selectors"
import { getCurrentTimestamp, isWithinMarginSeconds } from "../../support/helperMethods"
const batchProcessingSelectors = selectors.batchProcessing

describe('Transcript Verification Report', () => {
  const batch_test_student = Cypress.env('batch_test_student')

  context('On Student', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/')
      
      // Go to Batch Processing => New Batch Request
      cy.get(batchProcessingSelectors.navBtn).click()
      cy.get(batchProcessingSelectors.newRequestBtn).click()
      cy.contains('Transcript Verification Report').next().find('button').click()
      cy.wait(500)
    })

    /**
     * @name runsOnStudent
     * 
     * @description
     * Runs Transcript Verification Report for a single student to make sure student's data is properly updated.
     * 
     * ## Steps:
     * 1. Open TVR modal on Batch Processing
     * 2. Select Student as a group
     * 3. Enter PEN
     * 4. Click Add Student and Next
     * 5. Set up network interception for specialrun to get a batch id from response
     * 6. Click Submit 
     *    - This will call specialrun and Cypress obtains a batch id out of the response
     * 7. Call batch summary endpoint repeatedly until it's completed
     *    - If it's not completed within set timeout, test fails
     * 8. Call batch history for the batch id to ensure data is valid
     *    - Length of content should be 1
     *    - updateDate of a student should be same/close to current date time
     */
    it('Runs TVRRUN on Student', () => {
      cy.get(batchProcessingSelectors.overlayWindow).find('input').click({force: true})
      cy.get(selectors.selections).contains('Student').click()
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.numberInput).type(batch_test_student.PEN)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Add Student').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})

      // Setup interception for getting job exec id
      cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/tvrspecialrun`).as('batchRun')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()

      // Watch Batch result through API
      cy.wait('@batchRun').then(({response}) => {
        const batchId = response?.body?.batchId;
        cy.callBatchJobTillComplete(batchId, Date.now(), 10000)
        // Batch job is completed -> call studentHistory API to make sure student is updated
        cy.task('getBatchHistoryResultById', {batchJobResultId: batchId}).then((data) => {
          const content = data.content
          const endTime = getCurrentTimestamp()
          if (content && content.length) {
            expect(content).to.have.length(1)
            // Make sure updateDate is properly updated
            expect(isWithinMarginSeconds(content[0].updateDate, endTime)).to.be.true
          }
        })
      })
    })
  })
})