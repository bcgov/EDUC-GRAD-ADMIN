const { object, string, boolean, number, array } = require('yup');
const { baseRequestSchema } = require('./base');

const putStudentAssessmentSchema = object({
  body: object({
    assessmentStudentId: string().nonNullable(),
    sessionId:string().nonNullable(),
    districtId: string().nullable().optional(),
    schoolId: string().nonNullable(),
    assessmentCenterId: string().nonNullable(),
    assessmentId:string().nonNullable(),
    assessmentTypeCode: string().nonNullable(),
    studentId: string().nonNullable(),
    pen: string().max(9).nonNullable(),
    localId: string().max(12).nonNullable(),
    givenName: string().max(25).nonNullable(),
    surName: string().max(25).nonNullable(),
    isElectronicExam: boolean().nullable().optional(),
    proficiencyScore: number().nullable().optional(),
    provincialSpecialCaseCode: string().max(1).nullable().optional(),
    courseStatusCode: string().max(1).nullable().optional(),
    numberOfAttempts: number().nullable().optional(),
    courseMonth: number().optional(),
    courseYear: number().optional(),
    assessmentStudentValidationIssues: array().of(object({
      assessmentStudentValidationIssueId:string().nullable().optional(),
      assessmentStudentId:string().nullable().optional(),
      validationIssueSeverityCode:string().nullable().optional(),
      validationIssueCode:string().nullable().optional(),
      validationIssueFieldCode:string().nullable().optional(),
      validationLabel:string().nullable().optional(),
      validationMessage:string().nullable().optional(),
    }).concat(baseRequestSchema)).nullable().optional()
  }).concat(baseRequestSchema).noUnknown(),
  params: object({
    studentAssessmentId: string().nonNullable(),
  }),
  query: object().noUnknown(),
}).noUnknown();

const postStudentAssessmentSchema = object({
  body: object({
    sessionId:string().nonNullable(),
    districtId: string().nonNullable(),
    schoolId: string().nonNullable(),
    assessmentCenterId: string().nonNullable(),
    assessmentId:string().nonNullable(),
    assessmentTypeCode: string().nonNullable(),
    studentId: string().nullable().optional(),
    assessmentStudentId: string().nullable().optional(),
    courseStatusCode: string().nullable().optional(),
    numberOfAttempts: string().nullable().optional(),
    pen: string().max(9).nonNullable(),
    localId: string().max(12).nonNullable(),
    givenName: string().max(25).nonNullable(),
    surName: string().max(25).nonNullable(),
    isElectronicExam: boolean().nullable().optional(),
    proficiencyScore: number().nullable().optional(),
    provincialSpecialCaseCode: string().max(1).nullable().optional(),
    assessmentStudentValidationIssues: array().of(object({
      assessmentStudentId:string().nullable().optional(),
      validationIssueSeverityCode:string().nullable().optional(),
      validationIssueCode:string().nullable().optional(),
      validationIssueFieldCode: string().nullable().optional(),
      validationLabel:string().nullable().optional(),
      validationMessage:string().nullable().optional(),
    }).concat(baseRequestSchema)).nullable().optional()
  }).concat(baseRequestSchema).noUnknown(),
  query: object().noUnknown(),
  params: object({
    instituteType: string().nonNullable(),
  }).noUnknown(),
}).noUnknown();

module.exports = {
  putStudentAssessmentSchema,
  postStudentAssessmentSchema
};
