'use strict';
const { LocalDate, DateTimeFormatter } = require('@js-joda/core');

function generateSchoolObject(school) {
  return {
    schoolId: school.schoolId,
    districtID: school.districtId,
    mincode: school.mincode,
    independentAuthorityId: school.independentAuthorityId,
    schoolNumber: school.schoolNumber,
    displayName: school.displayName,
    displayNameNoSpecialChars: school.displayNameNoSpecialChars,
    schoolCategoryCode: school.schoolCategoryCode,
    facilityTypeCode: school.facilityTypeCode,
    openedDate: school.openedDate,
    closedDate: school.closedDate,
    canIssueCertificates: school.canIssueCertificates,
    canIssueTranscripts: school.canIssueTranscripts
  };
}

function isSchoolActive(school) {
  const currentTime = LocalDate.now();
  const openedDate = school?.effectiveDate;
  const closedDate = school?.expiryDate;
  return school
    && school.schoolName
    && !!openedDate
    && (!closedDate || currentTime.isBefore(LocalDate.parse(closedDate, DateTimeFormatter.ISO_LOCAL_DATE_TIME)));
}

module.exports = {
  generateSchoolObject: generateSchoolObject,
  isSchoolActive
};
