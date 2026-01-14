const { object, string, number, boolean, array } = require("yup");
const { uuidGeneric } = require("./custom-validations");
const { baseRequestSchema } = require("./base");

const studentCourseExamSchema = object({
  schoolPercentage: number().min(0).max(100).nullable(),
  bestSchoolPercentage: number().min(0).max(100).nullable(),
  bestExamPercentage: number().min(0).max(100).nullable(),
  specialCase: string().max(1).nullable(),
  examPercentage: number().min(0).max(100).nullable().notRequired(),
  toWriteFlag: string().max(1).nullable().notRequired(),
  wroteFlag: string().max(1).nullable().notRequired(),
});

const studentCourseSchema = object({
  courseID: string().max(12).required(),
  courseSession: string().max(6).required(),
  interimPercent: number().min(0).max(100).nullable(),
  interimLetterGrade: string().max(2).nullable(),
  finalPercent: number().min(0).max(100).nullable(),
  finalLetterGrade: string().max(2).nullable(),
  credits: number().min(0).max(4).nullable(),
  equivOrChallenge: string().max(1).nullable(),
  fineArtsAppliedSkills: string().max(1).nullable(),
  customizedCourseName: string().max(40).nullable(),
  relatedCourseId: string().max(12).nullable(),
  courseExam: studentCourseExamSchema.nullable().notRequired(),
  studentID: uuidGeneric().notRequired(),
});

const putStudentCourseSchema = object({
  body: studentCourseSchema
    .concat(baseRequestSchema)
    .shape({
      id: uuidGeneric().required(),
      isExaminable: boolean().required(),
    })
    .noUnknown(),
  params: object({
    studentID: uuidGeneric().required(),
  }),
  query: object().noUnknown(),
}).noUnknown();

const postStudentCourseSchema = object({
  body: array().of(
    studentCourseSchema
      .shape({
        isExaminable: boolean().required(),
      })
      .noUnknown()
  ),
  params: object({
    studentID: uuidGeneric().required(),
  }),
  query: object().noUnknown(),
}).noUnknown();

const postTransferStudentCourseSchema = object({
  body: array().of(uuidGeneric().required()),
  params: object({
    sourceStudentID: uuidGeneric().required(),
    targetStudentID: uuidGeneric().required(),
  }),
  query: object().noUnknown(),
}).noUnknown();

const postMergeStudentCourseSchema = object({
  body: array().of(uuidGeneric().required()),
  params: object({
    sourceStudentID: uuidGeneric().required(),
    targetStudentID: uuidGeneric().required(),
  }),
  query: object().noUnknown(),
}).noUnknown();

const deleteStudentCourseSchema = object({
  body: array().of(uuidGeneric().required()),
  query: object().noUnknown(),
  params: object({
    studentID: uuidGeneric().required(),
  }).noUnknown(),
}).noUnknown();

module.exports = {
  putStudentCourseSchema,
  postStudentCourseSchema,
  deleteStudentCourseSchema,
  postTransferStudentCourseSchema,
  postMergeStudentCourseSchema,
};
