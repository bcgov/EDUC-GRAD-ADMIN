import { base64ToFileTypeAndDownload, formatTime, getCurrentTimestamp, isWithinMarginSeconds } from "../support/helperMethods"
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder');


describe('API Test', () => {
  deleteDownloadsFolderBeforeAll()

  it('View batch result json', () => {
    //const batchJobResultId = "119524"
    const batchJobResultId = "120992" 

    cy.task('getBatchHistoryResultById', {batchJobResultId: batchJobResultId}).then((data) => {
      console.log("DATA: ", data)
    })

    // cy.task('downloadBatchReport', batchJobResultId).then(data => {
    //   base64ToFileTypeAndDownload(data, "application/zip", batchJobResultId)
    //   const zipFilePath =  `cypress/downloads/${batchJobResultId}.zip`;
    //   cy.readFile(zipFilePath, 'base64', {timeout: 10000})

    //   cy.task('checkPDFInZip', zipFilePath).then((result) => {
    //     expect(result).to.equal('PDF is not empty')
    //   })
    // })

    // cy.task('getBatchById', batchJobResultId).then(data => {
    //   console.log("Batch: ", data.content[0])
    //   const jobParameters = JSON.parse(data.content[0].jobParameters)
    //   cy.wrap(jobParameters).should('have.a.property', 'credentialType', 'RC')
    //   cy.wrap(jobParameters).its('payload.pens')
    //     .should('have.length', 1)
    // })

    // cy.task('getSchoolReportById', "0a61245b-9525-10d1-8195-3f1b2b820004").then(data => {
    //   console.log(data)
    // })
  })
})