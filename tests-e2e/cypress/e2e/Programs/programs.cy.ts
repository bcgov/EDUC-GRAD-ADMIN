/**
 * @module Programs
 * 
 * @description
 * This field is comprised of series of tables displaying anything regarding program.
 * These are the tables covered in this test file:
 * - Algorithm Rules
 * - Programs
 * - Program Rules
 * - Transcript Messaging
 * - Optional Programs
 * - Optional Program Rules
 * - Letter Grades
 * - Assessment Special Case Codes
 * - Requirement Type Codes
 * 
 * Currently, this spec file is only making sure there is at least one row in each table.
 */

import selectors from "../../support/selectors";
const programsSelectors = selectors.programs

describe('Programs', () => {
    beforeEach(() => {
        cy.login()
        cy.visit('/')
        cy.get(programsSelectors.navBtn).click()
    })

    /**
     * @name checkDataInTable
     * 
     * @description
     * Goes through every table in the Programs nav and checks if they load by making sure there is at least one row 
     * loaded in it.
     * 
     * ## Steps:
     * 1. Navigate to Algorithm Rules table to check data
     * 2. Navigate to Programs table to check data
     * 3. Navigate to Program Rules table to check data
     * 4. Navigate to Transcript Messaging table to check data
     * 5. Navigate to Optional Programs table to check data
     * 6. Navigate to Optional Program Rules table to check data
     * 7. Navigate to Letter Grades table to check data
     * 8. Navigate to Assessment Special Case Codes table to check data
     * 9. Navigate to Requirement Type Codes table to check data
     */
    it('Goes through every table in the Programs nav and checks if they load', () => {
        cy.shouldHaveData(programsSelectors.programsView)

        cy.get(programsSelectors.navSlider).contains('Programs').click()
        cy.get(selectors.selections).contains('Programs').click({force: true})
        cy.shouldHaveData(programsSelectors.programsView)
        
        cy.get(programsSelectors.navSlider).contains('Programs').click()
        cy.get(selectors.selections).contains('Program Rules').click({force: true})
        cy.shouldHaveData(programsSelectors.programsView)

        cy.get(programsSelectors.navSlider).contains('Programs').click()
        cy.get(selectors.selections).contains('Transcript Messaging').click({force: true})
        cy.shouldHaveData(programsSelectors.programsView)

        cy.get(programsSelectors.navSlider).contains('Optional Programs').click()
        cy.get(selectors.selections).contains('Optional Programs').click({force: true})
        cy.shouldHaveData(programsSelectors.programsView)

        cy.get(programsSelectors.navSlider).contains('Optional Program').click()
        cy.get(selectors.selections).contains('Optional Program Rules').click({force: true})
        cy.shouldHaveData(programsSelectors.programsView)

        cy.get(programsSelectors.navSlider).contains('Letter Grades').click()
        cy.shouldHaveData(programsSelectors.programsView)

        cy.get(programsSelectors.navSlider).contains('Assessment Special Case Codes').click()
        cy.shouldHaveData(programsSelectors.programsView)

        cy.get(programsSelectors.navSlider).contains('Requirement Type Codes').click()
        cy.shouldHaveData(programsSelectors.programsView)
    })
})