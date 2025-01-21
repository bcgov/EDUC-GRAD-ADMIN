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
        cy.get(programsSelectors.navSlider).contains('Programs').click()
    })
})