const {object} = require('yup');
const {uuidGeneric} = require('./custom-validations');
const postAdoptStudentSchema = object({
  body: object().noUnknown(),
  query: object().noUnknown(),
  params: object({
    studentID: uuidGeneric().required()
  }).noUnknown()
}).noUnknown();

module.exports = {
  postAdoptStudentSchema
};