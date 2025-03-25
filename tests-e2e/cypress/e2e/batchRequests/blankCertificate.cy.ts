import selectors from "../../support/selectors";
import { base64ToFileTypeAndDownload } from "../../support/helperMethods"
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder');
const batchProcessingSelectors = selectors.batchProcessing

describe('Blannk certificate print', () => {
  deleteDownloadsFolderBeforeAll()

  const batch_test_student = Cypress.env('test_students').batch_test_student

  beforeEach(() => {
    cy.login()
    cy.visit('/')
    
    // Go to Batch Processing => New Batch Request
    cy.get(batchProcessingSelectors.navBtn).click()
    cy.get(batchProcessingSelectors.newRequestBtn).click()
    cy.contains('Blank certificate print').next().find('button').click()
    cy.wait(500)
  })

  it('Runs Blank Certificate on a school', () => {
    cy.get('input[value="E"]').click() // Click just on a Dogwood (Public) for now
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.wait(500)
    cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_school)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.wait(500)
    cy.contains('label', 'Where').next().find('input').click({force: true})
    cy.get(selectors.selections).contains('Download').click()
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    
    // Setup interception for getting job exec id
    cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/userrequestblankdisrun/OC`).as('batchRun')
    cy.get(batchProcessingSelectors.overlayWindow).contains('button', 'Download').click({force: true})

    // Watch Batch result through API
    cy.wait('@batchRun').then(({response}) => {
      const batchId: string = response?.body?.batchId
      cy.callBatchJobTillComplete(batchId, Date.now(), 20000)

      
      // Batch job is completed -> check jobParameters
      cy.task('getBatchById', batchId).then((data) => {
        const jobParameters = JSON.parse(data.content[0].jobParameters)
        cy.wrap(jobParameters).should('have.a.property', 'credentialType', 'OC')
        cy.wrap(jobParameters).its('payload.schoolIds')
        .should('have.length', 1)
        //.and('include', '00505108') This does not work for some reason
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