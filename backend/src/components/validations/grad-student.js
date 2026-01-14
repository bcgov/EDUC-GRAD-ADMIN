const {object, string, array} = require('yup');
const {uuidGeneric} = require('./custom-validations');
const { baseStudentNoteSchema } = require('./student-note');

const postAdoptStudentSchema = object({
  body: object().noUnknown(),
  query: object().noUnknown(),
  params: object({
    studentID: uuidGeneric().required()
  }).noUnknown()
}).noUnknown();

const postMergeCompleteStudentSchema = object({
  body: object({
    source: baseStudentNoteSchema.noUnknown().nullable(),
    target: baseStudentNoteSchema.noUnknown().nullable()
  }).noUnknown(),
  query: object().noUnknown(),
  params: object({
    sourceStudentID: uuidGeneric().required(),
    targetStudentID: uuidGeneric().required()
  }).noUnknown()
}).noUnknown();

const getHistoricActivitySchema = object({
  body: object().noUnknown(),
  query: object().noUnknown(),
  params: object({
    studentID: uuidGeneric().required(),
  }).noUnknown()
}).noUnknown();

const mergeGradStatusBodySchema = object({
  studentID: uuidGeneric().required(),
  program: string().nullable(),
  studentStatus: string().nullable(),
  programCompletionDate: string().nullable(),
  studentGrade: string().nullable(),
  schoolOfRecordId: uuidGeneric().nullable(),
  schoolAtGradId: uuidGeneric().nullable(),
  honoursStanding: string().nullable(),
  adultStartDate: string().nullable(),
  consumerEducationRequirementMet: string().nullable(),
  optionalPrograms: array().nullable(),
  careerPrograms: array().nullable()
}).noUnknown();

const postMergeStudentGradStatusSchema = object({
  body: mergeGradStatusBodySchema,
  query: object().noUnknown(),
  params: object({
    studentID: uuidGeneric().required(),
    trueStudentID: uuidGeneric().required()
  }).noUnknown()
}).noUnknown();

module.exports = {
  postAdoptStudentSchema,
  postMergeCompleteStudentSchema,
  getHistoricActivitySchema,
  postMergeStudentGradStatusSchema
};
