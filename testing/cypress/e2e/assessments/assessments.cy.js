import selectors from "../../support/selectors";
const assessmentsSelectors = selectors.assessments

function shouldHaveData(selector) {
  cy.wait(400)
  cy.get(selector).find(assessmentsSelectors.rows).its('length').should('be.gt', 1)
}

describe('Assessments', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
    cy.get(assessmentsSelectors.navBtn).click()
  })

  it('Checks each table if they are loaded', () => {
    shouldHaveData(assessmentsSelectors.assessmentsWindow)

    cy.get(assessmentsSelectors.navSlider).contains('Assessment Requirements').click()
    shouldHaveData(assessmentsSelectors.requirementsWindow)
  })
})