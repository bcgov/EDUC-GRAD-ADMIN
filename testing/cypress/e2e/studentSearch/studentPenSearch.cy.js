import selectors from "../../support/selectors"
const studentSearchSelectors = selectors.studentSearch

function editStudentProfile(student, reset = false) {
    cy.get(studentSearchSelectors.gradBtn).click()
    // Edit
    cy.get(studentSearchSelectors.editBtn).click()
    cy.wait(1000)

    if (reset) {
      // Reset to original data
      cy.get(studentSearchSelectors.status).click({force: true})
      cy.get(studentSearchSelectors.selections).contains(student.original_status).click()
      cy.get(studentSearchSelectors.grade).click({force: true})
      cy.get(studentSearchSelectors.selections).contains(student.original_grade).click()
      cy.get(studentSearchSelectors.schoolOfRecord).click({force: true})
      cy.get(studentSearchSelectors.selections).contains(student.original_school).click()
      //cy.get(studentSearchSelectors.schoolAtGraduation).click({force: true})
      //cy.get(studentSearchSelectors.selections).contains(student.original_school).click()
    } else {
      // Change to new data
      cy.get(studentSearchSelectors.status).click({force: true})
      cy.get(studentSearchSelectors.selections).contains(student.new_status).click()
      cy.get(studentSearchSelectors.grade).click({force: true})
      cy.get(studentSearchSelectors.selections).contains(student.new_grade).click()
      cy.get(studentSearchSelectors.schoolOfRecord).click({force: true})
      cy.get(studentSearchSelectors.selections).contains(student.new_school).click()
      //cy.get(studentSearchSelectors.schoolAtGraduation).click({force: true})
      //cy.get(studentSearchSelectors.selections).contains(student.new_school).click()
    }
    cy.get(studentSearchSelectors.saveStatusBtn).click({force: true})
}

function checkItemsInWindowTable(windowSelector) {
    const selector = windowSelector + " " + studentSearchSelectors.noRow
    cy.wait(500)
    cy.doesExist(selector).then((exist) => {
        if (exist) {
            cy.get(selector).should('contain.text', 'No data available')
        } else {
            cy.get(windowSelector).find(studentSearchSelectors.rows).its('length').should('be.gt', 0)
        }
    })
}

describe('Student Search', () => {
  const test_student1 = Cypress.env('test_student1')

  context('with PEN Search', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/')
      cy.get(studentSearchSelectors.title).should('contain.text', 'Student Search')
      cy.get(studentSearchSelectors.searchByPEN).type(test_student1.PEN)
      cy.get(studentSearchSelectors.searchSubmit).click()
      cy.wait(5000) // Need to wait so that fields load up in Edit window
    })

    it('Edits GRAD status', () => {
      // Edit
      editStudentProfile(Cypress.env('test_student1'))

      // Check to see if values are changed
      cy.get(studentSearchSelectors.table).find(studentSearchSelectors.statusText).should('contain.text', test_student1.new_status)
      cy.get(studentSearchSelectors.table).find(studentSearchSelectors.gradeText).should('contain.text', test_student1.new_grade)
      cy.get(studentSearchSelectors.table).find(studentSearchSelectors.schoolOfRecordText).should('contain.text', test_student1.new_school)
      //cy.get(studentSearchSelectors.table).find(studentSearchSelectors.schoolAtGraduationText).should('contain.text', test_student1.new_school)

      // Clean up data
      editStudentProfile(Cypress.env('test_student1'), true)
    })

    it('Checks if each table\'s data is loaded', () => {
      // Courses Window
      cy.get(studentSearchSelectors.coursesBtn).click()
      cy.get(studentSearchSelectors.coursesWindow).should('not.contain.css', 'display', 'none')
      checkItemsInWindowTable(studentSearchSelectors.coursesWindow)
      // Assessments Window
      cy.get(studentSearchSelectors.assessmentBtn).click()
      cy.get(studentSearchSelectors.coursesWindow).should('contain.css', 'display', 'none')
      cy.get(studentSearchSelectors.assessmentsWindow).should('not.contain.css', 'display', 'none')
      checkItemsInWindowTable(studentSearchSelectors.assessmentsWindow)
      // Exams Details Window
      cy.get(studentSearchSelectors.examsBtn).click()
      cy.get(studentSearchSelectors.assessmentsWindow).should('contain.css', 'display', 'none')
      cy.get(studentSearchSelectors.examsWindow).should('not.contain.css', 'display', 'none')
      checkItemsInWindowTable(studentSearchSelectors.examsWindow)
      // Optional Programs Window
      cy.get(studentSearchSelectors.optionalBtn).click()
      cy.get(studentSearchSelectors.examsWindow).should('contain.css', 'display', 'none')
      cy.get(studentSearchSelectors.optionalWindow).should('not.contain.css', 'display', 'none')
      const optionalWindowRow = studentSearchSelectors.optionalWindow + " " + studentSearchSelectors.rows
        cy.doesExist(optionalWindowRow).then(exist => {
            if (exist) {
              cy.get(optionalWindowRow).its('length').should('be.gt', 0)
            } else {
              cy.get(studentSearchSelectors.optionalWindow).should('contain.text', 'This student does not have any optional programs.')
            }
        })
      // Audit History Window
      cy.get(studentSearchSelectors.auditBtn).click()
      cy.get(studentSearchSelectors.optionalWindow).should('contain.css', 'display', 'none')
      cy.get(studentSearchSelectors.auditWindow).should('not.contain.css', 'display', 'none')
      checkItemsInWindowTable(studentSearchSelectors.auditWindow + " .v-window-item:nth-child(1)")
      cy.get(studentSearchSelectors.auditWindow).find(studentSearchSelectors.firstExpandArrow).click()
      cy.get(studentSearchSelectors.auditWindow).find(studentSearchSelectors.secondRowJsonData).should('contain.text', 'createUser')

      cy.get(studentSearchSelectors.optionalProgramChangeHistoryBtn).click()
      checkItemsInWindowTable(studentSearchSelectors.auditWindow + " .v-window-item:nth-child(2)")
      cy.get(studentSearchSelectors.auditWindow).find(studentSearchSelectors.firstExpandArrow).click()
      cy.get(studentSearchSelectors.auditWindow).find(studentSearchSelectors.secondRowJsonData).should('contain.text', 'createUser')
      
      // Undo Completion Reasons Window
      cy.get(studentSearchSelectors.undoBtn).click()
      cy.get(studentSearchSelectors.auditWindow).should('contain.css', 'display', 'none')
      cy.get(studentSearchSelectors.undoWindow).should('not.contain.css', 'display', 'none')
      checkItemsInWindowTable(studentSearchSelectors.undoWindow)
    })

    it('Adds and removes optional program and note', () => {
      // Undo completion if the student is graduated
      const schoolAtGraduationText = studentSearchSelectors.table + " " + studentSearchSelectors.schoolAtGraduation
      cy.doesExist(schoolAtGraduationText).then(exist => {
        if (exist) {
          cy.get(studentSearchSelectors.selections).contains('Undo Completion').click({force: true})
          cy.wait(1000)
          cy.get(studentSearchSelectors.undoCompletionReasonInput).click({force: true})
          cy.get(studentSearchSelectors.selections).contains('Other').click({force: true})
          cy.get(studentSearchSelectors.undoCompletionReasonTextarea).type('Cypress testing')
          cy.get(studentSearchSelectors.undoCompletionConfirmCheckbox).click()
          cy.get(studentSearchSelectors.undoCompletionBtn).click()
          cy.get(studentSearchSelectors.transcriptTVRBtn).click()
        } else {
          cy.log("Student is not graduated")
        }
      })
        
      // Optional Program
      const optionalCourseToAdd = 'French Immersion'
      cy.get(studentSearchSelectors.optionalBtn).click()
      cy.get(studentSearchSelectors.examsWindow).should('contain.css', 'display', 'none')
      cy.get(studentSearchSelectors.optionalWindow).should('not.contain.css', 'display', 'none')
      // Add Optional Program
      cy.get(studentSearchSelectors.optionalWindow).should('contain.text', 'This student does not have any optional programs.')
      cy.get(studentSearchSelectors.optionalWindow).find('button').click()
      cy.contains('This student is not active.')
      cy.wait(500)
      cy.get(studentSearchSelectors.chooseOptional).click({force: true})
      cy.get(studentSearchSelectors.selections).contains(optionalCourseToAdd).click()
      cy.get(studentSearchSelectors.nextOptional).click()
      cy.contains(`You are about to add the ${optionalCourseToAdd}`)
      cy.get(studentSearchSelectors.nextOptional).click()
      cy.get(studentSearchSelectors.optionalWindow).find(studentSearchSelectors.optionalProgramTable).its('length').should('eq', 1)
      cy.get(studentSearchSelectors.optionalWindow).should('contain.text', optionalCourseToAdd)
      // Delete Optional Program
      cy.get(studentSearchSelectors.optionalWindow).find(studentSearchSelectors.deleteOptinalBtn).click({force: true})
      cy.contains('This student is not active.')
      cy.contains(`You are about to delete the ${optionalCourseToAdd}`)
      cy.get(studentSearchSelectors.deleteOptionalConfirmBtn).click()
      cy.get(studentSearchSelectors.optionalWindow).should('contain.text', 'This student does not have any optional programs.')

      // Note
      const note1 = 'Hello Test'
      const note2 = 'Another Note'
      cy.get(studentSearchSelectors.notesBtn).click()
      cy.get(studentSearchSelectors.optionalWindow).should('contain.css', 'display', 'none')
      cy.get(studentSearchSelectors.notesWindow).should('not.contain.css', 'display', 'none')
      // Add Note
      cy.get(studentSearchSelectors.notesWindow).find(studentSearchSelectors.addNoteBtn).click()
      cy.get(studentSearchSelectors.noteTextarea).type(note1)
      cy.get(studentSearchSelectors.addNoteConfirmBtn).click()
      cy.get(studentSearchSelectors.notesWindow).should('contain.text', note1)
      // Edit Note
      cy.get(studentSearchSelectors.notesWindow).find(studentSearchSelectors.editNoteBtn).click({force: true})
      cy.get(studentSearchSelectors.notesWindow).find(studentSearchSelectors.editTextarea).clear().type(note2)
      cy.get(studentSearchSelectors.notesWindow).find(studentSearchSelectors.saveNoteBtn).click()
      cy.get(studentSearchSelectors.notesWindow).should('contain.text', note2)
      cy.get(studentSearchSelectors.notesWindow).find(studentSearchSelectors.deleteNoteBtn).click({force: true})
      cy.get(studentSearchSelectors.notesWindow).should('not.contain.text', note2)
    })
  })

  context('With Advanced Search', () => {
    
    beforeEach(() => {
      cy.login()
      cy.visit('/')
      cy.get(studentSearchSelectors.title).should('contain.text', 'Student Search')
      cy.get(studentSearchSelectors.advancedSearchBtn).click()
      cy.contains('Advanced Student Search')
    })

    it('Searches one student', () => {
        cy.get(studentSearchSelectors.legalSurnameInput).type(test_student1.surname)
        cy.get(studentSearchSelectors.legalGivennameInput).type(test_student1.given)
        cy.get(studentSearchSelectors.advSearchSubmit).click()
        cy.get(studentSearchSelectors.searchResultTableRow).its('length').should('eq', 1)
        cy.get(studentSearchSelectors.searchResultTableRow).find(studentSearchSelectors.penLink).click()
        cy.contains('GRAD Status')
    }) 

    it('Searches multiple students', () => {
      const test_student2 = Cypress.env("test_student2")
      cy.get(studentSearchSelectors.legalGivennameInput).type(test_student2.given)
      cy.get(studentSearchSelectors.advSearchSubmit).click()
      cy.get(studentSearchSelectors.searchResultTableRow).its('length').should('eq', 4)

      cy.get(studentSearchSelectors.advSearchReset).click()
      cy.get(studentSearchSelectors.legalGivennameInput).should('not.contain.text', test_student2.given)
    })
  })

  context('With invalid data', () => {
    // Perform input validation for both pen and advanced search
    const invalidMessage = {
      noStudentPEN: 'Student cannot be found on the GRAD or PEN database',
      noStudentAdvanced: 'There are [0] more matches on PEN'
    }

    before(() => {
      cy.login()
      cy.visit('/')
      cy.get(studentSearchSelectors.title).should('contain.text', 'Student Search')
    })

    it('Enters invalid data', () => {
      cy.get(studentSearchSelectors.searchByPEN).type('121212121')
      cy.get(studentSearchSelectors.searchSubmit).click()
      cy.get(studentSearchSelectors.errorMsg).should('have.text', invalidMessage.noStudentPEN)

      cy.get(studentSearchSelectors.advancedSearchBtn).click()
      cy.get(studentSearchSelectors.legalSurnameInput).type('ZZZ')
      cy.get(studentSearchSelectors.advSearchSubmit).click()
      cy.get(studentSearchSelectors.errorMsg).should('have.text', invalidMessage.noStudentAdvanced)
    })
  })
})