describe('API Test', () => {

  it('View batch result json', () => {
    const batchJobResultId = "119066"

    cy.task('getBatchHistoryResultById', {batchJobResultId: batchJobResultId}).then((data) => {
      console.log(data)
      const content = data.content
      expect(content).to.have.length(1)
      const batchResultData = content[0]
      expect(batchResultData).to.have.property('activityCode', 'GRADALG')
      
      cy.task('getTranscript', batchResultData.studentID).then((data) => {
        console.log(data)
      })
      
    })
  })
})