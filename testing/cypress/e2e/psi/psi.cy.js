import selectors from "../../support/selectors";
const psiSelectors = selectors.psi;

function searchRowNumAndReset(rowNum) {
  cy.get(psiSelectors.psiReqForm).contains('Search').click()
  cy.get(psiSelectors.rows).its('length').should('eq', rowNum)
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
    cy.get(psiSelectors.rows).its('length').should('eq', 2)
    // Plus with Active Flag
    cy.get(psiSelectors.activeFlagSelection).click({force: true})
    cy.wait(500)
    cy.get(psiSelectors.selections).contains(test_psi.active).click({force: true})
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