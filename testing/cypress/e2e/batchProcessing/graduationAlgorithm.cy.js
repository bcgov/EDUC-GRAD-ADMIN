import selectors from "../../support/selectors"
const batchProcessingSelectors = selectors.batchProcessing

// Problem: Only looks at the first row (not working)
function refreshTableTillComplete(timeout, interval = 3000) {
    let refreshCount = timeout / interval
    const statusColSelector = batchProcessingSelectors.batchRunsTable + " " + batchProcessingSelectors.firstRow + " " + batchProcessingSelectors.batchStatusCol

    cy.get(statusColSelector).should('contain.text', 'STARTED')


    while (refreshCount >= 0) {        
        cy.wait(interval)
        cy.contains('Update').click({force: true})
        refreshCount --

        cy.get(statusColSelector).then(($element) => {
            if ($element.text().includes('COMPLETED')) {
                // Stop refresing
                console.log("DONE")
                refreshCount = -1
            } 
        })
    }
}

describe('Graduation Algorithm', () => {
    const test_student1 = Cypress.env('test_student1')

    context('School Group', () => {
        beforeEach(() => {
            cy.login()
            cy.visit('/')
            
            // Go to Batch Processing => New Batch Request
            cy.get(batchProcessingSelectors.navBtn).click()
            cy.get(batchProcessingSelectors.newRequestBtn).click()
        })

        it('Runs on School', () => {
            cy.contains('Graduation Algorithm').next().find('button').click()
            cy.wait(500)
            cy.get(batchProcessingSelectors.overlayWindow).find('input').click({force: true})
            cy.get(batchProcessingSelectors.selections).contains('School').click()
            cy.wait(500)
            cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.autocomplete).click({force: true})
            cy.get(batchProcessingSelectors.selections).contains(test_student1.og_school).click()
            cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
            cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
            cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()

            // Batch run result
            // cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.firstRow).find(batchProcessingSelectors.batchStatusCol).should('contain.text', 'STARTED')
            // cy.wait(10000)
            // cy.contains('Update').click({force: true})
            // cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.firstRow).find(batchProcessingSelectors.batchStatusCol).should('contain.text', 'COMPLETED')
            refreshTableTillComplete(30000)
            cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.firstRow).find(batchProcessingSelectors.batchStatusCol).should('contain.text', 'COMPLETED')
            cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.batchJobId).then(($element) => {
                const text = $element.text()
                
            })

            
        })
    })
})