/**
 * @module GraduationAlgorithm
 * 
 * @description
 * Run "Graduation Algorithm" in Batch Processing. This spec tests graduation algorithm by calling API directly
 * instead of naviagting thruogh UI to speed up the testing, as well as making sure endpoints work.
 * They are 4 different groups that need individual test cases.
 */

import selectors from "../../support/selectors"
import { getCurrentTimestamp, isWithinMarginSeconds } from "../../support/helperMethods"
const batchProcessingSelectors = selectors.batchProcessing
const studentSearchSelectors = selectors.studentSearch

describe('Graduation Algorithm', () => {
  const batch_test_student = Cypress.env('test_students').batch_test_student
  const activityCode = 'GRADALG'

  context('On Student', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/')
      
      // Go to Batch Processing => New Batch Request
      cy.get(batchProcessingSelectors.navBtn).click()
      cy.get(batchProcessingSelectors.newRequestBtn).click()
      cy.contains('Graduation Algorithm').next().find('button').click()
      cy.wait(500)
    })

    /**
     * @name runsOnStudent
     * 
     * @description
     * Runs Graduation Algorithm for a single student to make sure student's data is properly updated.
     * 
     * ## Steps:
     * 1. Open Grad Algorithm modal on Batch Processing
     * 2. Select Student as a group
     * 3. Enter PEN
     * 4. Click Add Student and Next
     * 5. Set up network interception for specialrun to get a batch id from response
     * 6. Click Submit 
     *    - This will call specialrun and Cypress obtains a batch id out of the response
     * 7. Call batch summary endpoint repeatedly until it's completed
     *    - If it's not completed within set timeout, test fails
     * 8. Call batch history for the batch id to ensure data is valid
     *    - activityCode should be REGALG
     *    - Length of content should be 1
     *    - updateDate of a student should be same/close to current date time
     * 9. Call graduation report API for checking updateDate for transcript is updated
     */
    it.only('Runs on REGALG Student', () => {
      cy.get(batchProcessingSelectors.overlayWindow).find('input').click({force: true})
      cy.get(selectors.selections).contains('Student').click()
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.numberInput).type(batch_test_student.PEN)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Add Student').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})

      // Setup interception for getting job exec id
      cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/specialrun`).as('batchRun')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()

      // Watch Batch result through API
      cy.wait('@batchRun').then(({response}) => {
        const batchId = response?.body?.batchId

        cy.callBatchJobTillComplete(batchId, Date.now(), 10000)
        // Batch job is completed -> call studentHistory API to make sure student is updated
        cy.task('getBatchHistoryResultById', {batchJobResultId: batchId}).then((data) => {
          const content = data.content
          expect(content).to.have.length(1)
          const batchResultData = content[0]
          // Make sure updateDate is properly updated
          const endTime = getCurrentTimestamp()
          expect(isWithinMarginSeconds(batchResultData.updateDate, endTime)).to.be.true
          // Check activity code
          expect(batchResultData).to.have.property('activityCode', activityCode)
          // Make sure transcript's updateDate is updated
          cy.task('getTranscript', batchResultData.studentID).then((data) => {
            expect(isWithinMarginSeconds(data.updateDate, endTime)).to.be.true
          })
        })
      })
    })
  })

  context('On School', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/')
      
      // Go to Batch Processing => New Batch Request
      cy.get(batchProcessingSelectors.navBtn).click()
      cy.get(batchProcessingSelectors.newRequestBtn).click()
      cy.contains('Graduation Algorithm').next().find('button').click()
      cy.wait(500)
    })

    /**
     * @name runsOnSchool
     * 
     * @description
     * Runs Graduation Algorithm for a test school to make sure student's data is properly updated.
     * 
     * ## Steps:
     * 1. Open Grad Algorithm modal on Batch Processing
     * 2. Select School as a group
     * 3. Select a test school
     * 4. Click Add School and Next
     * 5. Set up network interception for specialrun to get a batch id from response
     * 6. Click Submit 
     *    - This will call specialrun and Cypress obtains a batch id out of the response
     * 7. Call batch summary endpoint repeatedly until it's completed
     *    - If it's not completed within set timeout, test fails
     * 8. Call batch history for the batch id to ensure data is valid
     *    - activityCode is REGALG
     *    - updateDate of each student should be same/close to current date time
     */
    it('Runs REGALG on School', () => {
      cy.get(batchProcessingSelectors.overlayWindow).find('input').click({force: true})
      cy.get(selectors.selections).contains('School').click()
      cy.wait(500)
      cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_school)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Setup interception for getting job exec id
      cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/specialrun`).as('batchRun')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()
    
      // Watch Batch result through API
      cy.wait('@batchRun').then(({response}) => {
        const batchId = response?.body?.batchId
        cy.callBatchJobTillComplete(batchId, Date.now(), 5000)
        // Batch job is completed -> call studentHistory API to make sure student is updated
        cy.task('getBatchHistoryResultById', {batchJobResultId: batchId}).then((data) => {
          const content = data.content
          const endTime = getCurrentTimestamp()
          if (content && content.length) {
            // Make sure updateDate is properly updated
            content.forEach(item => {
              expect(isWithinMarginSeconds(item.updateDate, endTime)).to.be.true
              expect(item).to.have.property('activityCode', activityCode)
            })
          }
        })
      })
    })
  })

  context('On District', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/')
      
      // Go to Batch Processing => New Batch Request
      cy.get(batchProcessingSelectors.navBtn).click()
      cy.get(batchProcessingSelectors.newRequestBtn).click()
      cy.contains('Graduation Algorithm').next().find('button').click()
      cy.wait(500)
    })

    /**
     * @name runsOnDistrict
     * 
     * @description
     * Runs Graduation Algorithm for a distrcit to make sure student's data is properly updated.
     * 
     * ## Steps:
     * 1. Open Grad Algorithm modal on Batch Processing
     * 2. Select School Category as a group
     * 3. Select school category and district
     * 4. Click Add Distrcit and Next
     * 5. Set up network interception for specialrun to get a batch id from response
     * 6. Click Submit 
     *    - This will call specialrun and Cypress obtains a batch id out of the response
     * 7. Call batch summary endpoint repeatedly until it's completed
     *    - If it's not completed within set timeout, test fails
     * 8. Call batch history for the batch id to ensure data is valid
     *    - activityCode is REGALG
     *    - updateDate of each student should be same/close to current date time
     */
    it('Runs REGALG on District', () => {
      cy.get(batchProcessingSelectors.overlayWindow).find('input').click({force: true})
      cy.get(selectors.selections).contains('School Category').click()
      cy.wait(500)
      cy.get(batchProcessingSelectors.innerCard).contains('label', 'School Category').next().click({force: true})
      cy.get(selectors.selections).contains('Public').click()
      cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_district)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Add District').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Setup interception for getting job exec id
      cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/specialrun`).as('batchRun')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()

      // Watch Batch result through API
      cy.wait('@batchRun').then(({response}) => {
        const batchId = response?.body?.batchId
        cy.callBatchJobTillComplete(batchId, Date.now(), 20000, 4000)
        // Batch job is completed -> call studentHistory API to make sure student is updated
        cy.task('getBatchHistoryResultById', {batchJobResultId: batchId}).then((data) => {
          const content = data.content
          const endTime = getCurrentTimestamp()
          if (content && content.length) {
            // Make sure updateDate is properly updated
            content.forEach(item => {
              expect(isWithinMarginSeconds(item.updateDate, endTime)).to.be.true
              expect(item).to.have.property('activityCode', activityCode)
            })
          }
        })
      })
    })
  })
})