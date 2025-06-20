/**
 * @module SchoolReportRegeneration
 * 
 * @description
 * Run "User Request School Report Regeneration" in Batch Processing.  This spec tests School report regen by calling API directly
 * instead of naviagting thruogh UI to speed up the testing, as well as making sure endpoints work.
 */

import { formatTime, getCurrentTimestamp, isWithinMarginSeconds } from "tests-e2e/cypress/support/helperMethods";
import selectors from "../../support/selectors";
const batchProcessingSelectors = selectors.batchProcessing

describe('User Request School Report Regeneration', () => {
  const batch_test_student = Cypress.env('test_students').batch_test_student

  beforeEach(() => {
    cy.login()
    cy.visit('/')

    // Go to Batch Processing => New Batch Request
    cy.get(batchProcessingSelectors.navBtn).click()
    cy.get(batchProcessingSelectors.newRequestBtn).click()
    cy.contains('User Request School Report Regeneration').next().find('button').click()
    cy.wait(500)
  })

  /**
   * @name runsOnProjectedNonGraduates
   * 
   * @description
   * Run User Request School Report on Projected Non-graduates student to make sure the NONGRADPRJ report is
   * properly updated.
   * 
   * ## Steps:
   * 1. Open User Request School Report modal on Batch Processing
   * 2. Select Projected Non-graduates as a report type
   * 3. Add a school and Next
   * 4. Set up network interception for school-report to get a batch id from response
   * 5. Click Submit 
   *    - This will call school-report run and Cypress obtains a batch id out of the response
   * 6. Call batch summary endpoint repeatedly until it's completed
   *    - If it's not completed within set timeout, test fails
   * 7. Call graduation report API by school GUID to get school reports and make sure data is valid
   *    - School should have a NONGRADPRJ report
   *    - NONGRADPRJ report's updateDate should be same/close to current date time
   * 8. Call batch API for getting job parameters to make sure it is valid
   *    - reportType should be NONGRADPRJ
   */
  it('Runs User Request School Report on Projected Non-graduates', () => {
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).first().click({force: true})
    cy.get(selectors.selections).contains('Projected Non-Graduates').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).last().click({force: true})
    cy.get(selectors.selections).contains('School').click({force: true})
    cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_school)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})

    // Setup interception for getting job exec id
    cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/regenerate/school-report`).as('batchRun')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()
    
    // Watch Batch result through API
    cy.wait('@batchRun').then(({ response }) => {
      const batchId: string = response?.body?.batchId;
      cy.callBatchJobTillComplete(batchId, Date.now(), 10000)

      // Batch job is completed -> Search report 
      const schoolGuid: string = batch_test_student.og_school_guid
      cy.task('getSchoolReportById', schoolGuid).then(data => {
        const nongradReport = data.find(report => report.reportTypeCode == "NONGRADPRJ")
        expect(nongradReport).to.exist
  
        const endTime = getCurrentTimestamp()
        expect(isWithinMarginSeconds(formatTime(nongradReport?.updateDate!), endTime)).to.be.true
      })

      // Batch job is completed -> job parameter
      cy.task('getBatchById', batchId).then(data => {
        const jobParameters = JSON.parse(data.content[0].jobParameters)
        cy.wrap(jobParameters).its('reportTypes')
          .should('include', 'NONGRADPRJ')
      })
    })
  })

    /**
   * @name runsOnGraduatedAndNonGraduated
   * 
   * @description
   * Run User Request School Report on Graduated and Not-Yet Graduated students to make sure the NONGRADPRJ report is
   * properly updated.
   * 
   * ## Steps:
   * 1. Open User Request School Report modal on Batch Processing
   * 2. Select Graduated Students and Not-Yet Graduated Students as a report type
   * 3. Add a school and Next
   * 4. Set up network interception for school-report to get a batch id from response
   * 5. Click Submit 
   *    - This will call school-report run and Cypress obtains a batch id out of the response
   * 6. Call batch summary endpoint repeatedly until it's completed
   *    - If it's not completed within set timeout, test fails
   * 7. Call graduation report API by school GUID to get school reports and make sure data is valid
   *    - School should have NONGRADREG and GRADREG reports
   *    - both reports' updateDate should be same/close to current date time
   * 8. Call batch API for getting job parameters to make sure it is valid
   *    - reportType should be NONGRADREG and GRADREG
   */
    it('Runs User Request School Report on Projected Non-graduates', () => {
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).first().click({force: true})
      cy.get(selectors.selections).contains('Graduated Students').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).last().click({force: true})
      cy.get(selectors.selections).contains('School').click({force: true})
      cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_school)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
  
      // Setup interception for getting job exec id
      cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/regenerate/school-report`).as('batchRun')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()
      
      // Watch Batch result through API
      cy.wait('@batchRun').then(({ response }) => {
        const batchId: string = response?.body?.batchId;
        cy.callBatchJobTillComplete(batchId, Date.now(), 10000)
  
        // Batch job is completed -> Search report 
        const schoolGuid: string = batch_test_student.og_school_guid
        cy.task('getSchoolReportById', schoolGuid).then(data => {
          const nongradReport = data.find(report => report.reportTypeCode == 'NONGRADREG')
          const gradReport = data.find(report => report.reportTypeCode === 'GRADREG')
          expect(nongradReport).to.exist
          expect(gradReport).to.exist
    
          const endTime = getCurrentTimestamp()
          expect(isWithinMarginSeconds(formatTime(nongradReport?.updateDate!), endTime)).to.be.true
          expect(isWithinMarginSeconds(formatTime(gradReport?.updateDate!), endTime)).to.be.true
        })
  
        // Batch job is completed -> job parameter
        cy.task('getBatchById', batchId).then(data => {
          const jobParameters = JSON.parse(data.content[0].jobParameters)
          cy.wrap(jobParameters).its('reportTypes')
            .should('include', 'GRADREG and NONGRADREG')
        })
      })
    })
})