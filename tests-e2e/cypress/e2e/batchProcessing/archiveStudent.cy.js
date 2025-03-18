import selectors from "../../support/selectors";
import { formatTime, getCurrentTimestamp, isWithinMarginSeconds } from "../../support/helperMethods"
const batchProcessingSelectors = selectors.batchProcessing
const studentSearchSelectors = selectors.studentSearch


describe('Archive Student Batch Process', () => {
  const batch_test_student = Cypress.env('test_students').batch_test_student
  const activityCode = 'USERSTUDARC'

  beforeEach(() => {
    cy.login()
    cy.visit('/')
  })

  it('Runs Archive Student Batch on a school', () => {
    // Set student status as Current
    cy.get(studentSearchSelectors.searchByPEN).type(batch_test_student.PEN)
    cy.get(studentSearchSelectors.searchSubmit).click()
    cy.wait(5000) // Need to wait so that fields load up in Edit window
    cy.get(studentSearchSelectors.editBtn).click()
    cy.wait(500)
    cy.selectDropdown(studentSearchSelectors.status, 'Current')
    cy.get(studentSearchSelectors.saveStatusBtn).click()
    
    // Go to Batch Processing => New Batch Request
    cy.get(batchProcessingSelectors.navBtn).click()
    cy.get(batchProcessingSelectors.newRequestBtn).click()
    cy.contains('Archive Student Batch Process').next().find('button').click()
    cy.wait(500)

    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).click({force: true})
    cy.get(selectors.selections).contains('School').click()
    cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_school)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="REQUIRED_CONFIRMATION_1"]').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="REQUIRED_CONFIRMATION_2"]').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="REQUIRED_CONFIRMATION_3"]').click({force: true})
    
    // Setup interception for getting job exec id
    cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/student/archive`).as('batchRun')
    cy.get(batchProcessingSelectors.overlayWindow).contains('button', 'Submit').click({force: true})

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
        // Make sure status is updated to archived
        expect(batchResultData).to.have.property('studentStatus', 'ARC')
      })
    })
  })     

})