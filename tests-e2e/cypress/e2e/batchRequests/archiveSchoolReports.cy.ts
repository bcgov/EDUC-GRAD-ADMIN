/**
 * @module ArchiveSchoolReport
 * 
 * @description
 * Run "Archive School Reports Process" in Batch Processing. This spec tests Archive School Reports by calling API directly
 * instead of naviagting thruogh UI to speed up the testing, as well as making sure endpoints work. 
 */

import { formatTime, getCurrentTimestamp, isWithinMarginSeconds } from "tests-e2e/cypress/support/helperMethods";
import selectors from "../../support/selectors";
const batchProcessingSelectors = selectors.batchProcessing

describe('Archive School Reports', () => {
  const batch_test_student = Cypress.env('test_students').batch_test_student

  beforeEach(() => {
    cy.login()
    cy.visit('/')
    
    // Go to Batch Processing => New Batch Request
    cy.get(batchProcessingSelectors.navBtn).click()
    cy.get(batchProcessingSelectors.newRequestBtn).click()
    cy.contains('Archive School Reports Process').next().find('button').click()
    cy.wait(500)
  })

  after(() => {
    cy.login()
    cy.visit('/')
    
    // Generate report by running tvr
    cy.get(batchProcessingSelectors.navBtn).click()
    cy.get(batchProcessingSelectors.newRequestBtn).click()
    cy.contains('Transcript Verification Report').next().find('button').click()
    cy.wait(500)
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).click({force: true})
    cy.get(selectors.selections).contains('School').click()
    cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_school)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()
  })

  /**
   * @name runsOnProjectedNonGraduates
   * 
   * @description
   * Run Archive School Reports Process on Projected Non-graduates student to make sure data is
   * properly updated.
   * 
   * ## Steps:
   * 1. Open Archive School Reports modal on Batch Processing
   * 2. Select Projected Non-graduates as a report type
   * 3. Add a school and Next
   * 4. Set up network interception for archive to get a batch id from response
   * 5. Click Submit 
   *    - This will call archive run and Cypress obtains a batch id out of the response
   * 6. Call batch summary endpoint repeatedly until it's completed
   *    - If it's not completed within set timeout, test fails
   * 7. Call graduation report API by school GUID to get school reports and make sure data is valid
   *    - NONGRADPRJ type should no longer exist
   *    - NONGRADPRJARC type should exist and updateDate is updated
   */
  it('Archives NONGRADPRJ', () => { 
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).first().click({force: true})
    cy.get(selectors.selections).contains('NONGRADPRJ').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).last().click({force: true})
    cy.get(selectors.selections).contains('School').click({force: true})
    cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_school)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="REQUIRED_CONFIRMATION_1"]').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="REQUIRED_CONFIRMATION_2"]').click({force: true})

    // Setup interception for getting job exec id
    cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/report/school/archive`).as('batchRun')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()

    // Watch Batch result through API
    cy.wait('@batchRun').then(({ response }) => {
      const batchId = response?.body?.batchId;
      cy.callBatchJobTillComplete(batchId, Date.now(), 10000);

      // Batch job is completed -> Go to report to make sure last update date is updated to latest
      const schoolGuid: string = batch_test_student.og_school_guid
      cy.task('getSchoolReportById', schoolGuid).then(data => {
        cy.wrap(data.some(report => report.id === "NONGRADPRJ"))
          .should('be.false')

        const nongradArcReport = data.find(report => report.reportTypeCode == "NONGRADPRJARC")
        expect(nongradArcReport).to.exist
        const endTime = getCurrentTimestamp()
        expect(isWithinMarginSeconds(formatTime(nongradArcReport?.updateDate!), endTime)).to.be.true
      })
    })
  })
})