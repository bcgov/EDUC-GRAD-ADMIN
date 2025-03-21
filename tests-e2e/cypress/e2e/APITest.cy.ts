import { base64ToFileTypeAndDownload, formatTime, getCurrentTimestamp, isWithinMarginSeconds } from "../support/helperMethods"
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder');


describe('API Test', () => {
  deleteDownloadsFolderBeforeAll()

  it('View batch result json', () => {
    //const batchJobResultId = "119524"
    const batchJobResultId = "120290" 

    // cy.task('getBatchHistoryResultById', {batchJobResultId: batchJobResultId}).then((data) => {
    //   console.log("DATA: ", data)
    //   const content = data.content
    //   const batchResultData = content[0]
    //   cy.task('getCertificate', batchResultData.studentID).then((data) => {
    //     console.log(isWithinMarginSeconds(formatTime(data[0].updateDate), "2025-03-18T10:37:19"))
    //   })
    // })

    // cy.task('downloadBatchReport', batchJobResultId).then(data => {
    //   base64ToFileTypeAndDownload(data, "application/zip", batchJobResultId)
    //   const zipFilePath =  `cypress/downloads/${batchJobResultId}.zip`;
    //   cy.readFile(zipFilePath, 'base64', {timeout: 10000})

    //   cy.task('checkPDFInZip', zipFilePath).then((result) => {
    //     expect(result).to.equal('PDF is not empty')
    //   })
    // })

    cy.task('getBatchById', batchJobResultId).then(data => {
      console.log("Batch: ", data.content[0])
      const jobParameters = JSON.parse(data.content[0].jobParameters)
      cy.wrap(jobParameters).should('have.a.property', 'credentialType', 'RC')
      cy.wrap(jobParameters).its('payload.pens')
        .should('have.length', 1)
    })
  })
})