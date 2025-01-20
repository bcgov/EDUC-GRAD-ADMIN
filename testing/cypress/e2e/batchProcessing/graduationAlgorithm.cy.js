import selectors from "../../support/selectors"
const batchProcessingSelectors = selectors.batchProcessing

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
            cy.get(batchProcessingSelectors.overlayWindow).find('input').click({force: true})
            cy.get(batchProcessingSelectors.selections).contains('School').click()
            cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.autocomplete).click({force: true})
            cy.get(batchProcessingSelectors.selections).contains(test_student1.original_school).click()
            cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
            cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
            cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()

            // Batch run result
            cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.newRow).get('td:nth-child(7)').should('contain.text', 'STARTED')
            cy.wait(3000)
            cy.contains('Update').click({force: true})
            cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.newRow).get('td:nth-child(7)').should('contain.text', 'COMPLETED')
        })
    })
})