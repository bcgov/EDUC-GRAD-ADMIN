import selectors from "../../support/selectors";
const assessmentsSelectors = selectors.assessments

describe('Assessments', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')

    // If still not logged in, login
    cy.doesExist(selectors.login.loginBtn).then((exist) => {
    if (exist) {
        cy.get(selectors.login.loginBtn).eq(0).click()
    }
    })

    cy.get(assessmentsSelectors.navBtn).click()
  })
})