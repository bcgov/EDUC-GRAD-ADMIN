import { BatchHistoryResultPayload } from "../services/student-api-service"

describe('API Test', () => {

  it('View batch result json', () => {
    const batchJobResultId = "119066"

    cy.task('getBatchHistoryResultById', {batchJobResultId: batchJobResultId}).then((data) => {
      console.log(data)
      const content = data.content
      expect(content).to.have.length(1)
      content.forEach(item => {
        expect(item).to.have.property('activityCode', 'GRADALG')
      })
    })
  })
})