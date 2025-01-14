import selectors from "../../support/selectors"

describe('Student Search', () => {
  const test_student1 = Cypress.env('test_student1')

  context('with PEN', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/')
    })

    it('GRAD Status Edit', () => {
      cy.doesExist(selectors.login.loginBtn).then((exist) => {
        if (exist) {
          cy.get(selectors.login.loginBtn).eq(0).click()
        }
      })
      cy.get(selectors.studentSearch.title).should('contain.text', 'Student Search')
      cy.get(selectors.studentSearch.searchByPEN).type(test_student1.PEN)
      cy.get(selectors.studentSearch.searchSubmit).click()
      cy.wait(5000) // Need to wait so that fields load up in Edit window
      
      // Edit
      cy.get(selectors.studentSearch.editBtn).click()
      cy.get(selectors.studentSearch.status).click({force: true})
      cy.get(selectors.studentSearch.selections).contains(test_student1.new_status).click()
      cy.get(selectors.studentSearch.grade).click({force: true})
      cy.get(selectors.studentSearch.selections).contains(test_student1.new_grade).click()
      cy.get(selectors.studentSearch.schoolOfRecord).click({force: true})
      cy.get(selectors.studentSearch.selections).contains(test_student1.new_school).click()
      cy.get(selectors.studentSearch.schoolAtGraduation).click({force: true})
      cy.get(selectors.studentSearch.selections).contains(test_student1.new_school).click()
      cy.get(selectors.studentSearch.saveStatusBtn).click()

      // Check to see if values are changed
      cy.get(selectors.studentSearch.table).find(selectors.studentSearch.statusText).should('contain.text', test_student1.new_status)
      cy.get(selectors.studentSearch.table).find(selectors.studentSearch.gradeText).should('contain.text', test_student1.new_grade)
      cy.get(selectors.studentSearch.table).find(selectors.studentSearch.schoolOfRecordText).should('contain.text', test_student1.new_school)
      cy.get(selectors.studentSearch.table).find(selectors.studentSearch.schoolAtGraduationText).should('contain.text', test_student1.new_school)
    })

    after(() => {
      cy.resetDataToOriginal()
    })
  })
})