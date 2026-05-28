const { object, string } = require("yup");
const { baseRequestSchema } = require("./base");

const getStudentAddressSchema = object({
  body: object().noUnknown(),
  params: object({
    studentID: string()
  }).noUnknown(),
  query: object().noUnknown()
}).noUnknown();

const studentAddressBodySchema = object({
  body: object({
    studentAddressId: string().nullable(),
    studentID: string(),
    addressLine1: string(),
    addressLine2: string().nullable(),
    city: string().nullable(),
    postalZip: string().nullable(),
    provinceStateCode: string().nullable(),
    countryCode: string().nullable(),
  }).concat(baseRequestSchema).noUnknown(),
  query: object().noUnknown()
}).noUnknown();

const postStudentAddressSchema = studentAddressBodySchema.concat(object({
  params: object({
    studentID: string()
  }).noUnknown(),
})).noUnknown();

const putStudentAddressSchema = studentAddressBodySchema.concat(object({
  params: object({
    studentID: string(),
    studentAddressID: string()
  }).noUnknown(),
})).noUnknown();

module.exports = {
  getStudentAddressSchema,
  postStudentAddressSchema,
  putStudentAddressSchema
};
