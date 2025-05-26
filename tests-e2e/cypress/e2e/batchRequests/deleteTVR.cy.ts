/**
 * @module DeleteTVR
 * 
 * @description
 * Run "Delete Student TVR Process" in Batch Processing.  This spec tests Delete TVR by calling API directly
 * instead of naviagting thruogh UI to speed up the testing, as well as making sure endpoints work.
 * 
 * After running this test, generate TVR to tested students to revert to the original state
 */

import selectors from "../../support/selectors"
import { formatTime, getCurrentTimestamp, isWithinMarginSeconds } from "../../support/helperMethods"
const batchProcessingSelectors = selectors.batchProcessing
const studentSearchSelectors = selectors.studentSearch

describe('Delete Student TVR Process', () => {
  const batch_test_student = Cypress.env('test_students').batch_test_student
  const activityCode = 'TVRDELETED'

  beforeEach(() => {
    cy.login()
    cy.visit('/')
    
    // Go to Batch Processing => New Batch Request
    cy.get(batchProcessingSelectors.navBtn).click()
    cy.get(batchProcessingSelectors.newRequestBtn).click()
    cy.contains('Delete Student TVR Process').next().find('button').click()
    cy.wait(500)
  })

  after(() => {
    cy.login()
    cy.visit('/')

    cy.get(studentSearchSelectors.searchByPEN).type(batch_test_student.PEN)
    cy.get(studentSearchSelectors.searchSubmit).click()
    cy.wait(5000) // Need to wait so that fields load up in Edit window
    cy.get(studentSearchSelectors.transcriptTVRBtn).click()
    cy.get(selectors.selections).contains('Update TVR').click({force: true})
  })

  /**
   * @name runsOnStudent
   * 
   * @description
   * Run Delete Student TVR Process for a single student to make sure student's data is properly updated.
   * 
   * ## Steps:
   * 1. Open Delete TVR modal on Batch Processing
   * 2. Select Student as a group
   * 3. Enter PEN
   * 4. Click ADD Student and Next
   * 5. Set up network interception for delete to get a batch id from response
   * 6. Click Submit
   *    - This will call delete run to get a batch id out of the reponse
   * 7. Call batch summary endpoint repeatedly until it's completed
   *    - If it's not completed within set timeout, test fails
   * 8. Call batch history for the batch id to ensure data is valid
   *    - activityCode should be TVRDELETED
   *    - Length of content should be 1
   *    - updateDate of a student should be same/close to current date time
   * 9. Call graduaiton report API for checking TVR is empty 
   * 10. Call batch API for getting job parameters to make sure it's valid
   *    - it should include a student's PEN in payload
   */
  it('Runs Delete TVR on a student', () => {
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).click({force: true})
    cy.get(selectors.selections).contains('Student').click()
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.numberInput).type(batch_test_student.PEN)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Add Student').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})

    // Setup interception for getting job exec id
    cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/report/student/delete`).as('batchRun')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()

    // Watch Batch result through API
    cy.wait('@batchRun').then(({response}) => {
      const batchId: string = response?.body?.batchId

      cy.callBatchJobTillComplete(batchId, Date.now(), 20000)
      // Batch job is completed -> call studentHistory API to make sure student is updated
      cy.task('getBatchHistoryResultById', {batchJobResultId: batchId}).then((data) => {
        const content = data.content
        expect(content).to.have.length(1)
        const batchResultData = content[0]
        const endTime = getCurrentTimestamp()
        expect(isWithinMarginSeconds(formatTime(batchResultData.updateDate), endTime)).to.be.true
        expect(batchResultData).to.have.property('activityCode', activityCode)
        cy.task('getTranscriptVerificationReport', batchResultData.studentID).  then((data) => {
          expect(data).to.be.empty
        })
      })

      // Batch job is completed -> check jobParameters
      cy.task('getBatchById', batchId).then((data) => {
        const jobParameters = JSON.parse(data.content[0].jobParameters)
        cy.wrap(jobParameters).its('payload.pens')
          .should('have.length', 1)
          .and('include', batch_test_student.PEN)
      })
    })
  })
})