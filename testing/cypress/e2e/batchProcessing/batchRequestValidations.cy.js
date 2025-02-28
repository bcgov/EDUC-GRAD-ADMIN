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

function selelctStudentGroup(test_student) {
  cy.get(batchProcessingSelectors.overlayWindow).find('input').click({force: true})
  cy.get(selectors.selections).contains('Student').click()
  cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.numberInput).type(test_student.PEN)
  cy.get(batchProcessingSelectors.overlayWindow).contains('Add Student').click({force: true})
}

function openBatchRequestByLabel(label, exactMatch = false) {
  if (exactMatch) {
    cy.contains(new RegExp(`^${label}$`)).next().find('button').click()
  } else {
    cy.contains(label).next().find('button').click()
  }
  cy.wait(500)
}

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
   * @name testCancelBtnForGRADTVR
   * 
   * @description
   * Make sure Cancel button closes a opening modal and reset the data that was entered in the modal for any requests under GRAD and TVR section.
   * This test is directly dependent on label; therefore, it needs to be updated whenever label for button changes.
   */
  it('Test Cancel button for GRAD and TVR', () => {
    // Graduation Algorithm
    openBatchRequestByLabel('Graduation Algorithm')
    selelctStudentGroup(batch_test_student)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    // Cancel and make sure entered data is no longer there
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
    openBatchRequestByLabel('Graduation Algorithm')
    cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.givenname)
    cy.get(batchProcessingSelectors.overlayWindow).find('input').should('be.empty')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()

    // TVR
    openBatchRequestByLabel('Graduation Algorithm')
    selelctStudentGroup(batch_test_student)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    // Cancel and make sure entered data is no longer there
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
    openBatchRequestByLabel('Graduation Algorithm')
    cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.givenname)
    cy.get(batchProcessingSelectors.overlayWindow).find('input').should('be.empty')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()

    // Crendentials and Transcript Distribution Run
    openBatchRequestByLabel('Credentials and Transcript Distribution Run')
    cy.get(batchProcessingSelectors.runLaterRadioBtn).click()
    cy.get(batchProcessingSelectors.overlayWindow).contains('Tonight').click({force: true})
    // Cancel and make sure entered data is no longer there
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
    openBatchRequestByLabel('Credentials and Transcript Distribution Run')
    cy.get(batchProcessingSelectors.runLaterRadioBtn).should('not.be.checked')
    cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', 'Tonight')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()

  })

  /**
   * @name testCancelBtnForUserRequests
   * 
   * @description
   * Make sure Cancel button closes a opening modal and reset the data that was entered in the modal for any requests under User Requests section.
   * This test is directly dependent on label; therefore, it needs to be updated whenever label for button changes.
   */
  it('Test Cancel button for User Requests', () => {
    // Blank certificate print
    openBatchRequestByLabel('Blank certificate print')
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="FN"]').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="FNA"]').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_school)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    // Cancel and make sure entered data is no longer there
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
    openBatchRequestByLabel('Blank certificate print')
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="FN"]').should('not.be.checked')
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="FNA"]').should('not.be.checked')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.og_school) 
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()

    // Reprint certificate
    openBatchRequestByLabel('Reprint certificate')
    selelctStudentGroup(batch_test_student)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.wait(500)
    cy.get(batchProcessingSelectors.overlayWindow).contains('label', 'Where').next().click({force: true})
    cy.get(selectors.selections).contains('Download').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    // Cancel and make sure entered data is no longer there
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
    openBatchRequestByLabel('Reprint certificate')
    cy.get(batchProcessingSelectors.overlayWindow).find('input').should('be.empty')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', 'Download')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
    
    // Original certificate
    openBatchRequestByLabel('Original certificate')
    selelctStudentGroup(batch_test_student)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.wait(500)
    cy.get(batchProcessingSelectors.overlayWindow).contains('label', 'Where').next().click({force: true})
    cy.get(selectors.selections).contains('Download').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    // Cancel and make sure entered data is no longer there
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
    openBatchRequestByLabel('Original certificate')
    cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.givenname)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', 'Download')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()

    // Blank transcript print
    openBatchRequestByLabel('Blank transcript print')
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="BC2018-PUB"]').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="YU2018-PUB"]').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.wait(500)
    cy.get(batchProcessingSelectors.overlayWindow).find('input:visible').click({force: true})
    cy.get(selectors.selections).contains('School').click()
    cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_school)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.wait(500)
    cy.get(batchProcessingSelectors.overlayWindow).contains('label', 'Where').next().click({force: true})
    cy.get(selectors.selections).contains('Download').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    // Cancel and make sure entered data is no longer there
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
    openBatchRequestByLabel('Blank transcript print')
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="BC2018-PUB"]').should('not.be.checked')
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="YU2018-PUB"]').should('not.be.checked')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.og_school) 
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', 'Download')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()

    // Transcript
    openBatchRequestByLabel('Transcript', true)
    selelctStudentGroup(batch_test_student)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.wait(500)
    cy.get(batchProcessingSelectors.overlayWindow).contains('label', 'Where').next().click({force: true})
    cy.get(selectors.selections).contains('Download').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    // Cancel and make sure entered data is no longer there
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
    openBatchRequestByLabel('Transcript', true)
    cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.givenname) 
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', 'Download')
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
  })

  /**
   * @name testCancelBtnForRegeneration
   * 
   * @description
   * Make sure Cancel button closes a opening modal and reset the data that was entered in the modal for any requests under Regeneration section.
   * This test is directly dependent on label; therefore, it needs to be updated whenever label for button changes.
   */
  it.only('Test Cancel button for Regeneration', () => {
    // User Request Certificate Regeneration
    openBatchRequestByLabel('User Request Certificate Regeneration')
    selelctStudentGroup(batch_test_student)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    // Cancel and make sure entered data is no longer there
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
    openBatchRequestByLabel('User Request Certificate Regeneration')
    cy.get(batchProcessingSelectors.overlayWindow).find('input').should('be.empty')
    cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.givenname) 
    cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()

    // User Request School Report Regeneration
    // Does not work
  })

  /**
   * @name testCancelBtnForRegeneration
   * 
   * @description
   * Make sure Cancel button closes a opening modal and reset the data that was entered in the modal for any requests under Year-End Administration section.
   * This test is directly dependent on label; therefore, it needs to be updated whenever label for button changes.
   */
  it('Test Cancel button for Year-End Administration', () => {

  })
})