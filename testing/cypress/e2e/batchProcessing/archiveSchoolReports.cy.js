import selectors from "../../support/selectors";
const batchProcessingSelectors = selectors.batchProcessing

describe('Archive School Reports', () => {
  const batch_test_student = Cypress.env('test_students').graduated_student

  beforeEach(() => {
    cy.login()
    cy.visit('/')
    
    // Go to Batch Processing => New Batch Request
    cy.get(batchProcessingSelectors.navBtn).click()
    cy.get(batchProcessingSelectors.newRequestBtn).click()
    cy.contains('Archive School Reports Process').next().find('button').click()
    cy.wait(500)
  })

  it.only('Archives NONGRADPRJ', () => { 
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).first().click({force: true})
    cy.get(selectors.selections).contains('NONGRADPRJ').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).find(batchProcessingSelectors.selectInput).last().click({force: true})
    cy.get(selectors.selections).contains('School').click({force: true})
    cy.selectAutoselect(batchProcessingSelectors.autocomplete, batch_test_student.og_school)
    cy.get(batchProcessingSelectors.overlayWindow).contains('Add School').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).contains('Next').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="REQUIRED_CONFIRMATION_1"]').click({force: true})
    cy.get(batchProcessingSelectors.overlayWindow).find('input[value="REQUIRED_CONFIRMATION_2"]').click({force: true})
    
  })

  it('Archives GRADREG', () => {

  })

  it('Archives NONGRADREG', () => {

  })
})