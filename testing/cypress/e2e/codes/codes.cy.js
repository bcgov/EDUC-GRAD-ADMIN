import selectors from "../../support/selectors";
const codesSelectors = selectors.codes

function checkRows() {
  cy.wait(500)
  cy.get(codesSelectors.rows).its('length').should('be.gt', 0) 
}

function checkTableForData(selector) {
  cy.get(selector).click() 
  checkRows()
}

function checkCredentialTableForData(credentialType) {
  cy.get(codesSelectors.credentialsBtn).click()
  cy.get(codesSelectors.selections).contains(credentialType).click({force: true})
  checkRows()
}

describe('Codes', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/') 
    cy.get(codesSelectors.navBtn).click()
  })

  it('Goes through each table to check data is loaded', () => {
    checkTableForData(codesSelectors.careerProgramCodesBtn)
    // Credentials
    checkCredentialTableForData('Certificate Types')
    checkCredentialTableForData('Transcript Types')
    checkCredentialTableForData('Program Certificate Transcript')
    checkCredentialTableForData('Digital Signature')
    checkCredentialTableForData('Signature Block')
    checkCredentialTableForData('Document Status Codes')
    // Report Types
    checkTableForData(codesSelectors.reportTypesBtn)
    // Student Status Codes
    checkTableForData(codesSelectors.studentStatusCodesBtn)
    // Undo Completion Reason Codes
    checkTableForData(codesSelectors.undoCompletionReasonCodesBtn)
    // History Activity Codes
    checkTableForData(codesSelectors.historyActivityCodeBtn)
    // Batch Type Codes
    checkTableForData(codesSelectors.batchTypeCodesBtn)
  })
})