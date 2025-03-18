import selectors from "../../support/selectors";
const batchProcessingSelectors = selectors.batchProcessing

describe('Reprint Certificate without principal signature', () => {
  const batch_test_student = Cypress.env('test_student').graduated_student
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
    cy.contains('Where').next().find('button').click()
    cy.get(selectors.selections).contains('Download').click()
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})

    // Setup interception for getting job exec id
    cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/userrequestdisrun/RC`).as('batchRun')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()
    

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
    })
  })
})