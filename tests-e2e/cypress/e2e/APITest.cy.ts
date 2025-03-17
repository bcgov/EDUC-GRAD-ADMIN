import { base64ToFileTypeAndDownload, formatTime } from "../support/helperMethods"
const { deleteDownloadsFolderBeforeAll } = require('cypress-delete-downloads-folder');


describe('API Test', () => {
  deleteDownloadsFolderBeforeAll()

  it('View batch result json', () => {
    const batchJobResultId = "119524"

    // cy.task('getBatchHistoryResultById', {batchJobResultId: batchJobResultId}).then((data) => {
    //   const content = data.content
    //   expect(content).to.have.length(1)
    //   const batchResultData = content[0]
    //   console.log(content)
    //   cy.task('getCertificate', batchResultData.studentID).then((data) => {
    //     console.log(data[0].updateDate)
    //     console.log(formatTime(data[0].updateDate))
    //   })
      
    // })
    cy.task('downloadBatchReport', batchJobResultId).then(data => {
      base64ToFileTypeAndDownload(data, "application/zip", batchJobResultId)
      const zipFilePath =  `cypress/downloads/${batchJobResultId}.zip`;
      cy.readFile(zipFilePath, 'base64', {timeout: 10000})

      cy.task('checkPDFInZip', zipFilePath).then((result) => {
        expect(result).to.equal('PDF is not empty')
      })
    })
  })
})