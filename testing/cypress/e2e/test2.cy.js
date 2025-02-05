describe('Test for cypress deployment', () => {
  it('Visits and passes', () => {
    cy.visit('/')
    cy.get('body').should('contain.text', 
      'To access the Graduation Administration Application, you must have a valid IDIR.'
    )
    cy.login()
    cy.visit('/')
    cy.wait(10000)
    cy.get('body').should('contain.text', 
      'PEN Search'
    )
  })
})