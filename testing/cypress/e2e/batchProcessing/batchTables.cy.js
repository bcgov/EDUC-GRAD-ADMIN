import selectors from "../../support/selectors";
const batchProcessingSelectors = selectors.batchProcessing

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
    cy.get(currentBatchTable).find(batchProcessingSelectors.firstRow).children().eq(1).find('button').click({force: true})
    cy.get(batchProcessingSelectors.viewBatchResultBtn).click({force: true})

    cy.get(batchProcessingSelectors.batchJobResultTableWrapper).find(batchProcessingSelectors.itemPerPage).click({force: true})
    cy.get(batchProcessingSelectors.selections).contains('All').click()
    cy.wait(1000)
    const batchJobResultTable = batchProcessingSelectors.activeWindow + " " + batchProcessingSelectors.batchJobResultTable
    cy.get(batchJobResultTable).find(batchProcessingSelectors.rows).its('length').should('be.gt', 0) // TODO: It is only reading 10 rows wher it should read all rows
    cy.get(batchJobResultTable).find(batchProcessingSelectors.firstRow).children().eq(0).find('button').click({force: true})
    cy.url().should('include', Cypress.config('baseUrl') + "/student-profile")
    cy.get(batchProcessingSelectors.navBtn).click()
    // Skipping rerun batch btn
    
    // User Scheduled table
    cy.get(batchProcessingSelectors.userScheduledBtn).click()
    cy.wait(500)
    cy.get(currentBatchTable).find(batchProcessingSelectors.rows).its('length').should('be.gt', 0)
    cy.get(currentBatchTable).find(batchProcessingSelectors.firstRow).children().eq(0).find('button').click({force: true})
    cy.get(currentBatchTable).find(batchProcessingSelectors.secondRow).should('contain.text', 'localDownload')

    // Scheduled Routines table
    cy.get(batchProcessingSelectors.scheduledRoutinesBtn).click()
    cy.wait(500)
    cy.get(currentBatchTable).find(batchProcessingSelectors.rows).its('length').should('be.gt', 0)
  })
})