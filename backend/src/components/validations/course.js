'use strict';

const yup = require('yup');
const { object, string } = yup;

const courseRestrictionSchema = object({
    mainCourse: string().nonNullable().required(),
    mainCourseLevel: string().nonNullable().required(),
    restrictedCourse: string().nonNullable().required(),
    restrictedCourseLevel: string().nonNullable().required(),
    restrictionStartDate: string().nonNullable().required(),
    restrictionEndDate: string().nullable().optional(),
}).noUnknown();

const createCourseRestrictionSchema = object({
    body: courseRestrictionSchema.required(),
    params: object({}),
    query: object({}),
}).noUnknown();

const updateCourseRestrictionSchema = object({
    body: courseRestrictionSchema.required(),
    params: object({
        restrictionID: string().uuid().nonNullable().required(),
    }),
    query: object().noUnknown(),
}).noUnknown();

module.exports = {
    createCourseRestrictionSchema,
    updateCourseRestrictionSchema
};
