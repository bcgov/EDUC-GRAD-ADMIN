import selectors from "../../support/selectors";
const programsSelectors = selectors.programs

describe('Programs', () => {
    beforeEach(() => {
        cy.login()
        cy.visit('/')

        // If still not logged in, login
        cy.doesExist(selectors.login.loginBtn).then((exist) => {
        if (exist) {
            cy.get(selectors.login.loginBtn).eq(0).click()
        }
        })

        cy.get(programsSelectors.navBtn).click()
    })

    it('Goes through every table in the Programs nav and checks if they load', () => {
        cy.get(programsSelectors.algorithmRulesTable).should('exist')
        cy.get(programsSelectors.algorithmRulesTable).find(programsSelectors.rows).its('length').should('be.gt', 1)

        cy.get(programsSelectors.navSlider).contains('Programs').click()
        cy.get(programsSelectors.selections).contains('Programs').click()
        cy.get(programsSelectors)
    })
})