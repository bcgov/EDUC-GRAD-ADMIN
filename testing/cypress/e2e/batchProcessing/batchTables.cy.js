/**
 * @module BatchTable
 * 
 * @description
 * Under Batch Processing window, there are mutliple tables that Cypress can quickly goes through:
 * - Batch Runs
 * - User Scheduled
 * - Scheduled Routines
 * 
 * This file does not cover any "New Batch Request" due to its complexity
 */

import selectors from "../../support/selectors";
const batchProcessingSelectors = selectors.batchProcessing

// Test case changes based on whether selected run have 0 update student or not
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

  /**
   * @name checkDataInTable
   * 
   * @description
   * Goes through every table in the Batch Processing nav and checks if they load by making sure there is at least one row
   * loaded in it. Additionally, for Batch Runs table, it opens up multiple job results to ensure it is working as expected.
   * 
   * ## Steps:
   * 1. Navigate to Batch Runs table to check data
   * 2. Goes through Batch Result table for first multiple rows (it is 5 now) by clicking "View Batch Results"
   *    - If there is actual result and status is completed, it should display table with affected students
   *    - Otherwise, it should dipslay "No data available"
   * 3. Navigate to User Scheduled table to check data
   *    - Collapse first row and check JSON is stored
   * 4. Navigate to Scheduled Routines table to check data
   */
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