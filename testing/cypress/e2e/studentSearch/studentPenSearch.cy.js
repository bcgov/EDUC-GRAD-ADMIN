import selectors from "../../support/selectors"

describe('Student Search', () => {
  context('with PEN', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/')
    })

    it('GRAD Edit', () => {
      cy.get(selectors.studentSearch.title).should('contain.text', 'Student Search')
      cy.get(selectors.studentSearch.searchByPEN).type(Cypress.env('test1_PEN'))
      cy.get(selectors.studentSearch.searchSubmit).click()
      cy.wait(3000) // Need to wait so that fields load up in Edit window
      cy.get(selectors.studentSearch.editBtn).click()
      cy.get(selectors.studentSearch.status).click({force: true})
      cy.get(selectors.studentSearch.statusChoices).contains('Current').click()
    })
  })
})