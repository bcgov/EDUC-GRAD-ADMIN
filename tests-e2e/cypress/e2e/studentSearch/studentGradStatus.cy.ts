/**
 * @module StudentGradStatus
 * 
 * @description 
 * Viewing and Modifying Student Grad Status is a complicated process that comes with variety of rules.
 * This test file is aiming to cover all of the cases with multiple test cases of students.
 * 
 * @see {@link https://eccbc.atlassian.net/wiki/spaces/MODVMSTRAX/pages/13766627/View+Modify+Student+Grad+Status}
 */

import selectors from "../../support/selectors"
const studentSearchSelectors = selectors.studentSearch

function getNextMonthYYYYMM() {
  const date = new Date()
  date.setMonth(date.getMonth() + 1) // Move to next month
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Ensure 2-digit month

  return `${year}${month}`
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

function updateGradStatus() {
  cy.get(studentSearchSelectors.transcriptTVRBtn).click()
  cy.get(selectors.selections).contains('Update Grad Status').click({force: true})
  cy.wait(3000)
}

// function resetToOriginalState(test_student) {
//   // Undo completion if student has school at grad id but should not have graduated for testing purpose
//   // Update Grad Status if student does not have school at grad id but should have graduated 
//   const schoolAtGraduationText = studentSearchSelectors.table + ' ' + studentSearchSelectors.schoolAtGraduationText + ' div'
//   cy.doesExist(schoolAtGraduationText).then(exist => {
//     if (exist) {
//       if (!test_student.isCompleted) undoCompletion()
//     } else {
//       if (test_student.isCompleted) updateGradStatus()
//     }
//   })

//   // Edit Grad status back to normal even if data is same as original data
//   cy.get(studentSearchSelectors.editBtn).click()
//   cy.wait(1000)
//   // Reset to original data
//   // if student hasn't completed program, it is not disabled
//   if (!test_student.isCompleted) {
//     cy.selectDropdown(studentSearchSelectors.program, test_student.og_program)
//   }
//   // if student is in SCPP, it is not disabled
//   if (test_student.og_program == 'SCPP') {
//     cy.selectDropdown(studentSearchSelectors.programCompletionDate, test_student.og_completion_date)
//   }
//   cy.selectDropdown(studentSearchSelectors.status, test_student.og_status)
//   cy.selectDropdown(studentSearchSelectors.grade, test_student.og_grade)
//   cy.selectAutoselect(studentSearchSelectors.schoolOfRecord, test_student.og_school)

//   // if student is taking 1950 program, adult start date will change
//   if (test_student.og_program == '1950') {
//     cy.get(studentSearchSelectors.adultStartDate).type(test_student.og_adult_start_date)
//   }
//   cy.get(studentSearchSelectors.saveStatusBtn).click({force: true})
//   cy.wait(1000)

//   // Set flags to original data
//   cy.get(studentSearchSelectors.editBtn).click()
//   cy.wait(1000)
//   cy.get(studentSearchSelectors.recalcGrad).click({force: true})
//   cy.selectDropdown(studentSearchSelectors.recalcGrad, test_student.og_recalc_grad, true)
//   cy.selectDropdown(studentSearchSelectors.recalcProjected, test_student.og_recalc_proj, true)
//   cy.get(studentSearchSelectors.saveStatusBtn).click({force: true})
// }


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
    interalServerError: 'INTERNAL SERVER ERROR',
    noCompletionFuture: 'No Program Completion date or date is in the future',
    allRequirementMet: 'All program requirements have been met',
    mergedStudentError: 'tudent GRAD data cannot be updated for students with a status of \'M\' merged'
  }

  beforeEach(() => {
    cy.login()
    cy.visit('/')
    cy.get(studentSearchSelectors.title).should('contain.text', 'Student Search')
  })

  /**
   * @name editNongraduatedStudent
   * 
   * @description
   * Ensure data validation, error, and warning in the Grad Status Form are working as expected
   * regarding a non-grarduated non-SCCP program student.
   * This test cases covers most of business logics regarding 1950 program.
   * 
   * ## Steps:
   * 1. Make sure data is ready to be tested
   * 2. Open edit form
   * 3. Change student status
   *    - Selected student status has to match with student status from STUDENT (PEN) Database
   * 4. Check program completion date
   *    - Make sure it is non-modifiable except for students on SCCP
   * 5. Change program
   *    - If the User changes a students' Program a warning will be displayed to notify the User that any Optional Programs associated with the original Program will be deleted. 
   *    - If User selects 1950* check student grade for AD or AN
   * 6. Select back to original program
   * 7. Change grade & adult start date
   *    - Grade - If User selects AD or AN ensure Student is on Program 1950*
   *    - Adult Start Date - Only modifiable if student is on the 1950 program
   * 8. Select 1950 program to make sure error dissapears for Grade and adult start date is enabled
   * 9. Enter date for Adult Start Date for date validation
   *    - Cannot be empty
   *    - Invalid format
   *    - Incomplete input (try to save)
   * 10. Enter valid date for Adult Start date to make sure there is no error
   * 11. Change school of record
   *     - If User modifies School Of Record check if the school supports 10-12 enrollment and transcript 
   * 12. Make sure school at graduation is empty
   */
  it('Edits grad status for an non-graduated student on non-SCCP program', () => {
    const ungraduated_student = Cypress.env('test_students').ungraduated_student
    cy.get(studentSearchSelectors.searchByPEN).type(ungraduated_student.PEN)
    cy.get(studentSearchSelectors.searchSubmit).click()
    cy.wait(5000) // Need to wait so that fields load up in Edit window

    // Make sure data is in testable state
    const gradStatusTable = () => cy.get(studentSearchSelectors.table)
    gradStatusTable().find(studentSearchSelectors.programText).should('contain.text', ungraduated_student.og_program)
    gradStatusTable().find(studentSearchSelectors.programCompletionDateText).should('be.empty')
    gradStatusTable().find(studentSearchSelectors.statusText).should('contain.text', ungraduated_student.og_status)
    gradStatusTable().find(studentSearchSelectors.schoolOfRecordText).should('contain.text', ungraduated_student.og_school)
    gradStatusTable().find(studentSearchSelectors.schoolAtGraduationText).should('be.empty')

    // Edit
    cy.get(studentSearchSelectors.editBtn).click()
    cy.wait(1000)

    // Student Status
    // Selected student status has to match with student status from STUDENT (PEN) Database
    cy.selectDropdown(studentSearchSelectors.status, 'Merged')
    cy.get(studentSearchSelectors.saveStatusBtn).click()
    cy.get(studentSearchSelectors.snackBar).should('contain.text', messages.invalidStatusError)
    cy.selectDropdown(studentSearchSelectors.status, 'Archived')

    // Program Completion Date
    // Non-modifiable except for students on SCCP
    cy.get(studentSearchSelectors.programCompletionDate).should('be.disabled')

    // Program
    // If the User changes a students' Program a warning will be displayed to notify the User that any Optional Programs associated with the original Program will be deleted. 
    cy.selectDropdown(studentSearchSelectors.program, '2018-PF')
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.programChangeWarning)
    // If User selects 1950* check student grade for AD or AN
    cy.selectDropdown(studentSearchSelectors.program, '1950')
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.program1950Error)
    cy.get(studentSearchSelectors.saveStatusBtn).should('be.disabled')
    cy.selectDropdown(studentSearchSelectors.program, '2018-PF')
    
    // Grade & Adult Start Date
    // Grade - If User selects AD or AN ensure Student is on Program 1950*
    cy.selectDropdown(studentSearchSelectors.grade, 'AD')
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.gradeADANError)
    cy.get(studentSearchSelectors.saveStatusBtn).should('be.disabled')
    cy.selectDropdown(studentSearchSelectors.grade, 'AN')
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.gradeADANError)
    cy.get(studentSearchSelectors.saveStatusBtn).should('be.disabled')
    // Adult Start Date - Only modifiable if student is on the 1950 program
    cy.get(studentSearchSelectors.adultStartDate).should('be.disabled')
    // Select 1950 to make sure error dissapears
    cy.selectDropdown(studentSearchSelectors.program, '1950')
    cy.get(studentSearchSelectors.editForm).should('not.contain.text', messages.gradeADANError)
    cy.get(studentSearchSelectors.adultStartDate).should('not.be.disabled')
    // Adult Start Date - Date format validation
    // Empty
    cy.get(studentSearchSelectors.adultStartDate).clear()
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.adultStartDateEmptyError)
    // Invalid format
    cy.get(studentSearchSelectors.adultStartDate).type('hello')
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.adultStartDateInvalidFormatError)
    // Incomplete format
    cy.get(studentSearchSelectors.adultStartDate).clear().type('2000-10')
    cy.get(studentSearchSelectors.saveStatusBtn).click()
    cy.get(studentSearchSelectors.snackBar).should('contain.text', messages.interalServerError)
    // valid
    cy.get(studentSearchSelectors.adultStartDate).clear().type('2000-10-10')
    cy.get(studentSearchSelectors.editForm).should('not.contain.text', messages.adultStartDateInvalidFormatError)
      .and('not.contain.text', messages.adultStartDateEmptyError)

    // School Of Record
    // If User modifies School Of Record check if the school supports 10-12 enrollment and transcript 
    cy.selectAutoselect(studentSearchSelectors.schoolOfRecord, 'Jessie Lee Elementary')
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.schoolNo10to12EnrollmentWarning)
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.schoolNoTranscriptWarning)
    cy.selectAutoselect(studentSearchSelectors.schoolOfRecord, ungraduated_student.og_school)

    // School At Graduation
    cy.get(studentSearchSelectors.schoolAtGraduation).should('not.exist')
    
    // // Save
    // cy.get(studentSearchSelectors.saveStatusBtn).click()
    // // The students' graduation recalc flag for re-running the graduation algorithm will be set to "Y"
    // gradStatusTable().find(studentSearchSelectors.recalcGradText).should('contain.text', 'Y')
    // // A record will be inserted in the Student History table with Activity Code of USEREDIT.
    // cy.get(studentSearchSelectors.auditBtn).click()
    // cy.get(studentSearchSelectors.auditWindow).find(selectors.rows).first().should('contain.text', 'USEREDIT')
    // cy.get(studentSearchSelectors.gradBtn).click()
  })

  /**
   * @name editGraduatedStudent
   * 
   * @description
   * Ensure additional data for a graduated student is displayed or changes of interactability of certain fields for a graduated student 
   * compared to a non-graduated student.
   * 
   * ## Steps:
   * 1. Make sure data is ready to be tested
   * 2. Make sure honour standing flag is correct
   *    - If GPA > 3 then True else False value
   * 3. Check data in cards in student profile
   *    - Noncompletion Reasons - Should be empty
   *    - Requirements Met - Should list all requirements
   *    - Student Transcript Reports - Should have pdf link for Graduation Program
   *    - Student Certificates/ Dogwoods - Should have pdf link for Dogwoods
   * 4. Open edit
   * 5. Make sure a warning for ARC student appears
   *    - If a User Edits a students' GRAD data and the student has a status of "ARC", a warning will show up
   * 6. Make sure disabled fields
   *    - Program is non-modifiable if a student has a Program Completion Date
   * 7. Make sure school at graduation is not empty
   *    - School At Graduation is set to same school as School Of Graduation in default
   */
  it('Edits grad status for a graduated student on non-SCCP Program', () => {
    const graduated_student = Cypress.env('test_students').graduated_student
    cy.get(studentSearchSelectors.searchByPEN).type(graduated_student.PEN)
    cy.get(studentSearchSelectors.searchSubmit).click()
    cy.wait(5000) // Need to wait so that fields load up in Edit window

    // Should be a graduated non sccp program student
    const gradStatusTable = () => cy.get(studentSearchSelectors.table)
    gradStatusTable().get(studentSearchSelectors.programText).should('not.contain.text', 'SCCP')
    gradStatusTable().get(studentSearchSelectors.schoolAtGraduationText).should('exist')
    gradStatusTable().get(studentSearchSelectors.programCompletionDateText).should('exist')
    gradStatusTable().get(studentSearchSelectors.statusText).should('contain.text', graduated_student.og_status)

    // Honours standing flag is set to 'Y' if GPA is more thean 3
    cy.get(studentSearchSelectors.gpaText).invoke('text').then(gpa => {
      const honourFlag = parseFloat(gpa) > 3 ? 'Y' : 'N'
      cy.get(studentSearchSelectors.honoursStandingText).should('contain.text', honourFlag)
    })

    // Check cards: non completion reason, requirements met, student transcript repots, and student dogwoods
    cy.get(studentSearchSelectors.noCompletionCard).should('contain.text', messages.allRequirementMet)
    cy.shouldHaveData(studentSearchSelectors.requirementMetCard)
    cy.get(studentSearchSelectors.graduationReportsCard).find(studentSearchSelectors.pdfLink).should('contain.text', 'Graduation Program')
    cy.get(studentSearchSelectors.certificateDogwoodsCard).find(studentSearchSelectors.pdfLink).should('contain.text', 'Dogwood')

    // Edit
    cy.get(studentSearchSelectors.editBtn).click()
    cy.wait(1000)
    // If a User Edits a students' GRAD data and the student has a status of "ARC", a warning will show up
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.arcStudentWarning)
    
    // Program
    // Program is non-modifiable if a student has a Program Completion Date
    cy.get(studentSearchSelectors.program).should('be.disabled')
    
    // School At Graduation
    // If students are graduated, school at graduation is set to same school as school of record in defauld
    cy.get(studentSearchSelectors.schoolAtGraduation).should('not.be.empty')
                                                     .and('contain.text', graduated_student.og_school)
    cy.get(studentSearchSelectors.schoolOfRecordAutoselectText).should('contain.text', graduated_student.og_school)
  })

  /**
   * @name editNongraduatedSCCPStudent
   * 
   * @description
   * Ensure SCCP specific rules apply to the student. This test is also supposed to make sure graduation
   * logic for a SCCP student works  properly; however, those tests are now disabled due to the restriction of data modification with testing.
   * 
   * ## Steps:
   * 1. Make sure data is ready to be tested
   * 2. Make sure program completion date is modifiable
   *    - Non-modifiable excep for students on SCCP
   * 3. Check SCCP Rules for program completion date
   *    - Program completion date cannot be before the program effective date
   *    - Program completion date can be in the future
   */
  it('Edits grad status for an non-graduated student on SCCP program', () => {
    const sccp_student = Cypress.env('test_students').sccp_student
    cy.get(studentSearchSelectors.searchByPEN).type(sccp_student.PEN)
    cy.get(studentSearchSelectors.searchSubmit).click()
    cy.wait(5000) // Need to wait so that fields load up in Edit window
    
    // Should be an ungraduated sccp student
    const gradStatusTable = () => cy.get(studentSearchSelectors.table)
    gradStatusTable().get(studentSearchSelectors.programText).should('contain.text', 'SCCP')
    gradStatusTable().get(studentSearchSelectors.schoolAtGraduationText).should('be.empty')

    // Edit
    cy.get(studentSearchSelectors.editBtn).click()
    cy.wait(1000)
    // Program Completion Date
    // Non-modifiable except for students on SCCP
    cy.get(studentSearchSelectors.programCompletionDate).should('not.be.disabled')
    // SCCP Rules:
    // Program completion date cannot be before the program effective date
    cy.get(studentSearchSelectors.programCompletionDate).type('200312')
    cy.get(studentSearchSelectors.editForm).should('contain.text', messages.completionDatePriorSCCPWarning)
    // Program completion date can be in the future
    cy.get(studentSearchSelectors.programCompletionDate).clear().type(getNextMonthYYYYMM())

    // // SCCP students are graduated if their program completion date is less than the current date
    // // Make sure this student is not graduated
    // updateGradStatus()
    // gradStatusTable().find(studentSearchSelectors.schoolAtGraduationText).should('be.empty')
    // cy.get(studentSearchSelectors.noCompletionCard).should('contain.text', messages.noCompletionFuture)
    // cy.get(studentSearchSelectors.certificateDogwoodsCard).find(studentSearchSelectors.pdfLink).should('not.exist')
    // // Change completion date to past date
    // cy.get(studentSearchSelectors.editBtn).click()
    // cy.wait(1000)
    // cy.get(studentSearchSelectors.programCompletionDate).clear().type('201010')
    // cy.get(studentSearchSelectors.saveStatusBtn).click()
    // cy.wait(1000)
    // // Make sure this student is graduated
    // updateGradStatus()
    // gradStatusTable().find(studentSearchSelectors.schoolAtGraduationText).should('contain.text', sccp_student.og_school)

    // // Graduated SCCP student
    // cy.get(studentSearchSelectors.certificateDogwoodsCard).find(studentSearchSelectors.pdfLink).should('contain.text', 'Evergreen')
    // // If program completion date is not blank, User cannot modify the program completion date. 
    // cy.get(studentSearchSelectors.editBtn).click()
    // cy.get(studentSearchSelectors.programCompletionDate).should('be.disabled')
  })

  /**
   * @name editMergedStudent
   * 
   * @description
   * Try to edit grad status of a merged student; however, GRAD does not let users edit a merged student directly.
   * 
   * ## Steps:
   * 1. Make sure a test student's status is 'Merged'
   * 2. Open edit
   * 3. Change status to 'Current'
   * 4. Click save button to make sure it does not let user modify a merged student's grad status
   * 
   */
  it('Tries to edit merged student', () => {
    const merged_student = Cypress.env('test_students').merged_student
    cy.get(studentSearchSelectors.searchByPEN).type(merged_student.PEN)
    cy.get(studentSearchSelectors.searchSubmit).click()
    cy.wait(5000) // Need to wait so that fields load up in Edit window
    
    // Should be a merged student
    const gradStatusTable = () => cy.get(studentSearchSelectors.table)
    gradStatusTable().get(studentSearchSelectors.statusText).should('contain.text', 'Merged')

    // Edit
    cy.get(studentSearchSelectors.editBtn).click()
    cy.wait(1000)
    // Change something and try to save
    cy.selectDropdown(studentSearchSelectors.status, 'Current')
    cy.get(studentSearchSelectors.saveStatusBtn).click()
    // Error
    cy.get(studentSearchSelectors.snackBar).should('contain.text', messages.mergedStudentError)
  })
})