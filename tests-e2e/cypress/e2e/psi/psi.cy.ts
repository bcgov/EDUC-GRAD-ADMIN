/**
 * @module PSI
 * 
 * @description
 *  This field is comprised of several input fields that can be validated.
 */

import selectors from "../../support/selectors";
const psiSelectors = selectors.psi;

function searchRowNumAndReset(expectedRowNum) {
  cy.get(psiSelectors.psiReqForm).contains('Search').click()
  cy.shouldHaveData(psiSelectors.psiView, expectedRowNum)
  cy.get(psiSelectors.psiReqForm).contains('Reset').click()
}

describe('PSI', () => {
  const test_psi = {
    psiCode: 271, 
    psiName: 'Camosun College', 
    cslCode: 'AJAA', 
    active: 'Y', 
    transmission: 'XML'
  }

  const invalidMessage = {
    empty: 'Enter at least one field to search.',
    noPSI: 'No PSIs found.'
  }

  beforeEach(() => {
    cy.login()
    cy.visit('/')
    cy.get(psiSelectors.navBtn).click()
  })

  /**
   * @name searchPSI
   * 
   * @description
   * Search record using various criteria.
   * 
   * ## Steps:
   * 1. Search with empty input to make sure an error appears
   * 2. Search with PSI Code to make sure it only returns one result
   * 3. Reset input
   * 4. Search with PSI Name to make sure it returns two results
   * 5. Reset input
   * 6. Search with CSL Code to make sure it returns two results
   * 7. Filter with Active Flag and make sure it only returs one result
   * 8. Reset input
   * 9. Search with CSL Code and Transmission Mode and make sure it only returns one result
   * 10. Search with invalid input and make sure it displays an error when there is no psi
   */
  it('Searches PSIs', () => {
    // Empty
    cy.get(psiSelectors.psiReqForm).contains('Search').click()
    cy.get(psiSelectors.errorMsg).should('have.text', invalidMessage.empty)
    // With PSI Code
    cy.get(psiSelectors.psiCodeInput).type(test_psi.psiCode)
    searchRowNumAndReset(1)
    // With Name
    cy.get(psiSelectors.psiNameInput).type(test_psi.psiName)
    searchRowNumAndReset(2)
    // With Code
    cy.get(psiSelectors.cslCodeInput).type(test_psi.cslCode)
    cy.get(psiSelectors.psiReqForm).contains('Search').click()
    cy.shouldHaveData(psiSelectors.psiView, 2)
    // Plus with Active Flag
    cy.get(psiSelectors.activeFlagSelection).click({force: true})
    cy.wait(500)
    cy.get(selectors.selections).contains(test_psi.active).click({force: true})
    searchRowNumAndReset(1)
    // With Code and Transmission Mode
    cy.get(psiSelectors.cslCodeInput).type(test_psi.cslCode)
    cy.get(psiSelectors.transmissionModeInput).type(test_psi.transmission)
    searchRowNumAndReset(1)
    // No Match
    cy.get(psiSelectors.psiCodeInput).type('000')
    cy.get(psiSelectors.psiReqForm).contains('Search').click()
    cy.get(psiSelectors.errorMsg).should('have.text', invalidMessage.noPSI)
  })
})