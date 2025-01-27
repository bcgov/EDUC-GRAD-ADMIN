import selectors from "../../support/selectors";
const schoolsSelectors = selectors.schools

describe('Schools', () => {
  const test_school = Cypress.env('test_school')

  beforeEach(() => {
    cy.login()
    cy.visit('/') 

    // If still not logged in, login
    cy.doesExist(selectors.login.loginBtn).then((exist) => {
      if (exist) {
          cy.get(selectors.login.loginBtn).eq(0).click()
      }
    })

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