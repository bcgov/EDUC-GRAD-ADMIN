/**
 * @module certificateRegeneration
 * 
 * @description
 * Run "User Request Certificate Regeneration" in Batch Processing.  This spec tests CERTREGEN by calling API directly
 * instead of naviagting thruogh UI to speed up the testing, as well as making sure endpoints work.
 */

import selectors from "../../support/selectors";
import { formatTime, getCurrentTimestamp, isWithinMarginSeconds, base64ToFileTypeAndDownload } from "../../support/helperMethods"
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder');
const batchProcessingSelectors = selectors.batchProcessing

describe('User Request Certificate Regeneration', () => {
  const batch_test_student = Cypress.env('test_students').graduated_student
  const activityCode = 'CERTREGEN'

  beforeEach(() => {
    cy.login()
    cy.visit('/')
    
    // Go to Batch Processing => New Batch Request
    cy.get(batchProcessingSelectors.navBtn).click()
    cy.get(batchProcessingSelectors.newRequestBtn).click()
    cy.contains('User Request Certificate Regeneration').next().find('button').click()
    cy.wait(500)
  })

  /**
   * @name runsOnStudent
   * 
   * @description
   * Run Certificate Regeneration for a single student to make sure student's data is properly updated.
   * 
   * ## Steps:
   * 1. Open User Request Certificate Regeneration modal on Batch Processing
   * 2. Select Student as a group
   * 3. Enter PEN
   * 4. Click Add Student and Next
   * 5. Select Download option and Next
   * 6. Wait a little bit for letting app store load
   * 7. Set up network interception for executecertregenbatchjob to get a batch id from response
   * 8. Click Submit
   *    - This will call executecertregenbatchjob and Cypress obtains a batch id out of the response
   * 9. Call batch summary endpoint repeatedly until it's completed
   *    - If it's not completed within set timeout, test fails
   * 10. Call batch history for the batch id to ensure data is valid
   *    - activityCode should be CERTREGEN
   *    - Length of content should be 1
   *    - updateDate of a student should be same/close to current date time
   * 11. Call graduation report API for checking updateDate for certificate is updated
   */
  it('Runs Certificate Regeneration on a student', () => {
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).click({force: true})
    cy.get(selectors.selections).contains('Student').click()
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.numberInput).type(batch_test_student.PEN)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Add Student').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    // Setup interception for getting job exec id
    cy.wait(5000) // Need to wait for app store to store student's PEN
    cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/executecertregenbatchjob`).as('batchRun')
    cy.get(batchProcessingSelectors.overlayWindow).contains('button', 'Submit').click({force: true})
    
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
        cy.task('getCertificate', batchResultData.studentID).then((data) => {
          expect(isWithinMarginSeconds(formatTime(data[0].updateDate), endTime)).to.be.true
        })
      })
    })
  })
})