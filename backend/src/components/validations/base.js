'use strict';

const yup = require('yup');
const { object, string, date } = yup;

const baseRequestSchema = object({
  createDate: date().nullable().optional(),
  createUser: string().nullable().max(100).optional(),
  updateDate: date().nullable().optional(),
  updateUser: string().nullable().max(100).optional(),
}).noUnknown();

module.exports = {
  baseRequestSchema,
};
