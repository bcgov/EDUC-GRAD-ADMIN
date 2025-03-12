describe('API Test', () => {

  beforeEach(() => {
    cy.login()
    cy.visit('/')
  })

  it('View batch result json', () => {
    const batchJobResultId = "116180"

    cy.task('getBatchHistoryResultById', {batchJobResultId: batchJobResultId}).then((data) => {
      console.log(data)
    })
  })

  // Have to update batchJobResultId to newer one
  it('View batch result json', () => { 

    cy.task('getBatchSummary', {pageNumber: 0, pageSize: 10}).then((data) => {
      console.log(data)
      const content = data.content
      if (content && content.length) {
        console.log(content)
      }
    })

  })
})