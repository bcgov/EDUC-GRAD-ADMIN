const { object, string, number, array, boolean } = require('yup');
const { uuidGeneric } = require('./custom-validations');
const { baseRequestSchema } = require('./base');

const studentAssessmentSchema = object({
  adaptedAssessmentCode: string().max(10).notRequired(),
  assessmentCenterSchoolID: string().notRequired(),
  assessmentFormID: uuidGeneric().notRequired(),
  assessmentID: uuidGeneric().required(),
  assessmentStudentID: uuidGeneric().required(),
  // assessmentStudentValidationIssues: string().notRequired(), 
  assessmentTypeCode: string().max(10).notRequired(),
  courseMonth: string().max(2).notRequired(),
  courseStatusCode: string().max(1).notRequired(),
  courseYear: string().max(4).notRequired(),
  // createDate: string().notRequired(),
  // createUser: string().notRequired(),
  downloadDate: string().notRequired(),
  // givenName: string().max(25).required(),
  gradeAtRegistration: string().max(3).notRequired(),
  irtScore: string().max(7).notRequired(),
  localAssessmentID: string().max(20).notRequired(),
  localID: string().max(12).notRequired(),
  markingSession: string().notRequired(),
  numberOfAttempts: number().notRequired(),
  // pen: string().max(9).required(),
  proficiencyScore: number().notRequired(),
  provincialSpecialCaseCode: string().max(1).notRequired(),
  schoolAtWriteSchoolID: uuidGeneric().notRequired(),
  schoolOfRecordSchoolID: uuidGeneric().required(),
  sessionID: uuidGeneric().notRequired(),
  // studentID: uuidGeneric().required(),
  // studentStatusCode: string().max(10).required(),
  // surname: string().max(25).required(),
  // updateDate: string().notRequired(),
  // updateUser: string().notRequired(),
  wroteFlag: boolean().notRequired()
});



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

function markAllFieldsOptional(schema) {
  const fields = schema.fields;
  const optionalShape = Object.fromEntries(
    Object.entries(fields).map(([key, fieldSchema]) => [
      key,
      fieldSchema.optional(),
    ])
  );
  return object().shape(optionalShape);
}
const mergeStudentAssessmentSchema = object({
  source: studentAssessmentSchema.shape({
    assessmentID: uuidGeneric().required(),
  }).noUnknown(),
  target: markAllFieldsOptional(studentAssessmentSchema).shape({
    assessmentID: uuidGeneric().optional(),
  }).optional(),
});
const postMergeStudentAssessmentSchema = object({
  body: object({
    info: array().of(mergeStudentAssessmentSchema),
    conflicts: array().of(mergeStudentAssessmentSchema),
    errors: array().of(mergeStudentAssessmentSchema).optional()
  }),
  params: object({
    sourceStudentID: uuidGeneric().required(),
    targetStudentID: uuidGeneric().required()
  }),
  query: object().noUnknown(),
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
  postMergeStudentAssessmentSchema,
  putStudentAssessmentSchema,
  postStudentAssessmentSchema,
  deleteStudentAssessmentSchema,
  getPaginatedStudentAssessmentSchema
};
