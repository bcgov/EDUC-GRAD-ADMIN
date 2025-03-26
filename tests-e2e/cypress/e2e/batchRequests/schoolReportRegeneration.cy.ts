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
})