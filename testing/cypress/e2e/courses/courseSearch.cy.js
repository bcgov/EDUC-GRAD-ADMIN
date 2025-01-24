import selectors from "../../support/selectors";
const coursesSelectors = selectors.courses

describe('Courses', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/') 

    // If still not logged in, login
    cy.doesExist(selectors.login.loginBtn).then((exist) => {
    if (exist) {
        cy.get(selectors.login.loginBtn).eq(0).click()
    }
    })

    cy.get(coursesSelectors.navBtn).click()
  })

  it('Searches courses', () => {
    
  })
})