import selectors from "../../support/selectors";
const programsSelectors = selectors.programs

function shouldHaveData(selector) {
    cy.wait(400)
    cy.get(programsSelectors.itemPerPage).click({force: true})
    cy.wait(400)
    cy.get(programsSelectors.selections).contains('All').click({force: true})
    cy.get(selector).find(programsSelectors.rows).its('length').should('be.gt', 1)
}

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
        shouldHaveData(programsSelectors.algorithmRulesTable)

        cy.get(programsSelectors.navSlider).contains('Programs').click()
        cy.get(programsSelectors.selections).contains('Programs').click({force: true})
        shouldHaveData(programsSelectors.programTable)
        
        cy.get(programsSelectors.navSlider).contains('Programs').click()
        cy.get(programsSelectors.selections).contains('Program Rules').click({force: true})
        shouldHaveData(programsSelectors.programRuleTable)

        cy.get(programsSelectors.navSlider).contains('Programs').click()
        cy.get(programsSelectors.selections).contains('Transcript Messaging').click({force: true})
        shouldHaveData(programsSelectors.transcriptMessageTable)

        cy.get(programsSelectors.navSlider).contains('Optional Programs').click()
        cy.get(programsSelectors.selections).contains('Optional Programs').click({force: true})
        shouldHaveData(programsSelectors.optionalProgramTable)

        cy.get(programsSelectors.navSlider).contains('Optional Program').click()
        cy.get(programsSelectors.selections).contains('Optional Program Rules').click({force: true})
        shouldHaveData(programsSelectors.optionalProgramRuleTable)

        // 'otherTable' selector can be used to other tables above, because DOM overwrites table everytime.
        cy.get(programsSelectors.navSlider).contains('Letter Grades').click()
        shouldHaveData(programsSelectors.otherTable)

        cy.get(programsSelectors.navSlider).contains('Assessment Special Case Codes').click()
        shouldHaveData(programsSelectors.otherTable)

        cy.get(programsSelectors.navSlider).contains('Requirement Type Codes').click()
        shouldHaveData(programsSelectors.otherTable)
    })
})