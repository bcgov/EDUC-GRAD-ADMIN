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