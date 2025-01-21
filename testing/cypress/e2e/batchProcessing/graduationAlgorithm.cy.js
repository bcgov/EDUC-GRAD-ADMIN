import selectors from "../../support/selectors"
const batchProcessingSelectors = selectors.batchProcessing

// Problem: Only looks at the first row
function refreshTableTillComplete(timeout, interval = 3000) {
    let refreshCount = timeout / interval
    const statusColSelector = batchProcessingSelectors.batchRunsTable + " " + batchProcessingSelectors.newRow + " " + batchProcessingSelectors.batchStatusCol

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

            // If still not logged in, login
            cy.doesExist(selectors.login.loginBtn).then((exist) => {
                if (exist) {
                    cy.get(selectors.login.loginBtn).eq(0).click()
                }
            })
            
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
            cy.get(batchProcessingSelectors.selections).contains(test_student1.original_school).click()
            cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
            cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
            cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()

            // Batch run result
            // cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.newRow).find(batchProcessingSelectors.batchStatusCol).should('contain.text', 'STARTED')
            // cy.wait(10000)
            // cy.contains('Update').click({force: true})
            // cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.newRow).find(batchProcessingSelectors.batchStatusCol).should('contain.text', 'COMPLETED')
            refreshTableTillComplete(30000)
            cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.newRow).find(batchProcessingSelectors.batchStatusCol).should('contain.text', 'COMPLETED')
            cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.batchJobId).then(($element) => {
                const text = $element.text()
                
            })

            
        })
    })
})