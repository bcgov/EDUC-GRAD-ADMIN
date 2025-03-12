import { BatchHistoryResultPayload } from "../services/student-api-service"

describe('API Test', () => {

  beforeEach(() => {
    cy.login()
    cy.visit('/')
  })

  it('View batch result json', () => {
    const batchJobResultId = "116180"

    cy.task('getBatchHistoryResultById', {batchJobResultId: batchJobResultId}).then((data: BatchHistoryResultPayload) => {
      const content = data.content
      expect(content).to.have.length(10)
      content.forEach(item => {
        expect(item).to.have.property('recalculateGradStatus', null)
        expect(item).to.have.property('recalculateProjectedGrad', null)
      })
    })
  })
})