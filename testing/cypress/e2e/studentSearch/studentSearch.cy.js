/**
 * @module StudentSearch
 * 
 * @description hello
 */

import selectors from "../../support/selectors"
const studentSearchSelectors = selectors.studentSearch

function checkItemsInWindowTable(windowSelector) {
  const selector = windowSelector + " " + studentSearchSelectors.noRow
  cy.wait(500)
  cy.doesExist(selector).then((exist) => {
    if (exist) {
      cy.get(selector).should('contain.text', 'No data available')
    } else {
      cy.shouldHaveData(windowSelector)
    }
  })
}

function undoCompletion() {
  cy.get(studentSearchSelectors.transcriptTVRBtn).click()
  cy.get(selectors.selections).contains('Undo Completion').click({force: true})
  cy.wait(1000)
  cy.get(studentSearchSelectors.undoCompletionReasonInput).click({force: true})
  cy.get(selectors.selections).contains('Other').click({force: true})
  cy.get(studentSearchSelectors.undoCompletionReasonTextarea).type('Cypress testing')
  cy.get(studentSearchSelectors.undoCompletionConfirmCheckbox).click()
  cy.get(studentSearchSelectors.undoCompletionBtn).click()
}

describe('Student Search', () => {
  const test_student = Cypress.env('ungraduated_student')

  context('with PEN Search', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/')
      cy.get(studentSearchSelectors.title).should('contain.text', 'Student Search')
      cy.get(studentSearchSelectors.searchByPEN).type(test_student.PEN)
      cy.get(studentSearchSelectors.searchSubmit).click()
      cy.wait(5000) // Need to wait so that fields load up in Edit window
    })

    /**
     * @name checkDataInTable
     * 
     * @description
     * Make sure required fields in student grad status is always loaded, then go through every table in the test student's Student Grad Status and checks if data is loaded or
     * appropriate text appears when there is no data.
     * 
     * ## Steps:
     * 1. Make sure the following fields are loaded:
     *    - Program
     *    - Status
     *    - Grade
     *    - School Of Record
     *    - Recal Grad Status Flag
     *    - Rrecal Projected Grad Flag
     * 2. Navigate to Courses table to check data
     * 3. Navigate to Assessment table to check data
     * 4. Navigate to Exams Details table to check data
     * 5. Navigate to Optional Programs table to check data
     * 6. Navigate to Student Change Hisotry in Audit History table to check data
     *    - Collapse first row and check JSON is stored
     * 7. Navigate to Optional Program Change History in Audit History table to check data
     *    - Collapse first row and check JSON is stored
     * 8. Navigate to Undo Completion Reasons table to check data
     *    - Skip Notes sectinon because it does not have table
     */
    it('Checks if each table\'s data is loaded', () => {
      const gradStatusTable = () => cy.get(studentSearchSelectors.table)
      gradStatusTable().find(studentSearchSelectors.programText).should('exist')
      gradStatusTable().find(studentSearchSelectors.statusText).should('exist')
      gradStatusTable().find(studentSearchSelectors.gradeText).should('exist')
      gradStatusTable().find(studentSearchSelectors.schoolOfRecordText).should('exist')
      gradStatusTable().find(studentSearchSelectors.recalcGradText).should('exist')
      gradStatusTable().find(studentSearchSelectors.recalcProjectedText).should('exist')

      // Courses Window
      cy.get(studentSearchSelectors.coursesBtn).click()
      checkItemsInWindowTable(studentSearchSelectors.activeWindow)
      // Assessments Window
      cy.get(studentSearchSelectors.assessmentBtn).click()
      checkItemsInWindowTable(studentSearchSelectors.activeWindow)
      // Exams Details Window
      cy.get(studentSearchSelectors.examsBtn).click()
      checkItemsInWindowTable(studentSearchSelectors.activeWindow)
      // Optional Programs Window
      cy.get(studentSearchSelectors.optionalBtn).click()
      cy.wait(500)
      cy.get(studentSearchSelectors.activeWindow).should('contain.text', `This student is on the ${test_student.og_program} Graduation Program`)
      const optionalProgramRows = studentSearchSelectors.activeWindow + " > " + studentSearchSelectors.optionalTableRows
      cy.doesExist(optionalProgramRows).then(exist => {
        if (exist) {
          cy.shouldHaveData(studentSearchSelectors.activeWindow)
        } else {
          cy.get(studentSearchSelectors.activeWindow).should('contain.text', 'This student does not have any optional programs.')
        }
      })
      // Audit History Window
      cy.get(studentSearchSelectors.auditBtn).click()
      checkItemsInWindowTable(studentSearchSelectors.activeWindow + " .v-window-item:nth-child(1)")
      cy.get(studentSearchSelectors.activeWindow).find(studentSearchSelectors.firstExpandArrow).click()
      cy.get(studentSearchSelectors.activeWindow).find(studentSearchSelectors.secondRowJsonData).should('contain.text', 'createUser')

      cy.get(studentSearchSelectors.optionalProgramChangeHistoryBtn).click()
      checkItemsInWindowTable(studentSearchSelectors.activeWindow + " .v-window-item:nth-child(2)")
      cy.get(studentSearchSelectors.activeWindow).find(studentSearchSelectors.firstExpandArrow).click()
      cy.get(studentSearchSelectors.activeWindow).find(studentSearchSelectors.secondRowJsonData).should('contain.text', 'createUser')
      
      // Undo Completion Reasons Window
      cy.get(studentSearchSelectors.undoBtn).click()
      checkItemsInWindowTable(studentSearchSelectors.activeWindow)
    })

    /**
     * @name modifyOptionalProgramAndNote
     * 
     * @description
     * Adds and removes optinal program and note to ensure their functionality.
     * 
     * ## Steps:
     * 1. Set up test student ready for test
     *    - Undo completion if testing student is graduated since optional program cannot be removed if the student is graduated
     *    - Remove optional program if testing student has one for the sake of testing
     * 2. Add optional program (French Immersion) to ensure a warning is appropriate
     * 3. Make sure an added optional program is displayed on the table
     * 4. Click delete button for optional program to ensure a warning is appropriate
     * 5. Delete optional program and make sure there is no longer optional prograim in the table
     * 6. Navigate to Notes
     * 7. Type text to note and add to make sure it is saved properly
     * 8. Edit note by clearing text and typing another text
     * 9. Delete note to make sure note is no longer displayed
     */
    it('Adds and removes optional program and note', () => {
      // Undo completion if the student is graduated
      // const schoolAtGraduationText = studentSearchSelectors.table + " " + studentSearchSelectors.schoolAtGraduationText
      // cy.doesExist(schoolAtGraduationText).then(exist => {
      //   if (exist) {
      //     undoCompletion()
      //   } else {
      //     cy.log("Student is not graduated")
      //   }
      // })
        
      // Optional Program
      const optionalCourseToAdd = 'French Immersion'
      cy.get(studentSearchSelectors.optionalBtn).click()
      cy.wait(500)

      // Remove optinal program if there is any
      const optionalProgramRows = studentSearchSelectors.activeWindow + " > " + studentSearchSelectors.optionalTableRows
      cy.doesExist(optionalProgramRows).then(exist => {
        if (exist) {
          cy.get(optionalProgramRows).then($rows => {
            const count = $rows.length
            for (let i = 0; i < count; i++) {
              cy.get(studentSearchSelectors.activeWindow).find(studentSearchSelectors.firstRow).find(studentSearchSelectors.deleteOptionalBtn).click({force: true})
              cy.get(studentSearchSelectors.deleteOptionalConfirmBtn).click()
              cy.wait(500)
            }
          })
        } else {
          cy.log('Student does not have optional programs')
        }
      })

      // Add Optional Program
      cy.get(studentSearchSelectors.activeWindow).should('contain.text', 'This student does not have any optional programs.')
      cy.get(studentSearchSelectors.activeWindow).contains('Add Optional Program').click({force: true})
      cy.wait(500)
      cy.get(studentSearchSelectors.chooseOptional).click({force: true})
      cy.get(selectors.selections).contains(optionalCourseToAdd).click()
      cy.get(studentSearchSelectors.nextOptional).click()
      cy.contains(`You are about to add the ${optionalCourseToAdd}`)
      cy.get(studentSearchSelectors.nextOptional).click()
      cy.shouldHaveData(studentSearchSelectors.activeWindow, 1)
      cy.get(studentSearchSelectors.activeWindow).should('contain.text', optionalCourseToAdd)
      // Delete Optional Program
      cy.get(studentSearchSelectors.activeWindow).find(studentSearchSelectors.deleteOptionalBtn).click({force: true})
      cy.contains(`You are about to delete the ${optionalCourseToAdd}`)
      cy.get(studentSearchSelectors.deleteOptionalConfirmBtn).click()
      cy.get(studentSearchSelectors.activeWindow).should('contain.text', 'This student does not have any optional programs.')

      // Note
      const note1 = 'Hello Test'
      const note2 = 'Another Note'
      cy.get(studentSearchSelectors.notesBtn).click()
      // Add Note
      cy.get(studentSearchSelectors.activeWindow).find(studentSearchSelectors.addNoteBtn).click()
      cy.get(studentSearchSelectors.noteTextarea).type(note1)
      cy.get(studentSearchSelectors.addNoteConfirmBtn).click()
      cy.get(studentSearchSelectors.activeWindow).should('contain.text', note1)
      // Edit Note
      cy.get(studentSearchSelectors.activeWindow).find(studentSearchSelectors.editNoteBtn).click({force: true})
      cy.get(studentSearchSelectors.activeWindow).find(studentSearchSelectors.editTextarea).clear().type(note2)
      cy.get(studentSearchSelectors.activeWindow).find(studentSearchSelectors.saveNoteBtn).click()
      cy.get(studentSearchSelectors.activeWindow).should('contain.text', note2)
      cy.get(studentSearchSelectors.activeWindow).find(studentSearchSelectors.deleteNoteBtn).click({force: true})
      cy.get(studentSearchSelectors.activeWindow).should('not.contain.text', note2)
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


    /**
     * @name searchOneStudentWithAdvanced
     * 
     * @description
     * Search one student using Advanced Search.
     * 
     * ## Steps:
     * 1. Enter a valid surname and givenname and submit
     * 2. Ensure there is only one student returned
     * 3. Ensure the PEN link leads to Student Grad Status properly
     */
    it('Searches one student', () => {
        cy.get(studentSearchSelectors.legalSurnameInput).type(test_student.surname)
        cy.get(studentSearchSelectors.legalGivennameInput).type(test_student.givenname)
        cy.get(studentSearchSelectors.advSearchSubmit).click()
        cy.get(studentSearchSelectors.searchResultTableRow).its('length').should('eq', 1)
        cy.get(studentSearchSelectors.searchResultTableRow).find(studentSearchSelectors.penLink).click()
        cy.contains('GRAD Status')
    }) 

    /**
     * @name searchMultipleStudentsWithAdvanced
     * 
     * @description
     * Search multiple students using Advanced Search.
     * 
     * ## Steps:
     * 1. Enter given name and select male, then submit
     * 2. Ensure there are expected number of multiple students returned with same givename and gender
     * 3. Click Reset to make sure it cleans table and input field
     */
    it('Searches multiple students', () => {
      cy.get(studentSearchSelectors.legalSurnameInput).type(test_student.surname)
      cy.get(studentSearchSelectors.genderSelection).click({force: true})
      cy.get(selectors.selections).contains('Female').click({force: true})
      cy.get(studentSearchSelectors.advSearchSubmit).click()
      cy.get(studentSearchSelectors.searchResultTableRow).its('length').should('eq', 12)

      cy.get(studentSearchSelectors.advSearchReset).click()
      cy.get(studentSearchSelectors.legalGivennameInput).should('not.contain.text', test_student.surname)
    })
  })

  context('With invalid data', () => {
    // Perform input validation for both pen and advanced search
    const invalidMessage = {
      noStudentPEN: 'Student cannot be found on the GRAD or PEN database',
      noStudentAdvanced: 'There are [0] more matches on PEN',
      tooManyReponseAdvanced: 'Change Search Criteria. Too many records as response'
    }

    before(() => {
      cy.login()
      cy.visit('/')
      cy.get(studentSearchSelectors.title).should('contain.text', 'Student Search')
    })

    /**
     * @name searchStudentWithInvalidData
     * 
     * @description
     * Enter invalid data at both PEN Search and Advanced Search to make sure both display appropriate error messages
     * 
     * ## Steps:
     * 1. In PEN Search, enter PEN number without result to make sure it displays an error
     * 2. In Advanced Search, enter a surname without result to make sure it displays an error
     * 3. In Advanced Saerch, select Male to make sure it displays error for too many records
     */
    it('Enters invalid data', () => {
      // No result
      cy.get(studentSearchSelectors.searchByPEN).type('121212121')
      cy.get(studentSearchSelectors.searchSubmit).click()
      cy.get(studentSearchSelectors.errorMsg).should('have.text', invalidMessage.noStudentPEN)

      // No result
      cy.get(studentSearchSelectors.advancedSearchBtn).click()
      cy.get(studentSearchSelectors.legalSurnameInput).type('ZZZ')
      cy.get(studentSearchSelectors.advSearchSubmit).click()
      cy.get(studentSearchSelectors.errorMsg).should('have.text', invalidMessage.noStudentAdvanced)
      // Too many result
      cy.get(studentSearchSelectors.advSearchReset).click()
      cy.get(studentSearchSelectors.genderSelection).click({force: true})
      cy.get(selectors.selections).contains('Male').click({force: true})
      cy.get(studentSearchSelectors.advSearchSubmit).click()
      cy.get(studentSearchSelectors.errorMsg, {timeout: 20000}).should('have.text', invalidMessage.tooManyReponseAdvanced)
    })
  })
})