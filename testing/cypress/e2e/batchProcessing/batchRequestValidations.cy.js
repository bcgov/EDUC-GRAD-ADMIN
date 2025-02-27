/**
 * @module BatchRquestValidations
 * 
 * @description
 * Validations for all modals in "New Batch Request" tab.
 * Bundled in a single file since they behave very similarly and seperated from the individual batch testing.
 * The UI features that this spec file includes:
 *    - Validations
 *    - Cancel Buttons
 */

import selectors from "../../support/selectors";
const batchProcessingSelectors = selectors.batchProcessing

describe('Batch Request Validations', () => {
  const batch_test_student = Cypress.env('batch_test_student')

  beforeEach(() => {
    cy.login()
    cy.visit('/')
    
    // Go to Batch Processing => New Batch Request
    cy.get(batchProcessingSelectors.navBtn).click()
    cy.get(batchProcessingSelectors.newRequestBtn).click()
  })

  /**
   * @name cancelModal
   * 
   * @description
   * Make sure Cancel button closes a opening modal and reset the data that was entered in the modal.
   */
  it('Cancel button to close moals', () => {
    // Graduation Algorithm
    cy.contains('Graduation Algorithm').next().find('button').click()
    cy.wait(500)
    cy.get(batchProcessingSelectors.overlayWindow).find('input').click({force: true})
    cy.get(selectors.selections).contains('Student').click()
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.numberInput).type(batch_test_student.PEN)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Add Student').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    // Cancel and make sure entered data is no longer there
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
    cy.contains('Graduation Algorithm').next().find('button').click()
    cy.wait(500)
    cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.givenname)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()

    // TVR
  })
})