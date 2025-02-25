import selectors from "../../support/selectors"
import { getCurrentTimestamp, isWithinMarginSeconds } from "../../support/helperMethods"
const batchProcessingSelectors = selectors.batchProcessing

// Problem: Only looks at the first row (not working)
function refreshTableTillComplete(timeout, interval = 3000) {
  let refreshCount = timeout / interval
  const statusColSelector = batchProcessingSelectors.batchRunsTable + " " + batchProcessingSelectors.firstRow + " " + batchProcessingSelectors.batchStatusCol

  cy.get(statusColSelector).should('contain.text', 'STARTED')

  while (refreshCount >= 0) {        
    cy.wait(interval)
    cy.contains('Update').click({force: true})
    refreshCount --

    cy.get(statusColSelector).then(($element) => {
      if ($element.text().includes('COMPLETED')) {
        // Stop refresing
        console.log("DONE")
        refreshCount = -1
      } 
    })
  }
}

function callAPITilComplete(jobId, startTime, timeout, interval = 2000) {
  const currentTime = Date.now()

  if (currentTime - startTime >= timeout) {
    throw new Error('Timeout: Job was not completed within a given time')
  }

  cy.wait(interval)
  cy.task('getBatchSummary', {pageNumber: 0, pageSize: 10}).then((data) => {
    const batchJob = data.batchJobList.find(batchJob => batchJob.jobExecutionId == jobId)

    // If job is completed, stop recalling
    if (!!batchJob && batchJob.status == 'COMPLETED') {
      cy.log(`Batch Job ID ${jobId} - COMPLETED`)
    } else {
    // Otherwise keep calling
      callAPITilComplete(jobId, startTime, timeout, interval)
    }
  })
}

describe('Graduation Algorithm', () => {
  const graduated_student = Cypress.env('graduated_student')

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

    it.only('Runs on Student', () => {
      cy.get(batchProcessingSelectors.overlayWindow).find('input').click({force: true})
      cy.get(selectors.selections).contains('Student').click()
      cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.numberInput).type(graduated_student.PEN)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Add Student').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})

      // Setup interception for getting job exec id
      cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/specialrun`).as('batchRun')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()
      cy.wait('@batchRun').then(({response}) => {
        cy.wrap(response.body).as('batchRunStatus')
      })

      // Watch Batch result through API
      cy.get('@batchRunStatus').then(data => {
        const batchId = data.batchId
        callAPITilComplete(batchId, Date.now(), 10000)
        // Batch job is completed -> call studentHistory API to make sure student is updated
        cy.task('getBatchHistoryResultById', {batchJobResultId: batchId}).then((data) => {
          const content = data.content
          const endTime = getCurrentTimestamp()
          if (content && content.length) {
            expect(content).to.have.length(1)
            // Make sure updateDate is properly updated
            expect(isWithinMarginSeconds(content[0].updateDate, endTime)).to.be.true
          }
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

    it('Runs on School', () => {
      cy.get(batchProcessingSelectors.overlayWindow).find('input').click({force: true})
      cy.get(selectors.selections).contains('School').click()
      cy.wait(500)
      cy.selectAutoselect(batchProcessingSelectors.autocomplete, graduated_student.og_school)
      cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
      cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
      // Setup interception for getting job exec id
      cy.intercept('POST',  `${Cypress.config('baseUrl')}/api/v1/batch/specialrun`).as('batchRun')
      cy.get(batchProcessingSelectors.overlayWindow).contains('Submit').click()
      cy.wait('@batchRun').then(({response}) => {
        cy.wrap(response.body).as('batchRunStatus')
      })

      // Watch Batch result through UI
      // cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.firstRow).find(batchProcessingSelectors.batchStatusCol).should('contain.text', 'STARTED')
      // cy.wait(10000)
      // cy.contains('Update').click({force: true})
      // cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.firstRow).find(batchProcessingSelectors.batchStatusCol).should('contain.text', 'COMPLETED')
      // refreshTableTillComplete(30000)
      // cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.firstRow).find(batchProcessingSelectors.batchStatusCol).should('contain.text', 'COMPLETED')
      // cy.get(batchProcessingSelectors.batchRunsTable).find(batchProcessingSelectors.batchJobId).then(($element) => {
      //     const text = $element.text()    
      // }) 
      
      // Watch Batch result through API
      cy.get('@batchRunStatus').then(data => {
        const batchId = data.batchId
        callAPITilComplete(batchId, Date.now(), 5000)
        const endTime = getCurrentTimestamp()
        // Batch job is completed -> call studentHistory API to make sure student is updated
        cy.task('getBatchHistoryResultById', {batchJobResultId: batchId}).then((data) => {
          const content = data.content
          if (content && content.length) {
            // Make sure updateDate is properly updated
            content.forEach(item => {
              expect(isWithinMarginSeconds(item.updateDate, endTime)).to.be.true
            })
          }
        })
      })
    })
  })
})