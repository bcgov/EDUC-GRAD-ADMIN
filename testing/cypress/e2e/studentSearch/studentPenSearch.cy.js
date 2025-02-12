import selectors from "../../support/selectors"

function editStudentProfile(student, reset = false) {
    cy.get(selectors.studentSearch.gradBtn).click()
    // Edit
    cy.get(selectors.studentSearch.editBtn).click()
    cy.wait(1000)

    if (reset) {
      // Reset to original data
      cy.get(selectors.studentSearch.status).click({force: true})
      cy.get(selectors.studentSearch.selections).contains(student.original_status).click()
      cy.get(selectors.studentSearch.grade).click({force: true})
      cy.get(selectors.studentSearch.selections).contains(student.original_grade).click()
      cy.get(selectors.studentSearch.schoolOfRecord).click({force: true})
      cy.get(selectors.studentSearch.selections).contains(student.original_school).click()
      cy.get(selectors.studentSearch.schoolAtGraduation).click({force: true})
      cy.get(selectors.studentSearch.selections).contains(student.original_school).click
    } else {
      // Change to new data
      cy.get(selectors.studentSearch.status).click({force: true})
      cy.get(selectors.studentSearch.selections).contains(student.new_status).click()
      cy.get(selectors.studentSearch.grade).click({force: true})
      cy.get(selectors.studentSearch.selections).contains(student.new_grade).click()
      cy.get(selectors.studentSearch.schoolOfRecord).click({force: true})
      cy.get(selectors.studentSearch.selections).contains(student.new_school).click()
      cy.get(selectors.studentSearch.schoolAtGraduation).click({force: true})
      cy.get(selectors.studentSearch.selections).contains(student.new_school).click()
    }
    cy.get(selectors.studentSearch.saveStatusBtn).click()
}

describe('Student Search', () => {
  const test_student1 = Cypress.env('test_student1')

  context('with PEN Search', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/')

      // If still not logged in, login
      cy.doesExist(selectors.login.loginBtn).then((exist) => {
        if (exist) {
          cy.get(selectors.login.loginBtn).eq(0).click()
        }
      })
      
      cy.get(selectors.studentSearch.title).should('contain.text', 'Student Search')
      cy.get(selectors.studentSearch.searchByPEN).type(test_student1.PEN)
      cy.get(selectors.studentSearch.searchSubmit).click()
      cy.wait(5000) // Need to wait so that fields load up in Edit window
    })

    it('Edits GRAD status', () => {
      // Edit
      editStudentProfile(Cypress.env('test_student1'))

      // Check to see if values are changed
      cy.get(selectors.studentSearch.table).find(selectors.studentSearch.statusText).should('contain.text', test_student1.new_status)
      cy.get(selectors.studentSearch.table).find(selectors.studentSearch.gradeText).should('contain.text', test_student1.new_grade)
      cy.get(selectors.studentSearch.table).find(selectors.studentSearch.schoolOfRecordText).should('contain.text', test_student1.new_school)
      cy.get(selectors.studentSearch.table).find(selectors.studentSearch.schoolAtGraduationText).should('contain.text', test_student1.new_school)
    })

    it('Checks if each table\'s data is loaded', () => {
      // Courses Window
      cy.get(selectors.studentSearch.coursesBtn).click()
      cy.get(selectors.studentSearch.coursesWindow).should('not.contain.css', 'display', 'none')
      cy.checkItemsInWindowTable(selectors.studentSearch.coursesWindow)
      // Assessments Window
      cy.get(selectors.studentSearch.assessmentBtn).click()
      cy.get(selectors.studentSearch.coursesWindow).should('contain.css', 'display', 'none')
      cy.get(selectors.studentSearch.assessmentsWindow).should('not.contain.css', 'display', 'none')
      cy.checkItemsInWindowTable(selectors.studentSearch.assessmentsWindow)
      // Exams Details Window
      cy.get(selectors.studentSearch.examsBtn).click()
      cy.get(selectors.studentSearch.assessmentsWindow).should('contain.css', 'display', 'none')
      cy.get(selectors.studentSearch.examsWindow).should('not.contain.css', 'display', 'none')
      cy.checkItemsInWindowTable(selectors.studentSearch.examsWindow)
      // Optional Programs Window
      cy.get(selectors.studentSearch.optionalBtn).click()
      cy.get(selectors.studentSearch.examsWindow).should('contain.css', 'display', 'none')
      cy.get(selectors.studentSearch.optionalWindow).should('not.contain.css', 'display', 'none')
      cy.checkItemsInWindowTable(selectors.studentSearch.optionalWindow)
      // Audit History Window
      cy.get(selectors.studentSearch.auditBtn).click()
      cy.get(selectors.studentSearch.optionalWindow).should('contain.css', 'display', 'none')
      cy.get(selectors.studentSearch.auditWindow).should('not.contain.css', 'display', 'none')
      cy.checkItemsInWindowTable(selectors.studentSearch.auditWindow + " .v-window-item:nth-child(1)")
      cy.get(selectors.studentSearch.optionalProgramChangeHistoryBtn).click()
      cy.checkItemsInWindowTable(selectors.studentSearch.auditWindow + " .v-window-item:nth-child(2)")
      // Undo Completion Reasons Window
      cy.get(selectors.studentSearch.undoBtn).click()
      cy.get(selectors.studentSearch.auditWindow).should('contain.css', 'display', 'none')
      cy.get(selectors.studentSearch.undoWindow).should('not.contain.css', 'display', 'none')
      cy.checkItemsInWindowTable(selectors.studentSearch.undoWindow)
    })

    after(() => {
      editStudentProfile(Cypress.env('test_student1'), true)
    })
  })

  context('With Advanced Search', () => {
    
    beforeEach(() => {
      cy.login()
      cy.visit('/')

      // If still not logged in, login
      cy.doesExist(selectors.login.loginBtn).then((exist) => {
        if (exist) {
          cy.get(selectors.login.loginBtn).eq(0).click()
        }
      })
      
      cy.get(selectors.studentSearch.title).should('contain.text', 'Student Search')
      cy.get(selectors.studentSearch.advancedSearchBtn).click()
      cy.contains('Advanced Student Search')
    })

    it('Search one person', () => {
        cy.get(selectors.studentSearch.legalSurnameInput).type(test_student1.surname)
        cy.get(selectors.studentSearch.legalGivennameInput).type(test_student1.given)
        cy.get(selectors.studentSearch.advSearchSubmit).click()
        cy.get(selectors.studentSearch.searchResultTableRow).its('length').should('eq', 1)
        cy.get(selectors.studentSearch.searchResultTableRow).find(selectors.studentSearch.penLink).click()
        cy.contains('GRAD Status')
    }) 
  })
})