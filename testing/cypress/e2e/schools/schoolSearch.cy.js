import selectors from "../../support/selectors";
const schoolsSelectors = selectors.schools

describe('Schools', () => {
  const test_school = {
    mincode: "00505034",
    district: "005",
    schoolName: "Fernie Secondary"
  }
  
  const invalidMessage = {
    empty: 'Enter at least one field to'
  }

  beforeEach(() => {
    cy.login()
    cy.visit('/') 
    cy.get(schoolsSelectors.navBtn).click()
  })

  it('Searches schools', () => {
    cy.get(schoolsSelectors.districtInput).type(test_school.district)
    cy.get(schoolsSelectors.schoolWindow).contains('Search').click()
    cy.get(schoolsSelectors.rows).its('length').should('be.gt', 1)
    cy.get(schoolsSelectors.schoolWindow).contains('Reset').click()
    cy.get(schoolsSelectors.districtInput).should('be.empty')

    cy.get(schoolsSelectors.mincodeInput).type(test_school.mincode)
    cy.get(schoolsSelectors.schoolWindow).contains('Search').click()
    cy.get(schoolsSelectors.rows).its('length').should('eq', 1)
    cy.get(schoolsSelectors.schoolWindow).contains('Reset').click()
    cy.get(schoolsSelectors.mincodeInput).should('be.empty')

    cy.get(schoolsSelectors.schoolNameInput).type(test_school.schoolName)
    cy.get(schoolsSelectors.schoolWindow).contains('Search').click()
    // Could be one or more than one
    cy.get(schoolsSelectors.rows).its('length').should('be.gte', 1)
    cy.get(schoolsSelectors.schoolWindow).contains('Reset').click()
    cy.get(schoolsSelectors.schoolNameInput).should('be.empty')
  })
})