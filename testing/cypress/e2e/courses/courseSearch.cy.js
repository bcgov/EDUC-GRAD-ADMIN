import selectors from "../../support/selectors";
const coursesSelectors = selectors.courses

describe('Courses', () => {
  const test_course = Cypress.env('test_course') 

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

  // This does not work if any of the button lable changes
  it('Searches courses', () => {
    // Only TRAX Code
    cy.get(coursesSelectors.advancedSearchForm).contains('TRAX Code:').next().type(test_course.courseCode)
    cy.get(coursesSelectors.advancedSearchForm).contains('Search').click()
    cy.get(coursesSelectors.activeWindow).find(coursesSelectors.rows).its('length').should('eq', test_course.courseNum)
    // Trax Code and Grade
    cy.get(coursesSelectors.advancedSearchForm).contains('TRAX Grade Level:').next().type(test_course.gradeLevel)
    cy.get(coursesSelectors.advancedSearchForm).contains('Search').click()
    cy.get(coursesSelectors.activeWindow).find(coursesSelectors.rows).its('length').should('eq', 1)
  })
})