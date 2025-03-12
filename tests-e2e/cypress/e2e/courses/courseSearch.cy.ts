/**
 * @module Courses
 * 
 * @description
 * This field is comprised of multiple tables and windows with input fields regarding courses.
 * There are the tables covered in this test file:
 * - Course Restrictions
 * - Fine Arts Applied Skills
 * - Exam Special Cases
 * - Equivalency or Challenge
 * There are two windows with input fields covered in this test file:
 * - Course
 * - Course Requirements 
 */

import selectors from "../../support/selectors";
const coursesSelectors = selectors.courses

function typeInputFieldFoundByLabel(label: string, content: string) {
  cy.get(coursesSelectors.advancedSearchForm).contains(label).next().type(content)
}

describe('Courses', () => {
  const test_course =  {
    courseCode: 'SS',
    gradeLevel: '10',
    courseTitle: 'SOCIAL STUDIES 10',
    language: 'EN',
    courseNum: 3,
    requirementNum: 7,
    ruleNum: '704'
  }
  
  const invalidMessage = {
    empty: 'Enter at least one field to search.',
    noCourse: 'No courses found.',
    noCourseReq: 'No course requirements found.'
  }

  beforeEach(() => {
    cy.login()
    cy.visit('/') 
    cy.get(coursesSelectors.navBtn).click()
  })

  /**
   * @name searchCoursesAndRequirements
   * 
   * @description
   * In Courses and Course Requirement input fields, search records using various criteria.
   * Reminder: *This test does not work if any of the button label changes* due to its dependent selectors
   * 
   * ## Steps:
   * 1. Search with a valid course code entered in "TRAX Code:" and make sure it returns expected number of courses
   * 2. Filter it with a valid grade level entered in "TRAX Grade Level:" and now there is only one course in the table
   * 3. Reset input
   * 4. Search with a valid course title and instruction language in "Course Title: " and "Instruction Language" and make sure it returns one course
   * 5. Reset input
   * 6. Search with empty input to make sure an error appears
   * 7. Search with invalid data to make sure an error appears when there is no course to return
   * 8. **Navigate to Course Requirement window**
   * 9. Search with a valid course code entered in "Course code:" and make sure it returns expected number of course requirements
   * 10. Filter it with a valid course level entered in "Course level:" and now there are two requirements in the table
   * 11. Reset input
   * 12. Search with a valid course code and rule in "Course code:" and "Rule#:" and make sure it returns only one course requirement
   * 13. Reset input
   * 14. Search with empty input to make sure an error appears
   * 15. Search with invalid data to make sure an error appears when there is no course requirement to return 
   */
  it('Searches courses and requirements', () => {
    // Only TRAX Code
    typeInputFieldFoundByLabel('TRAX Code:', test_course.courseCode)
    cy.get(coursesSelectors.advancedSearchForm).contains('Search').click()
    cy.shouldHaveData(coursesSelectors.coursesView, test_course.courseNum)
    // Trax Code and Grade
    typeInputFieldFoundByLabel('TRAX Grade Level:', test_course.gradeLevel)
    cy.get(coursesSelectors.advancedSearchForm).contains('Search').click()
    cy.shouldHaveData(coursesSelectors.coursesView, 1)
    // Reset
    cy.get(coursesSelectors.advancedSearchForm).contains('Reset').click()
    cy.get(coursesSelectors.advancedSearchForm).contains('TRAX Code:').next().should('be.empty')
    cy.get(coursesSelectors.advancedSearchForm).contains('TRAX Grade Level:').next().should('be.empty')
    // Course Title & language
    typeInputFieldFoundByLabel('Course Title:', test_course.courseTitle)
    cy.get(coursesSelectors.advancedSearchForm).contains('Instruction Language').next().click({force: true})
    cy.get(selectors.selections).contains(test_course.language).click({force: true})
    cy.get(coursesSelectors.advancedSearchForm).contains('Search').click()
    cy.shouldHaveData(coursesSelectors.coursesView, 1)
    // Enters invalid data for Course Search
    cy.get(coursesSelectors.advancedSearchForm).contains('Reset').click()
    cy.get(coursesSelectors.advancedSearchForm).contains('Search').click()
    cy.get(coursesSelectors.advancedSearchForm).find(coursesSelectors.errorMsg).should('have.text', invalidMessage.empty)
    typeInputFieldFoundByLabel('TRAX Code:', 'Hello')
    cy.get(coursesSelectors.advancedSearchForm).contains('Search').click()
    cy.get(coursesSelectors.advancedSearchForm).find(coursesSelectors.errorMsg).should('have.text', invalidMessage.noCourse)

    // Course Requirements
    // Course code
    cy.get(coursesSelectors.courseRequirementsNav).click()
    typeInputFieldFoundByLabel('Course code:', test_course.courseCode)
    cy.get(coursesSelectors.courseReqForm).contains('Search').click()
    cy.shouldHaveData(coursesSelectors.coursesView, test_course.requirementNum)
    // Course level
    typeInputFieldFoundByLabel('Course level:', test_course.gradeLevel)
    cy.get(coursesSelectors.courseReqForm).contains('Search').click()
    cy.shouldHaveData(coursesSelectors.coursesView, 2)
    // Reset
    cy.get(coursesSelectors.courseReqForm).contains('Reset').click()
    cy.get(coursesSelectors.courseReqForm).contains('Course code:').next().should('be.empty')
    cy.get(coursesSelectors.courseReqForm).contains('Course level:').next().should('be.empty')
    // Requirement rule
    typeInputFieldFoundByLabel('Course code:', test_course.courseCode)
    typeInputFieldFoundByLabel('Rule#:', test_course.ruleNum)
    cy.get(coursesSelectors.courseReqForm).contains('Search').click()
    cy.shouldHaveData(coursesSelectors.coursesView, 1)
    // Enters invalid data for Course Requirement 
    cy.get(coursesSelectors.courseReqForm).contains('Reset').click()
    cy.get(coursesSelectors.courseReqForm).contains('Search').click()
    cy.get(coursesSelectors.courseReqForm).find(coursesSelectors.errorMsg).should('have.text', invalidMessage.empty)
    typeInputFieldFoundByLabel('Course code:', 'Hello')
    cy.get(coursesSelectors.courseReqForm).contains('Search').click()
    cy.get(coursesSelectors.courseReqForm).find(coursesSelectors.errorMsg).should('have.text', invalidMessage.noCourseReq)
  })

  /**
   * @name checkDataInTable
   * 
   * @description
   * Goes through every table in the Courses nav and checks if there is at least one row in each table
   * 
   * ## Steps:
   * 1. Navigate to Course Restrictions table to check data
   * 2. Navigate to Fine Arts Applied Skills table to check data
   * 3. Navigate to Exam Special Cases table to check data
   * 4. Navigate to Equivalency or Challenge table to check data
   */
  it('Goes through tables to check if data is loaded', () => {
    cy.get(coursesSelectors.courseRestrictionNav).click()
    cy.wait(500)
    cy.shouldHaveData(coursesSelectors.coursesView)

    cy.get(coursesSelectors.fineArtAppliedSkillNav).click()
    cy.wait(500)
    cy.shouldHaveData(coursesSelectors.coursesView)

    cy.get(coursesSelectors.examSpecialCaseNav).click()
    cy.wait(500)
    cy.shouldHaveData(coursesSelectors.coursesView)

    cy.get(coursesSelectors.equivalencyOrChallengeCodesNav).click()
    cy.wait(500)
    cy.shouldHaveData(coursesSelectors.coursesView)
  })
})