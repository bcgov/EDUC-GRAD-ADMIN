import selectors from "../../support/selectors";
import { formatTime, getCurrentTimestamp, isWithinMarginSeconds, base64ToFileTypeAndDownload } from "../../support/helperMethods"
const batchProcessingSelectors = selectors.batchProcessing


describe('Reprint Certificate without principal signature', () => {
  const batch_test_student = Cypress.env('test_students').graduated_student
  const activityCode = 'USERDISTRC'

  beforeEach(() => {
    cy.login()
    cy.visit('/')
    
    // Go to Batch Processing => New Batch Request
    cy.get(batchProcessingSelectors.navBtn).click()
    cy.get(batchProcessingSelectors.newRequestBtn).click()
    cy.contains('Reprint certificate').next().find('button').click()
    cy.wait(500)
  })

  it.only('Runs RC on a student', () => {
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).click({force: true})
    cy.get(selectors.selections).contains('Student').click()
    cy.wait(500)
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.numberInput).type(batch_test_student.PEN)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Add Student').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.wait(500)
    cy.contains('label', 'Where').next().find('input').click({force: true})
    cy.get(selectors.selections).contains('Download').click()
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})

    // Setup interception for getting job exec id
    cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/userrequestdisrun/RC`).as('batchRun')
    cy.get(batchProcessingSelectors.overlayWindow).contains('button', 'Download').click({force: true})
    

    // Watch Batch result through API
    cy.wait('@batchRun').then(({response}) => {
      const batchId = response?.body?.batchId
      cy.callBatchJobTillComplete(batchId, Date.now(), 20000)

      // Batch job is completed -> call studentHistory API to make sure student is updated
      cy.task('getBatchHistoryResultById', {batchJobResultId: batchId}).then((data) => {
        const content = data.content
        expect(content).to.have.length(1)
        const batchResultData = content[0]
        // Make sure updateDate is properly updated
        const endTime = getCurrentTimestamp()
        expect(isWithinMarginSeconds(formatTime(batchResultData.updateDate), endTime)).to.be.true
        // Check activity code
        expect(batchResultData).to.have.property('activityCode', activityCode)
        // Make sure transcript's updateDate is updated
        cy.task('getCertificate', batchResultData.studentID).then((data) => {
          expect(isWithinMarginSeconds(formatTime(data[0].updateDate), endTime)).to.be.true
        })
      })

      // Batch job is completed -> download file to make sure file is not empty
      cy.task('downloadBatchReport', batchId).then(data => {
        base64ToFileTypeAndDownload(data, "application/zip", batchId)
        const zipFilePath =  `cypress/downloads/${batchId}.zip`;
        cy.readFile(zipFilePath, 'base64', {timeout: 10000})
  
        cy.task('checkPDFInZip', zipFilePath).then((result) => {
          expect(result).to.equal('PDF is not empty')
        })
      })
  
      // Batch job is completed -> check jobParameters
      cy.task('getBatchById', batchId).then(data => {
        const jobParameters = JSON.parse(data.content[0].jobParameters)
        cy.wrap(jobParameters).should('have.a.property', 'credentialType', 'RC')
        cy.wrap(jobParameters).its('payload.pens')
          .should('have.length', 1)
          .and('include', batch_test_student.PEN)
      })
    })
  })
})