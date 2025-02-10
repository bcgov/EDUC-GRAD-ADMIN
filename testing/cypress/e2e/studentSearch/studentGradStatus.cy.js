import selectors from "../../support/selectors"
const studentSearchSelectors = selectors.studentSearch

function selectDropdown(selector, text, forceFlag = false) {
  cy.get(selector).click({force: true})
  cy.get(studentSearchSelectors.selections).contains(text).click({force: forceFlag})
}

function selectAutoselect(selector, text) {
  cy.get(selector).clear().type(text)
  selectDropdown(selector, text)
}

function getNextMonthYYYYMM() {
  const date = new Date()
  date.setMonth(date.getMonth() + 1) // Move to next month
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Ensure 2-digit month

  return `${year}${month}`
}

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
  cy.wait(3000)
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
    selectDropdown(studentSearchSelectors.program, test_student.og_program)
  }
  // if student is in SCPP, it is not disabled
  if (test_student.og_program == 'SCPP') {
    selectDropdown(studentSearchSelectors.programCompletionDate, test_student.og_completion_date)
  }
  selectDropdown(studentSearchSelectors.status, test_student.og_status)
  selectDropdown(studentSearchSelectors.grade, test_student.og_grade)
  selectAutoselect(studentSearchSelectors.schoolOfRecord, test_student.og_school)

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
  selectDropdown(studentSearchSelectors.recalcGrad, test_student.og_recalc_grad, true)
  selectDropdown(studentSearchSelectors.recalcProjected, test_student.og_recalc_proj, true)
  cy.get(studentSearchSelectors.saveStatusBtn).click({force: true})
}


describe('Student Grad Status', () => {

  const messages = {
    arcStudentWarning: 'This student is not active. Re-activate by setting their status to "Current" if they are currently attending school',
    programChangeWarning: 'Warning, any optional programs associated with the original program will be deleted. You must add back in any pertinent optional programs once you have saved the changes to Program.',
    program1950Error: 'Student grade should be one of AD or AN if the student program is 1950', 
    completionDatePriorSCCPWarning: 'The program completion date cannot be prior to the start of the program',
    invalidStatusError: 'Status code selected does not match with the PEN data for this student',
    gradeADANError: 'Student grade should not be AD or AN for this program',
    schoolNo10to12EnrollmentWarning: 'Warning: School 03636089 is not reported with grade 10-12 enrolments.',
    schoolNoTranscriptWarning: 'Warning: School 03636089 is not authorized to issue Transcripts.',
    adultStartDateEmptyError: 'Students on the 1950 Program must have an adult start date. Please enter a valid date.',
    adultStartDateInvalidFormatError: 'The adult start date format is invalid. Please follow the date format YYYY-MM-DD',
    noCompletionFuture: 'No Program Completion date or date is in the future',
  }

  beforeEach(() => {
    cy.login()
    cy.visit('/')
    cy.get(studentSearchSelectors.title).should('contain.text', 'Student Search')
  })

  it('Edits grad status for an ungraduated student', () => {
    const test_student2 = Cypress.env('test_student2')
    cy.get(studentSearchSelectors.searchByPEN).type(test_student2.PEN)
    cy.get(studentSearchSelectors.searchSubmit).click()
    cy.wait(5000) // Need to wait so that fields load up in Edit window

    // const reset = true // TODO: This is for faster development. Remove this.
    // if (reset)
    //   resetToOriginalState(test_student2)

    // // Make sure data is in originlal state
    const gradStatusTable = () => cy.get(studentSearchSelectors.table)
    // gradStatusTable().find(studentSearchSelectors.programText).should('contain.text', test_student2.og_program)
    // gradStatusTable().find(studentSearchSelectors.programCompletionDateText).should('be.empty')
    // gradStatusTable().find(studentSearchSelectors.statusText).should('contain.text', test_student2.og_status)
    // gradStatusTable().find(studentSearchSelectors.gradeText).should('contain.text', test_student2.og_grade)
    // gradStatusTable().find(studentSearchSelectors.schoolOfRecordText).should('contain.text', test_student2.og_school)
    // gradStatusTable().find(studentSearchSelectors.schoolAtGraduationText).should('be.empty')
    // gradStatusTable().find(studentSearchSelectors.honoursStandingText).should('be.empty')
    // gradStatusTable().find(studentSearchSelectors.gpaText).should('be.empty')
    // gradStatusTable().find(studentSearchSelectors.optionalProgramsText).should('be.empty')
    // gradStatusTable().find(studentSearchSelectors.adultStartDateText).should('be.empty')
    // gradStatusTable().find(studentSearchSelectors.cerText).should('be.empty')
    // gradStatusTable().find(studentSearchSelectors.recalcGradText).should('contain.text', test_student2.og_recalc_grad)
    // gradStatusTable().find(studentSearchSelectors.recalcProjectedText).should('contain.text', test_student2.og_recalc_proj)

    // // Edit
    // cy.get(studentSearchSelectors.editBtn).click()
    // cy.wait(1000)

    // // Program
    // // If the User changes a students' Program a warning will be displayed to notify the User that any Optional Programs associated with the original Program will be deleted. 
    // selectDropdown(studentSearchSelectors.program, '2018-PF')
    // cy.get(studentSearchSelectors.editForm).should('contain.text', messages.programChangeWarning)
    // // If User selects 1950* check student grade for AD or AN
    // selectDropdown(studentSearchSelectors.program, '1950')
    // cy.get(studentSearchSelectors.editForm).should('contain.text', messages.program1950Error)
    // cy.get(studentSearchSelectors.saveStatusBtn).should('be.disabled')
    
    // // Program Completion Date
    // // Non-modifiable except for students on SCCP
    // cy.get(studentSearchSelectors.programCompletionDate).should('be.disabled')
    // selectDropdown(studentSearchSelectors.program, 'SCCP')
    // cy.get(studentSearchSelectors.programCompletionDate).should('not.be.disabled')
    // // SCCP Rules:
    // // If program completion date is blank, User can enter a program completion date, the date can be in the future  
    // // Program completion date cannot be before the program effective date
    // cy.get(studentSearchSelectors.programCompletionDate).type('200312')
    // cy.get(studentSearchSelectors.editForm).should('contain.text', messages.completionDatePriorSCCPWarning)
    // // Program completion date can be in the future
    // cy.get(studentSearchSelectors.programCompletionDate).clear().type(getNextMonthYYYYMM())

    // // Student Status
    // // Compare status selected with STUD STATUS from STUDENT (PEN) Database
    // selectDropdown(studentSearchSelectors.status, 'Merged')
    // cy.get(studentSearchSelectors.saveStatusBtn).click()
    // cy.get(studentSearchSelectors.snackBar).should('contain.text', messages.invalidStatusError)
    // selectDropdown(studentSearchSelectors.status, 'Archived')

    // // Grade & Adult Start Date
    // // Grade - If User selects AD or AN ensure Student is on Program 1950*
    // selectDropdown(studentSearchSelectors.grade, 'AD')
    // cy.get(studentSearchSelectors.editForm).should('contain.text', messages.gradeADANError)
    // cy.get(studentSearchSelectors.saveStatusBtn).should('be.disabled')
    // selectDropdown(studentSearchSelectors.grade, 'AN')
    // cy.get(studentSearchSelectors.editForm).should('contain.text', messages.gradeADANError)
    // cy.get(studentSearchSelectors.saveStatusBtn).should('be.disabled')
    // // Adult Start Date - Only modifiable if student is on the 1950 program
    // cy.get(studentSearchSelectors.adultStartDate).should('be.disabled')
    // // Select 1950 to make sure error dissapears
    // selectDropdown(studentSearchSelectors.program, '1950')
    // cy.get(studentSearchSelectors.editForm).should('not.contain.text', messages.gradeADANError)
    // cy.get(studentSearchSelectors.adultStartDate).should('not.be.disabled')
    // // Adult Start Date - Date format validattion
    // cy.get(studentSearchSelectors.adultStartDate).clear()
    // cy.get(studentSearchSelectors.editForm).should('contain.text', messages.adultStartDateEmptyError)
    // cy.get(studentSearchSelectors.adultStartDate).type('hello')
    // cy.get(studentSearchSelectors.editForm).should('contain.text', messages.adultStartDateInvalidFormatError)
    // cy.get(studentSearchSelectors.adultStartDate).clear().type('2000-10-10')
    // cy.get(studentSearchSelectors.editForm).should('not.contain.text', messages.adultStartDateInvalidFormatError)
    //   .and('not.contain.text', messages.adultStartDateEmptyError)
    
    // // Back to SCCP
    // selectDropdown(studentSearchSelectors.program, 'SCCP')
    // selectDropdown(studentSearchSelectors.grade, '12')

    // // School Of Record
    // // If User modifies School Of Record check if the school supports 10-12 enrollment and transcript 
    // selectAutoselect(studentSearchSelectors.schoolOfRecord, 'Jessie Lee Elementary')
    // cy.get(studentSearchSelectors.editForm).should('contain.text', messages.schoolNo10to12EnrollmentWarning)
    // cy.get(studentSearchSelectors.editForm).should('contain.text', messages.schoolNoTranscriptWarning)
    // selectAutoselect(studentSearchSelectors.schoolOfRecord, test_student2.og_school)

    // // School At Graduation
    // cy.get(studentSearchSelectors.schoolAtGraduation).should('be.disabled')
    
    // // Save
    // cy.get(studentSearchSelectors.saveStatusBtn).click()
    // The students' graduation recalc flag for re-running the graduation algorithm will be set to "Y"
    gradStatusTable().find(studentSearchSelectors.recalcGradText).should('contain.text', 'Y')
    // A record will be inserted in the Student History table with Activity Code of USEREDIT.
    cy.get(studentSearchSelectors.auditBtn).click()
    cy.get(studentSearchSelectors.auditWindow).find(studentSearchSelectors.rows).first().should('contain.text', 'USEREDIT')
    cy.get(studentSearchSelectors.gradBtn).click()

    // SCCP students are graduated if their program completion date is less than the current date
    // Make sure this student is not graduated
    updateGradStatus()
    gradStatusTable().find(studentSearchSelectors.schoolAtGraduationText).should('be.empty')
    cy.get(studentSearchSelectors.noCompletionTable).should('contain.text', messages.noCompletionFuture)
    // Change completion date to past date
    cy.get(studentSearchSelectors.editBtn).click()
    cy.wait(1000)
    cy.get(studentSearchSelectors.programCompletionDate).clear().type('201010')
    // If a User Edits a students' GRAD data and the student has a status of "ARC", a warning will show
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.arcStudentWarning)
    cy.get(studentSearchSelectors.saveStatusBtn).click()
    updateGradStatus()
    gradStatusTable().find(studentSearchSelectors.schoolAtGraduationText).should('contain.text', test_student2.og_school)
    // If program completion date is not blank, User cannot modify the program completion date. 
    cy.get(studentSearchSelectors.editBtn).click()
    cy.get(studentSearchSelectors.programCompletionDate).should('be.disabled')
    // If students are graduated, they can modify SchoolAtGraduation
    cy.get(studentSearchSelectors.schoolAtGraduation).should('not.be.disabled')
  })
})