import selectors from "../../support/selectors"
const studentSearchSelectors = selectors.studentSearch

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

function resetToOriginalState(test_student) {
  // Undo completion if student has school at grad id but should not have graduated for testing purpose
  const schoolAtGraduationText = studentSearchSelectors.table + " " + studentSearchSelectors.schoolAtGraduationText
  cy.doesExist(schoolAtGraduationText).then(exist => {
    if (exist && !test_student.isCompleted) {
      undoCompletion()
    }
  })

  // Edit
  cy.get(studentSearchSelectors.editBtn).click()
  cy.wait(1000)
  // Reset to original data
  cy.get(studentSearchSelectors.status).click({force: true})
  cy.get(studentSearchSelectors.selections).contains(test_student.og_status).click()
  cy.get(studentSearchSelectors.grade).click({force: true})
  cy.get(studentSearchSelectors.selections).contains(test_student.og_grade).click()
  cy.get(studentSearchSelectors.schoolOfRecord).click({force: true})
  cy.get(studentSearchSelectors.selections).contains(test_student.og_school).click()
}

describe('Student Grad Status', () => {
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
    
    resetToOriginalState(test_student2)

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
  })
})