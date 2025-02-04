import selectors from "../../support/selectors";
const schoolsSelectors = selectors.schools

// It does not work: excluded from testing
describe('Schools', () => {
  before(() => {
    cy.login()
    cy.visit('/') 
    cy.get(schoolsSelectors.navBtn).click()
  })

  it('Goes to EDX', () => {
    cy.url().should('includes', 'silver.devops.gov.bc.ca/institute/school')
  })
})