/**
 * @module Assessments
 * 
 * @description
 * This field is comprised of series of tables displaying anything regarding assessment.
 * These are the tables covered in this test file:
 * - Assessments
 * - Assessment Requirement
 * 
 * Currently, this spec file is only making sure there is at least one row in each table.
 */

import selectors from "../../support/selectors";
const assessmentsSelectors = selectors.assessments

describe('Assessments', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
    cy.get(assessmentsSelectors.navBtn).click()
  })

  /**
   * @name checkDataInTable
   * 
   * @description
   * Goes through every table in the Assessments nav and checks if they load by making sure there is at least one row 
   * loaded in it.
   * 
   * ## Steps:
   * 1. Navigate to Assessment table to check data
   * 2. Navigate to Assessment Requirement table to check data
   */
  it('Checks each table if they are loaded', () => {
    cy.shouldHaveData(assessmentsSelectors.assessmentsView)

    cy.get(assessmentsSelectors.navSlider).contains('Assessment Requirements').click()
    cy.shouldHaveData(assessmentsSelectors.assessmentsView)
  })
})