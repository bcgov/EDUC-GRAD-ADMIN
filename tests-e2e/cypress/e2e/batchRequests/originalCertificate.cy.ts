/**
 * @module OriginalCertificate
 * 
 * @description
 * Run "Original certificate - with principal signature block" in Batch Processing.  This spec tests OC by calling API directly
 * instead of naviagting thruogh UI to speed up the testing, as well as making sure endpoints work.
 * The difference between "Reprint certificate" is that OC always updates distribution dates
 */

import selectors from "../../support/selectors";
import { formatTime, getCurrentTimestamp, isWithinMarginSeconds, base64ToFileTypeAndDownload } from "../../support/helperMethods"
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder');
const batchProcessingSelectors = selectors.batchProcessing

describe('Original Certificate with principal signature', () => {
  deleteDownloadsFolderBeforeAll()

  const batch_test_student = Cypress.env('test_students').graduated_student
  const activityCode = 'USERDISTOC'

  beforeEach(() => {
    cy.login()
    cy.visit('/')
    
    // Go to Batch Processing => New Batch Request
    cy.get(batchProcessingSelectors.navBtn).click()
    cy.get(batchProcessingSelectors.newRequestBtn).click()
    cy.contains('Original certificate').next().find('button').click()
    cy.wait(500)
  })

  /**
   * @name runsOnStudent
   * 
   * @description
   * Run Original Certificate for a single student to make sure student's da ta is properly updated.
   * 
   * ## Steps: 
   * 1. Open Original Certificate modal on Batch Processing
   * 2. Select Student as a group
   * 3. Enter PEN
   * 4. Click Add Student and Next
   * 5. Select Download option and Next
   * 6. Set up network interception for userrequestdistrun to get a batch id from response
   * 7. Click Submit
   *    - This will call userrequestdistrun and Cypress obtains a batch id out of the response
   * 8. Call batch summary endpoint repeatedly until it's completed
   *    - If it's not completed within set timeout, test fails
   * 9. Call batch history for the batch id to ensure data is valid
   *    - activityCode should be USERDISTOC
   *    - Length of content should be 1
   *    - updateDate of a student should be same/close to current date time
   * 10. Call graduaiton report API for checking
   *    - updateDate in the certificate is updated
   *    - distributionDate in the transcript is updated
   * 11. Call distribution API to download generated report and make sure the file is not empty
   * 12. Call batch API for getting job parameters to make sure it's valid
   *    - credentialType should be OC
   *    - it should include a student's PEN in payload
   */
  it('Runs OC on a student', () => {
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).click({force: true})
    cy.get(selectors.selections).contains('Student').click()
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.numberInput).type(batch_test_student.PEN)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Add Student').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.wait(500)
    cy.contains('label', 'Where').next().find('input').click({force: true})
    cy.get(selectors.selections).contains('Download').click()
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})

    // Setup interception for getting job exec id
    cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/userrequestdisrun/OC`).as('batchRun')
    cy.get(batchProcessingSelectors.overlayWindow).contains('button', 'Download').click({force: true})
    
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

        cy.task('getTranscript', batchResultData.studentID).then((data) => {
          expect(isWithinMarginSeconds(formatTime(data[0].distributionDate), endTime)).to.be.true
        })
      })
 
      // Batch job is completed -> check jobParameters
      cy.task('getBatchById', batchId).then((data) => {
        const jobParameters = JSON.parse(data.content[0].jobParameters)
        cy.wrap(jobParameters).should('have.a.property', 'credentialType', 'OC')
        cy.wrap(jobParameters).its('payload.pens')
        .should('have.length', 1)
        .and('include', batch_test_student.PEN)
      })

      cy.wait(2000)
      // Batch job is completed -> download file to make sure file is not empty
      cy.task('downloadBatchReport', batchId).then((data) => {
        base64ToFileTypeAndDownload(data, "application/zip", batchId)
        const zipFilePath =  `cypress/downloads/${batchId}.zip`;
        cy.readFile(zipFilePath, 'base64', {timeout: 10000})
        cy.task('checkPDFInZip', zipFilePath).then((result) => {
          expect(result).to.equal('PDF is not empty')
        })
      })
    })
  })
})