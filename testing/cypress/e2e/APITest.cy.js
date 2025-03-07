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
  it.only('View batch result json', () => { 

    const batchId = "118416"
    cy.task('getBatchHistoryResultById', {batchJobResultId: batchId}).then((data) => {
      console.log(data)
      const content = data.content
      if (content && content.length) {
        console.log(content)
      }
    })

  })
})