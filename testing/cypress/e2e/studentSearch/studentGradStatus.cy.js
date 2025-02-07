import selectors from "../../support/selectors"
const studentSearchSelectors = selectors.studentSearch

function getNextMonthYYYYMM() {
  const date = new Date()
  date.setMonth(date.getMonth() + 1) // Move to next month
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Ensure 2-digit month

  return `${year}${month}`
}

// Example usage
console.log(getNextMonthYYYYMM()); // Example output: "202502"


function undoCompletion() {
  cy.get(studentSearchSelectors.transcriptTVRBtn).click()
  cy.get(studentSearchSelectors.selections).contains('Undo Completion').click({force: true})
  cy.wait(1000)
  cy.get(studentSearchSelectors.undoCompletionReasonInput).click({force: true})
  cy.get(studentSearchSelectors.selections).contains('Other').click({force: true})
  cy.get(studentSearchSelectors.undoCompletionReasonTextarea).type('Cypress testing')
  cy.get(studentSearchSelectors.undoCompletionConfirmCheckbox).click()
  cy.get(studentSearchSelectors.undoCompletionBtn).click()
}

function updateGradStatus() {
  cy.get(studentSearchSelectors.transcriptTVRBtn).click()
  cy.get(studentSearchSelectors.selections).contains('Update Grad Status').click({force: true})
  cy.wait(1000)
}

function resetToOriginalState(test_student) {
  // Undo completion if student has school at grad id but should not have graduated for testing purpose
  // Update Grad Status if student does not have school at grad id but should have graduated 
  const schoolAtGraduationText = studentSearchSelectors.table + ' ' + studentSearchSelectors.schoolAtGraduationText + ' div'
  cy.doesExist(schoolAtGraduationText).then(exist => {
    if (exist) {
      if (!test_student.isCompleted) undoCompletion()
    } else {
      if (test_student.isCompleted) updateGradStatus()
    }
  })

  // Edit Grad status back to normal even if data is same as original data
  cy.get(studentSearchSelectors.editBtn).click()
  cy.wait(1000)
  // Reset to original data
  // if student hasn't completed program, it is not disabled
  if (!test_student.isCompleted) {
    cy.get(studentSearchSelectors.program).click({force: true})
    cy.get(studentSearchSelectors.selections).contains(test_student.og_program).click()
  }
  // if student is in SCPP, it is not disabled
  if (test_student.og_program == 'SCPP') {
    cy.get(studentSearchSelectors.programCompletionDate).click({force: true})
    cy.get(studentSearchSelectors.selections).contains(test_student.og_completion_date).click()
  }
  cy.get(studentSearchSelectors.status).click({force: true})
  cy.get(studentSearchSelectors.selections).contains(test_student.og_status).click()
  cy.get(studentSearchSelectors.grade).click({force: true})
  cy.get(studentSearchSelectors.selections).contains(test_student.og_grade).click()
  cy.get(studentSearchSelectors.schoolOfRecord).click({force: true})
  cy.get(studentSearchSelectors.selections).contains(test_student.og_school).click()
  // if student is taking 1950 program, adult start date will change
  if (test_student.og_program == '1950') {
    cy.get(studentSearchSelectors.adultStartDate).type(test_student.og_adult_start_date)
  }
  cy.get(studentSearchSelectors.saveStatusBtn).click({force: true})
  cy.wait(1000)

  // Set flags to original data
  cy.get(studentSearchSelectors.editBtn).click()
  cy.wait(1000)
  cy.get(studentSearchSelectors.recalcGrad).click({force: true})
  cy.get(studentSearchSelectors.selections).contains(test_student.og_recalc_grad).click()
  cy.get(studentSearchSelectors.recalcProjected).click({force: true})
  cy.get(studentSearchSelectors.selections).contains(test_student.og_recalc_proj).click()
  cy.get(studentSearchSelectors.saveStatusBtn).click({force: true})
}

describe('Student Grad Status', () => {

  const messages = {
    programChangeWarning: 'Warning, any optional programs associated with the original program will be deleted. You must add back in any pertinent optional programs once you have saved the changes to Program.',
    program1950Error: 'Student grade should be one of AD or AN if the student program is 1950', 
    completionDatePriorSCCPWarning: 'The program completion date cannot be prior to the start of the program'

  }

  beforeEach(() => {
    cy.login()
    cy.visit('/')
    cy.get(studentSearchSelectors.title).should('contain.text', 'Student Search')
  })

  it('Edits a single student record and makes sure messages are correct', () => {
    const test_student2 = Cypress.env('test_student2')
    cy.get(studentSearchSelectors.searchByPEN).type(test_student2.PEN)
    cy.get(studentSearchSelectors.searchSubmit).click()
    cy.wait(5000) // Need to wait so that fields load up in Edit window

    const reset = true // TODO: This is for faster development. Remove this.
    if (reset)
      resetToOriginalState(test_student2)

    // Make sure data is in originlal state
    const gradStatusTable = () => cy.get(studentSearchSelectors.table)
    gradStatusTable().find(studentSearchSelectors.programText).should('contain.text', test_student2.og_program)
    gradStatusTable().find(studentSearchSelectors.programCompletionDateText).should('be.empty')
    gradStatusTable().find(studentSearchSelectors.statusText).should('contain.text', test_student2.og_status)
    gradStatusTable().find(studentSearchSelectors.gradeText).should('contain.text', test_student2.og_grade)
    gradStatusTable().find(studentSearchSelectors.schoolOfRecordText).should('contain.text', test_student2.og_school)
    gradStatusTable().find(studentSearchSelectors.schoolAtGraduationText).should('be.empty')
    gradStatusTable().find(studentSearchSelectors.honoursStandingText).should('be.empty')
    gradStatusTable().find(studentSearchSelectors.gpaText).should('be.empty')
    gradStatusTable().find(studentSearchSelectors.optionalProgramsText).should('be.empty')
    gradStatusTable().find(studentSearchSelectors.adultStartDateText).should('be.empty')
    gradStatusTable().find(studentSearchSelectors.cerText).should('be.empty')
    gradStatusTable().find(studentSearchSelectors.recalcGradText).should('contain.text', test_student2.og_recalc_grad)
    gradStatusTable().find(studentSearchSelectors.recalcProjectedText).should('contain.text', test_student2.og_recalc_proj)

    // Edit
    cy.get(studentSearchSelectors.editBtn).click()
    cy.wait(1000)

    // Program
    // If the User changes a students' Program a warning will be displayed to notify the User that any Optional Programs associated with the original Program will be deleted. 
    cy.get(studentSearchSelectors.program).click({force: true})
    cy.get(studentSearchSelectors.selections).contains('2018-PF').click()
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.programChangeWarning)
    // If User selects 1950* check student grade for AD or AN
    cy.get(studentSearchSelectors.program).click({force: true})
    cy.get(studentSearchSelectors.selections).contains('1950').click()
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.program1950Error)
    cy.get(studentSearchSelectors.saveStatusBtn).should('be.disabled')
    
    // Program Completion Date
    // Non-modifiable except for students on SCCP
    cy.get(studentSearchSelectors.programCompletionDate).should('be.disabled')
    cy.get(studentSearchSelectors.program).click({force: true})
    cy.get(studentSearchSelectors.selections).contains('SCCP').click()
    cy.get(studentSearchSelectors.programCompletionDate).should('not.be.disabled')
    // SCCP Rules:
    // If program completion date is blank, User can enter a program completion date, the date can be in the future  
    // Program completion date cannot be before the program effective date
    cy.get(studentSearchSelectors.programCompletionDate).type('200312')
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.completionDatePriorSCCPWarning)
    // Program completion date can be in the future
    cy.get(studentSearchSelectors.programCompletionDate).type(getNextMonthYYYYMM())
  })
})