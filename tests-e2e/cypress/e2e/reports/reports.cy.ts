/**
 * @module Reports
 * 
 * @description
 * This field is comprised of two sections: School Reports and Distrcit Reports. 
 */

import selectors from "../../support/selectors";
const reportSelectors = selectors.reports

describe('Reports', () => {
  const test_school_with_result = {
    title: '00502001 - Mount Baker Secondary',
    expectedReportsNum: 5
  }
  const test_school_without_results = {
    title: '00101000 - Fernie Learning Centre- test',
    expectedReportsNum: 0
  }

  const test_district_with_result = {
    title: '005 - Southeast Koote\'nay',
    expectedReportsNum: 2
  }
  const test_district_without_result = {
    title: '020 - Kootenay-Columbia',
    expectedReportsNum: 0
  }

  const invalidMessage = {
    emptySchool: 'Select a school to view reports.',
    noSchool: 'No reports found for this school',
    emptyDistict: 'Select a district to view reports.',
    noDistrict: 'No reports found for this district'
  }

  beforeEach(() => {
    cy.login()
    cy.visit('/') 
    cy.get(reportSelectors.navBtn).click()
  })

  /**
   * @name getReports
   * 
   * @description
   * Validate result and input field, and get reports for both School Reports and District Reports
   * 
   * ## Steps:
   * 1. In School Reports, Search with empty field to check an error message
   * 2. Search school reports with valid school name that has reports to make sure it displays expected number of reports
   * 3. Search school reports with valid school name that does not have reports to check an error message
   * 4. Nagigate to Distrcit Reports
   * 5. In District Reports, Search with empty field to check an error message
   * 6. Search district reports with valid district name that has reports to make sure it displays expected number of reports
   * 7. Search district reports with valid district name that does not have reports to check an error message
   */
  it('Gets report', () => {
    // Wait a bit for institute
    cy.wait(3000)
    // School Report
    // Empty
    cy.get(reportSelectors.advancedSearchButtons).contains('Search').click()
    cy.get(reportSelectors.messageAlert).should('have.text', invalidMessage.emptySchool)
    // Valid data with result
    cy.selectAutoselect(reportSelectors.mincodeAuto, test_school_with_result.title)
    cy.get(reportSelectors.advancedSearchButtons).contains('Search').click()
    cy.shouldHaveData(reportSelectors.reportsView, test_school_with_result.expectedReportsNum)
    cy.get(reportSelectors.advancedSearchButtons).contains('Reset').click()
    // Valid data without result
    cy.selectAutoselect(reportSelectors.mincodeAuto,test_school_without_results.title)
    cy.get(reportSelectors.advancedSearchButtons).contains('Search').click()
    cy.get(reportSelectors.messageAlert).should('have.text', invalidMessage.noSchool)

    // District Report
    // Empty
    cy.get(reportSelectors.districtReportsTab).click()
    cy.get(reportSelectors.advancedSearchButtons).contains('Search').click()
    cy.get(reportSelectors.messageAlert).should('have.text', invalidMessage.emptyDistict)
    // Valid data with result
    cy.selectAutoselect(reportSelectors.districtAuto, test_district_with_result.title)
    cy.get(reportSelectors.advancedSearchButtons).contains('Search').click()
    cy.shouldHaveData(reportSelectors.reportsView, test_district_with_result.expectedReportsNum)
    cy.get(reportSelectors.advancedSearchButtons).contains('Reset').click()
    // Valid data without result
    cy.selectAutoselect(reportSelectors.districtAuto, test_district_without_result.title)
    cy.get(reportSelectors.advancedSearchButtons).contains('Search').click()
    cy.get(reportSelectors.messageAlert).should('have.text', invalidMessage.noDistrict)
  })
})