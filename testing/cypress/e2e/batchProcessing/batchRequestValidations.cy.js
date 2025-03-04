/**
 * @module BatchRquestValidations
 * 
 * @description
 * Validations for all modals in "New Batch Request" tab.
 * Bundled in a single file since they behave very similarly and seperated from the individual batch testing.
 * The UI features that this spec file includes:
 *    - Validations
 *    - Cancel Buttons
 */

import selectors from "../../support/selectors";
const batchProcessingSelectors = selectors.batchProcessing

// Only works if there is one visible v-select
function selelctStudentGroup(pen) {
  cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).click({force: true})
  cy.get(selectors.selections).contains('Student').click()
  cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.numberInput).type(pen)
  cy.get(batchProcessingSelectors.overlayWindow).contains('Add Student').click({force: true})
}

// Only works if there is one visible v-select
function selectSchoolGroup(school) {
  cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).click({force: true})
  cy.get(selectors.selections).contains('School').click({force: true})
  cy.selectAutoselect(batchProcessingSelectors.autocomplete, school)
  cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
}

function openBatchRequestByLabel(label, exactMatch = false) {
  if (exactMatch) {
    cy.contains(new RegExp(`^${label}$`)).next().find('button').click()
  } else {
    cy.contains(label).next().find('button').click()
  }
  cy.wait(500)
}

function checkSelectedIcon(isChecked) {
  if (isChecked) {
    cy.get(batchProcessingSelectors.selectedIcon).should('have.class', 'mdi-check')
    cy.get(batchProcessingSelectors.selectedIcon).should('not.have.class', 'mdi-close-circle')
  } else {
    cy.get(batchProcessingSelectors.selectedIcon).should('not.have.class', 'mdi-check')
    cy.get(batchProcessingSelectors.selectedIcon).should('have.class', 'mdi-close-circle')
  }
}

describe('Batch Request Validations', () => {
  const batch_test_student = Cypress.env('test_students').batch_test_student

  context('For Cancel Btn', () => {

    beforeEach(() => {
      cy.login()
      cy.visit('/')
      
      // Go to Batch Processing => New Batch Request
      cy.get(batchProcessingSelectors.navBtn).click()
      cy.get(batchProcessingSelectors.newRequestBtn).click()
    })
  
    /**
     * @name testCancelBtnForGRADTVR
     * 
     * @description
     * Make sure Cancel button closes a opening modal and reset the data that was entered in the modal for any requests under GRAD and TVR section.
     * This test is directly dependent on label; therefore, it needs to be updated whenever label for button changes.
     * Enter field and make sure cancel buttons reset them for the following batch requests:
     *    - Graduation Algorithm
     *    - Transcript Verification Report
     *    - Credentials and Transcirpt Distribution Run
     */
    it('Tests Cancel button for GRAD and TVR', () => {
      // Graduation Algorithm
      openBatchRequestByLabel('Graduation Algorithm')
      selelctStudentGroup(batch_test_student.PEN)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('Graduation Algorithm')
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.givenname)
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.select).should('not.have.class', 'v-select--selected')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
  
      // TVR
      openBatchRequestByLabel('Graduation Algorithm')
      selelctStudentGroup(batch_test_student.PEN)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('Graduation Algorithm')
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.givenname)
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.select).should('not.have.class', 'v-select--selected')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
  
      // Crendentials and Transcript Distribution Run
      openBatchRequestByLabel('Credentials and Transcript Distribution Run')
      cy.get(batchProcessingSelectors.runLaterRadioBtn).click()
      cy.get(batchProcessingSelectors.overlayWindow).contains('Tonight').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('Credentials and Transcript Distribution Run')
      cy.get(batchProcessingSelectors.runLaterRadioBtn).should('not.be.checked')
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', 'Tonight')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
  
    })
  
    /**
     * @name testCancelBtnForUserRequests
     * 
     * @description
     * Make sure Cancel button closes a opening modal and reset the data that was entered in the modal for any requests under User Requests section.
     * This test is directly dependent on label; therefore, it needs to be updated whenever label for button changes.
     * Enter field and make sure cancel buttons reset them for the following batch requests:
     *    - Blank certificate print
     *    - Reprint certificate
     *    - Original certificate
     *    - Blank transcript print
     *    - Transcript
     */
    it('Tests Cancel button for User Requests', () => {
      // Blank certificate print
      openBatchRequestByLabel('Blank certificate print')
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="FN"]').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="FNA"]').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_school)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('Blank certificate print')
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="FN"]').should('not.be.checked')
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="FNA"]').should('not.be.checked')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.og_school) 
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
  
      // Reprint certificate
      openBatchRequestByLabel('Reprint certificate')
      selelctStudentGroup(batch_test_student.PEN)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.wait(500)
      cy.get(batchProcessingSelectors.overlayWindow).contains('label', 'Where').next().click({force: true})
      cy.get(selectors.selections).contains('Download').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('Reprint certificate')
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.select).should('not.have.class', 'v-select--selected')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', 'Download')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      
      // Original certificate
      openBatchRequestByLabel('Original certificate')
      selelctStudentGroup(batch_test_student.PEN)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.wait(500)
      cy.get(batchProcessingSelectors.overlayWindow).contains('label', 'Where').next().click({force: true})
      cy.get(selectors.selections).contains('Download').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('Original certificate')
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.givenname)
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.select).should('not.have.class', 'v-select--selected')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', 'Download')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
  
      // Blank transcript print
      openBatchRequestByLabel('Blank transcript print')
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="BC2018-PUB"]').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="YU2018-PUB"]').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.wait(500)
      selectSchoolGroup(batch_test_student.og_school)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.wait(500)
      cy.get(batchProcessingSelectors.overlayWindow).contains('label', 'Where').next().click({force: true})
      cy.get(selectors.selections).contains('Download').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('Blank transcript print')
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="BC2018-PUB"]').should('not.be.checked')
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="YU2018-PUB"]').should('not.be.checked')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.og_school) 
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', 'Download')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
  
      // Transcript
      openBatchRequestByLabel('Transcript', true)
      selelctStudentGroup(batch_test_student.PEN)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.wait(500)
      cy.get(batchProcessingSelectors.overlayWindow).contains('label', 'Where').next().click({force: true})
      cy.get(selectors.selections).contains('Download').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('Transcript', true)
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.givenname)
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.select).should('not.have.class', 'v-select--selected')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', 'Download')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
    })
  
    /**
     * @name testCancelBtnForRegeneration
     * 
     * @description
     * Make sure Cancel button closes a opening modal and reset the data that was entered in the modal for any requests under Regeneration section.
     * This test is directly dependent on label; therefore, it needs to be updated whenever label for button changes.
     * Enter field and make sure cancel buttons reset them for the following batch requests:
     *    - User Request Certificate Regeneration
     *    - User Request School Report Regeneration
     */
    it('Tests Cancel button for Regeneration', () => {
      // User Request Certificate Regeneration
      openBatchRequestByLabel('User Request Certificate Regeneration')
      selelctStudentGroup(batch_test_student.PEN)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('User Request Certificate Regeneration')
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.select).should('not.have.class', 'v-select--selected')
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.givenname) 
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
  
      // User Request School Report Regeneration
      openBatchRequestByLabel('User Request School Report Regeneration')
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).first().click({force: true})
      cy.get(selectors.selections).contains('Graduated Students').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).last().click({force: true})
      cy.get(selectors.selections).contains('All').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('User Request School Report Regeneration')
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', 'All')
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.og_school) 
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
    })
  
    /**
     * @name testCancelBtnForRegeneration
     * 
     * @description
     * Make sure Cancel button closes a opening modal and reset the data that was entered in the modal for any requests under Year-End Administration section.
     * This test is directly dependent on label; therefore, it needs to be updated whenever label for button changes.
     * Enter field and make sure cancel buttons reset them for the following batch requests:
     *    - PSI Run FTP / Paper
     *    - Year-End Credentials and Transcript Distribution Run
     *    - Non-Graduate Transcript Distribution Run
     *    - Archive Student Batch Process
     *    - Archive School Reports Process
     *    - Delete Student TVR Process
     */
    it('Tests Cancel button for Year-End Administration', () => {
      // PSI Run FTP / Paper
      openBatchRequestByLabel('PSI Run FTP / Paper')
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).click({force: true})
      cy.get(selectors.selections).contains('FTP').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.numberInput).clear().type('2000')
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.psiInput).clear().type('003')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Add PSI').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('PSI Run FTP / Paper')
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).should('not.contain.text', 'FTP')
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.numberInput).should('not.contain.text', '2000')
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', '001')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      
      // Year-End Credentials and Transcript Distribution Run
      openBatchRequestByLabel('Year-End Credentials and Transcript Distribution Run')
      cy.get(batchProcessingSelectors.innerCard).contains('label', 'School Category').next().click({force: true})
      cy.get(selectors.selections).contains('Public').click()
      cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_district)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Add District').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('Year-End Credentials and Transcript Distribution Run')
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', 'Public')
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.og_district)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
  
      // Non-Graduate Transcript Distribution Run
      openBatchRequestByLabel('Non-Graduate Transcript Distribution Run')
      cy.get(batchProcessingSelectors.innerCard).contains('label', 'School Category').next().click({force: true})
      cy.get(selectors.selections).contains('Public').click()
      cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_district)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Add District').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('Non-Graduate Transcript Distribution Run')
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', 'Public')
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.og_district)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
  
      // Archive Student Batch Process
      openBatchRequestByLabel('Archive Student Batch Process')
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).click({force: true})
      cy.get(selectors.selections).contains('All Students').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="REQUIRED_CONFIRMATION_1"]').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="REQUIRED_CONFIRMATION_2"]').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('Archive Student Batch Process')
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.select).should('not.have.class', 'v-select--selected')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="REQUIRED_CONFIRMATION_1"]').should('not.be.checked')
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="REQUIRED_CONFIRMATION_2"]').should('not.be.checked')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      
      // Archive School Reports Process
      openBatchRequestByLabel('Archive School Reports Process')
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).first().click({force: true})
      cy.get(selectors.selections).contains('Graduated Students').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).last().click({force: true})
      cy.get(selectors.selections).contains('All Schools').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="REQUIRED_CONFIRMATION_1"]').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('Archive School Reports Process')
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.select).first().should('not.have.class', 'v-select--selected')
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.select).last().should('not.have.class', 'v-select--selected')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).find('input[value="REQUIRED_CONFIRMATION_1"]').should('not.be.checked')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
  
      // Delete Student TVR Process
      openBatchRequestByLabel('Delete Student TVR Process')
      selelctStudentGroup(batch_test_student.PEN)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Cancel and make sure entered data is no longer there
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
      openBatchRequestByLabel('Delete Student TVR Process')
      cy.get(batchProcessingSelectors.overlayWindow).should('not.contain.text', batch_test_student.givenname) 
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.select).should('not.have.class', 'v-select--selected')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click()
  
    })
  })

  context('For Validation', () => {

    // Hardcoded for now, needs better implementaion
    const runTypelabelMapping = {
      REGALG: 'Graduation Algorithm',
      TVRRUN: 'Transcript Verification Report',
      OC: 'Original certificate',
      RC: 'Reprint certificate',
      CERT_REGEN: 'User Request Certificate Regeneration',
      SCHL_RPT_REGEN: 'User Request School Report Regeneration',
      TVR_DELETE: 'Delete Student TVR Process',
      DISTRUN_YE: 'Year-End Credentials and Transcript Distribution Run',
      NONGRADRUN: 'Non-Graduate Transcript Distribution Run',
      PSIRUN: 'PSI Run FTP / Paper',
      ARC_SCH_REPORTS: 'Archive School Reports Process',
      ARC_STUDENTS: 'Archive Student Batch Process',
    }

    beforeEach(() => {
      cy.login()
      cy.visit('/')
      
      // Go to Batch Processing => New Batch Request
      cy.get(batchProcessingSelectors.navBtn).click()
      cy.get(batchProcessingSelectors.newRequestBtn).click()
    })

    it('Tests validatoin for Adding Student', () => {
      const testCases = Cypress.env('add_student_testcases')
      testCases.forEach(testCase => {
        // Open batch request based on label mapped from a given run type
        if (testCase.run && runTypelabelMapping[testCase.run]) {
          const label = runTypelabelMapping[testCase.run]
          openBatchRequestByLabel(label)
        } else {
          openBatchRequestByLabel(runTypelabelMapping.REGALG)
        }

        // Assume v-select is visible to add a student
        selelctStudentGroup(testCase.PEN)
        cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.errorAlert).should('contain.text', testCase.message)
        cy.get(batchProcessingSelectors.overlayWindow).contains('Cancel').click({force: true})
      })
    })
  
    it.only('Tests validation for GRAD and TVR', () => {
      const submitBtn = () => cy.get(batchProcessingSelectors.overlayWindow).contains('Submit')

      // Graduation Algorithm
      // Group
      openBatchRequestByLabel('Graduation Algorithm')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      submitBtn().should('have.class', 'v-btn--disabled')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Back').click({force: true})

      checkSelectedIcon(false)
      selelctStudentGroup(batch_test_student.PEN)
      cy.get(batchProcessingSelectors.overlayWindow).should('contain.text', batch_test_student.PEN)
      checkSelectedIcon(true)

      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).first().click({force: true})
      cy.get(selectors.selections).contains('School').click({force: true})
      checkSelectedIcon(false)
      cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_school)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).should('contain.text', batch_test_student.og_school)
      checkSelectedIcon(true)

      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).first().click({force: true})
      cy.get(selectors.selections).contains('School Category').click({force: true})
      checkSelectedIcon(false)
      cy.get(batchProcessingSelectors.innerCard).contains('label', 'School Category').next().click({force: true})
      cy.get(selectors.selections).contains('Public').click()
      cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_district)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Add District').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).should('contain.text', batch_test_student.og_district)
      checkSelectedIcon(true)

      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      submitBtn().should('not.have.class', 'v-btn--disabled')
      // Run Schedule
      cy.get(batchProcessingSelectors.runLaterRadioBtn).click()
      submitBtn().should('have.class', 'v-btn--disabled')
      checkSelectedIcon(false)
      cy.get(batchProcessingSelectors.overlayWindow).should('contain.text', 'Time to schedule')
      cy.get(batchProcessingSelectors.runTonightRadioBtn).click()
      submitBtn().should('not.have.class', 'v-btn--disabled')
      checkSelectedIcon(true)
      cy.get(batchProcessingSelectors.runWeekendRadioBtn).click()
      checkSelectedIcon(true)
      cy.get(batchProcessingSelectors.runTomorrowRadioBtn).click()
      checkSelectedIcon(true)
      cy.get(batchProcessingSelectors.runCustomRadioBtn).click()
      submitBtn().should('have.class', 'v-btn--disabled')
      checkSelectedIcon(true)
    })  
  })
})