const {
  errorResponse,
  getData,
  getCommonServiceData,
} = require("../components/utils");
const config = require("../config/index");
const log = require("../components/logger");
const auth = require("../components/auth");
const cacheService = require("./cache-service");
const HttpStatus = require("http-status-codes");

async function getStudentStatusCodes(req, res) {
  const token = auth.getBackendToken(req);
  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/studentstatus`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data); //idk about this, do we always want to return a 200?
  } catch (e) {
    log.error(
      e,
      "getStudentStatusCodes",
      "Error occurred while attempting to get student status codes"
    );
    if (e.data.message) {
      return response(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getHistoryActivityCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentAPIURL"
    )}/api/v1/student/historyactivity`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getStudentGradeCodes(req, res) {
  try {
    const codes = cacheService.getStudentGradeCodesJSON();
    return res.status(HttpStatus.OK).json(codes);
  } catch (e) {
    log.error(e, 'getStudentGradeCodes', 'Error occurred while attempting to get cached student grade codes.');
    return errorResponse(res);
  }
}

async function getGradProgramCodes(req, res) {
  try {
    const codes = cacheService.getGradProgramCodesJSON();
    return res.status(HttpStatus.OK).json(codes);
  } catch (e) {
    log.error(e, 'getGradProgramCodes', 'Error occurred while attempting to get cached graduation program codes.');
    return errorResponse(res);
  }
}

async function getOptionalProgramCodes(req, res) {
  try {
    const codes = cacheService.getOptionalProgramCodesJSON();
    return res.status(HttpStatus.OK).json(codes);
  } catch (e) {
    log.error(e, 'getOptionalProgramCodes', 'Error occurred while attempting to get cached optional program codes.');
    return errorResponse(res);
  }
}

async function getCareerProgramCodes(req, res) {
  try {
    const codes = cacheService.getCareerProgramCodesJSON();
    return res.status(HttpStatus.OK).json(codes);
  } catch (e) {
    log.error(e, 'getCareerProgramCodes', 'Error occurred while attempting to get cached career program codes.');
    return errorResponse(res);
  }
}

async function getRequirementTypeCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:programAPIURL"
    )}/api/v1/program/gradrequirementtype`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getFineArtsAppliedSkillsCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/fineArtsAppliedSkillsCodes`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getEquivalentOrChallengeCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/equivalentOrChallengeCodes`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getExamSpecialCaseCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:courseAPIURL"
    )}/api/v1/course/examSpecialCaseCodes`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getInstituteSchoolCategoryCodes(_req, res) {
  try {
    const url = `${config.get(
      "server:instituteAPIURL"
    )}/api/v1/institute/category-codes`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}
async function getInstituteFacilityCodes(_req, res) {
  try {
    const url = `${config.get(
      "server:instituteAPIURL"
    )}/api/v1/institute/facility-codes`;
    const data = await getCommonServiceData(url);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getAssessmentSpecialCaseCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentGraduationAPIURL"
    )}/api/v1/studentgraduation/lgSc/specialcase`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getCourseLetterGradeCodes(req, res) {
  try {
    const codes = cacheService.getLetterGradeCodesJSON();
    return res.status(HttpStatus.OK).json(codes);
  } catch (e) {
    log.error(e, 'getCourseLetterGradeCodes', 'Error occurred while attempting to get cached letter grade codes.');
    return errorResponse(res);
  }
}

async function getTranscriptMessagingCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentGraduationAPIURL"
    )}/api/v1/studentgraduation/transcript/gradmessages`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getStudentUndoCompletionReasonCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:studentGraduationAPIURL"
    )}/api/v1/studentgraduation/undocompletion/undocompletionreason`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getTranscriptTypeCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationReportAPIURL"
    )}/api/v1/graduationreports/transcripttype`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getCertificateTypeCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationReportAPIURL"
    )}/api/v1/graduationreports/certificatetype`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getCertificateTypeCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationReportAPIURL"
    )}/api/v1/graduationreports/certificatetype`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getProgramCertificateTranscriptCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationReportAPIURL"
    )}/api/v1/graduationreports/allprogramcertificates`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getReportTypeCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationReportAPIURL"
    )}/api/v1/graduationreports/reporttype`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getDocumentStatusCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:graduationReportAPIURL"
    )}/api/v1/graduationreports/documentstatus`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getDigitalSignatureBlockTypeCodes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get(
      "server:reportAPIURL"
    )}/api/v1/reports/signatures/getSignatureBlockTypeCodes`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function getBatchJobTypes(req, res) {
  const token = auth.getBackendToken(req);

  try {
    const url = `${config.get("server:batchAPIURL")}/api/v1/batch/batchjobtype`;
    const data = await getData(token, url, req.session?.correlationID);
    return res.status(200).json(data);
  } catch (e) {
    if (e.data.messages) {
      return errorResponse(res, e.data.messages[0].message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

async function downloadLetterGradeCodesCSV(req, res) {
  try {
    const codes = cacheService.getLetterGradeCodesJSON();

    if (!codes || codes.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'No letter grade codes available' });
    }

    const headers = [
      'Letter Grade',
      'Percent Range High',
      'Percent Range Low',
      'Pass',
      'GPA Mark Value',
      'Label',
      'Description',
      'Effective Date',
      'Expiry Date'
    ];

    const formatPass = (passFlag) => {
      if (passFlag === null || passFlag === undefined) return '';
      return passFlag ? 'Y' : 'N';
    };

    const rows = codes.map(item => [
      csvHelpers.escapeCSV(item.grade),
      csvHelpers.escapeCSV(item.percentRangeHigh || ''),
      csvHelpers.escapeCSV(item.percentRangeLow || ''),
      csvHelpers.escapeCSV(formatPass(item.passFlag)),
      csvHelpers.escapeCSV(item.gpaMarkValue || ''),
      csvHelpers.escapeCSV(item.label || ''),
      csvHelpers.escapeCSV(item.description || ''),
      csvHelpers.escapeCSV(csvHelpers.formatDate(item.effectiveDate)),
      csvHelpers.escapeCSV(csvHelpers.formatExpiryDateOrBlankIfFarFuture(item.expiryDate))
    ].join(','));

    const csvContent = csvHelpers.generateCSV(headers, rows);
    const filename = `LetterGrades_${new Date().toISOString().replace(/-/g, '').split('T')[0]}.csv`;

    return csvHelpers.sendCSVResponse(res, csvContent, filename);
  } catch (e) {
    log.error(e, 'downloadLetterGradeCodesCSV', 'Error occurred while generating letter grade codes CSV.');
    return errorResponse(res);
  }
}

async function downloadStudentGradeCodesCSV(req, res) {
  try {
    const codes = cacheService.getStudentGradeCodesJSON();

    if (!codes || codes.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'No student grade codes available' });
    }

    const headers = [
      'Code',
      'Label',
      'Description',
      'Effective Date',
      'Expiry Date',
      'Expected'
    ];

    const formatExpected = (expected) => {
      if (expected === null || expected === undefined) return '';
      return expected ? 'Y' : 'N';
    };

    const rows = codes.map(item => [
      csvHelpers.escapeCSV(item.studentGradeCode),
      csvHelpers.escapeCSV(item.label),
      csvHelpers.escapeCSV(item.description || ''),
      csvHelpers.escapeCSV(csvHelpers.formatDate(item.effectiveDate)),
      csvHelpers.escapeCSV(csvHelpers.formatExpiryDateOrBlankIfFarFuture(item.expiryDate)),
      csvHelpers.escapeCSV(formatExpected(item.expected))
    ].join(','));

    const csvContent = csvHelpers.generateCSV(headers, rows);
    const filename = `StudentGradeCodes_${new Date().toISOString().replace(/-/g, '').split('T')[0]}.csv`;

    return csvHelpers.sendCSVResponse(res, csvContent, filename);
  } catch (e) {
    log.error(e, 'downloadStudentGradeCodesCSV', 'Error occurred while generating student grade codes CSV.');
    return errorResponse(res);
  }
}

async function downloadGradProgramCodesCSV(req, res) {
  try {
    const codes = cacheService.getGradProgramCodesJSON();

    if (!codes || codes.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'No graduation program codes available' });
    }

    const headers = [
      'Program Code',
      'Program Name',
      'Description',
      'Associated Credential',
      'Effective Date',
      'Expiry Date'
    ];

    const rows = codes.map(item => [
      csvHelpers.escapeCSV(item.programCode),
      csvHelpers.escapeCSV(item.programName),
      csvHelpers.escapeCSV(item.description || ''),
      csvHelpers.escapeCSV(item.associatedCredential || ''),
      csvHelpers.escapeCSV(csvHelpers.formatDate(item.effectiveDate)),
      csvHelpers.escapeCSV(csvHelpers.formatExpiryDateOrBlankIfFarFuture(item.expiryDate))
    ].join(','));

    const csvContent = csvHelpers.generateCSV(headers, rows);
    const filename = `Programs_${new Date().toISOString().replace(/-/g, '').split('T')[0]}.csv`;

    return csvHelpers.sendCSVResponse(res, csvContent, filename);
  } catch (e) {
    log.error(e, 'downloadGradProgramCodesCSV', 'Error occurred while generating graduation program codes CSV.');
    return errorResponse(res);
  }
}

async function downloadOptionalProgramCodesCSV(req, res) {
  try {
    const codes = cacheService.getOptionalProgramCodesJSON();

    if (!codes || codes.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'No optional program codes available' });
    }

    const headers = [
      'Program Code',
      'Optional Program Code',
      'Optional Program Name',
      'Description',
      'Associated Credential',
      'Effective Date',
      'Expiry Date'
    ];

    const rows = codes.map(item => [
      csvHelpers.escapeCSV(item.graduationProgramCode || ''),
      csvHelpers.escapeCSV(item.optProgramCode),
      csvHelpers.escapeCSV(item.optionalProgramName),
      csvHelpers.escapeCSV(item.description || ''),
      csvHelpers.escapeCSV(item.associatedCredential || ''),
      csvHelpers.escapeCSV(csvHelpers.formatDate(item.effectiveDate)),
      csvHelpers.escapeCSV(csvHelpers.formatExpiryDateOrBlankIfFarFuture(item.expiryDate))
    ].join(','));

    const csvContent = csvHelpers.generateCSV(headers, rows);
    const filename = `OptionalProgramCodes_${new Date().toISOString().replace(/-/g, '').split('T')[0]}.csv`;

    return csvHelpers.sendCSVResponse(res, csvContent, filename);
  } catch (e) {
    log.error(e, 'downloadOptionalProgramCodesCSV', 'Error occurred while generating optional program codes CSV.');
    return errorResponse(res);
  }
}

async function downloadCareerProgramCodesCSV(req, res) {
  try {
    const codes = cacheService.getCareerProgramCodesJSON();

    if (!codes || codes.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'No career program codes available' });
    }

    const headers = [
      'Code',
      'Program',
      'Effective Date',
      'Expiry Date'
    ];

    const rows = codes.map(item => [
      csvHelpers.escapeCSV(item.code),
      csvHelpers.escapeCSV(item.description),
      csvHelpers.escapeCSV(csvHelpers.formatDate(item.startDate)),
      csvHelpers.escapeCSV(csvHelpers.formatExpiryDateOrBlankIfFarFuture(item.endDate))
    ].join(','));

    const csvContent = csvHelpers.generateCSV(headers, rows);
    const filename = `CareerProgramCodes_${new Date().toISOString().replace(/-/g, '').split('T')[0]}.csv`;

    return csvHelpers.sendCSVResponse(res, csvContent, filename);
  } catch (e) {
    log.error(e, 'downloadCareerProgramCodesCSV', 'Error occurred while generating career program codes CSV.');
    return errorResponse(res);
  }
}

async function getCountryCodes(req, res) {
  try {
    const codes = cacheService.getCountryCodesJSON();
    return res.status(HttpStatus.OK).json(codes);
  } catch (e) {
    log.error(e, 'getCountryCodes', 'Error occurred while attempting to get cached country codes.');
    return errorResponse(res);
  }
}

async function downloadCountryCodesCSV(req, res) {
  try {
    const codes = cacheService.getCountryCodesJSON();

    if (!codes || codes.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'No country codes available' });
    }

    const headers = [
      'Code',
      'Name',
      'Effective Date',
      'Expiry Date'
    ];

    const rows = codes.map(item => [
      csvHelpers.escapeCSV(item.countryCode),
      csvHelpers.escapeCSV(item.label),
      csvHelpers.escapeCSV(csvHelpers.formatDate(item.effectiveDate)),
      csvHelpers.escapeCSV(csvHelpers.formatExpiryDateOrBlankIfFarFuture(item.expiryDate))
    ].join(','));

    const csvContent = csvHelpers.generateCSV(headers, rows);
    const filename = `CountryCodes_${new Date().toISOString().replace(/-/g, '').split('T')[0]}.csv`;

    return csvHelpers.sendCSVResponse(res, csvContent, filename);
  } catch (e) {
    log.error(e, 'downloadCountryCodesCSV', 'Error occurred while generating country codes CSV.');
    return errorResponse(res);
  }
}

async function getCitizenshipCodes(req, res) {
  try {
    const codes = cacheService.getCitizenshipCodesJSON();
    return res.status(HttpStatus.OK).json(codes);
  } catch (e) {
    log.error(e, 'getCitizenshipCodes', 'Error occurred while attempting to get cached citizenship codes.');
    return errorResponse(res);
  }
}

async function getProvinceCodes(req, res) {
  try {
    const codes = cacheService.getProvinceCodesJSON();
    return res.status(HttpStatus.OK).json(codes);
  } catch (e) {
    log.error(e, 'getProvinceCodes', 'Error occurred while attempting to get cached province codes.');
    return errorResponse(res);
  }
}

async function getExaminableCourses(req, res) {
  try {
    const courses = cacheService.getExaminableCoursesJSON();
    return res.status(HttpStatus.OK).json(courses);
  } catch (e) {
    log.error(e, 'getExaminableCourses', 'Error occurred while attempting to get cached examinable courses.');
    return errorResponse(res);
  }
}

async function downloadExaminableCoursesCSV(req, res) {
  try {
    const courses = cacheService.getExaminableCoursesJSON();

    if (!courses || courses.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'No examinable courses available' });
    }

    const headers = [
      'Course Code',
      'Course Level',
      'Program Year',
      '% School Weight',
      '% Exam Weight',
      '% School Weight (before 1989/08)',
      '% Exam Weight (before 1989/08)',
      'Course Title',
      'Examinable Start',
      'Examinable End'
    ];

    const rows = courses.map(item => [
      csvHelpers.escapeCSV(item.courseCode),
      csvHelpers.escapeCSV(item.courseLevel),
      csvHelpers.escapeCSV(item.programYear || '2004+'),
      csvHelpers.escapeCSV(item.schoolWeightPercent || ''),
      csvHelpers.escapeCSV(item.examWeightPercent || ''),
      csvHelpers.escapeCSV(item.schoolWeightPercentPre1989 || ''),
      csvHelpers.escapeCSV(item.examWeightPercentPre1989 || ''),
      csvHelpers.escapeCSV(item.courseTitle),
      csvHelpers.escapeCSV(csvHelpers.formatDate(item.examinableStart)),
      csvHelpers.escapeCSV(csvHelpers.formatExpiryDateOrBlankIfFarFuture(item.examinableEnd))
    ].join(','));

    const csvContent = csvHelpers.generateCSV(headers, rows);
    const filename = `ExaminableCourses_${new Date().toISOString().replace(/-/g, '').split('T')[0]}.csv`;

    return csvHelpers.sendCSVResponse(res, csvContent, filename);
  } catch (e) {
    log.error(e, 'downloadExaminableCoursesCSV', 'Error occurred while generating examinable courses CSV.');
    return errorResponse(res);
  }
}

async function getCourseRestrictions(req, res) {
  try {
    const restrictions = cacheService.getCourseRestrictionsJSON();
    return res.status(HttpStatus.OK).json(restrictions);
  } catch (e) {
    log.error(e, 'getCourseRestrictions', 'Error occurred while attempting to get cached course restrictions.');
    return errorResponse(res);
  }
}

async function downloadCourseRestrictionsCSV(req, res) {
  try {
    const restrictions = cacheService.getCourseRestrictionsJSON();

    if (!restrictions || restrictions.length === 0) {
      return res.status(HttpStatus.NOT_FOUND).json({message: 'No course restrictions available'});
    }

    const headers = [
      'Course Code Main',
      'Course Level Main',
      'Course Code Restricted',
      'Course Level Restricted',
      'Restriction Start Date',
      'Restriction End Date'
    ];

    const rows = restrictions.map(item => [
      csvHelpers.escapeCSV(item.mainCourse),
      csvHelpers.escapeCSV(item.mainCourseLevel),
      csvHelpers.escapeCSV(item.restrictedCourse),
      csvHelpers.escapeCSV(item.restrictedCourseLevel),
      csvHelpers.escapeCSV(csvHelpers.formatDate(item.restrictionStartDate)),
      csvHelpers.escapeCSV(csvHelpers.formatExpiryDateOrBlankIfFarFuture(item.restrictionEndDate))
    ].join(','));

    const csvContent = csvHelpers.generateCSV(headers, rows);
    const filename = `CourseRestrictions_${new Date().toISOString().replace(/-/g, '').split('T')[0]}.csv`;

    return csvHelpers.sendCSVResponse(res, csvContent, filename);
  } catch (e) {
    log.error(e, 'downloadCourseRestrictionsCSV', 'Error occurred while generating course restrictions CSV.');
    return errorResponse(res);
  }
}

const csvHelpers = require('./codes-csv-helpers');

async function waitForCourseRestrictionsRefresh(req, res) {
  try {
    const GradCourseEventsHandler = require('../messaging/handlers/grad-course-events-handler');

    await GradCourseEventsHandler.waitForCacheRefresh('courseRestrictions', 10000);

    const restrictions = cacheService.getCourseRestrictionsJSON();
    return res.status(HttpStatus.OK).json({
      message: 'Cache refresh complete',
      count: restrictions.length
    });
  } catch (e) {
    if (e.message && e.message.includes('Timeout')) {
      log.warn('Timeout waiting for cache refresh from Java API');
      return res.status(HttpStatus.REQUEST_TIMEOUT).json({
        message: 'Timeout waiting for cache refresh'
      });
    }
    log.error(e, 'waitForCourseRestrictionsRefresh', 'Error waiting for cache refresh.');
    return errorResponse(res);
  }
}


module.exports = {
  getStudentStatusCodes,
  getHistoryActivityCodes,
  getStudentGradeCodes,
  downloadStudentGradeCodesCSV,
  getGradProgramCodes,
  downloadGradProgramCodesCSV,
  getOptionalProgramCodes,
  downloadOptionalProgramCodesCSV,
  getCareerProgramCodes,
  downloadCareerProgramCodesCSV,
  getCountryCodes,
  downloadCountryCodesCSV,
  getCitizenshipCodes,
  getProvinceCodes,
  getExaminableCourses,
  downloadExaminableCoursesCSV,
  getCourseRestrictions,
  downloadCourseRestrictionsCSV,
  waitForCourseRestrictionsRefresh,
  getRequirementTypeCodes,
  getFineArtsAppliedSkillsCodes,
  getEquivalentOrChallengeCodes,
  getExamSpecialCaseCodes,
  getInstituteSchoolCategoryCodes,
  getInstituteFacilityCodes,
  getAssessmentSpecialCaseCodes,
  getCourseLetterGradeCodes,
  downloadLetterGradeCodesCSV,
  getTranscriptMessagingCodes,
  getStudentUndoCompletionReasonCodes,
  getTranscriptTypeCodes,
  getCertificateTypeCodes,
  getProgramCertificateTranscriptCodes,
  getReportTypeCodes,
  getDocumentStatusCodes,
  getDigitalSignatureBlockTypeCodes,
  getBatchJobTypes,
};
