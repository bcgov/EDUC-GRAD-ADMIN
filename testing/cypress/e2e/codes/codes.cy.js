/**
 * @module Codes
 * 
 * @description
 * This field is comprised of series of tables displaying anything regarding codes.
 * These are the tables covered in this test file:
 * - Career Program Codes
 * - Certificate Types
 * - Transcript Types
 * - Progarm Certificate Transcript
 * - Digital Signature
 * - Signature Block
 * - Document Status Codes
 * - Report Types
 * - Student Status Codes
 * - Undo Completion Reason Codes
 * - History Activity Codes
 * - Batch Type Codes
 * 
 * Currently, this spec file is only making sure there is at least one row in each table.
 */
import selectors from "../../support/selectors";
const codesSelectors = selectors.codes

function checkCredentialTableForData(credentialType) {
  cy.get(codesSelectors.credentialsBtn).click()
  cy.get(selectors.selections).contains(credentialType).click({force: true})
  cy.shouldHaveData(codesSelectors.codesView)
}

describe('Codes', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/') 
    cy.get(codesSelectors.navBtn).click()
  })

  /**
   * @name checkDataInTable
   * 
   * @description
   * Goes through every table in the Codes nav and checks if they load by making sure there is at least one row 
   * loaded in it.
   * 
   * ## Steps:
   * 1. Navigate to Career Program Codes table to check data
   * 2. Navigate to Certificate Types table to check data
   * 3. Navigate to Transcript Types table to check data
   * 4. Navigate to Program Certificate Transcript table to check data
   * 5. Navigate to Digital Signature table to check data
   * 6. Navigate to Signature Block table to check data
   * 7. Navigate to Document Status Codes table to check data
   * 8. Navigate to Report Types table to check data
   * 9. Navigate to Student Status Codes table to check data
   * 10. Navigate to Undo Completion Reason Codes table to check data
   * 11. Navigate to History Activity Codes table to check data
   * 12. Navigate to Batch Type Codes table to check data
   */
  it('Goes through each table to check data is loaded', () => {
    cy.get(codesSelectors.careerProgramCodesBtn).click()
    cy.shouldHaveData(codesSelectors.codesView)
    // Credentials
    checkCredentialTableForData('Certificate Types')
    checkCredentialTableForData('Transcript Types')
    checkCredentialTableForData('Program Certificate Transcript')
    checkCredentialTableForData('Digital Signature')
    checkCredentialTableForData('Signature Block')
    checkCredentialTableForData('Document Status Codes')
    // Report Types
    cy.get(codesSelectors.reportTypesBtn).click()
    cy.shouldHaveData(codesSelectors.codesView)
    // Student Status Codes
    cy.get(codesSelectors.studentStatusCodesBtn).click()
    cy.shouldHaveData(codesSelectors.codesView)
    // Undo Completion Reason Codes
    cy.get(codesSelectors.undoCompletionReasonCodesBtn).click()
    cy.shouldHaveData(codesSelectors.codesView)
    // History Activity Codes
    cy.get(codesSelectors.historyActivityCodeBtn).click()
    cy.shouldHaveData(codesSelectors.codesView)
    // Batch Type Codes
    cy.get(codesSelectors.batchTypeCodesBtn).click()
    cy.shouldHaveData(codesSelectors.codesView)
  })
})