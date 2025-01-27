import selectors from "../../support/selectors";
const coursesSelectors = selectors.courses

function typeInputFieldFoundByLabel(label, content) {
  cy.get(coursesSelectors.advancedSearchForm).contains(label).next().type(content)
}

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
  it('Searches courses and requirements', () => {
    // Only TRAX Code
    typeInputFieldFoundByLabel('TRAX Code:', test_course.courseCode)
    cy.get(coursesSelectors.advancedSearchForm).contains('Search').click()
    cy.get(coursesSelectors.activeWindow).find(coursesSelectors.rows).its('length').should('eq', test_course.courseNum)
    // Trax Code and Grade
    typeInputFieldFoundByLabel('TRAX Grade Level:', test_course.gradeLevel)
    cy.get(coursesSelectors.advancedSearchForm).contains('Search').click()
    cy.get(coursesSelectors.activeWindow).find(coursesSelectors.rows).its('length').should('eq', 1)
    // Reset
    cy.get(coursesSelectors.advancedSearchForm).contains('Reset').click()
    cy.get(coursesSelectors.advancedSearchForm).contains('TRAX Code:').next().should('be.empty')
    cy.get(coursesSelectors.advancedSearchForm).contains('TRAX Grade Level:').next().should('be.empty')
    // Course Title & language
    typeInputFieldFoundByLabel('Course Title:', test_course.courseTitle)
    cy.get(coursesSelectors.advancedSearchForm).contains('Instruction Language').next().click({force: true})
    cy.get(coursesSelectors.selections).contains(test_course.language).click({force: true})
    cy.get(coursesSelectors.advancedSearchForm).contains('Search').click()
    cy.get(coursesSelectors.activeWindow).find(coursesSelectors.rows).its('length').should('eq', 1)

    // Course Requirements
    // Course code
    cy.get(coursesSelectors.courseRequirementsNav).click()
    typeInputFieldFoundByLabel('Course code:', test_course.courseCode)
    cy.get(coursesSelectors.courseReqForm).contains('Search').click()
    cy.get(coursesSelectors.activeWindow).find(coursesSelectors.rows).its('length').should('eq', test_course.requirementNum)
    // Course level
    typeInputFieldFoundByLabel('Course level:', test_course.gradeLevel)
    cy.get(coursesSelectors.courseReqForm).contains('Search').click()
    cy.get(coursesSelectors.activeWindow).find(coursesSelectors.rows).its('length').should('eq', 2)
    // Reset
    cy.get(coursesSelectors.courseReqForm).contains('Reset').click()
    cy.get(coursesSelectors.courseReqForm).contains('Course code:').next().should('be.empty')
    cy.get(coursesSelectors.courseReqForm).contains('Course level:').next().should('be.empty')
    // Requirement rule
    typeInputFieldFoundByLabel('Course code:', test_course.courseCode)
    typeInputFieldFoundByLabel('Rule#:', test_course.ruleNum)
    cy.get(coursesSelectors.courseReqForm).contains('Search').click()
    cy.get(coursesSelectors.activeWindow).find(coursesSelectors.rows).its('length').should('eq', 1)
  })

  it('Goes through tables to check if data is loaded', () => {
    cy.get(coursesSelectors.courseRestrictionNav).click()
    cy.wait(500)
    cy.get(coursesSelectors.activeWindow).find(coursesSelectors.rows).its('length').should('be.gt', 0)

    cy.get(coursesSelectors.fineArtAppliedSkillNav).click()
    cy.wait(500)
    cy.get(coursesSelectors.activeWindow).find(coursesSelectors.rows).its('length').should('be.gt', 0)

    cy.get(coursesSelectors.examSpecialCaseNav).click()
    cy.wait(500)
    cy.get(coursesSelectors.activeWindow).find(coursesSelectors.rows).its('length').should('be.gt', 0)

    cy.get(coursesSelectors.equivalencyOrChallengeCodesNav).click()
    cy.wait(500)
    cy.get(coursesSelectors.activeWindow).find(coursesSelectors.rows).its('length').should('be.gt', 0)
  })
})