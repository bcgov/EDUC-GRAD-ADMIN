const { object, string } = require("yup");
const { baseRequestSchema } = require("./base");

const getStudentAddressSchema = object({
  body: object().noUnknown(),
  params: object({
    studentID: string()
  }).noUnknown(),
  query: object().noUnknown()
}).noUnknown();

const putStudentAddressSchema = object({
  body: object({
    studentAddressId: string(),
    studentID: string(),
    addressLine1: string(),
    addressLine2: string().nullable(),
    city: string().nullable(),
    postalZip: string().nullable(),
    provinceStateCode: string().nullable(),
    countryCode: string().nullable(),
  }).concat(baseRequestSchema).noUnknown(),
  params: object({
    studentID: string(),
    studentAddressID: string()
  }).noUnknown(),
  query: object().noUnknown()
}).noUnknown();

module.exports = {
  getStudentAddressSchema,
  putStudentAddressSchema
};
