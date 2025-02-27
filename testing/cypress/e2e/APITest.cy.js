describe('API Test', () => {

  beforeEach(() => {
    cy.login()
    cy.visit('/')
  })

  it('View batch result json', () => {
    const batchJobResultId = "116180"

    cy.task('getBatchHistoryResultById', {batchJobResultId: batchJobResultId}).then((data) => {
      const content = data.content
      expect(content).to.have.length(10)
      content.forEach(item => {
        expect(item).to.have.property('recalculateGradStatus', null)
        expect(item).to.have.property('recalculateProjectedGrad', null)
      })
    })
  })

  // Have to update batchJobResultId to newer one
  it('View batch result json', () => { 
    const batchJobResultId = "117128"

    cy.task('getBatchSummary', {pageNumber: 0, pageSize: 10}).then((data) => {
      console.log(data)
      const batchJobList = data.batchJobList
      const batchJob = batchJobList.find(batchJob => batchJob.jobExecutionId == batchJobResultId)
      console.log(batchJob)
      expect(batchJob).to.have.property('status', 'COMPLETED')
    })

    // const batchId = 117140
    // const endTime = getCurrentTimestamp()
    // cy.task('getBatchHistoryResultById', {batchJobResultId: batchId}).then((data) => {
    //   const content = data.content
    //   if (content && content.length) {
    //     expect(content).to.have.length(1)
    //     // Make sure updateDate is properly updated
    //     console.log(endTime)
    //     console.log(content[0].updateDate)
    //     expect(isWithinMarginSeconds(content[0].updateDate, endTime)).to.be.true
    //   }
    // })
  })
})