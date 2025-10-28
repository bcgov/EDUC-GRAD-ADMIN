const {object} = require('yup');
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

module.exports = {
  postAdoptStudentSchema,
  postMergeCompleteStudentSchema,
  getHistoricActivitySchema
};
