import { formatTime } from "../support/helperMethods"

describe('API Test', () => {

  it('View batch result json', () => {
    const batchJobResultId = "119244"

    cy.task('getBatchHistoryResultById', {batchJobResultId: batchJobResultId}).then((data) => {
      const content = data.content
      expect(content).to.have.length(1)
      const batchResultData = content[0]
      expect(batchResultData).to.have.property('activityCode', 'GRADALG')
      
      cy.task('getTranscriptVerificationReport', batchResultData.studentID).then((data) => {
        console.log(data[0].updateDate)
        console.log(formatTime(data[0].updateDate))
      })
      
    })
  })
})