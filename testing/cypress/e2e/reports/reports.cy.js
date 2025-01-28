import selectors from "../../support/selectors";
const reportSelectors = selectors.reports

describe('Reports', () => {
  const test_school_with_result = {
    title: '00502001 - Mount Baker Secondary',
    expectedReportsNum: 8
  }
  const test_school_without_results = {
    title: '00101000 - Fernie Learning Centre- test',
    expectedReportsNum: 0
  }

  const test_district_with_result = {
    title: '005 - Southeast Koote\'nay',
    expectedReportsNum: 3
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

  it('Gets report', () => {
    // Wait a bit for institute
    cy.wait(3000)
    // School Report
    cy.get(reportSelectors.advancedSearchButtons).contains('Search').click()
    cy.get(reportSelectors.messageAlert).should('have.text', invalidMessage.emptySchool)

    cy.get(reportSelectors.mincodeAuto).click()
    cy.get(reportSelectors.selections).contains(test_school_with_result.title).click({force: true})
    cy.get(reportSelectors.advancedSearchButtons).contains('Search').click()
    cy.get(reportSelectors.resultTable).find(reportSelectors.rows).its('length').should('eq', test_school_with_result.expectedReportsNum)
    cy.get(reportSelectors.advancedSearchButtons).contains('Reset').click()
    
    cy.get(reportSelectors.mincodeAuto).click()
    cy.get(reportSelectors.selections).contains(test_school_without_results.title).click({force: true})
    cy.get(reportSelectors.advancedSearchButtons).contains('Search').click()
    cy.get(reportSelectors.messageAlert).should('have.text', invalidMessage.noSchool)

    // District Report
    cy.get(reportSelectors.districtReportsTab).click()
    cy.get(reportSelectors.advancedSearchButtons).contains('Search').click()
    cy.get(reportSelectors.messageAlert).should('have.text', invalidMessage.emptyDistict)

    cy.get(reportSelectors.districtAuto).click()
    cy.get(reportSelectors.selections).contains(test_district_with_result.title).click({force: true})
    cy.get(reportSelectors.advancedSearchButtons).contains('Search').click()
    cy.get(reportSelectors.resultTable).find(reportSelectors.rows).its('length').should('eq', test_district_with_result.expectedReportsNum)
    cy.get(reportSelectors.advancedSearchButtons).contains('Reset').click()

    cy.get(reportSelectors.districtAuto).click()
    cy.get(reportSelectors.selections).contains(test_district_without_result.title).click({force: true})
    cy.get(reportSelectors.advancedSearchButtons).contains('Search').click()
    cy.get(reportSelectors.messageAlert).should('have.text', invalidMessage.noDistrict)
  })
})