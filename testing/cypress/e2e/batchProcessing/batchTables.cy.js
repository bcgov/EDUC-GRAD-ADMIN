import selectors from "../../support/selectors";
const batchProcessingSelectors = selectors.batchProcessing

// Test case changes if selected run have 0 update student or not
function checkResultTable(rowIndex) {
  const currentBatchTable = batchProcessingSelectors.activeWindow + " " + batchProcessingSelectors.batchTable
  // Check if there is data to display in batch result table by seeting status and actual result
  const columns = () => cy.get(currentBatchTable).find(batchProcessingSelectors.rows).eq(rowIndex).children()
  // Status
  columns().eq(6).invoke('text').then(status => {
      let hasCompleted = status.trim() == 'COMPLETED'
      // Actual result
      columns().eq(8).invoke('text').then(actualResult => {
        let noData = actualResult.trim() == '0'

        cy.get(currentBatchTable).find(batchProcessingSelectors.rows)
        .eq(rowIndex).children().eq(1).find('button').click({force: true})
        cy.get(batchProcessingSelectors.viewBatchResultBtn).click({force: true})
        cy.wait(1000)
  
        // Assert
        const batchJobResultTable = batchProcessingSelectors.activeWindow + " " + batchProcessingSelectors.batchJobResultTable
        if (noData || !hasCompleted) {
          cy.get(batchJobResultTable).find(batchProcessingSelectors.batchJobResultNoData).should('have.text', 'No data available')
        } else {
          cy.get(batchJobResultTable).find(batchProcessingSelectors.rows).its('length').should('be.gt', 0) // TODO: It is only reading 10 rows wher it should read all rows
          cy.get(batchJobResultTable).find(batchProcessingSelectors.firstRow).children().eq(0).find('button').click({force: true})
          cy.url().should('include', Cypress.config('baseUrl') + "/student-profile")
          cy.get(batchProcessingSelectors.navBtn).click()
        }
  
      })
    })
}

describe('Batch Processing Tables' , () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
    cy.get(batchProcessingSelectors.navBtn).click()
  })

  it('Goes through each table and its content to check if they are loaded', () => {
    // Batch Runs table
    cy.wait(5000)
    const currentBatchTable = batchProcessingSelectors.activeWindow + " " + batchProcessingSelectors.batchTable
    cy.get(currentBatchTable).find(batchProcessingSelectors.rows).its('length').should('be.gt', 0)

    // Test each rows
    const testRowNum = 5
    for (let i = 0; i < testRowNum; i++) {
      checkResultTable(i)
    }

    // Skipping rerun batch btn
    
    // User Scheduled table
    cy.get(batchProcessingSelectors.userScheduledBtn).click()
    cy.wait(500)
    cy.get(currentBatchTable).find(batchProcessingSelectors.rows).its('length').should('be.gt', 0)
    cy.get(currentBatchTable).find(batchProcessingSelectors.firstRow).children().eq(0).find('button').click({force: true})
    cy.wait(500)
    cy.get(currentBatchTable).find(batchProcessingSelectors.secondRow).should('contain.text', 'localDownload')

    // Scheduled Routines table
    cy.get(batchProcessingSelectors.scheduledRoutinesBtn).click()
    cy.wait(500)
    cy.get(currentBatchTable).find(batchProcessingSelectors.rows).its('length').should('be.gt', 0)
  })
})