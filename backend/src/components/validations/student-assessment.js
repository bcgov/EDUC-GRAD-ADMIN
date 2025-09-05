const { object, string, number } = require('yup');
const { uuidGeneric } = require('./custom-validations');
const { baseRequestSchema } = require('./base');

const putStudentAssessmentSchema = object({
  body: object({
    assessmentStudentID: uuidGeneric().required(),
    assessmentID:uuidGeneric().required(),
    schoolAtWriteSchoolID: uuidGeneric().notRequired(),
    assessmentCenterSchoolID: string().notRequired(),
    schoolOfRecordSchoolID: uuidGeneric().required(),
    studentID: uuidGeneric().required(),
    givenName: string().max(25).required(),
    surname: string().max(25).required(),
    pen: string().max(9).required(),
    localID: string().max(12).notRequired(),
    gradeAtRegistration: string().max(3).notRequired(),
    proficiencyScore: number().notRequired(),
    assessmentFormID: uuidGeneric().notRequired(),
    adaptedAssessmentCode: string().max(10).notRequired(),
    studentStatusCode: string().max(10).required(),
    irtScore: string().max(7).notRequired(),
    provincialSpecialCaseCode: string().max(1).notRequired(),
    numberOfAttempts: number().notRequired(),
    localAssessmentID: string().max(20).notRequired(),
    courseStatusCode: string().max(1).notRequired(),
    downloadDate: string().notRequired(),
    markingSession: string().notRequired()
  }).concat(baseRequestSchema).noUnknown(),
  params: object({
    studentAssessmentId: uuidGeneric().required()
  }).noUnknown(),
  query: object().noUnknown(),
}).noUnknown();

const postStudentAssessmentSchema = object({
  body: object({
    assessmentID:uuidGeneric().required(),
    assessmentCenterSchoolID: uuidGeneric().notRequired(),
    provincialSpecialCaseCode: string().max(1).notRequired(),
    schoolAtWriteSchoolID: uuidGeneric().notRequired(),
    studentID: uuidGeneric().required(),
  }).concat(baseRequestSchema).noUnknown(),
  query: object({
    allowRuleOverride: string().oneOf(['true', 'false']).optional()
  }).noUnknown(),
  params: object().noUnknown(),
}).noUnknown();

const deleteStudentAssessmentSchema = object({
  body: object().noUnknown(),
  query: object({
    allowRuleOverride: string().oneOf(['true', 'false']).optional()
  }).noUnknown(),
  params: object({
    studentAssessmentId: uuidGeneric().required()
  }).noUnknown()
}).noUnknown();

const getPaginatedStudentAssessmentSchema = object({
  body: object().noUnknown(),
  query: object({
    pageNumber: number().integer().required(),
    pageSize:number().integer().required(),
    searchParams: object({
      studentId: uuidGeneric().required()
    }).required().noUnknown(),
    sort: object({
      'assessmentEntity.assessmentTypeCode': string().oneOf(['ASC', 'DESC']).optional(),
      'updateDate': string().oneOf(['ASC', 'DESC']).optional()
    }).optional().noUnknown()
  }).noUnknown(),
  params: object().noUnknown()
}).noUnknown();

module.exports = {
  putStudentAssessmentSchema,
  postStudentAssessmentSchema,
  deleteStudentAssessmentSchema,
  getPaginatedStudentAssessmentSchema
};
